import type { DwellConfig, PhaseFrequency, LLMResearchResult, ConversionResult } from '../types';
import { parseJWPreset } from './parser';
import { assignDwells } from './dwell';
import { buildPhase1, buildPhase2, buildPhase3, buildPhase4 } from './phaseBuilder';
import { generatePreset } from './presetGenerator';

export interface PipelineOptions {
  rawFileContent: string;
  dwellConfig: DwellConfig;
  conditionLabel: string;
  includedMWs: Set<string>;
  llmResult?: LLMResearchResult | null;
  phase2Overrides?: PhaseFrequency[];
  brainwaveEnabled?: boolean;
}

export function runConversionPipeline(options: PipelineOptions): ConversionResult {
  const {
    rawFileContent,
    dwellConfig,
    conditionLabel,
    includedMWs,
    llmResult,
    phase2Overrides,
    brainwaveEnabled = true,
  } = options;

  // Step 1: Parse
  const parsed = parseJWPreset(rawFileContent);

  // Step 2: Apply user include/exclude selections
  for (const freq of parsed.allFrequencies) {
    freq.included = includedMWs.has(freq.mwKey);
  }

  // Step 3: Assign dwells
  const dwellMap = assignDwells(parsed.allFrequencies, dwellConfig);

  // Step 4: Build phases
  const phase1 = buildPhase1(parsed.allFrequencies, dwellMap, conditionLabel);
  const phase2 = buildPhase2(phase2Overrides);
  const phase3 = buildPhase3(conditionLabel, llmResult);
  const phase4 = buildPhase4(llmResult, brainwaveEnabled);

  const phases = [phase1, phase2, phase3, phase4];

  // Step 5: Generate output
  return generatePreset(phases, conditionLabel, llmResult?.mechanism);
}
