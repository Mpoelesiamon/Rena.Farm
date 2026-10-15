/* Display-only OAuth metadata. Never used for permissions or identity checks. */
function googleProfilePhoto(user) {
  const google = user?.identities?.find(identity => identity.provider === 'google')?.identity_data;
  const metadata = user?.user_metadata;
  const candidates = [google?.avatar_url, google?.picture, metadata?.avatar_url, metadata?.picture];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === 'https:' && !url.username && !url.password && !url.port &&
          (url.hostname === 'googleusercontent.com' || url.hostname.endsWith('.googleusercontent.com'))) return url.href;
    } catch (_) { /* Missing or malformed photo: use initials. */ }
  }
  return null;
}
function renderProfileAvatar(element, user, name) {
  if (!element) return;
  const initial = (name || 'Your account').trim().charAt(0).toUpperCase() || '?';
  element.textContent = initial;
  element.setAttribute('aria-hidden', 'true');
  const url = googleProfilePhoto(user);
  if (!url) return;
  const photo = document.createElement('img');
  photo.alt = '';
  photo.referrerPolicy = 'no-referrer';
  photo.decoding = 'async';
  photo.hidden = true;
  photo.onload = () => {
    if (!element.contains(photo)) return;
    element.replaceChildren(photo);
    photo.hidden = false;
  };
  photo.onerror = () => photo.remove();
  element.appendChild(photo);
  photo.src = url;
}
if (typeof module !== 'undefined') module.exports = { googleProfilePhoto, renderProfileAvatar };
