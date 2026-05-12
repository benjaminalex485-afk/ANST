import { createFileRoute } from "@tanstack/react-router";
import { HealthPanel } from "@/components/terminal/HealthPanel";

export const Route = createFileRoute("/_terminal/health")({
  head: () => ({
    meta: [
      { title: "Health — QUANT.OS Terminal" },
      { name: "description", content: "System observability and telemetry." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <HealthPanel />
    </div>
  ),
});
