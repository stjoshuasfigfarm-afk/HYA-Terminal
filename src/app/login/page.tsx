
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  Check, 
  X,
  Terminal,
  Cpu,
  Mail
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/firebase";
import { initiateGoogleSignIn } from "@/firebase/non-blocking-login";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  const handleDemoAccess = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("terminal_demo_active", "true");
      router.push("/");
    }
  };

  const comparisonFeatures = [
    { name: "Live Supply Chain Topology", free: "Basic (Tier-1 Only)", inst: "Advanced (Full Network)", status: true },
    { name: "Recursive AI Synthesis", free: false, inst: true, status: "Boolean" },
    { name: "Real-time FMP Data Flows", free: "Simulated Fallback", inst: "Full API Sync", status: true },
    { name: "Alpha Vantage Technicals", free: "Standard Price", inst: "HLOC + DEMA + Bal. Sheet", status: true },
    { name: "NVIDIA Hardware Attestation", free: false, inst: true, status: "Boolean" },
    { name: "Trading Economics Forecasts", free: false, inst: true, status: "Boolean" },
  ];

  return (
    <div className="min-h-screen bg-[#1A1D20] flex flex-col items-center py-12 px-4 overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#26A69A] rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#B2FF59] rounded-full blur-[160px]" />
      </div>

      <div className="max-w-6xl w-full z-10 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#26A69A]/20 border border-[#26A69A]/30 text-[#26A69A] text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Institutional Analytical Track
              </div>
              <h1 className="text-5xl lg:text-7xl font-headline font-black tracking-tighter leading-none">
                Analysis <span className="text-[#B2FF59]">Terminal</span>
              </h1>
              <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
                The next generation of Quantitative Logistics Intelligence. Map structural topologies, synthesize supply chain alpha, and monitor global yield transmission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#26A69A]/50 transition-colors group">
                <Cpu className="w-8 h-8 text-[#26A69A] shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg text-white">Hardware Audit</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">NVIDIA Attestation Sync</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#B2FF59]/50 transition-colors group">
                <Globe className="w-8 h-8 text-[#B2FF59] shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg text-white">Macro Corridor</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Real-time Yield Dynamics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#14171A] border-white/10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#26A69A]" />
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex justify-between items-center">
                  <span>System Access</span>
                  <Shield className="w-6 h-6 text-[#26A69A]" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 py-8">
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-full bg-[#26A69A]/10 w-fit mx-auto border border-[#26A69A]/20">
                    <Terminal className="w-12 h-12 text-[#B2FF59]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Initialize Terminal</h3>
                    <p className="text-sm text-gray-400 mt-2">Authenticated terminal access optimized for institutional sessions.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white hover:bg-gray-100 text-black font-black uppercase tracking-widest h-14 gap-3 shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.77h2.64c1.55-1.42 2.43-3.52 2.43-5.2z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.77c-.73.49-1.66.78-2.64.78-2.85 0-5.27-1.92-6.13-4.51H3.75v2.84C5.56 20.21 8.53 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.87 13.84c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V6.91H3.75C3.01 8.44 2.59 10.17 2.59 12s.42 3.56 1.16 5.09l2.12-3.25z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.53 1 5.56 3.79 3.75 6.91l2.12 3.25c.86-2.59 3.28-4.51 6.13-4.51z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={handleDemoAccess}
                    className="w-full border-white/10 hover:bg-white/5 text-gray-400 font-bold uppercase tracking-widest h-14 transition-all"
                  >
                    Launch Demo Session
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-[#14171A] px-3 text-gray-600 tracking-[0.2em]">Institutional Sandbox</span></div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-white/5 pt-6 pb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Secured Institutional Environment v4.0.2
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="space-y-10 pt-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">Institutional Triage</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">Compare the structural capabilities of our standard and institutional analytical tiers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="bg-black/20 border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="text-[#26A69A] font-black text-xs uppercase tracking-[0.2em]">Free Tier</h4>
                      <p className="text-4xl font-black text-white mt-2">$0</p>
                   </div>
                   <div className="px-2 py-0.5 rounded-full border text-[10px] font-bold border-white/10 text-gray-500 uppercase">Standard Access</div>
                </div>
                <p className="text-xs text-gray-400">Core logistics monitoring and basic asset oversight for individual analysts.</p>
             </Card>

             <Card className="bg-[#26A69A]/5 border-[#26A69A]/30 p-6 space-y-4 ring-1 ring-[#26A69A]/20 relative">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#B2FF59] text-black text-[9px] font-black uppercase tracking-widest rounded-bl-lg">Recommended</div>
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="text-[#B2FF59] font-black text-xs uppercase tracking-[0.2em]">Institutional</h4>
                      <p className="text-4xl font-black text-white mt-2">$9<span className="text-sm font-normal text-gray-500 ml-1">/mo</span></p>
                   </div>
                   <div className="px-2 py-0.5 rounded-full border text-[10px] font-bold bg-[#26A69A] text-white uppercase border-transparent">Full Synthesis</div>
                </div>
                <p className="text-xs text-gray-300">Advanced structural mapping, recursive AI synthesis, and macro forecasting.</p>
             </Card>
          </div>

          <div className="bg-[#14171A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-white font-black uppercase text-[10px] py-6 px-8 tracking-widest">Capabilities</TableHead>
                  <TableHead className="text-gray-400 font-black uppercase text-[10px] py-6 px-8 text-center tracking-widest">Free Tier</TableHead>
                  <TableHead className="text-[#26A69A] font-black uppercase text-[10px] py-6 px-8 text-center tracking-widest">Institutional</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((feature, idx) => (
                  <TableRow key={idx} className="border-white/5 hover:bg-white/[0.01]">
                    <TableCell className="text-gray-300 font-medium py-5 px-8 text-xs">{feature.name}</TableCell>
                    <TableCell className="py-5 px-8 text-center">
                      {typeof feature.free === "string" ? (
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{feature.free}</span>
                      ) : feature.free ? (
                        <Check className="w-4 h-4 text-[#26A69A] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-700 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="py-5 px-8 text-center">
                      {typeof feature.inst === "string" ? (
                        <span className="text-[10px] text-[#26A69A] font-black uppercase">{feature.inst}</span>
                      ) : feature.inst ? (
                        <Check className="w-5 h-5 text-[#B2FF59] mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#26A69A]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">Analysis Terminal v4.0.2</span>
           </div>
           <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-gray-500">
              <span className="cursor-pointer hover:text-white transition-colors">Security Protocol</span>
              <span className="cursor-pointer hover:text-white transition-colors">Institutional Terms</span>
              <span className="cursor-pointer hover:text-white transition-colors">Legal Audit</span>
           </div>
        </div>
      </div>
    </div>
  );
}
