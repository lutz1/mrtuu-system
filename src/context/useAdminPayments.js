import { usePayments } from "./PaymentsContext";

export function useAdminPayments() {
  return usePayments();
}
