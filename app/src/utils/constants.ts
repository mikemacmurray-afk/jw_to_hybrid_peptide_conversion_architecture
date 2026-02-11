import type { DwellConfig } from '../types';

export const MW_TO_HZ_FACTOR = '2.2523430883E+23';
export const DNA_TO_HZ_FACTOR = '4.35589935811E+17';
export const RNA_TO_HZ_FACTOR = '4.35589935811E+17';
export const MRNA_TO_HZ_FACTOR = '4.35589935811E+17';

export const DNA_FORCE_MW_KEY = 'M4.35589935811E+17';
export const DNA_FORCE_DWELL = 60;

export const DEFAULT_ANCHOR_DWELL = 600;
export const DEFAULT_SECONDARY_DWELL = 40;
export const DEFAULT_SYNERGIST_DWELL = 20;

export const DEFAULT_DWELL_CONFIG: DwellConfig = {
  mode: 'binary',
  commonDwell: 12,
  essentialDwell: 60,
  baseDwell: 8,
  multiplier: 4,
  maxDwell: 75,
};
