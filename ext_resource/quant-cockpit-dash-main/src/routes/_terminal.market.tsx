import { createFileRoute } from "@tanstack/react-router";
import { ChartPanel } from "@/components/terminal/ChartPanel";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

const book = Array.from({ length: 12 }, (_, i) => ({
  bidPx: (67842 - i * 1.4).toFixed(1),
  bidSz: (Math.random() * 4 + 0.2).toFixed(3),
  askPx: (67843 + i * 1.4).toFixed(1),
  askSz: (Math.random() * 4 + 0.2).toFixed(3),
}));

export const Route = createFileRoute("/_terminal/market")({
  head: () => ({
    meta: [
      { title: "Market — QUANT.OS Terminal" },
      { name: "description", content: "Live market view with chart and order book." },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  return (
    <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ChartPanel />
      </div>
      <div className="lg:col-span-4">
        <TerminalPanel title="Order Book" subtitle="BTC/USDT" scroll>
          <table className="w-full font-mono text-[11px]">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-2 py-1 text-left">Bid Sz</th>
                <th className="px-2 py-1 text-right">Bid</th>
                <th className="px-2 py-1 text-left">Ask</th>
                <th className="px-2 py-1 text-right">Ask Sz</th>
              </tr>
            </thead>
            <tbody>
              {book.map((r, i) => (
                <tr key={i} className="border-b border-grid-line">
                  <td className="tnum px-2 py-0.5 text-bull">{r.bidSz}</td>
                  <td className="tnum px-2 py-0.5 text-right text-bull">{r.bidPx}</td>
                  <td className="tnum px-2 py-0.5 text-bear">{r.askPx}</td>
                  <td className="tnum px-2 py-0.5 text-right text-bear">{r.askSz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TerminalPanel>
      </div>
    </div>
  );
}
