import { useQuery } from "@tanstack/react-query";
import { useAjax } from "@frontend/hooks/useAjax";

export const useTransactionsQuery = ({
  accountId,
  dateStart,
  dateEnd,
}: any) => {
  const { get } = useAjax();

  return useQuery({
    queryKey: ["transactions", accountId, dateStart, dateEnd],

    queryFn: async () => {
      const params: any = {
        date_start: dateStart,
        date_end: dateEnd,
        limit: 200,
        order: "DESC",
      };

      if (accountId !== "all") {
        params.account_id = accountId;
      }

      const data = await get("cdcompta_get_transactions", params);

      return {
        transactions: data?.transactions ?? [],
        total: data?.total ?? 0,
      };
    },

    staleTime: 1000 * 60 * 5,
  });
};