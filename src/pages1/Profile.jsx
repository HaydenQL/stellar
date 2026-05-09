import { useState } from "react";
import { Camera, Edit3, Check, X, Users, Film, UserPlus, UserCheck, Trophy, Star, Scissors, Clock, LogOut, Settings, Shield, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const mockFriends = [
  { id: 1, name: "xX_Sniper_Xx", tag: "sniper#4521", status: "online", game: "Valorant", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" },
  { id: 2, name: "ProGamer99", tag: "progamer#1337", status: "clipping", game: "CS2", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop" },
  { id: 3, name: "StellarFan", tag: "stellar#0042", status: "offline", game: null, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop" },
  { id: 4, name: "NightOwl", tag: "nightowl#7777", status: "online", game: "Apex Legends", avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop" },
];

const mockRequests = [
  { id: 5, name: "FragKing", tag: "fragking#2291", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop" },
];

const statusConfig = {
  online:   { dot: "bg-emerald-400",          label: (g) => g ? `Playing ${g}` : "Online" },
  clipping: { dot: "bg-primary animate-pulse", label: (g) => `Clipping · ${g}` },
  offline:  { dot: "bg-muted-foreground/30",   label: () => "Offline" },
};

function StatusDot({ status }) {
  return <span className={cn("inline-block w-2.5 h-2.5 rounded-full shrink-0", statusConfig[status]?.dot)} />;
}

function FriendRow({ friend, onRemove }) {
  const cfg = statusConfig[friend.status];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 group">
      <div className="relative shrink-0">
        <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-xl object-cover" />
        <StatusDot status={friend.status} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{friend.name}</p>
        <p className={cn("text-[11px]", friend.status === "clipping" ? "text-primary" : "text-muted-foreground")}>
          {cfg.label(friend.game)}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground px-2">Clips</Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive/70 hover:text-destructive px-2" onClick={() => onRemove(friend.id)}>Remove</Button>
      </div>
    </div>
  );
}

const ACCENT_COLORS = [
  { label: "Purple", from: "from-violet-500", to: "to-fuchsia-600" },
  { label: "Blue", from: "from-blue-500", to: "to-cyan-500" },
  { label: "Orange", from: "from-orange-500", to: "to-rose-500" },
  { label: "Green", from: "from-emerald-500", to: "to-teal-500" },
];

export default function Profile() {
  const [displayName, setDisplayName] = useState("YourTag");
  const [tagNum, setTagNum] = useState("0001");
  const [bio, setBio] = useState("Just here to clip the impossible.");
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [tempName, setTempName] = useState(displayName);
  const [tempBio, setTempBio] = useState(bio);
  const [friends, setFriends] = useState(mockFriends);
  const [requests, setRequests] = useState(mockRequests);
  const [addFriendTag, setAddFriendTag] = useState("");
  const [addFriendSent, setAddFriendSent] = useState(false);
  const [accentIndex, setAccentIndex] = useState(0);
  const [loggedIn, setLoggedIn] = useState(true);
  const [notifyFriendClips, setNotifyFriendClips] = useState(true);
  const [notifyRequests, setNotifyRequests] = useState(true);

  const accent = ACCENT_COLORS[accentIndex];

  const handleSendRequest = () => {
    if (addFriendTag.trim()) {
      setAddFriendSent(true);
      setTimeout(() => { setAddFriendSent(false); setAddFriendTag(""); }, 2000);
    }
  };

  const acceptRequest = (id) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      setFriends(prev => [...prev, { ...req, status: "online", game: null }]);
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const stats = [
    { icon: Scissors, value: "47", label: "Clips saved" },
    { icon: Trophy, value: "1.2k", label: "Total views" },
    { icon: Star, value: "340", label: "Likes received" },
    { icon: Clock, value: "14m", label: "Total footage" },
  ];

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Sign in to Stellar</h2>
          <p className="text-sm text-muted-foreground">Create a free account to sync clips, add friends, and join the community.</p>
          <div className="flex flex-col gap-2">
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setLoggedIn(true)}>Sign In</Button>
            <Button variant="outline" className="w-full border-border" onClick={() => setLoggedIn(true)}>Create Free Account</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl">

      {/* Profile hero card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Colour banner */}
        <div className={cn("h-24 bg-gradient-to-br relative", accent.from, accent.to)}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 bg-black/25 hover:bg-black/40 text-white">
            <Camera className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end gap-3 -mt-7 mb-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br border-4 border-card flex items-center justify-center shadow-lg", accent.from, accent.to)}>
                <span className="text-lg font-display font-bold text-white">{displayName[0]?.toUpperCase()}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
            </div>
            {/* Accent colour picker */}
            <div className="flex gap-1.5 mb-1">
              {ACCENT_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setAccentIndex(i)}
                  className={cn("w-5 h-5 rounded-full bg-gradient-to-br transition-all", c.from, c.to, accentIndex === i ? "ring-2 ring-offset-1 ring-offset-card ring-white/60 scale-110" : "opacity-60 hover:opacity-100")}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Name & bio */}
          <div className="space-y-1.5">
            {editingName ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm shrink-0">Tag:</span>
                <Input value={tempName} onChange={e => setTempName(e.target.value)} className="bg-secondary border-border h-8 text-sm font-semibold max-w-40" maxLength={24} />
                <span className="text-muted-foreground text-sm">#</span>
                <Input value={tagNum} onChange={e => setTagNum(e.target.value.replace(/\D/,"").slice(0,4))} className="bg-secondary border-border h-8 text-sm font-mono w-16" maxLength={4} />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => { setDisplayName(tempName); setEditingName(false); }}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => { setTempName(displayName); setEditingName(false); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <span className="font-display font-bold text-lg text-foreground">{displayName}</span>
                <span className="text-muted-foreground font-mono text-sm">#{tagNum}</span>
                <button onClick={() => setEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            )}

            {editingBio ? (
              <div className="flex items-center gap-2">
                <Input value={tempBio} onChange={e => setTempBio(e.target.value)} className="bg-secondary border-border h-8 text-sm flex-1" maxLength={100} placeholder="Write a short bio..." />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => { setBio(tempBio); setEditingBio(false); }}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => { setTempBio(bio); setEditingBio(false); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <span className="text-sm text-muted-foreground">{bio || "No bio set."}</span>
                <button onClick={() => setEditingBio(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3.5 flex flex-col gap-1">
            <s.icon className="w-4 h-4 text-muted-foreground" />
            <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="friends">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="friends">
            Friends
            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0 bg-muted">{friends.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 && (
              <Badge className="ml-1.5 text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">{requests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="add">Add Friend</TabsTrigger>
          <TabsTrigger value="prefs">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          <div className="bg-card rounded-2xl border border-border px-5">
            {friends.filter(f => f.status !== "offline").length > 0 && (
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold pt-4 pb-1">
                Online · {friends.filter(f => f.status !== "offline").length}
              </p>
            )}
            {friends.filter(f => f.status !== "offline").map(f => (
              <FriendRow key={f.id} friend={f} onRemove={id => setFriends(prev => prev.filter(x => x.id !== id))} />
            ))}
            {friends.filter(f => f.status === "offline").length > 0 && (
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold pt-4 pb-1">Offline</p>
            )}
            {friends.filter(f => f.status === "offline").map(f => (
              <FriendRow key={f.id} friend={f} onRemove={id => setFriends(prev => prev.filter(x => x.id !== id))} />
            ))}
            {friends.length === 0 && (
              <div className="text-center py-10">
                <Users className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No friends yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="bg-card rounded-2xl border border-border px-5">
            {requests.map(req => (
              <div key={req.id} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
                <img src={req.avatar} alt={req.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{req.tag}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => acceptRequest(req.id)}>
                    <UserCheck className="w-3.5 h-3.5" /> Accept
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setRequests(prev => prev.filter(r => r.id !== req.id))}>
                    Decline
                  </Button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-10">
                <UserPlus className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Add by Stellar Tag</p>
              <p className="text-xs text-muted-foreground">Every Stellar user has a unique tag like <span className="font-mono text-foreground">username#1234</span>. Share yours to get added.</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="username#0000"
                value={addFriendTag}
                onChange={e => setAddFriendTag(e.target.value)}
                className="bg-secondary border-border font-mono text-sm"
                onKeyDown={e => e.key === "Enter" && handleSendRequest()}
              />
              <Button onClick={handleSendRequest} disabled={addFriendSent || !addFriendTag.trim()} className="shrink-0">
                {addFriendSent ? <><Check className="w-4 h-4 mr-1" /> Sent</> : <><UserPlus className="w-4 h-4 mr-1" /> Add</>}
              </Button>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Your Stellar Tag</p>
                <p className="text-sm font-mono font-semibold text-foreground">{displayName}#{tagNum}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Copy</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prefs" className="mt-4">
          <div className="bg-card rounded-2xl border border-border divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2"><Bell className="w-4 h-4 text-muted-foreground" /> Friend clip notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">Notify when friends post a new clip</p>
              </div>
              <Switch checked={notifyFriendClips} onCheckedChange={setNotifyFriendClips} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2"><UserPlus className="w-4 h-4 text-muted-foreground" /> Friend request notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">Notify when you receive a friend request</p>
              </div>
              <Switch checked={notifyRequests} onCheckedChange={setNotifyRequests} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" /> Who can add me</p>
                <p className="text-xs text-muted-foreground mt-0.5">Anyone with your tag</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">Change <ChevronRight className="w-3 h-3" /></Button>
            </div>
            <div className="p-4">
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 gap-2 justify-start" onClick={() => setLoggedIn(false)}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}