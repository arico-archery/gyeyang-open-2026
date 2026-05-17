// Staff invite codes for judge/admin registration
// These can be managed via Supabase later, for now hardcoded
export const STAFF_INVITE_CODES: Record<string, { role: "judge" | "admin"; label: string }> = {
  "GYEYANG-JUDGE-2026": { role: "judge", label: "심판 초대 코드" },
  "GYEYANG-ADMIN-2026": { role: "admin", label: "관리자 초대 코드" },
};

export function validateInviteCode(code: string): { valid: boolean; role?: "judge" | "admin" } {
  const entry = STAFF_INVITE_CODES[code.trim().toUpperCase()];
  if (entry) {
    return { valid: true, role: entry.role };
  }
  return { valid: false };
}
