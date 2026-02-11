import type { LLMResearchResult } from '../types';

interface ClaudeResearchPanelProps {
  loading: boolean;
  result: LLMResearchResult | null;
  error: string;
  onResearch: () => void;
  hasApiKey: boolean;
  hasCondition: boolean;
}

export function ClaudeResearchPanel({
  loading,
  result,
  error,
  onResearch,
  hasApiKey,
  hasCondition,
}: ClaudeResearchPanelProps) {
  return (
    <div className="research-panel">
      <h3>Peptide Target Research (Claude AI)</h3>
      <p className="research-desc">
        Uses Claude to research therapeutic peptide targets for Phase 3 (Lock) and synergists for Phase 4.
      </p>
      <button
        className="btn-primary"
        onClick={onResearch}
        disabled={loading || !hasApiKey || !hasCondition}
      >
        {loading ? 'Researching...' : 'Research Peptide Targets'}
      </button>
      {!hasApiKey && <small className="warning">Enter API key above first</small>}
      {!hasCondition && <small className="warning">Enter condition label first</small>}
      {error && <div className="error-msg">{error}</div>}

      {result && (
        <div className="research-results">
          <div className="result-section">
            <h4>Peptide Targets (Phase 3)</h4>
            {result.peptideTargets.map((t, i) => (
              <div key={i} className="result-item">
                <strong>{t.name}</strong> — {t.mwKey} — {t.suggestedDwell}s dwell
                <br />
                <small>{t.description}</small>
              </div>
            ))}
          </div>

          <div className="result-section">
            <h4>Synergists (Phase 4)</h4>
            {result.synergists.map((s, i) => (
              <div key={i} className="result-item">
                <strong>{s.name}</strong> — {s.mwKey} — {s.suggestedDwell}s dwell
                <br />
                <small>{s.description}</small>
              </div>
            ))}
          </div>

          {result.brainwaveFrequencies.length > 0 && (
            <div className="result-section">
              <h4>Brainwave Frequencies</h4>
              {result.brainwaveFrequencies.map((b, i) => (
                <div key={i} className="result-item">
                  <strong>{b.hz} Hz</strong> — {b.suggestedDwell}s dwell
                  <br />
                  <small>{b.description}</small>
                </div>
              ))}
            </div>
          )}

          <div className="result-section">
            <h4>Mechanism</h4>
            <p>{result.mechanism}</p>
          </div>

          <div className="result-section">
            <h4>Rationale</h4>
            <p>{result.rationale}</p>
          </div>
        </div>
      )}
    </div>
  );
}
