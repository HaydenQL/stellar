import { useState } from "react";
import { Film, Play, Trash2, Share2, Gamepad2, Search, Grid3x3, List, Clock, HardDrive, MoreHorizontal, Download, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const initialClips = [
  { id: 1, name: "Insane 4K Ace", game: "Valorant", duration: "0:24", size: "89 MB", date: "2 min ago", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop", isPublic: true },
  { id: 2, name: "Clutch Round Win", game: "CS2", duration: "0:18", size: "62 MB", date: "15 min ago", thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop", isPublic: false },
  { id: 3, name: "Epic Build Fight", game: "Fortnite", duration: "0:32", size: "112 MB", date: "1 hr ago", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop", isPublic: true },
  { id: 4, name: "Team Wipe", game: "Apex Legends", duration: "0:15", size: "48 MB", date: "3 hrs ago", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=225&fit=crop", isPublic: false },
  { id: 5, name: "Pentakill!", game: "League of Legends", duration: "0:28", size: "95 MB", date: "5 hrs ago", thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop", isPublic: true },
  { id: 6, name: "Aerial Goal", game: "Rocket League", duration: "0:12", size: "38 MB", date: "Yesterday", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=225&fit=crop", isPublic: true },
];

function ClipCard({ clip, onTogglePrivacy, onDelete }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/20 transition-all">
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <img src={clip.thumbnail} alt={clip.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 right-2">
          <button
            onClick={() => onTogglePrivacy(clip.id)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all backdrop-blur-sm border",
              clip.isPublic
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-black/50 border-white/10 text-white/60 hover:bg-black/70"
            )}
          >
            {clip.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            {clip.isPublic ? "Public" : "Private"}
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/60 text-white text-[10px] backdrop-blur-sm border-0">{clip.duration}</Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{clip.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Gamepad2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{clip.game}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Play className="w-3.5 h-3.5 mr-2" /> Play</DropdownMenuItem>
              <DropdownMenuItem><Share2 className="w-3.5 h-3.5 mr-2" /> Share</DropdownMenuItem>
              <DropdownMenuItem><Download className="w-3.5 h-3.5 mr-2" /> Export</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePrivacy(clip.id)}>
                {clip.isPublic ? <Lock className="w-3.5 h-3.5 mr-2" /> : <Globe className="w-3.5 h-3.5 mr-2" />}
                Make {clip.isPublic ? "Private" : "Public"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(clip.id)}><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {clip.size}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {clip.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function Clips() {
  const [clips, setClips] = useState(initialClips);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [gameFilter, setGameFilter] = useState("all");

  const togglePrivacy = (id) => setClips(prev => prev.map(c => c.id === id ? { ...c, isPublic: !c.isPublic } : c));
  const deleteClip = (id) => setClips(prev => prev.filter(c => c.id !== id));

  const filtered = clips.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesGame = gameFilter === "all" || c.game === gameFilter;
    return matchesSearch && matchesGame;
  });

  const uniqueGames = [...new Set(clips.map(c => c.game))];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <SectionHeader
        title="Clip Library"
        description={`${clips.length} clips · ${clips.filter(c=>c.isPublic).length} public · ${clips.filter(c=>!c.isPublic).length} private`}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border h-10"
          />
        </div>
        <Select value={gameFilter} onValueChange={setGameFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-secondary border-border h-10">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {uniqueGames.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1 bg-secondary rounded-lg p-1 border border-border self-start sm:self-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Clip Grid */}
      <div className={cn(
        "grid gap-4",
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      )}>
        {filtered.map(clip => (
          <ClipCard key={clip.id} clip={clip} onTogglePrivacy={togglePrivacy} onDelete={deleteClip} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No clips found</p>
        </div>
      )}
    </div>
  );
}