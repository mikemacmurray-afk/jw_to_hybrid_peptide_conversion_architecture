import type { AminoAcid, ParsedFrequency } from '../types';
import aminoAcidData from '../data/amino_acids.json';

const aaLookup = new Map<string, AminoAcid>();
for (const aa of aminoAcidData as AminoAcid[]) {
  aaLookup.set(aa.mwKey, aa);
}

export function classifyFrequencies(
  occurrenceMap: Map<string, number>
): { frequencies: ParsedFrequency[]; unknownMWs: string[] } {
  const frequencies: ParsedFrequency[] = [];
  const unknownMWs: string[] = [];

  for (const [mwKey, occurrences] of occurrenceMap) {
    const aminoAcid = aaLookup.get(mwKey);
    if (!aminoAcid) {
      unknownMWs.push(mwKey);
    }

    const mw = parseFloat(mwKey.replace(/^M/, ''));
    frequencies.push({
      mwKey,
      mw,
      occurrences,
      aminoAcid,
      included: true,
    });
  }

  // Sort by occurrences descending
  frequencies.sort((a, b) => b.occurrences - a.occurrences);

  return { frequencies, unknownMWs };
}

export function lookupAminoAcid(mwKey: string): AminoAcid | undefined {
  return aaLookup.get(mwKey);
}
