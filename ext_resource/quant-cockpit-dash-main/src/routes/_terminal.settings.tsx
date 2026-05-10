import { createFileRoute } from "@tanstack/react-router";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { Switch } from "@/components/ui/switch";

const settings = [
  { label: "Paper trading mode", desc: "Simulate fills without sending live orders", on: true },
  { label: "Auto-reconnect feeds", desc: "Recover dropped websocket connections", on: true },
  { label: "Sound alerts", desc: "Play tone on fills and risk breaches", on: false },
  { label: "Confirm market orders", desc: "Require dialog confirmation for market sends", on: true },
  { label: "Telemetry export", desc: "Forward telemetry to external observability sink", on: false },
];

export const Route = createFileRoute("/_terminal/settings")({
  head: () => ({
    meta: [
      { title: "Settings — QUANT.OS Terminal" },
      { name: "description", content: "Terminal preferences and runtime settings." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <TerminalPanel title="Settings" subtitle="runtime · alerts">
        <div className="divide-y divide-border">
          {settings.map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-3 py-2.5">
              <div className="flex-1">
                <div className="font-mono text-[12px] text-foreground">{s.label}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{s.desc}</div>
              </div>
              <Switch defaultChecked={s.on} />
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  ),
});
