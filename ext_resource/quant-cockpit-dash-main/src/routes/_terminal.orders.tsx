import { createFileRoute } from "@tanstack/react-router";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { StatusBadge } from "@/components/terminal/StatusBadge";
import { cn } from "@/lib/utils";

const orders = [
  { id: "ord_8741a", time: "10:42:11", symbol: "BTC/USDT", side: "BUY", type: "LIMIT", qty: 0.12, price: 67820, status: "FILLED" },
  { id: "ord_8741b", time: "10:39:51", symbol: "ETH/USDT", side: "SELL", type: "MARKET", qty: 2.0, price: 3512.4, status: "FILLED" },
  { id: "ord_8741c", time: "10:36:02", symbol: "SOL/USDT", side: "SELL", type: "STOP", qty: 25, price: 156.0, status: "WORKING" },
  { id: "ord_8741d", time: "10:31:17", symbol: "NVDA", side: "BUY", type: "LIMIT", qty: 10, price: 124.2, status: "PARTIAL" },
  { id: "ord_8741e", time: "10:22:30", symbol: "ES1!", side: "SELL", type: "LIMIT", qty: 1, price: 5715, status: "CANCELED" },
];

export const Route = createFileRoute("/_terminal/orders")({
  head: () => ({
    meta: [
      { title: "Orders — QUANT.OS Terminal" },
      { name: "description", content: "Working and historical orders." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div className="h-full">
      <TerminalPanel title="Orders" subtitle={`${orders.length} entries`} scroll>
        <table className="w-full font-mono text-[11px]">
          <thead className="sticky top-0 bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-2.5 py-1.5 text-left">Time</th>
              <th className="px-2.5 py-1.5 text-left">Order ID</th>
              <th className="px-2.5 py-1.5 text-left">Symbol</th>
              <th className="px-2.5 py-1.5 text-left">Side</th>
              <th className="px-2.5 py-1.5 text-left">Type</th>
              <th className="px-2.5 py-1.5 text-right">Qty</th>
              <th className="px-2.5 py-1.5 text-right">Price</th>
              <th className="px-2.5 py-1.5 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-grid-line hover:bg-panel-elevated">
                <td className="px-2.5 py-1 text-muted-foreground">{o.time}</td>
                <td className="px-2.5 py-1 text-foreground">{o.id}</td>
                <td className="px-2.5 py-1 font-semibold">{o.symbol}</td>
                <td className={cn("px-2.5 py-1", o.side === "BUY" ? "text-bull" : "text-bear")}>{o.side}</td>
                <td className="px-2.5 py-1 text-muted-foreground">{o.type}</td>
                <td className="tnum px-2.5 py-1 text-right">{o.qty}</td>
                <td className="tnum px-2.5 py-1 text-right">{o.price.toLocaleString()}</td>
                <td className="px-2.5 py-1">
                  <StatusBadge variant={
                    o.status === "FILLED" ? "bull" :
                    o.status === "WORKING" ? "info" :
                    o.status === "PARTIAL" ? "warn" : "neutral"
                  }>{o.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TerminalPanel>
    </div>
  );
}
