import type { ParsedFrequency, Phase, PhaseFrequency, LLMResearchResult } from '../types';
import { DNA_FORCE_MW_KEY, DNA_FORCE_DWELL } from '../utils/constants';

export function buildPhase1(
  frequencies: ParsedFrequency[],
  dwellMap: Map<string, number>,
  conditionLabel: string
): Phase {
  const included = frequencies.filter((f) => f.included);

  // Sort: non-essential first (short dwell), then conditionally essential, then essential
  const categoryOrder = { non_essential: 0, conditionally_essential: 1, essential: 2 };
  const sorted = [...included].sort((a, b) => {
    const catA = a.aminoAcid ? categoryOrder[a.aminoAcid.category] : 0;
    const catB = b.aminoAcid ? categoryOrder[b.aminoAcid.category] : 0;
    return catA - catB;
  });

  const phaseFreqs: PhaseFrequency[] = sorted.map((f) => ({
    mwKey: f.mwKey,
    dwell: dwellMap.get(f.mwKey) || 12,
    label: f.aminoAcid ? `${f.aminoAcid.name} (${f.aminoAcid.code})` : `Unknown (${f.mwKey})`,
  }));

  const abbrev = conditionLabel || 'Target';
  return {
    number: 1,
    title: `Phase 1: Precursor Supply (${abbrev} Bricks)`,
    description: 'Amino acid building blocks delivered with weighted dwell times.',
    frequencies: phaseFreqs,
    programName: `Phase 1: Precursor Supply (${abbrev} Bricks)`,
  };
}

export function buildPhase2(
  customFrequencies?: PhaseFrequency[]
): Phase {
  const defaultFreqs: PhaseFrequency[] = [
    { mwKey: DNA_FORCE_MW_KEY, dwell: DNA_FORCE_DWELL, label: 'DNA Force Factor' },
  ];

  return {
    number: 2,
    title: 'Phase 2: Ignition (Genomic Instruction)',
    description: 'DNA-specific force factor signals the body to assemble amino acids into functional peptides.',
    frequencies: customFrequencies || defaultFreqs,
    programName: 'Phase 2: Ignition (Genomic Instruction)',
  };
}

export function buildPhase3(
  conditionLabel: string,
  llmResult?: LLMResearchResult | null
): Phase {
  const freqs: PhaseFrequency[] = [];

  if (llmResult?.peptideTargets) {
    for (const target of llmResult.peptideTargets) {
      freqs.push({
        mwKey: target.mwKey,
        dwell: target.suggestedDwell,
        label: target.name,
      });
    }
  }

  const abbrev = conditionLabel || 'Target';
  return {
    number: 3,
    title: `Phase 3: Molecular Verification (${abbrev} Lock)`,
    description: 'Primary peptide anchor with sustained dwell for entrainment.',
    frequencies: freqs,
    programName: `Phase 3: Molecular Verification (${abbrev} Lock)`,
  };
}

export function buildPhase4(
  llmResult?: LLMResearchResult | null,
  brainwaveEnabled: boolean = true
): Phase {
  const freqs: PhaseFrequency[] = [];

  if (llmResult?.synergists) {
    for (const syn of llmResult.synergists) {
      freqs.push({
        mwKey: syn.mwKey,
        dwell: syn.suggestedDwell,
        label: syn.name,
      });
    }
  }

  if (brainwaveEnabled && llmResult?.brainwaveFrequencies) {
    for (const bw of llmResult.brainwaveFrequencies) {
      freqs.push({
        mwKey: String(bw.hz),
        dwell: bw.suggestedDwell,
        label: `${bw.hz} Hz - ${bw.description}`,
      });
    }
  }

  return {
    number: 4,
    title: 'Phase 4: Receptor Agonists & Synergists',
    description: 'Supporting molecules and brainwave frequencies for stabilization.',
    frequencies: freqs,
    programName: 'Phase 4: Receptor Agonists & Synergists',
  };
}
