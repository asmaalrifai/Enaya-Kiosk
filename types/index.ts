export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  membership?: "Gold" | "Silver" | "Basic";
  notes?: string;
  upcoming?: Appointment[];
};

export type AppointmentItem = {
  name: string;
  price?: number; // SAR
};

export type Appointment = {
  id: string;
  time?: string; // e.g., "15:30"
  date?: string; // ISO date if you have it
  services?: string[]; // legacy; keep for compatibility
  items?: AppointmentItem[]; // preferred: itemized services with prices
  staff: string;
  status: "scheduled" | "checked_in" | "completed";
  total?: number;         // optional total in SAR
  currency?: string;      // e.g., "SAR"
};
