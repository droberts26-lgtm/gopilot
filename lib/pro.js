// Hardcoded Pro emails — replace with DB lookup when payments are added
const PRO_EMAILS = ['dshirtsla@gmail.com'];

/**
 * Returns true if the NextAuth session user has Pro access.
 * @param {object|null} session - NextAuth session object
 * @returns {boolean}
 */
export function isPro(session) {
  if (!session?.user?.email) return false;
  return PRO_EMAILS.includes(session.user.email.toLowerCase());
}
