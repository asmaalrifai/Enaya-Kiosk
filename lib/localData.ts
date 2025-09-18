import { promises as fs } from "node:fs";
import path from "node:path";

export type LocalAppointment = {
  id: string;
  time: string;
  services: string[];
  staff: string;
  status: "scheduled" | "checked_in" | "completed";
};

export type LocalCustomer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  membership?: "Gold" | "Silver" | "Basic";
  notes?: string;
  upcoming?: LocalAppointment[];
};

export async function loadLocalCustomers(): Promise<LocalCustomer[]> {
  const file = path.join(process.cwd(), "data", "enaya.json");
  const raw = await fs.readFile(file, "utf-8");
  const json = JSON.parse(raw);
  return json.customers as LocalCustomer[];
}
