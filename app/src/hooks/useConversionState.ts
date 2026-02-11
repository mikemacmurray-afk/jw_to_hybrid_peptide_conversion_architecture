import { useReducer, useCallback } from 'react';
import type { AppState, DwellConfig, ParsedPreset, Phase, PhaseFrequency, LLMResearchResult } from '../types';
import { DEFAULT_DWELL_CONFIG } from '../utils/constants';
import { parseJWPreset } from '../engine/parser';
import { assignDwells } from '../engine/dwell';
import { buildPhase1, buildPhase2, buildPhase3, buildPhase4 } from '../engine/phaseBuilder';
import { generatePreset } from '../engine/presetGenerator';

type Action =
  | { type: 'SET_FILE'; content: string }
  | { type: 'SET_CONDITION'; label: string }
  | { type: 'SET_DWELL_CONFIG'; config: DwellConfig }
  | { type: 'TOGGLE_FREQUENCY'; mwKey: string }
  | { type: 'SET_LLM_LOADING'; loading: boolean }
  | { type: 'SET_LLM_RESULT'; result: LLMResearchResult }
  | { type: 'SET_LLM_ERROR'; error: string }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'UPDATE_PHASE'; phaseNumber: 1 | 2 | 3 | 4; frequencies: PhaseFrequency[] }
  | { type: 'SET_EDITED_TEXT'; text: string }
  | { type: 'SET_BRAINWAVE_ENABLED'; enabled: boolean }
  | { type: 'REGENERATE' };

const initialState: AppState = {
  rawFileContent: null,
  parsedPreset: null,
  conditionLabel: '',
  dwellConfig: DEFAULT_DWELL_CONFIG,
  phases: [],
  apiKey: localStorage.getItem('claude_api_key') || '',
  llmResult: null,
  llmLoading: false,
  conversionResult: null,
  editedPresetText: '',
};

function extractConditionAbbrev(presetName: string): string {
  // Try to extract abbreviation from parentheses: "Overactive Bladder (OAB) (R)" -> "OAB"
  // Look for uppercase abbreviations 2-6 chars, but exclude single-char like (R)
  const matches = presetName.match(/\(([A-Z][A-Za-z0-9]{1,5})\)/g);
  if (matches) {
    // Find the longest match that isn't "(R)" — the condition abbreviation
    for (const m of matches) {
      const inner = m.slice(1, -1);
      if (inner !== 'R' && inner.length >= 2) return inner;
    }
  }
  // Fallback: take words before first parenthesis, make abbreviation
  const beforeParen = presetName.split('(')[0].trim();
  if (beforeParen) {
    const words = beforeParen.split(/\s+/).filter((w) => w.length > 2);
    if (words.length > 1) {
      return words.map((w) => w[0].toUpperCase()).join('');
    }
    return beforeParen;
  }
  return 'Target';
}

function rebuildPhasesAndGenerate(state: AppState): AppState {
  if (!state.parsedPreset) return state;

  const included = state.parsedPreset.allFrequencies.filter((f) => f.included);
  const dwellMap = assignDwells(included, state.dwellConfig);

  const phase1 = buildPhase1(state.parsedPreset.allFrequencies, dwellMap, state.conditionLabel);

  // Preserve existing phase 2/3/4 edits if they exist
  const phase2 = state.phases.find((p) => p.number === 2) || buildPhase2();
  const phase3 = state.phases.find((p) => p.number === 3) || buildPhase3(state.conditionLabel, state.llmResult);
  const phase4 = state.phases.find((p) => p.number === 4) || buildPhase4(state.llmResult);

  const phases = [phase1, phase2, phase3, phase4];
  const result = generatePreset(phases, state.conditionLabel, state.llmResult?.mechanism);

  return {
    ...state,
    phases,
    conversionResult: result,
    editedPresetText: result.fullPresetText,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FILE': {
      const parsed = parseJWPreset(action.content);
      const conditionLabel = extractConditionAbbrev(parsed.presetName);
      const newState: AppState = {
        ...state,
        rawFileContent: action.content,
        parsedPreset: parsed,
        conditionLabel,
        phases: [],
        llmResult: null,
        conversionResult: null,
        editedPresetText: '',
      };
      return rebuildPhasesAndGenerate(newState);
    }

    case 'SET_CONDITION':
      return rebuildPhasesAndGenerate({ ...state, conditionLabel: action.label });

    case 'SET_DWELL_CONFIG':
      return rebuildPhasesAndGenerate({ ...state, dwellConfig: action.config });

    case 'TOGGLE_FREQUENCY': {
      if (!state.parsedPreset) return state;
      const updated = {
        ...state,
        parsedPreset: {
          ...state.parsedPreset,
          allFrequencies: state.parsedPreset.allFrequencies.map((f) =>
            f.mwKey === action.mwKey ? { ...f, included: !f.included } : f
          ),
        },
      };
      return rebuildPhasesAndGenerate(updated);
    }

    case 'SET_LLM_LOADING':
      return { ...state, llmLoading: action.loading };

    case 'SET_LLM_RESULT': {
      const newState = { ...state, llmResult: action.result, llmLoading: false };
      // Rebuild phases 3 and 4 with LLM data
      const phase3 = buildPhase3(state.conditionLabel, action.result);
      const phase4 = buildPhase4(action.result);
      newState.phases = state.phases.map((p) => {
        if (p.number === 3) return phase3;
        if (p.number === 4) return phase4;
        return p;
      });
      if (newState.phases.length === 0) {
        newState.phases = [buildPhase1(state.parsedPreset?.allFrequencies || [], new Map(), state.conditionLabel), buildPhase2(), phase3, phase4];
      }
      const result = generatePreset(newState.phases, state.conditionLabel, action.result.mechanism);
      return { ...newState, conversionResult: result, editedPresetText: result.fullPresetText };
    }

    case 'SET_LLM_ERROR':
      return { ...state, llmLoading: false };

    case 'SET_API_KEY':
      localStorage.setItem('claude_api_key', action.key);
      return { ...state, apiKey: action.key };

    case 'UPDATE_PHASE': {
      const newPhases = state.phases.map((p) =>
        p.number === action.phaseNumber ? { ...p, frequencies: action.frequencies } : p
      );
      const result = generatePreset(newPhases, state.conditionLabel, state.llmResult?.mechanism);
      return { ...state, phases: newPhases, conversionResult: result, editedPresetText: result.fullPresetText };
    }

    case 'SET_EDITED_TEXT':
      return { ...state, editedPresetText: action.text };

    case 'SET_BRAINWAVE_ENABLED': {
      const phase4 = buildPhase4(state.llmResult, action.enabled);
      const newPhases = state.phases.map((p) => (p.number === 4 ? phase4 : p));
      const result = generatePreset(newPhases, state.conditionLabel, state.llmResult?.mechanism);
      return { ...state, phases: newPhases, conversionResult: result, editedPresetText: result.fullPresetText };
    }

    case 'REGENERATE':
      return rebuildPhasesAndGenerate(state);

    default:
      return state;
  }
}

export function useConversionState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFile = useCallback((content: string) => dispatch({ type: 'SET_FILE', content }), []);
  const setCondition = useCallback((label: string) => dispatch({ type: 'SET_CONDITION', label }), []);
  const setDwellConfig = useCallback((config: DwellConfig) => dispatch({ type: 'SET_DWELL_CONFIG', config }), []);
  const toggleFrequency = useCallback((mwKey: string) => dispatch({ type: 'TOGGLE_FREQUENCY', mwKey }), []);
  const setApiKey = useCallback((key: string) => dispatch({ type: 'SET_API_KEY', key }), []);
  const setLLMLoading = useCallback((loading: boolean) => dispatch({ type: 'SET_LLM_LOADING', loading }), []);
  const setLLMResult = useCallback((result: LLMResearchResult) => dispatch({ type: 'SET_LLM_RESULT', result }), []);
  const setLLMError = useCallback((error: string) => dispatch({ type: 'SET_LLM_ERROR', error }), []);
  const updatePhase = useCallback(
    (phaseNumber: 1 | 2 | 3 | 4, frequencies: PhaseFrequency[]) =>
      dispatch({ type: 'UPDATE_PHASE', phaseNumber, frequencies }),
    []
  );
  const setEditedText = useCallback((text: string) => dispatch({ type: 'SET_EDITED_TEXT', text }), []);
  const setBrainwaveEnabled = useCallback((enabled: boolean) => dispatch({ type: 'SET_BRAINWAVE_ENABLED', enabled }), []);

  return {
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
  };
}
