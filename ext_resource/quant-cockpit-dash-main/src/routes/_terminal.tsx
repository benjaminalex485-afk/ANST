import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Sidebar } from '@/components/terminal/Sidebar';
import { Topbar } from '@/components/terminal/Topbar';
import { CommandPalette } from '@/components/terminal/CommandPalette';
import { simulationEngine } from '@/services/engines/simulation-engine';

export const Route = createFileRoute('/_terminal')({
  component: TerminalLayout,
});

function TerminalLayout() {
  // Spin up real-time pricing ticks on workstation boot
  useEffect(() => {
    simulationEngine.start();
    return () => {
      simulationEngine.stop();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main workstation workspace */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top telemetry bar */}
        <Topbar />

        {/* Content routing container */}
        <main className="flex-1 overflow-y-auto p-2 min-h-0">
          <Outlet />
        </main>
      </div>

      {/* Custom CommandPalette menu */}
      <CommandPalette />
    </div>
  );
}
