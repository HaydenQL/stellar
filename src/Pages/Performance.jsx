import { Gauge, Cpu, HardDrive, Thermometer, Activity, Zap, MemoryStick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import SectionHeader from "@/components/ui/SectionHeader";
import SettingRow from "@/components/ui/SettingRow";
import { useState } from "react";

function ResourceMeter({ label, value, max, unit, color }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono text-foreground">{value}{unit} / {max}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Performance() {
  const [encoder, setEncoder] = useState("nvenc");
  const [priority, setPriority] = useState("low");
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [gpuAccel, setGpuAccel] = useState(true);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <SectionHeader
        title="Performance"
        description="Stellar is built for zero-impact recording. Monitor resources and tune for your hardware."
      />

      {/* Live Monitoring */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-foreground">Live Resource Usage</h3>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Healthy
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <ResourceMeter label="CPU" value={3} max={100} unit="%" color="bg-primary" />
          <ResourceMeter label="GPU" value={8} max={100} unit="%" color="bg-accent" />
          <ResourceMeter label="RAM" value={142} max={16384} unit=" MB" color="bg-emerald-400" />
          <ResourceMeter label="Disk I/O" value={12} max={500} unit=" MB/s" color="bg-amber-400" />
        </div>
      </div>

      {/* Performance Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "FPS Impact", value: "0", sublabel: "No frame drops", icon: Gauge, accent: "text-emerald-400" },
          { label: "Encoder Load", value: "< 1%", sublabel: "Hardware encode", icon: Cpu, accent: "text-primary" },
          { label: "Memory Usage", value: "142 MB", sublabel: "Minimal footprint", icon: MemoryStick, accent: "text-accent" },
          { label: "Temperature", value: "+2°C", sublabel: "Above idle", icon: Thermometer, accent: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-4">
            <stat.icon className={`w-5 h-5 ${stat.accent} mb-3`} />
            <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Performance Settings */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Optimization</h3>
        </div>
        <div className="px-5">
          <SettingRow icon={Cpu} title="Encoder" description="Hardware encoder for minimal CPU usage">
            <Select value={encoder} onValueChange={setEncoder}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nvenc">NVENC (NVIDIA)</SelectItem>
                <SelectItem value="amf">AMF (AMD)</SelectItem>
                <SelectItem value="qsv">QuickSync (Intel)</SelectItem>
                <SelectItem value="x264">x264 (Software)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow icon={Gauge} title="Process Priority" description="How Stellar competes for resources">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Recommended)</SelectItem>
                <SelectItem value="below-normal">Below Normal</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow icon={Zap} title="GPU Acceleration" description="Use GPU for encoding and processing">
            <Switch checked={gpuAccel} onCheckedChange={setGpuAccel} />
          </SettingRow>

          <SettingRow icon={Activity} title="Low Power Mode" description="Reduce quality slightly for even less resource usage">
            <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}