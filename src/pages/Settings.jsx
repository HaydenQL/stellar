import { useState } from "react";
import { Settings, FolderOpen, Palette, Bell, Shield, Globe, MonitorDown, Info, Users, MessageSquare, Lock, TrendingUp, Eye, Cloud, LogIn } from "lucide-react";
import HelpTip from "@/components/ui/HelpTip";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/ui/SectionHeader";
import SettingRow from "@/components/ui/SettingRow";

export default function SettingsPage() {
  const [startMinimized, setStartMinimized] = useState(true);
  const [startWithWindows, setStartWithWindows] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [savePath, setSavePath] = useState("C:\\Users\\You\\Videos\\Stellar");
  const [language, setLanguage] = useState("en");
  const [autoUpdate, setAutoUpdate] = useState(true);
  // Online / Social
  const [onlineMode, setOnlineMode] = useState(true);
  const [discordRpc, setDiscordRpc] = useState(true);
  const [discordShowGame, setDiscordShowGame] = useState(true);
  const [discordShowClipping, setDiscordShowClipping] = useState(true);
  const [defaultPrivacy, setDefaultPrivacy] = useState("public");
  const [showOnFeed, setShowOnFeed] = useState(true);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <SectionHeader
        title="Settings"
        description="General preferences and application configuration."
      />

      {/* Cloud sync banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
        <Cloud className="w-5 h-5 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Cloud Sync Active</p>
          <p className="text-xs text-muted-foreground">Your settings and clips are synced across devices. Free, always.</p>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Free</span>
      </div>

      {/* General */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">General</h3>
        </div>
        <div className="px-5">
          <SettingRow icon={MonitorDown} title={<span className="flex items-center">Start Minimized <HelpTip text="Stellar opens silently to the system tray instead of showing a window. It's always running in the background, ready to clip." /></span>} description="Launch Stellar in the system tray">
            <Switch checked={startMinimized} onCheckedChange={setStartMinimized} />
          </SettingRow>
          <SettingRow icon={Shield} title={<span className="flex items-center">Start with Windows <HelpTip text="Stellar will automatically start when you turn on your PC so you never miss a moment. Uses very little memory at idle." /></span>} description="Auto-launch on system startup">
            <Switch checked={startWithWindows} onCheckedChange={setStartWithWindows} />
          </SettingRow>
          <SettingRow icon={Globe} title="Language" description="Application display language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow icon={Shield} title={<span className="flex items-center">Auto-Update <HelpTip text="Stellar will silently download and apply updates in the background. Recommended — updates are free and often improve performance." /></span>} description="Automatically download and install updates">
            <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </SettingRow>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Appearance</h3>
        </div>
        <div className="px-5">
          <SettingRow icon={Palette} title="Theme" description="Application color scheme">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-36 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="midnight">Midnight</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow icon={MonitorDown} title="In-Game Overlay" description="Show recording status while gaming">
            <Switch checked={overlayEnabled} onCheckedChange={setOverlayEnabled} />
          </SettingRow>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="px-5">
          <SettingRow icon={Bell} title="Desktop Notifications" description="Show toast when a clip is saved">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </SettingRow>
          <SettingRow icon={Bell} title="Sound Effects" description="Play a sound when clipping">
            <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
          </SettingRow>
        </div>
      </div>

      {/* Storage */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Storage</h3>
        </div>
        <div className="px-5">
          <div className="py-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Save Location</p>
                <p className="text-xs text-muted-foreground">Where clips are stored on disk</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pl-12">
              <Input
                value={savePath}
                onChange={(e) => setSavePath(e.target.value)}
                className="bg-secondary border-border text-xs font-mono flex-1"
              />
              <Button variant="outline" size="sm" className="border-border shrink-0">
                Browse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Online & Social */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-foreground">Online & Social</h3>
          </div>
          {!onlineMode && (
            <span className="text-[11px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">Minimalist Mode</span>
          )}
        </div>
        <div className="px-5">
          <SettingRow
            icon={Globe}
            title={<span className="flex items-center">Online Mode <HelpTip text="Turn this off to use Stellar as a pure local clip recorder — no account needed, no social features. Great for privacy-first users." /></span>}
            description={onlineMode ? "Social features enabled — friends, discover, profiles" : "Minimalist mode — local clips only, no social features"}
          >
            <Switch checked={onlineMode} onCheckedChange={setOnlineMode} />
          </SettingRow>

          {onlineMode && (
            <>
              <SettingRow icon={Lock} title="Default Clip Privacy" description="New clips start as Public or Private">
                <Select value={defaultPrivacy} onValueChange={setDefaultPrivacy}>
                  <SelectTrigger className="w-36 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow icon={TrendingUp} title="Show on Community Feed" description="Allow your public clips to appear in Discover">
                <Switch checked={showOnFeed} onCheckedChange={setShowOnFeed} />
              </SettingRow>
            </>
          )}
        </div>
      </div>

      {/* Discord */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Discord Integration</h3>
        </div>
        <div className="px-5">
          <SettingRow icon={MessageSquare} title="Discord Rich Presence" description="Show Stellar status on your Discord profile">
            <Switch checked={discordRpc} onCheckedChange={setDiscordRpc} />
          </SettingRow>
          {discordRpc && (
            <>
              <SettingRow icon={Eye} title="Show Current Game" description='Display "Playing Valorant" on Discord'>
                <Switch checked={discordShowGame} onCheckedChange={setDiscordShowGame} />
              </SettingRow>
              <SettingRow icon={Eye} title='Show "Clipping with Stellar"' description="Let friends know when you save a clip">
                <Switch checked={discordShowClipping} onCheckedChange={setDiscordShowClipping} />
              </SettingRow>
              <div className="py-4 border-b border-border/50">
                <div className="bg-secondary/60 border border-border rounded-xl p-3 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Discord Preview</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {discordShowGame ? "🎮 Playing Valorant" : "🌟 Using Stellar"}
                    </p>
                    {discordShowClipping && (
                      <p className="text-[11px] text-primary mt-0.5">✂️ Clipping with Stellar</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">This is how you appear to your Discord friends</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Stellar Clip Engine</p>
            <p className="text-xs text-muted-foreground">Version 1.0.0 · Built for gamers</p>
          </div>
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary text-xs">
            Up to date
          </Badge>
        </div>
      </div>
    </div>
  );
}