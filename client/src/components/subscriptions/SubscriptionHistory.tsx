import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import type { SubscriptionPlan, UserSubscription } from "@shared/schema";

interface SubscriptionHistoryProps {
  subscriptions: (UserSubscription & { plan: SubscriptionPlan })[];
  isLoading: boolean;
}

export default function SubscriptionHistory({ subscriptions, isLoading }: SubscriptionHistoryProps) {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd.MM.yyyy', { locale: uk });
  };
  
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Історія підписок</h3>
      <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-muted-foreground">План</TableHead>
                <TableHead className="text-muted-foreground">Дата початку</TableHead>
                <TableHead className="text-muted-foreground">Дата закінчення</TableHead>
                <TableHead className="text-muted-foreground">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-800">
              {isLoading ? (
                // Loading skeleton
                Array(2).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{sub.plan?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(sub.startDate)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(sub.endDate)}</div>
                    </TableCell>
                    <TableCell>
                      {sub.isActive ? (
                        <Badge variant="outline" className="bg-green-500 bg-opacity-10 text-green-500 border-0">
                          Активна
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-700 text-gray-400 border-0">
                          Завершена
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Немає історії підписок
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
