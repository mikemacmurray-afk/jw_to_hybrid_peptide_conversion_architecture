import type { Phase } from '../types';

export function generatePresetName(conditionLabel: string): string {
  const normalized = conditionLabel
    .toUpperCase()
    .replace(/\s+/g, '.')
    .replace(/[^A-Z0-9.]/g, '');
  return `PEPTIDE.${normalized}.HYBRID.V3FB(R)-RW`;
}

export function generatePresetNotes(
  conditionLabel: string,
  phases: Phase[],
  mechanism?: string
): string {
  const lines: string[] = [];

  lines.push(`Preset Logic & Notes //`);
  lines.push('');

  if (mechanism) {
    lines.push(`Mechanism: ${mechanism}`);
  } else {
    lines.push(
      `Mechanism: This preset utilizes a hybrid informational delivery system targeting ${conditionLabel}. ` +
      `It provides amino acid building blocks and therapeutic peptide signals optimized for Spooky2 Remote long-duration operation.`
    );
  }
  lines.push('');

  for (const phase of phases) {
    const freqCount = phase.frequencies.length;
    const dwells = phase.frequencies.map((f) => f.dwell);
    const minDwell = dwells.length > 0 ? Math.min(...dwells) : 0;
    const maxDwell = dwells.length > 0 ? Math.max(...dwells) : 0;
    const dwellRange = minDwell === maxDwell ? `${minDwell}s` : `${minDwell}-${maxDwell}s`;

    lines.push(`${phase.title}: ${phase.description} (${freqCount} frequencies, ${dwellRange} dwell)`);
    lines.push('');
  }

  lines.push('// Operational Instructions //');
  lines.push('');
  lines.push(
    'Hardware: Use Spooky2 Remote (DNA in the v2.0 Remote). ' +
    'Connection: Connect to the BN Port of the Spooky Boost for high-intensity 20V delivery. ' +
    'Factor Settings: Ensure the Force_MW_to_Hz_Factor is set to 2.2523430883E+23.'
  );

  return lines.join('\\n');
}
