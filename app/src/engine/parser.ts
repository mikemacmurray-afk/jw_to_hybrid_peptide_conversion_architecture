import type { ParsedPreset, ParsedFrequency } from '../types';
import { classifyFrequencies } from './classifier';

function stripQuotes(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractValue(line: string, key: string): string | null {
  const stripped = stripQuotes(line);
  if (stripped.startsWith(key + '=')) {
    return stripped.slice(key.length + 1);
  }
  return null;
}

function parseMWKey(token: string): string | null {
  const cleaned = token.trim();
  if (!cleaned || cleaned === '0' || cleaned.startsWith('0=')) return null;

  // Strip dwell suffix: "M147.068=1" -> "M147.068"
  const eqIdx = cleaned.indexOf('=');
  const mwKey = eqIdx > 0 ? cleaned.slice(0, eqIdx) : cleaned;
  return mwKey;
}

export function parseJWPreset(rawContent: string): ParsedPreset {
  const lines = rawContent.split(/\r?\n/);
  let presetName = '';
  let basePreset = '';
  const presetNotesLines: string[] = [];
  const programNames: string[] = [];
  const frequencyLines: string[][] = [];
  let inNotes = false;

  for (const line of lines) {
    const stripped = stripQuotes(line);

    if (stripped === '[Preset]' || stripped === '[/Preset]') continue;

    const nameVal = extractValue(line, 'PresetName');
    if (nameVal !== null) {
      presetName = nameVal;
      continue;
    }

    const baseVal = extractValue(line, 'Base_Preset');
    if (baseVal !== null) {
      basePreset = baseVal;
      continue;
    }

    if (stripped.startsWith('Preset_Notes=')) {
      inNotes = true;
      presetNotesLines.push(stripped.slice('Preset_Notes='.length));
      continue;
    }

    if (inNotes) {
      if (stripped.startsWith('Loaded_Programs=') || stripped.startsWith('Loaded_Frequencies=')) {
        inNotes = false;
      } else {
        presetNotesLines.push(stripped);
        continue;
      }
    }

    // Handle Loaded_Programs - one per line in JW format
    if (stripped.startsWith('Loaded_Programs=')) {
      const progName = stripped.slice('Loaded_Programs='.length);
      programNames.push(progName);
    }

    // Handle Loaded_Frequencies - one per line in JW format
    if (stripped.startsWith('Loaded_Frequencies=')) {
      const freqStr = stripped.slice('Loaded_Frequencies='.length);
      const tokens = freqStr.split(',');
      const mwKeys: string[] = [];
      for (const token of tokens) {
        const mwKey = parseMWKey(token);
        if (mwKey) mwKeys.push(mwKey);
      }
      if (mwKeys.length > 0) {
        frequencyLines.push(mwKeys);
      }
    }
  }

  // Count occurrences across all frequency lines
  const occurrenceMap = new Map<string, number>();
  for (const freqLine of frequencyLines) {
    for (const mwKey of freqLine) {
      occurrenceMap.set(mwKey, (occurrenceMap.get(mwKey) || 0) + 1);
    }
  }

  // Classify and build frequency list
  const { frequencies, unknownMWs } = classifyFrequencies(occurrenceMap);

  return {
    presetName,
    basePreset,
    presetNotes: presetNotesLines.join('\n'),
    programNames,
    frequencyLines,
    allFrequencies: frequencies,
    unknownMWs,
  };
}
