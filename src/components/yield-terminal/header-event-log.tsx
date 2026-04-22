
"use client";

import React from "react";
import type { LogEntry } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const logTypeColors: Record<LogEntry["type"], string> = {
  INFO: "text-blue-400",
  FS_ERR: "text-red-400",
  FS_SYNC: "text-purple-400",
  AI_QUERY: "text-yellow-400",
  AI_RESPONSE: "text-accent",
};

export default function HeaderEventLog({ logs }: { logs: LogEntry[] }) {
  const recentLogs = [...logs].reverse().slice(0, 20); // Show most recent 20 logs

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Terminal className="w-4 h-4 mr-2" />
          Event Log
          {logs.length > 0 && 
            <Badge variant="destructive" className="absolute -right-2 -top-2 px-1.5 h-auto">
              {logs.length}
            </Badge>
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel>Recent Events</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          <div className="p-2 space-y-2">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <div key={index} className="flex gap-2 items-start text-xs">
                  <span className="text-muted-foreground/70">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={cn("font-bold", logTypeColors[log.type])}>
                    [{log.type}]
                  </span>
                  <span className="flex-1 break-words text-foreground">
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center p-4">No events yet.</p>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
