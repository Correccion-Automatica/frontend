export function normalizeUser(raw = {}) {
  return {
    id: raw.id ?? raw._id ?? null,
    email: raw.email ?? null,
    name: raw.name ?? raw.fullName ?? null,
    ...raw,
  };
}