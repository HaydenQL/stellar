import { useState } from "react";
import { Monitor, Gamepad2, Check, Search, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SectionHeader from "@/components/ui/SectionHeader";
import CaptureSettings from "@/components/capture/CaptureSettings";
import GameIcon from "@/components/capture/GameIcon";

const mockApps = [
  { name: "Valorant",          process: "VALORANT-Win64-Shipping.exe" },
  { name: "CS2",               process: "cs2.exe" },
  { name: "Fortnite",          process: "FortniteClient-Win64-Shipping.exe" },
  { name: "Apex Legends",      process: "r5apex.exe" },
  { name: "League of Legends", process: "League of Legends.exe" },
  { name: "Overwatch 2",       process: "Overwatch.exe" },
  { name: "Minecraft",         process: "javaw.exe" },
  { name: "Rocket League",     process: "RocketLeague.exe" },
];

export default function Capture() {
  const [captureMode, setCaptureMode] = useState("game");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState("primary");

  const filteredApps = mockApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <SectionHeader
        title="Capture Source"
        description="Choose what Stellar records — a specific game or your entire screen."
      />

      <Tabs value={captureMode} onValueChange={setCaptureMode}>
        <TabsList className="bg-secondary border border-border h-11">
          <TabsTrigger value="game" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Gamepad2 className="w-4 h-4" /> Game Capture
          </TabsTrigger>
          <TabsTrigger value="screen" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Monitor className="w-4 h-4" /> Screen Capture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="game" className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search running applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border h-11"
            />
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Detected Applications
              </p>
              <Badge variant="secondary" className="text-xs bg-secondary">{filteredApps.length} found</Badge>
            </div>
            <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
              {filteredApps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => setSelectedApp(app.name)}
                  className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                    selectedApp === app.name
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-secondary/50 border-l-2 border-l-transparent"
                  }`}
                >
                  <GameIcon name={app.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{app.process}</p>
                  </div>
                  {selectedApp === app.name && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedApp && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/8 border border-primary/20">
              <GameIcon name={selectedApp} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Now capturing</p>
                <p className="text-sm font-semibold text-foreground">{selectedApp}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-0 text-xs">Active</Badge>
            </div>
          )}
        </TabsContent>

        <TabsContent value="screen" className="mt-6 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select Display</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "primary", label: "Primary Display", res: "2560 × 1440", icon: Monitor },
                { id: "secondary", label: "Secondary Display", res: "1920 × 1080", icon: MonitorPlay },
              ].map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setSelectedScreen(screen.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    selectedScreen === screen.id
                      ? "border-primary bg-primary/8"
                      : "border-border hover:border-muted-foreground/20 bg-secondary/30"
                  }`}
                >
                  <screen.icon className={`w-5 h-5 ${selectedScreen === screen.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{screen.label}</p>
                    <p className="text-xs text-muted-foreground">{screen.res}</p>
                  </div>
                  {selectedScreen === screen.id && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CaptureSettings />
    </div>
  );
}