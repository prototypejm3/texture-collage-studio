import { useState } from 'react';
import { CanvasElement } from '@/types/studio';

const fontOptions = [
  { value: 'system-ui, sans-serif', label: 'System' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Courier New", monospace', label: 'Courier' },
  { value: '"Times New Roman", serif', label: 'Times' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: '"Comic Sans MS", cursive', label: 'Comic Sans' },
];

const sizeOptions = [14, 18, 24, 32, 48, 64];

const colorOptions = [
  { value: '#3d3530', label: 'Brown' },
  { value: '#1a1714', label: 'Black' },
  { value: '#ffffff', label: 'White' },
  { value: '#c4956a', label: 'Warm' },
  { value: '#e07070', label: 'Red' },
  { value: '#6aaed4', label: 'Blue' },
  { value: '#6abf7a', label: 'Green' },
  { value: '#9b7fd4', label: 'Purple' },
  { value: '#f97316', label: 'Orange' },
];

interface TextPanelProps {
  onAddText: (text: string, opts: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    textColor: string;
    textAlign: 'left' | 'center' | 'right';
  }) => void;
  selectedElement?: CanvasElement | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
}

export function TextPanel({ onAddText, selectedElement, onUpdateElement }: TextPanelProps) {
  const isEditing = selectedElement?.type === 'text';

  const [text, setText] = useState(isEditing ? selectedElement.text || '' : 'Hello');
  const [fontFamily, setFontFamily] = useState(isEditing ? selectedElement.fontFamily || 'system-ui, sans-serif' : 'system-ui, sans-serif');
  const [fontSize, setFontSize] = useState(isEditing ? selectedElement.fontSize || 24 : 24);
  const [fontWeight, setFontWeight] = useState(isEditing ? selectedElement.fontWeight || 500 : 500);
  const [textColor, setTextColor] = useState(isEditing ? selectedElement.textColor || '#3d3530' : '#3d3530');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(isEditing ? selectedElement.textAlign || 'center' : 'center');

  const handleApply = () => {
    if (isEditing && selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, { text, fontFamily, fontSize, fontWeight, textColor, textAlign });
    } else {
      onAddText(text, { fontFamily, fontSize, fontWeight, textColor, textAlign });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Text input */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Type your text..."
        />
      </div>

      {/* Font family */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1.5">Font</label>
        <div className="flex flex-wrap gap-1">
          {fontOptions.map(f => (
            <button
              key={f.value}
              onClick={() => setFontFamily(f.value)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                fontFamily === f.value
                  ? 'bg-[#c4956a] text-white'
                  : 'bg-secondary text-foreground border border-border hover:bg-accent'
              }`}
              style={{ fontFamily: f.value }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1.5">Size</label>
        <div className="flex items-center gap-1">
          {sizeOptions.map(s => (
            <button
              key={s}
              onClick={() => setFontSize(s)}
              className={`w-8 h-8 rounded-lg text-[10px] font-medium transition-colors ${
                fontSize === s
                  ? 'bg-[#c4956a] text-white'
                  : 'bg-secondary text-foreground border border-border hover:bg-accent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1.5">Weight</label>
        <div className="flex gap-1">
          {[{ v: 400, l: 'Regular' }, { v: 500, l: 'Medium' }, { v: 600, l: 'Semibold' }, { v: 700, l: 'Bold' }].map(w => (
            <button
              key={w.v}
              onClick={() => setFontWeight(w.v)}
              className={`px-2.5 py-1 rounded-full text-[10px] transition-colors ${
                fontWeight === w.v
                  ? 'bg-[#c4956a] text-white'
                  : 'bg-secondary text-foreground border border-border hover:bg-accent'
              }`}
              style={{ fontWeight: w.v }}
            >
              {w.l}
            </button>
          ))}
        </div>
      </div>

      {/* Text color */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1.5">Color</label>
        <div className="flex items-center gap-1.5">
          {colorOptions.map(c => (
            <button
              key={c.value}
              onClick={() => setTextColor(c.value)}
              className={`w-6 h-6 rounded-full transition-all flex-shrink-0 ${
                textColor === c.value
                  ? 'ring-2 ring-[#f97316] ring-offset-2 ring-offset-popover scale-110'
                  : 'hover:scale-110'
              } ${c.value === '#ffffff' ? 'border border-border' : ''}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1.5">Align</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              onClick={() => setTextAlign(a)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors capitalize ${
                textAlign === a
                  ? 'bg-[#c4956a] text-white'
                  : 'bg-secondary text-foreground border border-border hover:bg-accent'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-border bg-secondary/30 p-3 min-h-[60px] flex items-center justify-center">
        <span
          style={{
            fontFamily,
            fontSize: Math.min(fontSize, 32),
            fontWeight,
            color: textColor,
            textAlign,
          }}
          className="text-center w-full block"
        >
          {text || 'Preview'}
        </span>
      </div>

      {/* Add button */}
      <button
        onClick={handleApply}
        disabled={!text.trim()}
        className="w-full py-2 rounded-full text-sm font-semibold transition-colors bg-[#f97316] text-white hover:bg-[#ea6c10] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isEditing ? 'Update Text' : 'Add Text to Canvas'}
      </button>
    </div>
  );
}
