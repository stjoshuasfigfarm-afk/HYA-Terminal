
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Clock, Info, AlertTriangle } from "lucide-react";

interface LastUpdateBoxProps {
  isConnected: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export default function LastUpdateBox({ isConnected, lastUpdated, error }: LastUpdateBoxProps) {
  const status = error ? 'error' : isConnected ? 'connected' : 'disconnected';

  const getStatusInfo = () => {
    switch (status) {
      case 'error':
        return {
          text: "Update Error",
          color: "text-red-400 border-red-500/50 bg-red-500/10 hover:bg-red-500/20",
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          details: `Error: ${error}`
        };
      case 'connected':
        return {
          text: `Updated: ${lastUpdated?.toLocaleTimeString()}`,
          color: "text-green-400 border-green-500/50 bg-green-500/10 hover:bg-green-500/20",
          icon: <Clock className="w-3.5 h-3.5" />,
          details: `Live data connected via API. Last trade update received at ${lastUpdated?.toLocaleTimeString()}.`
        };
      default:
        return {
          text: "Disconnected",
          color: "text-muted-foreground border-border bg-muted/50 hover:bg-muted",
          icon: <Info className="w-3.5 h-3.5" />,
          details: "Real-time data is disabled or a valid API key is not configured."
        };
    }
  };

  const { text, color, icon, details } = getStatusInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex items-center gap-2 text-xs px-2 py-1 border rounded-md transition-colors", color)}>
          {icon}
          <span className="font-medium">{text}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="focus:bg-transparent focus:text-popover-foreground cursor-default">
          <p className="text-sm text-muted-foreground whitespace-normal max-w-xs">{details}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
