"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeSentiment } from "@/ai/flows/sentiment-flow"
import { describeApp } from "@/ai/flows/describe-app-flow"
import { Loader, FlaskConical, BrainCircuit, Activity } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';

export default function DevPanel() {
    const [isSentimentPending, startSentimentTransition] = useTransition();
    const [isDescriptionPending, startDescriptionTransition] = useTransition();
    const [headline, setHeadline] = useState("Apple announces record-breaking iPhone sales, exceeding all analyst expectations.");
    const [sentimentResult, setSentimentResult] = useState<Sentiment | null>(null);
    const [descriptionResult, setDescriptionResult] = useState("");

    const handleAnalyzeSentiment = () => {
        if (!headline) return;
        setSentimentResult(null);
        startSentimentTransition(async () => {
            // This hits your Genkit backend logic
            const result = await analyzeSentiment(headline);
            setSentimentResult(result as Sentiment);
        });
    }

    const handleDescribeApp = () => {
        setDescriptionResult("");
        startDescriptionTransition(async () => {
            const result = await describeApp();
            setDescriptionResult(result);
        });
    }

    return (
        <Card className="w-full max-w-2xl bg-black/20 border-white/5 backdrop-blur-sm shadow-2xl">
            <CardHeader className="border-b border-white/5">
                <CardTitle className="font-headline text-primary text-2xl flex items-center gap-3">
                    <FlaskConical className="text-amber-400" /> 
                    GENKIT_DIAGNOSTICS_V1
                </CardTitle>
                <CardDescription className="text-muted-foreground/70">
                    Direct execution environment for AI supply chain logic and sentiment scoring.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 pt-6">
                
                {/* 1. SENTIMENT ANALYSIS TEST */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary/80">
                        <Activity className="w-4 h-4" />
                        <Label className="text-sm font-bold tracking-widest uppercase">Sentiment scoring</Label>
                    </div>
                    <div className="space-y-3">
                         <Textarea 
                            className="bg-black/40 border-white/10 text-sm min-h-[100px] focus-visible:ring-amber-500/50"
                            placeholder="Paste a raw supply chain headline..."
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            disabled={isSentimentPending}
                        />
                        <Button 
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all"
                            onClick={handleAnalyzeSentiment} 
                            disabled={isSentimentPending || !headline}
                        >
                            {isSentimentPending ? (
                                <><Loader className="mr-2 h-4 w-4 animate-spin" /> PROCESSING_GENKIT_FLOW...</>
                            ) : (
                                "EXECUTE_SENTIMENT_ANALYSIS"
                            )}
                        </Button>
                    </div>

                    {sentimentResult && (
                        <Alert className={`mt-4 border-2 ${
                            sentimentResult === 'Bullish' ? 'border-green-500/50 bg-green-500/5' : 
                            sentimentResult === 'Bearish' ? 'border-red-500/50 bg-red-500/5' : 
                            'border-amber-500/50 bg-amber-500/5'
                        }`}>
                            <AlertTitle className="text-xs font-black uppercase tracking-tighter opacity-70">Analysis Output</AlertTitle>
                            <AlertDescription className="text-lg">
                                SC_SENTIMENT: <span className={`font-black ${
                                    sentimentResult === 'Bullish' ? 'text-green-400' : 
                                    sentimentResult === 'Bearish' ? 'text-red-400' : 
                                    'text-amber-400'
                                }`}>{sentimentResult.toUpperCase()}</span>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* 2. APP DESCRIPTION TEST */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary/80">
                        <BrainCircuit className="w-4 h-4" />
                        <Label className="text-sm font-bold tracking-widest uppercase">System metadata</Label>
                    </div>
                    <div className="space-y-3">
                        <Button 
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5 font-bold"
                            onClick={handleDescribeApp} 
                            disabled={isDescriptionPending}
                        >
                             {isDescriptionPending ? (
                                <><Loader className="mr-2 h-4 w-4 animate-spin" /> GENERATING_SYSTEM_DESC...</>
                             ) : (
                                "PULL_SYSTEM_CAPABILITIES"
                             )}
                        </Button>
                    </div>
                    {descriptionResult && (
                         <Alert className="mt-4 bg-white/5 border-white/10">
                            <AlertTitle className="text-xs font-black uppercase opacity-70">Metadata Output</AlertTitle>
                            <AlertDescription className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                {descriptionResult}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}