import type { ParsedFrequency, DwellConfig } from '../types';

export function assignDwells(
  frequencies: ParsedFrequency[],
  config: DwellConfig
): Map<string, number> {
  const dwellMap = new Map<string, number>();

  for (const freq of frequencies) {
    if (!freq.included) continue;

    let dwell: number;

    if (config.mode === 'binary') {
      if (
        freq.aminoAcid &&
        (freq.aminoAcid.category === 'essential' ||
          freq.aminoAcid.category === 'conditionally_essential')
      ) {
        dwell = config.essentialDwell;
      } else {
        dwell = config.commonDwell;
      }
    } else {
      // Weighted mode
      dwell = config.baseDwell + freq.occurrences * config.multiplier;
      dwell = Math.min(dwell, config.maxDwell);
      dwell = Math.max(dwell, config.baseDwell);
    }

    dwellMap.set(freq.mwKey, Math.round(dwell));
  }

  return dwellMap;
}
