export function isPreviewOrLocalAccess(): boolean {
  if (typeof window === 'undefined') return false;

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  const isAiStudioPreview =
    (host.startsWith('ais-') && host.endsWith('.run.app')) ||
    host.endsWith('.aistudio.google.com');

  return isLocal || isAiStudioPreview;
}

export function hasAppAccess(): boolean {
  if (typeof window === 'undefined') return false;
  const isSubscribed = localStorage.getItem('stellaway_subscription_active') === 'true';
  const savedExpires = localStorage.getItem('stellaway_trial_expires');
  const isTrialValid = Boolean(savedExpires && Number(savedExpires) > Date.now());
  return isSubscribed || isTrialValid || isPreviewOrLocalAccess();
}
