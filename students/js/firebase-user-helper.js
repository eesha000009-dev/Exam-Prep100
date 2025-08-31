// Small helper to centralize personalization logic used across student pages
// Exports: initUserPersonalization(onReady) -> initializes firebase-user and calls onReady({user, helpers})
export async function initUserPersonalization(onReady) {
  try {
    const mod = await import('../../js/firebase-user.js');
    const { onUserChange, getUnreadNotificationsCount, initialsFromName } = mod;

    onUserChange(async (user) => {
      try {
        const helpers = {
          getUnreadNotificationsCount,
          initialsFromName,
        };
          // Apply a consistent avatar across pages: #avatar-sm (sidebar) and #topAvatar (topbar)
          try {
            const applyAvatar = async () => {
              if (!user) return;
              const fullName = user.displayName || '';
              const initials = (mod && mod.initialsFromName) ? (await mod.initialsFromName(fullName)) : (fullName.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase());
              const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&length=2`;
              const sidebarImg = document.getElementById('avatar-sm');
              if (sidebarImg) sidebarImg.src = avatarUrl;
              const topImg = document.getElementById('topAvatar');
              if (topImg) topImg.src = avatarUrl;
              // also handle other common selectors
              const userAvatar = document.querySelector('img[alt="User"]') || document.getElementById('user-avatar');
              if (userAvatar) userAvatar.src = avatarUrl;
            };
            applyAvatar().catch(()=>{});
          } catch(e){ /* non-fatal */ }

          onReady && onReady({ user, helpers });
      } catch (e) {
        console.warn('personalization helper handler failed', e);
      }
    });
  } catch (e) {
    console.warn('firebase-user import failed in helper', e);
    onReady && onReady({ user: null, helpers: null });
  }
}

// Convenience wrappers so pages can call helpers without importing the original module directly
export async function initialsFromName(name) {
  try {
    const mod = await import('../../js/firebase-user.js');
    return mod.initialsFromName(name);
  } catch (e) {
    console.warn('initialsFromName helper failed', e);
    // fallback: crude initials
    if (!name) return '';
    return name.split(' ').map(s=>s[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
  }
}

export async function getUnreadNotificationsCount(uid) {
  try {
    const mod = await import('../../js/firebase-user.js');
    return await mod.getUnreadNotificationsCount(uid);
  } catch (e) {
    console.warn('getUnreadNotificationsCount helper failed', e);
    return 0;
  }
}
