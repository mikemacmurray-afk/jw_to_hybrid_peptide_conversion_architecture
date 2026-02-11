import type { Phase, ConversionResult } from '../types';
import { MW_TO_HZ_FACTOR, DNA_TO_HZ_FACTOR, RNA_TO_HZ_FACTOR, MRNA_TO_HZ_FACTOR } from '../utils/constants';
import { generatePresetName, generatePresetNotes } from '../utils/formatting';
import presetTemplate from '../data/preset_template.txt?raw';

function formatFrequencyEntry(freq: { mwKey: string; dwell: number }): string {
  return `${freq.mwKey}=${Math.round(freq.dwell)}`;
}

function buildLoadedProgramsLine(phases: Phase[]): string {
  return phases
    .map((p) => `"Loaded_Programs=${p.programName}"`)
    .join(' ');
}

function buildLoadedFrequenciesLine(phases: Phase[]): string {
  return phases
    .map((p) => {
      const freqStr = p.frequencies.map(formatFrequencyEntry).join(',');
      return `"Loaded_Frequencies=${freqStr}"`;
    })
    .join(' ');
}

export function generatePreset(
  phases: Phase[],
  conditionLabel: string,
  mechanism?: string
): ConversionResult {
  const presetName = generatePresetName(conditionLabel);
  const presetNotes = generatePresetNotes(conditionLabel, phases, mechanism);

  // Inject notes into template
  const templateWithNotes = presetTemplate.replace(
    '{{PRESET_NOTES}}',
    `"Preset_Notes=${presetNotes}"`
  );

  const loadedPrograms = buildLoadedProgramsLine(phases);
  const loadedFrequencies = buildLoadedFrequenciesLine(phases);

  const lines = [
    '"[Preset]"',
    `"PresetName=${presetName}"`,
    `"Force_MW_to_Hz_Factor=${MW_TO_HZ_FACTOR}"`,
    `"Force_DNA_to_Hz_Factor=${DNA_TO_HZ_FACTOR}"`,
    `"Force_RNA_to_Hz_Factor=${RNA_TO_HZ_FACTOR}"`,
    `"Force_mRNA_to_Hz_Factor=${MRNA_TO_HZ_FACTOR}"`,
    templateWithNotes,
    loadedPrograms,
    '',
    loadedFrequencies,
    '"[/Preset]"',
  ];

  const fullPresetText = lines.join('\n');

  return {
    phases,
    presetName,
    presetNotes,
    fullPresetText,
  };
}
