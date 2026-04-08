import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionsFilters(props: any) {
  const {
    accountId,
    setAccountId,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    accounts,
    total,
  } = props;

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Select value={accountId} onValueChange={setAccountId}>
        <SelectTrigger>
          <SelectValue placeholder="Compte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          {accounts.map((a: any) => (
            <SelectItem key={a.account_id} value={a.account_id}>
              {a.account_id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
      <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />

      <div className="flex items-center">
        {total} résultats
      </div>
    </div>
  );
}