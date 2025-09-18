import "server-only";

const BASE = process.env.ZENOTI_BASE_URL!;
const ORG_ID = process.env.ZENOTI_ORG_ID!;
const CENTER_ID = process.env.ZENOTI_CENTER_ID!;
const API_KEY = process.env.ZENOTI_API_KEY!;
const CLIENT_ID = process.env.ZENOTI_CLIENT_ID!;
const CLIENT_SECRET = process.env.ZENOTI_CLIENT_SECRET!;

let accessToken: string | null = null;
let tokenExpireAt = 0;

async function ensureToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpireAt - 60_000) return accessToken;

  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "zenoti-api-key": API_KEY },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: `org:${ORG_ID}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Unable to get Zenoti token");
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpireAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  return accessToken!;
}

function authHeaders(tok: string) {
  return {
    Authorization: `Bearer ${tok}`,
    "zenoti-api-key": API_KEY,
    "Content-Type": "application/json",
  };
}

export async function searchGuests(query: string) {
  const tok = await ensureToken();
  const url = new URL(`${BASE}/guests/search`);
  url.searchParams.set("org_id", ORG_ID);
  url.searchParams.set("center_id", CENTER_ID);
  url.searchParams.set("q", query);
  // supports name/phone/email per Zenoti guest search. :contentReference[oaicite:5]{index=5}
  const res = await fetch(url, { headers: authHeaders(tok), cache: "no-store" });
  if (!res.ok) throw new Error("Zenoti guest search failed");
  return res.json();
}

export async function listGuestAppointments(guestId: string, fromISO: string, toISO: string) {
  const tok = await ensureToken();
  const url = new URL(`${BASE}/appointments/center`);
  url.searchParams.set("org_id", ORG_ID);
  url.searchParams.set("center_id", CENTER_ID);
  url.searchParams.set("guest_id", guestId);
  url.searchParams.set("from_date", fromISO);
  url.searchParams.set("to_date", toISO);
  // center appointments with filters. :contentReference[oaicite:6]{index=6}
  const res = await fetch(url, { headers: authHeaders(tok), cache: "no-store" });
  if (!res.ok) throw new Error("Zenoti appointments fetch failed");
  return res.json();
}

export async function checkInAppointment(appointmentId: string) {
  const tok = await ensureToken();
  const res = await fetch(`${BASE}/appointments/${appointmentId}/checkin`, {
    method: "POST",
    headers: authHeaders(tok),
    body: JSON.stringify({ org_id: ORG_ID, center_id: CENTER_ID }),
  });
  // mark appointment checked-in. :contentReference[oaicite:7]{index=7}
  if (!res.ok) throw new Error("Zenoti check-in failed");
  return res.json();
}
