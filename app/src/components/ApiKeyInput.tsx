import { useState } from 'react';

interface ApiKeyInputProps {
  value: string;
  onChange: (key: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="api-key-input">
      <label htmlFor="api-key">Claude API Key</label>
      <div className="api-key-row">
        <input
          id="api-key"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-ant-..."
        />
        <button
          type="button"
          className="btn-small"
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <small>Stored locally in your browser. Required for peptide target research.</small>
    </div>
  );
}
