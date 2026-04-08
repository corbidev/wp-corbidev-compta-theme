import { create } from "zustand";

export const useTransactionsStore = create((set) => ({
  filters: {
    search: "",
    dateStart: "",
    dateEnd: "",
    type: "", // credit | debit
    amountOperator: "", // gt | lt | eq
    amountValue: "",
    category: "",
  },

  setFilters: (newFilters: any) =>
    set((state: any) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        dateStart: "",
        dateEnd: "",
        type: "",
        amountOperator: "",
        amountValue: "",
        category: "",
      },
    }),
}));