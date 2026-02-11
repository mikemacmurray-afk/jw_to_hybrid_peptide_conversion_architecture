import type { DwellConfig, DwellMode } from '../types';

interface DwellModeSelectorProps {
  config: DwellConfig;
  onChange: (config: DwellConfig) => void;
}

export function DwellModeSelector({ config, onChange }: DwellModeSelectorProps) {
  const setMode = (mode: DwellMode) => onChange({ ...config, mode });
  const setNum = (key: keyof DwellConfig, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) onChange({ ...config, [key]: num });
  };

  return (
    <div className="dwell-mode-selector">
      <h3>Dwell Assignment Mode</h3>
      <div className="mode-options">
        <label className={`mode-option ${config.mode === 'binary' ? 'active' : ''}`}>
          <input
            type="radio"
            name="dwellMode"
            checked={config.mode === 'binary'}
            onChange={() => setMode('binary')}
          />
          <div>
            <strong>Mode A: Binary Classification</strong>
            <small>Essential/signaling AAs get long dwell, common AAs get short dwell</small>
          </div>
        </label>
        <label className={`mode-option ${config.mode === 'weighted' ? 'active' : ''}`}>
          <input
            type="radio"
            name="dwellMode"
            checked={config.mode === 'weighted'}
            onChange={() => setMode('weighted')}
          />
          <div>
            <strong>Mode B: Occurrence-Weighted</strong>
            <small>Dwell scales with JW repetition count: base + (occurrences x multiplier)</small>
          </div>
        </label>
      </div>

      <div className="dwell-params">
        {config.mode === 'binary' ? (
          <>
            <div className="param-row">
              <label>Common AA Dwell (s)</label>
              <input
                type="number"
                value={config.commonDwell}
                onChange={(e) => setNum('commonDwell', e.target.value)}
                min={1}
                max={300}
              />
            </div>
            <div className="param-row">
              <label>Essential/Signaling AA Dwell (s)</label>
              <input
                type="number"
                value={config.essentialDwell}
                onChange={(e) => setNum('essentialDwell', e.target.value)}
                min={1}
                max={300}
              />
            </div>
          </>
        ) : (
          <>
            <div className="param-row">
              <label>Base Dwell (s)</label>
              <input
                type="number"
                value={config.baseDwell}
                onChange={(e) => setNum('baseDwell', e.target.value)}
                min={1}
                max={60}
              />
            </div>
            <div className="param-row">
              <label>Multiplier</label>
              <input
                type="number"
                value={config.multiplier}
                onChange={(e) => setNum('multiplier', e.target.value)}
                min={0.5}
                max={10}
                step={0.5}
              />
            </div>
            <div className="param-row">
              <label>Max Dwell (s)</label>
              <input
                type="number"
                value={config.maxDwell}
                onChange={(e) => setNum('maxDwell', e.target.value)}
                min={10}
                max={300}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
