import { useState } from "react";
import { Keyboard, Plus, Trash2, RotateCcw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/ui/SectionHeader";
import HotkeyRecorder from "@/components/hotkeys/HotkeyRecorder";

const defaultBindings = [
  { id: 1, action: "Save Clip", keys: ["F9"], description: "Save the last replay buffer as a clip" },
  { id: 2, action: "Start/Stop Recording", keys: ["Ctrl", "F9"], description: "Toggle continuous recording" },
  { id: 3, action: "Screenshot", keys: ["F10"], description: "Take a screenshot of the current frame" },
  { id: 4, action: "Toggle Overlay", keys: ["Ctrl", "Shift", "O"], description: "Show or hide the Stellar overlay" },
  { id: 5, action: "Bookmark Moment", keys: ["F8"], description: "Mark a timestamp in the recording" },
];

export default function Hotkeys() {
  const [bindings, setBindings] = useState(defaultBindings);
  const [editingId, setEditingId] = useState(null);

  const handleUpdateKeys = (id, newKeys) => {
    setBindings(prev => prev.map(b => b.id === id ? { ...b, keys: newKeys } : b));
    setEditingId(null);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <SectionHeader
        title="Hotkeys"
        description="Customize your keybindings. Click on a binding to change it — supports single keys and combos."
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-foreground">Keybindings</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </Button>
        </div>
        <div className="divide-y divide-border/50">
          {bindings.map((binding) => (
            <div key={binding.id} className="flex items-center gap-4 p-5 hover:bg-secondary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{binding.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{binding.description}</p>
              </div>

              {editingId === binding.id ? (
                <HotkeyRecorder
                  onRecord={(keys) => handleUpdateKeys(binding.id, keys)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <button
                  onClick={() => setEditingId(binding.id)}
                  className="flex items-center gap-1.5 group"
                >
                  {binding.keys.map((key, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-xs text-muted-foreground">+</span>}
                      <kbd className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono font-medium text-foreground group-hover:border-primary/30 transition-colors min-w-[2rem] text-center">
                        {key}
                      </kbd>
                    </span>
                  ))}
                  <Pencil className="w-3 h-3 text-muted-foreground/40 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> You can use single keys like F9 or key combos like Ctrl + Shift + F9. 
          Click on any binding above to reassign it.
        </p>
      </div>
    </div>
  );
}