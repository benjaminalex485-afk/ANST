import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPanel } from "@/components/terminal/PortfolioPanel";

export const Route = createFileRoute("/_terminal/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — QUANT.OS Terminal" },
      { name: "description", content: "Open positions, allocations, and PnL." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <PortfolioPanel />
    </div>
  ),
});
