import { useState } from "react";
import { Volume2, Mic, Headphones, Music, MessageCircle, Monitor } from "lucide-react";
import HelpTip from "@/components/ui/HelpTip";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/ui/SectionHeader";
import AudioTrack from "@/components/audio/AudioTrack";

const defaultTracks = [
  { id: "game", name: "Game Audio", icon: Monitor, enabled: true, volume: 80, color: "text-primary", separate: true },
  { id: "mic", name: "Microphone", icon: Mic, enabled: true, volume: 100, color: "text-emerald-400", separate: true },
  { id: "discord", name: "Discord", icon: Headphones, enabled: true, volume: 65, color: "text-accent", separate: true },
  { id: "spotify", name: "Spotify / Music", icon: Music, enabled: false, volume: 40, color: "text-amber-400", separate: false },
  { id: "system", name: "System Audio", icon: Volume2, enabled: true, volume: 50, color: "text-muted-foreground", separate: false },
  { id: "browser", name: "Browser", icon: MessageCircle, enabled: false, volume: 30, color: "text-rose-400", separate: false },
];

export default function Audio() {
  const [tracks, setTracks] = useState(defaultTracks);
  const [separateFiles, setSeparateFiles] = useState(true);

  const updateTrack = (id, field, value) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const enabledCount = tracks.filter(t => t.enabled).length;
  const separateCount = tracks.filter(t => t.separate && t.enabled).length;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <SectionHeader
        title="Audio Configuration"
        description="Control which audio sources are recorded and optionally export them as separate files."
      />

      {/* Multi-track toggle */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground flex items-center">
                  Multi-Track Audio
                  <HelpTip text="When enabled, each audio source is saved as its own file. Great for video editors who want to adjust game volume vs mic volume separately after recording." />
                </p>
                <p className="text-xs text-muted-foreground">
                  Export separate audio files for each source
                </p>
              </div>
            </div>
          <div className="flex items-center gap-3">
            {separateFiles && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                {separateCount} tracks
              </Badge>
            )}
            <Switch checked={separateFiles} onCheckedChange={setSeparateFiles} />
          </div>
        </div>
        {separateFiles && (
          <p className="text-xs text-muted-foreground mt-3 pl-[52px]">
            Each enabled source marked as "separate" will be exported as its own audio file alongside the main video.
            Perfect for post-editing in Premiere, DaVinci, etc.
          </p>
        )}
      </div>

      {/* Audio tracks */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-foreground">Audio Sources</h3>
          </div>
          <span className="text-xs text-muted-foreground">{enabledCount} of {tracks.length} active</span>
        </div>
        <div className="divide-y divide-border/50">
          {tracks.map((track) => (
            <AudioTrack
              key={track.id}
              track={track}
              showSeparate={separateFiles}
              onToggle={(val) => updateTrack(track.id, "enabled", val)}
              onVolumeChange={(val) => updateTrack(track.id, "volume", val[0])}
              onSeparateToggle={(val) => updateTrack(track.id, "separate", val)}
            />
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> Separating audio tracks has minimal performance impact.
          File sizes increase slightly per additional track.
        </p>
      </div>
    </div>
  );
}