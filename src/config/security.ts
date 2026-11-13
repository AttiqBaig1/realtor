/**
 * Admin / agency access.
 *
 * Only the SHA-256 hash of the password lives in the code (the site is public
 * on GitHub Pages). To change the password, put the hash of your new one here:
 *   node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"
 *
 * Note: this is a static site, so this gate keeps casual visitors out of the
 * admin console and the agency tools; it is not server-side security. All
 * data (listings, leads, WordPress credentials) stays in the browser that
 * entered it.
 */
export const ADMIN_PASSWORD_SHA256 = '919ad88efc27ec035d4446869c9d943bcd71aa0920b1937ca9371588c3380109';

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  return (await sha256Hex(password.trim())) === ADMIN_PASSWORD_SHA256;
}
