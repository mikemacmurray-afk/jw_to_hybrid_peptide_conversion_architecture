export interface AminoAcid {
  mw: number;
  mwKey: string;
  name: string;
  code: string;
  category: 'essential' | 'conditionally_essential' | 'non_essential';
}

export interface ParsedFrequency {
  mwKey: string;
  mw: number;
  occurrences: number;
  aminoAcid?: AminoAcid;
  included: boolean;
}

export interface ParsedPreset {
  presetName: string;
  basePreset: string;
  presetNotes: string;
  programNames: string[];
  frequencyLines: string[][];
  allFrequencies: ParsedFrequency[];
  unknownMWs: string[];
}

export type DwellMode = 'binary' | 'weighted';

export interface DwellConfig {
  mode: DwellMode;
  commonDwell: number;
  essentialDwell: number;
  baseDwell: number;
  multiplier: number;
  maxDwell: number;
}

export interface PhaseFrequency {
  mwKey: string;
  dwell: number;
  label?: string;
}

export interface Phase {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  frequencies: PhaseFrequency[];
  programName: string;
}

export interface ConversionResult {
  phases: Phase[];
  presetName: string;
  presetNotes: string;
  fullPresetText: string;
}

export interface LLMResearchResult {
  peptideTargets: Array<{
    name: string;
    mw: number;
    mwKey: string;
    description: string;
    suggestedDwell: number;
  }>;
  synergists: Array<{
    name: string;
    mw: number;
    mwKey: string;
    description: string;
    suggestedDwell: number;
  }>;
  brainwaveFrequencies: Array<{
    hz: number;
    description: string;
    suggestedDwell: number;
  }>;
  mechanism: string;
  rationale: string;
}

export interface AppState {
  rawFileContent: string | null;
  parsedPreset: ParsedPreset | null;
  conditionLabel: string;
  dwellConfig: DwellConfig;
  phases: Phase[];
  apiKey: string;
  llmResult: LLMResearchResult | null;
  llmLoading: boolean;
  conversionResult: ConversionResult | null;
  editedPresetText: string;
}
