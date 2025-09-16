export type Appointment = {
  id: string;
  time: string;
  services: string[];
  staff: string;
  status: "scheduled" | "checked_in" | "completed";
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  membership?: "Gold" | "Silver" | "Basic";
  notes?: string;
  upcoming?: Appointment[];
};
