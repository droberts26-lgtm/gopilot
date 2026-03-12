// Hardcoded Pro emails — email bypass for the owner account
const PRO_EMAILS = ['dshirtsla@gmail.com', 'droberts26@pacificachristian.org'];

/**
 * Returns true if the NextAuth session user has Pro access via the email bypass.
 * @param {object|null} session - NextAuth session object
 * @returns {boolean}
 */
export function isPro(session) {
  if (!session?.user?.email) return false;
  return PRO_EMAILS.includes(session.user.email.toLowerCase());
}

/**
 * Returns the Redis key for a user's Pro status.
 * @param {string} userId
 * @returns {string}
 */
export function proKey(userId) {
  return `user:${userId}:pro`;
}
