import { createFileRoute } from "@tanstack/react-router";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const Route = createFileRoute("/_terminal/explainability")({
  head: () => ({
    meta: [
      { title: "Explainability — QUANT.OS Terminal" },
      { name: "description", content: "Model interpretability and decision rationale." },
    ],
  }),
  component: () => (
    <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-2">
      <TerminalPanel title="Feature Attribution" subtitle="last signal · BTC/USDT BUY">
        <div className="flex flex-col gap-1.5 p-3">
          {[
            { f: "MACD histogram", w: 0.32 },
            { f: "Volume Δ (5m)", w: 0.21 },
            { f: "EMA20 slope", w: 0.18 },
            { f: "Order book imbalance", w: 0.14 },
            { f: "Funding rate", w: 0.09 },
            { f: "BTC dominance", w: 0.06 },
          ].map((r) => (
            <div key={r.f} className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-40 text-muted-foreground">{r.f}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-muted">
                <div className="h-full bg-info" style={{ width: `${r.w * 100}%` }} />
              </div>
              <span className="tnum w-10 text-right">{(r.w * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </TerminalPanel>
      <TerminalPanel title="Decision Trace">
        <pre className="overflow-auto p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
{`[10:42:11] regime_classifier => "trend-up" (0.82)
[10:42:11] features.macd_hist = +0.0042
[10:42:11] features.vol_delta_5m = +18.4%
[10:42:11] ensemble.score = +0.74 (threshold 0.55)
[10:42:11] risk.size_check OK (0.12 BTC)
[10:42:11] router.venue = binance.spot
[10:42:11] order.placed BUY 0.12 @ LIMIT 67820`}
        </pre>
      </TerminalPanel>
    </div>
  ),
});
