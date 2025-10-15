// Centralized utility to resolve a user's profile image URL
// Prefers explicit URLs, otherwise falls back to a ui-avatars.com image
// Usage: getProfileImageUrl({ profile_image, avatar, name })

export function getProfileImageUrl({ profile_image, avatar, name }) {
  const primary = (typeof profile_image === 'string' ? profile_image : null) ||
                  (typeof avatar === 'string' ? avatar : null);

  if (primary && primary.trim() !== '') {
    return primary;
  }

  const safeName = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${safeName}&background=f59e0b&color=fff`;
}

export default getProfileImageUrl;