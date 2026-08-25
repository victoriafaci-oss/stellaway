import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query } from 'firebase/firestore';
import {
  auth,
  db,
  initAuth,
  signInWithGoogle,
  logoutUser,
  getAccessToken,
  testConnection,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { createGoogleCalendarEvent, CalendarEventPayload } from '../lib/calendar';
import { ObservationLog, StarlightSpot } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  syncEventToCalendar: (
    payload: CalendarEventPayload
  ) => Promise<{ id: string; htmlLink: string }>;
  userLogs: ObservationLog[];
  userSpots: StarlightSpot[];
  addLogToFirestore: (log: Omit<ObservationLog, 'id'>) => Promise<void>;
  addSpotToFirestore: (spot: Omit<StarlightSpot, 'id'>) => Promise<void>;
  userProfileData: {
    subscriptionPlan?: string;
    trialPhone?: string;
  } | null;
  saveUserProfileData: (data: { subscriptionPlan?: string; trialPhone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [loading, setLoading] = useState(true);
  const [userLogs, setUserLogs] = useState<ObservationLog[]>([]);
  const [userSpots, setUserSpots] = useState<StarlightSpot[]>([]);
  const [userProfileData, setUserProfileData] = useState<{
    subscriptionPlan?: string;
    trialPhone?: string;
  } | null>(null);

  // Test Firebase connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token || getAccessToken());
        setLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to Firestore documents when logged in
  useEffect(() => {
    if (!user) {
      setUserLogs([]);
      setUserSpots([]);
      setUserProfileData(null);
      return;
    }

    // User profile sync
    const userDocRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfileData(docSnap.data());
        } else {
          // Initialize user doc
          setDoc(
            userDocRef,
            {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Socio StellaWay',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`)
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    // Journal Logs sync
    const logsCollRef = collection(db, 'users', user.uid, 'journal');
    const unsubLogs = onSnapshot(
      query(logsCollRef),
      (snapshot) => {
        const fetchedLogs: ObservationLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ObservationLog[];
        setUserLogs(fetchedLogs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/journal`);
      }
    );

    // Saved Spots sync
    const spotsCollRef = collection(db, 'users', user.uid, 'spots');
    const unsubSpots = onSnapshot(
      query(spotsCollRef),
      (snapshot) => {
        const fetchedSpots: StarlightSpot[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as StarlightSpot[];
        setUserSpots(fetchedSpots);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/spots`);
      }
    );

    return () => {
      unsubUser();
      unsubLogs();
      unsubSpots();
    };
  }, [user]);

  const signIn = async () => {
    const res = await signInWithGoogle();
    setUser(res.user);
    setAccessToken(res.accessToken);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
  };

  const syncEventToCalendar = async (payload: CalendarEventPayload) => {
    const token = accessToken || getAccessToken();
    if (!token) {
      throw new Error('Debes iniciar sesión con Google para sincronizar con tu calendario.');
    }

    const calendarResult = await createGoogleCalendarEvent(token, payload);

    // Log to Firestore if authenticated
    if (user) {
      const logId = Date.now().toString();
      const logRef = doc(db, 'users', user.uid, 'calendarSyncs', logId);
      await setDoc(
        logRef,
        {
          logId,
          userId: user.uid,
          eventTitle: payload.summary,
          googleEventId: calendarResult.id,
          eventDate: payload.startDateTime,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) =>
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `users/${user.uid}/calendarSyncs/${logId}`
        )
      );
    }

    return calendarResult;
  };

  const addLogToFirestore = async (logData: Omit<ObservationLog, 'id'>) => {
    if (!user) return;
    const entryId = Date.now().toString();
    const docRef = doc(db, 'users', user.uid, 'journal', entryId);
    await setDoc(docRef, {
      entryId,
      userId: user.uid,
      ...logData,
      createdAt: new Date().toISOString(),
    }).catch((err) =>
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `users/${user.uid}/journal/${entryId}`
      )
    );
  };

  const addSpotToFirestore = async (spotData: Omit<StarlightSpot, 'id'>) => {
    if (!user) return;
    const spotId = Date.now().toString();
    const docRef = doc(db, 'users', user.uid, 'spots', spotId);
    await setDoc(docRef, {
      spotId,
      userId: user.uid,
      ...spotData,
      createdAt: new Date().toISOString(),
    }).catch((err) =>
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `users/${user.uid}/spots/${spotId}`
      )
    );
  };

  const saveUserProfileData = async (data: { subscriptionPlan?: string; trialPhone?: string }) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signIn,
        logout,
        syncEventToCalendar,
        userLogs,
        userSpots,
        addLogToFirestore,
        addSpotToFirestore,
        userProfileData,
        saveUserProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
