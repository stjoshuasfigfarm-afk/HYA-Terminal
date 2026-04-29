
"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GitMerge, CheckCircle } from 'lucide-react';

const changes = [
    {
        title: "Renamed to Analysis Terminal",
        description: "Updated branding across the entire application to reflect the new institutional identity."
    },
    {
        title: "Institutional Tier Pricing",
        description: "Confirmed Institutional access tier at $9/mo with priority structural synthesis."
    },
    {
        title: "Interactive Sector Analysis",
        description: "Sectors in the analysis panel are now clickable, revealing a dropdown of associated companies for quick navigation."
    },
    {
        title: "UI Layout and Naming Improvements",
        description: "Improved overall panel organization and enlarged the topology map for a more intuitive workflow."
    },
    {
        title: "Streamlined Navigation",
        description: "Removed redundant navigation buttons and added a dedicated 'Settings' button to simplify the user interface."
    },
    {
        title: "Enhanced Financial Metrics",
        description: "The price panel now displays the absolute dollar and percentage change (delta) for a clearer view of performance."
    },
    {
        title: "Optimized API Fallback Logic",
        description: "Re-prioritized data sources to ensure more reliable real-time data and news feeds."
    },
    {
        title: "Integrated MarketStack for News",
        description: "Added MarketStack as a fourth-level fallback for news data, increasing data resiliency."
    },
    {
        title: "Fixed API Key Validation Crash",
        description: "The application no longer crashes when using tools that require an API key that has not been configured."
    },
];

export default function HeaderChangelog() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <GitMerge className="w-4 h-4 mr-2" />
          Changelog
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel>Recent Changes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          <div className="p-2 space-y-3">
            {changes.map((change, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">{change.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{change.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
