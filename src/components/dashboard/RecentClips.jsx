import { Film, Play, Share2, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { recentClips } from '@/lib/mockData.js'

export default function RecentClips() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-foreground">Recent Clips</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          View All
        </Button>
      </div>
      <div className="divide-y divide-border/50">
        {recentClips.slice(0, 4).map((clip) => (
          <div key={clip.id} className="flex items-center gap-3 p-4 hover:bg-secondary/20 transition-colors">
            <div
              className="w-16 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: clip.gradient || 'var(--elevated)' }}
            >
              <Play className="w-4 h-4 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{clip.title}</p>
              <p className="text-xs text-muted-foreground">{clip.game} · {clip.duration}</p>
            </div>
            <span className="text-xs text-muted-foreground">{clip.ago}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
