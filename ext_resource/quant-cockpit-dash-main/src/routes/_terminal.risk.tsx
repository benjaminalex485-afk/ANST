import { createFileRoute } from "@tanstack/react-router";
import { RiskPanel } from "@/components/terminal/RiskPanel";

export const Route = createFileRoute("/_terminal/risk")({
  head: () => ({
    meta: [
      { title: "Risk — QUANT.OS Terminal" },
      { name: "description", content: "Real-time risk and exposure monitoring." },
    ],
  }),
  component: () => (
    <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <RiskPanel />
      </div>
    </div>
  ),
});
