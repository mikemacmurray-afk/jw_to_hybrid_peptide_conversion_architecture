interface ConditionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConditionInput({ value, onChange }: ConditionInputProps) {
  return (
    <div className="condition-input">
      <label htmlFor="condition-label">Condition Label</label>
      <input
        id="condition-label"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. OAB, GH, Thyroid"
      />
      <small>Used for preset naming and LLM research context</small>
    </div>
  );
}
