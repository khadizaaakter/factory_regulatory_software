export function formatNumber(number) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}
const PERMISSION_FREE_ROUTES = [
  "user-management",
];

export function hasPermission(route) {
  if (PERMISSION_FREE_ROUTES.includes(route?.name)) return true;
  const user_permissions = JSON.parse(localStorage.getItem("user_permissions"));
  return user_permissions?.some((item) => item == route?.name);
}

// Button-level (granular) permission check against the raw dotted permission
// strings the backend returns at login (e.g. "license_master.edit").
// Use in a template to hide a button:  v-if="can('license_master.edit')"
export function can(permission) {
  const raw = JSON.parse(localStorage.getItem("raw_permissions") || "[]");
  if (!Array.isArray(raw)) return false;
  return raw.some((p) => (typeof p === "string" ? p : p?.name) === permission);
}
