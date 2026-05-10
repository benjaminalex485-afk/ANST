import { createFileRoute } from "@tanstack/react-router";
import { SignalsPanel } from "@/components/terminal/SignalsPanel";

export const Route = createFileRoute("/_terminal/signals")({
  head: () => ({
    meta: [
      { title: "Signals — QUANT.OS Terminal" },
      { name: "description", content: "AI-generated trading signals feed." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <SignalsPanel />
    </div>
  ),
});
