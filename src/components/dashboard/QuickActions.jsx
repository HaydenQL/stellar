import { Film, Settings, Keyboard, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'

const actions = [
  { label: 'New Clip', icon: Film, desc: 'Save the last replay buffer' },
  { label: 'Settings', icon: Settings, desc: 'Adjust capture preferences' },
  { label: 'Hotkeys', icon: Keyboard, desc: 'Customize key bindings' },
  { label: 'Storage', icon: HardDrive, desc: 'Manage clip storage' },
]

export default function QuickActions() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <h3 className="font-display font-semibold text-foreground">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((a) => (
          <Button key={a.label} variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
            <a.icon className="w-4 h-4 text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
