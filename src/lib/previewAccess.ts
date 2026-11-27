const ACCESS_COOKIE_NAME = 'stellaway_access_v1';

interface AccessCookiePayload {
  planId?: string;
  subscribed?: boolean;
  trialExpiresAt?: number;
  email?: string;
  name?: string;
  provider?: string;
  transactionId?: string;
}

function readAccessCookie(): AccessCookiePayload | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${ACCESS_COOKIE_NAME}=`));
    if (!match) return null;
    const raw = decodeURIComponent(match.split('=').slice(1).join('='));
    const parsed = JSON.parse(raw) as AccessCookiePayload;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeAccessCookie(payload: AccessCookiePayload): void {
  if (typeof document === 'undefined') return;
  try {
    const encoded = encodeURIComponent(JSON.stringify(payload));
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${ACCESS_COOKIE_NAME}=${encoded}; max-age=${maxAge}; path=/; SameSite=Lax${secureFlag}`;
  } catch {
    // Ignore cookie write errors in restricted contexts
  }
}

function deleteAccessCookie(): void {
  if (typeof document === 'undefined') return;
  try {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${ACCESS_COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax${secureFlag}`;
  } catch {
    // Ignore
  }
}

function hydrateAccessFromCookie(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('stellaway_subscription_status') === 'cancelled') return;

  const hasLocalSub = localStorage.getItem('stellaway_subscription_active') === 'true';
  const hasLocalTrial = Boolean(localStorage.getItem('stellaway_trial_expires'));
  if (hasLocalSub || hasLocalTrial) return;

  const cookieData = readAccessCookie();
  if (!cookieData) return;

  const isTrialPlan = cookieData.planId === 'free2days' || cookieData.planId === 'trial_48h';
  const trialValid = Boolean(cookieData.trialExpiresAt && cookieData.trialExpiresAt > Date.now());

  if (isTrialPlan && !trialValid) return;
  if (!cookieData.subscribed && !trialValid) return;

  if (cookieData.planId) {
    localStorage.setItem('stellaway_active_plan', cookieData.planId);
  }
  if (cookieData.subscribed && !isTrialPlan) {
    localStorage.setItem('stellaway_subscription_active', 'true');
  }
  if (cookieData.trialExpiresAt) {
    localStorage.setItem('stellaway_trial_expires', String(cookieData.trialExpiresAt));
  }
  if (cookieData.email) {
    localStorage.setItem('stellaway_user_email', cookieData.email);
    if (isTrialPlan) {
      localStorage.setItem('stellaway_trial_email', cookieData.email);
    }
  }
  if (cookieData.name) {
    localStorage.setItem('stellaway_user_name', cookieData.name);
  }
  if (cookieData.provider) {
    localStorage.setItem('stellaway_payment_provider', cookieData.provider);
  }
  if (cookieData.transactionId) {
    localStorage.setItem('stellaway_transaction_id', cookieData.transactionId);
  }
}

export function isPreviewOrLocalAccess(): boolean {
  if (typeof window === 'undefined') return false;

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  const isAiStudioPreview =
    (host.startsWith('ais-') && host.endsWith('.run.app')) ||
    host.endsWith('.aistudio.google.com');

  return isLocal || isAiStudioPreview;
}

/**
 * Returns true ONLY when the user has a real persisted registration,
 * active 48h trial, or paid subscription (ignoring localhost/AI Studio preview bypass).
 */
export function hasRegisteredAccess(): boolean {
  if (typeof window === 'undefined') return false;
  hydrateAccessFromCookie();

  const activePlan = localStorage.getItem('stellaway_active_plan');
  const isSubscribed = localStorage.getItem('stellaway_subscription_active') === 'true';
  const savedExpires = localStorage.getItem('stellaway_trial_expires');
  const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());

  if (activePlan === 'free2days' || activePlan === 'trial_48h') {
    return isTrialValid;
  }

  return isSubscribed || isTrialValid;
}

export function hasAppAccess(): boolean {
  if (typeof window === 'undefined') return false;
  return hasRegisteredAccess() || isPreviewOrLocalAccess();
}

export function persistAppAccess(params: {
  planId: string;
  email?: string;
  name?: string;
  trialExpiresAt?: number;
  provider?: string;
  transactionId?: string;
}): void {
  if (typeof window === 'undefined') return;

  const cleanPlan = params.planId || 'anual';
  const isTrialPlan = cleanPlan === 'free2days' || cleanPlan === 'trial_48h';
  const expiresAt = isTrialPlan
    ? params.trialExpiresAt || Date.now() + 48 * 3600 * 1000
    : params.trialExpiresAt;

  localStorage.removeItem('stellaway_subscription_status');
  localStorage.setItem('stellaway_active_plan', cleanPlan);

  if (isTrialPlan) {
    localStorage.setItem('stellaway_trial_expires', String(expiresAt));
    localStorage.removeItem('stellaway_subscription_active');
    localStorage.setItem('stellaway_device_trial_used', 'true');
  } else {
    localStorage.setItem('stellaway_subscription_active', 'true');
  }

  if (params.email) {
    const cleanEmail = params.email.trim().toLowerCase();
    localStorage.setItem('stellaway_user_email', cleanEmail);
    localStorage.setItem('stellaway_customer_email', cleanEmail);
    if (isTrialPlan) {
      localStorage.setItem('stellaway_trial_email', cleanEmail);
      try {
        const usedEmails = JSON.parse(localStorage.getItem('stellaway_used_trial_emails') || '[]');
        if (Array.isArray(usedEmails) && !usedEmails.includes(cleanEmail)) {
          usedEmails.push(cleanEmail);
          localStorage.setItem('stellaway_used_trial_emails', JSON.stringify(usedEmails));
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  if (params.name) {
    localStorage.setItem('stellaway_user_name', params.name.trim());
  }
  if (params.provider) {
    localStorage.setItem('stellaway_payment_provider', params.provider);
  }
  if (params.transactionId) {
    localStorage.setItem('stellaway_transaction_id', params.transactionId);
  }

  writeAccessCookie({
    planId: cleanPlan,
    subscribed: !isTrialPlan,
    trialExpiresAt: expiresAt,
    email: params.email?.trim().toLowerCase(),
    name: params.name?.trim(),
    provider: params.provider,
    transactionId: params.transactionId,
  });

  window.dispatchEvent(new CustomEvent('stellaway-access-updated'));
}

export function clearPersistedAppAccess(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('stellaway_subscription_active');
  localStorage.removeItem('stellaway_trial_phone');
  localStorage.removeItem('stellaway_trial_email');
  localStorage.removeItem('stellaway_trial_expires');
  localStorage.removeItem('stellaway_active_plan');
  localStorage.removeItem('stellaway_payment_provider');
  localStorage.removeItem('stellaway_transaction_id');
  deleteAccessCookie();
  window.dispatchEvent(new CustomEvent('stellaway-access-updated'));
}
