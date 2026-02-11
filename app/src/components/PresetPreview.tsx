interface PresetPreviewProps {
  text: string;
  onChange: (text: string) => void;
}

export function PresetPreview({ text, onChange }: PresetPreviewProps) {
  return (
    <div className="preset-preview">
      <h3>Generated Preset</h3>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        spellCheck={false}
      />
    </div>
  );
}
