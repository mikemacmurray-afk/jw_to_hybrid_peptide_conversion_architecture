import { useState } from 'react';
import type { Phase, PhaseFrequency } from '../types';

interface PhaseEditorProps {
  phases: Phase[];
  onUpdatePhase: (phaseNumber: 1 | 2 | 3 | 4, frequencies: PhaseFrequency[]) => void;
  brainwaveEnabled: boolean;
  onBrainwaveToggle: (enabled: boolean) => void;
}

function PhasePanel({
  phase,
  onUpdate,
  showBrainwaveToggle,
  brainwaveEnabled,
  onBrainwaveToggle,
}: {
  phase: Phase;
  onUpdate: (frequencies: PhaseFrequency[]) => void;
  showBrainwaveToggle?: boolean;
  brainwaveEnabled?: boolean;
  onBrainwaveToggle?: (enabled: boolean) => void;
}) {
  const [newMwKey, setNewMwKey] = useState('');
  const [newDwell, setNewDwell] = useState('20');
  const [newLabel, setNewLabel] = useState('');

  const handleRemove = (index: number) => {
    const updated = phase.frequencies.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleDwellChange = (index: number, dwell: string) => {
    const num = parseInt(dwell);
    if (isNaN(num)) return;
    const updated = phase.frequencies.map((f, i) =>
      i === index ? { ...f, dwell: num } : f
    );
    onUpdate(updated);
  };

  const handleAdd = () => {
    if (!newMwKey) return;
    const freq: PhaseFrequency = {
      mwKey: newMwKey,
      dwell: parseInt(newDwell) || 20,
      label: newLabel || undefined,
    };
    onUpdate([...phase.frequencies, freq]);
    setNewMwKey('');
    setNewDwell('20');
    setNewLabel('');
  };

  return (
    <div className="phase-panel">
      <h4>{phase.title}</h4>
      <p className="phase-desc">{phase.description}</p>

      {showBrainwaveToggle && (
        <label className="brainwave-toggle">
          <input
            type="checkbox"
            checked={brainwaveEnabled}
            onChange={(e) => onBrainwaveToggle?.(e.target.checked)}
          />
          Include brainwave frequencies
        </label>
      )}

      {phase.frequencies.length > 0 ? (
        <table className="phase-freq-table">
          <thead>
            <tr>
              <th>MW Key</th>
              <th>Label</th>
              <th>Dwell (s)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {phase.frequencies.map((freq, i) => (
              <tr key={`${freq.mwKey}-${i}`}>
                <td className="mono">{freq.mwKey}</td>
                <td>{freq.label || '—'}</td>
                <td>
                  <input
                    type="number"
                    className="dwell-input"
                    value={freq.dwell}
                    onChange={(e) => handleDwellChange(i, e.target.value)}
                    min={1}
                  />
                </td>
                <td>
                  <button className="btn-remove" onClick={() => handleRemove(i)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-phase">
          {phase.number >= 3
            ? 'Run LLM research to populate, or add entries manually below.'
            : 'No frequencies in this phase.'}
        </p>
      )}

      <div className="add-freq-row">
        <input
          type="text"
          placeholder="MW Key (e.g. M1069.22)"
          value={newMwKey}
          onChange={(e) => setNewMwKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Dwell"
          value={newDwell}
          onChange={(e) => setNewDwell(e.target.value)}
          min={1}
          className="dwell-input"
        />
        <button className="btn-small" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}

export function PhaseEditor({ phases, onUpdatePhase, brainwaveEnabled, onBrainwaveToggle }: PhaseEditorProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="phase-editor">
      <h3>Phase Editor</h3>
      <div className="phase-tabs">
        {phases.map((phase, i) => (
          <button
            key={phase.number}
            className={`phase-tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            Phase {phase.number}
            <span className="freq-count">({phase.frequencies.length})</span>
          </button>
        ))}
      </div>
      {phases[activeTab] && (
        <PhasePanel
          phase={phases[activeTab]}
          onUpdate={(freqs) => onUpdatePhase(phases[activeTab].number as 1 | 2 | 3 | 4, freqs)}
          showBrainwaveToggle={phases[activeTab].number === 4}
          brainwaveEnabled={brainwaveEnabled}
          onBrainwaveToggle={onBrainwaveToggle}
        />
      )}
    </div>
  );
}
