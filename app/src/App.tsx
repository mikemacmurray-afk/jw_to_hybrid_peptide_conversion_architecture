import { useState } from 'react';
import { useConversionState } from './hooks/useConversionState';
import { useClaudeResearch } from './hooks/useClaudeResearch';
import { FileUpload } from './components/FileUpload';
import { ConditionInput } from './components/ConditionInput';
import { FrequencyTable } from './components/FrequencyTable';
import { DwellModeSelector } from './components/DwellModeSelector';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ClaudeResearchPanel } from './components/ClaudeResearchPanel';
import { PhaseEditor } from './components/PhaseEditor';
import { PresetPreview } from './components/PresetPreview';
import { DownloadButton } from './components/DownloadButton';

export default function App() {
  const {
    state,
    setFile,
    setCondition,
    setDwellConfig,
    toggleFrequency,
    setApiKey,
    setLLMLoading,
    setLLMResult,
    setLLMError,
    updatePhase,
    setEditedText,
    setBrainwaveEnabled,
  } = useConversionState();

  const [llmError, setLlmErrorMsg] = useState('');
  const [brainwaveEnabled, setBrainwave] = useState(true);

  const { runResearch } = useClaudeResearch({
    apiKey: state.apiKey,
    conditionLabel: state.conditionLabel,
    frequencies: state.parsedPreset?.allFrequencies || [],
    setLLMLoading,
    setLLMResult,
    setLLMError: (err) => {
      setLLMError(err);
      setLlmErrorMsg(err);
    },
  });

  const handleBrainwaveToggle = (enabled: boolean) => {
    setBrainwave(enabled);
    setBrainwaveEnabled(enabled);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>JW to Hybrid Peptide Converter</h1>
        <p>Convert JW-style peptide presets into structured hybrid programs for Spooky2 Remote</p>
      </header>

      <main className="app-main">
        <section className="section">
          <div className="row">
            <div className="col-2">
              <FileUpload
                onFileLoaded={setFile}
                hasFile={!!state.parsedPreset}
              />
            </div>
            <div className="col-1">
              <ConditionInput value={state.conditionLabel} onChange={setCondition} />
            </div>
          </div>
        </section>

        {state.parsedPreset && (
          <>
            <section className="section">
              <div className="row">
                <div className="col-2">
                  <FrequencyTable
                    frequencies={state.parsedPreset.allFrequencies}
                    dwellConfig={state.dwellConfig}
                    onToggle={toggleFrequency}
                  />
                </div>
                <div className="col-1">
                  <DwellModeSelector
                    config={state.dwellConfig}
                    onChange={setDwellConfig}
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <ApiKeyInput value={state.apiKey} onChange={setApiKey} />
              <ClaudeResearchPanel
                loading={state.llmLoading}
                result={state.llmResult}
                error={llmError}
                onResearch={runResearch}
                hasApiKey={!!state.apiKey}
                hasCondition={!!state.conditionLabel}
              />
            </section>

            <section className="section">
              <PhaseEditor
                phases={state.phases}
                onUpdatePhase={updatePhase}
                brainwaveEnabled={brainwaveEnabled}
                onBrainwaveToggle={handleBrainwaveToggle}
              />
            </section>

            <section className="section">
              <PresetPreview
                text={state.editedPresetText}
                onChange={setEditedText}
              />
              <div className="download-row">
                <DownloadButton
                  text={state.editedPresetText}
                  presetName={state.conditionLabel || 'preset'}
                  disabled={!state.editedPresetText}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
