import React, { useState } from 'react';
import { ObservationLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileViewProps {
  nightVision: boolean;
  setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ nightVision, setNightVision }) => {
  const { user, signIn, logout, userLogs, addLogToFirestore } = useAuth();
  const { t } = useLanguage();

  const [localLogs, setLocalLogs] = useState<ObservationLog[]>([
    {
      id: '1',
      date: '2026-08-01',
      location: 'Observatorio de Penyagolosa',
      targetObject: 'M31 Galaxia de Andrómeda & Nebulosa del Anillo M57',
      telescopeEquipment: 'Reflector 130mm + Ocular 25mm + Ocular 10mm',
      notes: 'Excelente transparencia. Brazos espirales de M31 insinuados a simple vista con visión periférica.',
      rating: 5,
      bortle: 2
    },
    {
      id: '2',
      date: '2026-07-28',
      location: 'Mirador de Culla Starlight',
      targetObject: 'Saturno y Cúmulo de Hércules M13',
      telescopeEquipment: 'Prismáticos 15x70 con trípode',
      notes: 'Cúmulo M13 brillante y granular. Saturno nítido con titilado mínimo.',
      rating: 4,
      bortle: 3
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    location: 'Penyagolosa',
    targetObject: '',
    telescopeEquipment: '',
    notes: '',
    rating: 5,
    bortle: 2
  });

  // Display logs from Firestore if available, otherwise local logs
  const displayLogs = userLogs.length > 0 ? userLogs : localLogs;

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.targetObject) return;

    const entryData = {
      date: new Date().toISOString().split('T')[0],
      location: newLog.location,
      targetObject: newLog.targetObject,
      telescopeEquipment: newLog.telescopeEquipment || 'Observación a simple vista / Prismáticos',
      notes: newLog.notes,
      rating: newLog.rating,
      bortle: newLog.bortle
    };

    if (user) {
      await addLogToFirestore(entryData);
    } else {
      const entry: ObservationLog = {
        id: Date.now().toString(),
        ...entryData
      };
      setLocalLogs([entry, ...localLogs]);
    }

    setShowAddModal(false);
    setNewLog({
      location: 'Penyagolosa',
      targetObject: '',
      telescopeEquipment: '',
      notes: '',
      rating: 5,
      bortle: 2
    });
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-5xl mx-auto w-full pt-20 md:pt-12 pb-28 md:pb-16">
      {/* Profile Header in Celestial Sky Blue Glass */}
      <div className="card-pastel-gold rounded-3xl p-6 md:p-8 border border-[#7DD3FC]/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#082F49]/80 border border-[#38BDF8]/60 p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Usuario'} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="material-symbols-outlined text-[#7DD3FC] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_circle
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {user ? user.displayName || 'Observador Google' : 'Observador StellaWay'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#082F49]/90 text-[#7DD3FC] border border-[#38BDF8]/40 text-[10px] font-extrabold uppercase tracking-wider">
                {user ? 'Google & Firebase Sync' : 'Socio Starlight'}
              </span>
            </div>

            <p className="text-sm text-[#BAE6FD] font-medium mt-1">
              {user ? user.email : 'Ubicación principal: Castellón & Arco Mediterráneo'}
            </p>
            <p className="text-xs text-[#7DD3FC] font-extrabold font-['JetBrains_Mono'] mt-1">
              Días de observación registrados: {displayLogs.length} sesiones
            </p>
          </div>
        </div>

        {/* Google Login / Logout & Night vision */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {user ? (
            <button
              onClick={() => logout()}
              className="px-5 py-3 rounded-2xl bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Cerrar Sesión Google
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-6 py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer border border-[#7DD3FC]/50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Conectar Google Account
            </button>
          )}

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-install-modal'))}
            className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Añadir icono a la pantalla de inicio"
          >
            <span className="material-symbols-outlined text-lg">install_mobile</span>
            Instalar en Móvil
          </button>

          <button
            onClick={() => setNightVision(!nightVision)}
            className={`px-5 py-3 rounded-2xl border font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              nightVision
                ? 'bg-[#FF3B30] text-white border-white shadow-lg'
                : 'bg-[#082F49]/80 hover:bg-[#082F49] text-white border-[#38BDF8]/50'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {nightVision ? 'visibility_off' : 'visibility'}
            </span>
            {nightVision ? 'Luz Roja ON' : 'Luz Roja'}
          </button>
        </div>
      </div>

      {/* Observation Logbook Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            <span className="material-symbols-outlined text-[#7DD3FC]">edit_note</span>
            Diario de Observación
          </h2>
          <p className="text-xs text-[#BAE6FD] font-medium">
            {user
              ? 'Tus observaciones se sincronizan automáticamente en la nube con Firebase'
              : 'Registra tus observaciones nocturnas (conéctate con Google para sincronizar entre dispositivos)'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-[#7DD3FC]/50"
        >
          <span className="material-symbols-outlined text-base">add</span>
          {t('newSessionBtn', 'Nueva Salida')}
        </button>
      </div>

      {/* Log list in Celestial Sky Blue Glass */}
      <div className="space-y-4">
        {displayLogs.map((log) => (
          <div key={log.id} className="card-pastel-gold rounded-3xl p-6 border border-[#7DD3FC]/50 shadow-xl hover:shadow-2xl transition-all backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#38BDF8]/40 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-['JetBrains_Mono'] text-[#7DD3FC] font-extrabold">📅 {log.date}</span>
                <span className="text-[#38BDF8]">•</span>
                <span className="text-xs text-[#BAE6FD] font-extrabold">📍 {log.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#082F49]/90 text-[#7DD3FC] border border-[#38BDF8]/40 font-['JetBrains_Mono'] font-extrabold px-2.5 py-0.5 rounded-full">
                  Bortle {log.bortle}
                </span>
                <span className="text-xs text-[#FEE685] font-bold">{'★'.repeat(log.rating)}</span>
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{log.targetObject}</h3>
            <p className="text-xs text-[#7DD3FC] font-bold font-['JetBrains_Mono'] mb-3">
              ⚙️ {log.telescopeEquipment}
            </p>
            <p className="text-sm text-[#E0F2FE] font-medium leading-relaxed bg-[#082F49]/80 p-3.5 rounded-2xl border border-[#38BDF8]/40">
              "{log.notes}"
            </p>
          </div>
        ))}
      </div>

      {/* Add Log Modal in Celestial Sky Blue Glass */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card-pastel-gold w-full max-w-lg rounded-3xl p-6 md:p-8 border border-[#7DD3FC]/60 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#38BDF8]/40 pb-4 mb-4">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                <span className="material-symbols-outlined text-[#7DD3FC]">edit_note</span>
                Registrar Salida de Observación
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-white hover:text-white/80 p-2 rounded-2xl bg-[#082F49]/80 hover:bg-[#082F49] border border-[#38BDF8]/40 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Lugar de Observación</label>
                <input
                  type="text"
                  value={newLog.location}
                  onChange={(e) => setNewLog({ ...newLog, location: e.target.value })}
                  className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#7DD3FC] outline-none font-medium placeholder-[#7DD3FC]/50"
                  placeholder="Ej: Observatorio Penyagolosa"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Objetos Observados</label>
                <input
                  type="text"
                  required
                  value={newLog.targetObject}
                  onChange={(e) => setNewLog({ ...newLog, targetObject: e.target.value })}
                  className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#7DD3FC] outline-none font-medium placeholder-[#7DD3FC]/50"
                  placeholder="Ej: Saturno, M31 Andrómeda, Orión"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Equipo Utilizado</label>
                <input
                  type="text"
                  value={newLog.telescopeEquipment}
                  onChange={(e) => setNewLog({ ...newLog, telescopeEquipment: e.target.value })}
                  className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#7DD3FC] outline-none font-medium placeholder-[#7DD3FC]/50"
                  placeholder="Ej: Telescopio 130EQ + Ocular 10mm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Notas y Detalles del Seeing</label>
                <textarea
                  rows={3}
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#7DD3FC] outline-none font-medium placeholder-[#7DD3FC]/50"
                  placeholder="Describe la nitidez, viento, o lo que pudiste apreciar..."
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Clase Bortle (1-9)</label>
                  <select
                    value={newLog.bortle}
                    onChange={(e) => setNewLog({ ...newLog, bortle: Number(e.target.value) })}
                    className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3 py-2 text-white text-sm focus:border-[#7DD3FC] outline-none font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => (
                      <option key={b} value={b} className="bg-[#082F49] text-white">
                        Bortle {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-extrabold text-[#7DD3FC] mb-1">Valoración (1-5 ★)</label>
                  <select
                    value={newLog.rating}
                    onChange={(e) => setNewLog({ ...newLog, rating: Number(e.target.value) })}
                    className="w-full bg-[#082F49]/80 border border-[#38BDF8]/50 rounded-xl px-3 py-2 text-white text-sm focus:border-[#7DD3FC] outline-none font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r} className="bg-[#082F49] text-white">
                        {r} Estrellas
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#38BDF8]/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#082F49]/80 hover:bg-[#082F49] text-white font-bold text-xs uppercase border border-[#38BDF8]/40 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase cursor-pointer transition-all shadow-md border border-[#7DD3FC]/50"
                >
                  Guardar en Diario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
