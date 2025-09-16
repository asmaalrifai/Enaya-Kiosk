import { Customer } from "@/types";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Aisha Al Mansour",
    phone: "+966 5••• ••321",
    membership: "Gold",
    notes: "Prefers quiet room; sensitive scalp.",
    upcoming: [
      {
        id: "a1",
        time: "15:00",
        services: ["Balayage", "Blow-dry"],
        staff: "Roya",
        status: "scheduled",
      },
    ],
  },
  {
    id: "c2",
    name: "Laila Al Saud",
    phone: "+966 53•• ••789",
    membership: "Silver",
    upcoming: [
      {
        id: "a2",
        time: "15:30",
        services: ["Classic Mani", "Gel Removal"],
        staff: "Sahar",
        status: "scheduled",
      },
    ],
  },
  {
    id: "c3",
    name: "Noor Al Harbi",
    phone: "+966 54•• ••112",
    membership: "Basic",
    upcoming: [
      {
        id: "a3",
        time: "16:00",
        services: ["Haircut", "Treatment"],
        staff: "Mona",
        status: "scheduled",
      },
    ],
  },
];
