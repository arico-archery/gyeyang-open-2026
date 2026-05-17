// Super admin emails - these accounts can manage all user roles
export const SUPER_ADMIN_EMAILS = [
  "sms@arico.co.jp",
];

export function isSuperAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}
