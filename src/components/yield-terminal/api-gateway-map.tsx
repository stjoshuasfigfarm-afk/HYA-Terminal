
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { User, Server, Cloud, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ApiGatewayMapProps {
  apiStatus: { 
      finnhub: boolean | null; 
      alphaVantage: boolean | null; 
      financialModelingPrep: boolean | null; 
      marketStack: boolean | null;
      tradingEconomics: boolean | null;
      rapidApi: boolean | null;
      yahooFinance: boolean | null;
  };
}

const ServiceNode = ({ label, icon: Icon, status, details }: { label: string, icon: React.ElementType, status: 'valid' | 'invalid' | 'validating' | 'neutral', details: string }) => {
    const statusInfo = {
        valid: {
            icon: CheckCircle,
            color: 'border-green-500/50 bg-green-500/10 text-green-300',
            iconColor: 'text-green-400'
        },
        invalid: {
            icon: XCircle,
            color: 'border-red-500/50 bg-red-500/10 text-red-300',
            iconColor: 'text-red-400'
        },
        validating: {
            icon: AlertCircle,
            color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 animate-pulse',
            iconColor: 'text-yellow-400'
        },
        neutral: {
            icon: Icon,
            color: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
            iconColor: 'text-sky-300'
        }
    };
    const currentStatus = statusInfo[status];
    const StatusIcon = currentStatus.icon;

    return (
        <div className={cn("relative flex items-center gap-3 p-3 rounded-lg border w-48 h-20 shadow-lg backdrop-blur-sm", currentStatus.color)}>
            <Icon className="w-8 h-8 shrink-0" />
            <div className="flex flex-col">
                <span className="text-sm font-bold">{label}</span>
                <span className="text-xs text-muted-foreground">{details}</span>
            </div>
            <StatusIcon className={cn("absolute top-2 right-2 w-5 h-5", currentStatus.iconColor)} />
        </div>
    )
};

const ConnectionLine = ({ status }: { status: 'valid' | 'invalid' | 'validating' }) => {
    const statusColors = {
        valid: 'border-green-500/30',
        invalid: 'border-red-500/30',
        validating: 'border-yellow-500/30',
    };
    const pulseColors = {
        valid: 'bg-green-500',
        invalid: 'bg-red-500',
        validating: 'bg-yellow-500',
    };

    return (
        <div className="relative flex items-center h-20">
            <div className={cn("w-16 h-px mx-2 border-t border-dashed", statusColors[status])}>
                 <div className={cn("h-full w-1 animate-pulse", pulseColors[status])} style={{ animationDirection: 'reverse' }}/>
            </div>
            <div className={cn(
                "w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8",
                statusColors[status].replace('border-t-', 'border-l-')
            )} />
        </div>
    );
};

export default function ApiGatewayMap({ apiStatus }: ApiGatewayMapProps) {

    const getStatus = (key: keyof ApiGatewayMapProps['apiStatus']): 'valid' | 'invalid' | 'validating' => {
        if (apiStatus[key] === true) return 'valid';
        if (apiStatus[key] === false) return 'invalid';
        return 'validating';
    }

    const avStatus = getStatus('alphaVantage');
    const finnhubStatus = getStatus('finnhub');
    const fmpStatus = getStatus('financialModelingPrep');
    const teStatus = getStatus('tradingEconomics');
    const rapidStatus = getStatus('rapidApi');
    const yahooStatus = getStatus('yahooFinance');
    
    const isAnyLive = avStatus === 'valid' || finnhubStatus === 'valid' || rapidStatus === 'valid';

  return (
    <div className="relative w-full bg-black/20 border border-border rounded-lg overflow-auto p-6 flex flex-col items-center gap-4">
        <h3 className="text-lg font-headline text-primary">Service Topology Map</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xl mb-4">
            Visualizing structural data flows. RapidAPI and Yahoo Finance tracks are now live in the institutional circuit.
        </p>

        <div className="flex items-center">
            {/* Client */}
            <ServiceNode label="Client" icon={User} status="neutral" details="Your Browser" />
            <ConnectionLine status={isAnyLive ? 'valid' : 'invalid'} />
            
            {/* Gateway */}
            <div className="flex flex-col items-center">
                 <ServiceNode label="API Gateway" icon={Server} status={isAnyLive ? 'valid' : 'invalid'} details="Next.js Server" />
                 <p className="text-xs mt-2 font-mono">{isAnyLive ? 'CIRCUIT_LIVE' : 'CIRCUIT_OFFLINE'}</p>
            </div>

            {/* Connections to APIs */}
            <div className="flex flex-col justify-around h-full ml-2">
                 <ConnectionLine status={finnhubStatus} />
                 <ConnectionLine status={rapidStatus} />
                 <ConnectionLine status={yahooStatus} />
                 <ConnectionLine status={fmpStatus} />
            </div>

            {/* API Nodes */}
            <div className="flex flex-col gap-4 ml-2">
                <ServiceNode label="Finnhub" icon={Cloud} status={finnhubStatus} details="Equity Prices/News" />
                <ServiceNode label="RapidAPI" icon={Cloud} status={rapidStatus} details="Cross-Platform Gateway" />
                <ServiceNode label="Yahoo Finance" icon={Cloud} status={yahooStatus} details="HLOC Institutional Data" />
                <ServiceNode label="FMP" icon={Cloud} status={fmpStatus} details="Institutional Search" />
            </div>
        </div>

    </div>
  );
}
