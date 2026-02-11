import type { ParsedFrequency, DwellConfig } from '../types';
import { assignDwells } from '../engine/dwell';

interface FrequencyTableProps {
  frequencies: ParsedFrequency[];
  dwellConfig: DwellConfig;
  onToggle: (mwKey: string) => void;
}

function categoryLabel(cat: string): string {
  switch (cat) {
    case 'essential': return 'Essential';
    case 'conditionally_essential': return 'Cond. Essential';
    case 'non_essential': return 'Non-Essential';
    default: return cat;
  }
}

function categoryClass(cat: string): string {
  switch (cat) {
    case 'essential': return 'cat-essential';
    case 'conditionally_essential': return 'cat-conditional';
    case 'non_essential': return 'cat-nonessential';
    default: return '';
  }
}

export function FrequencyTable({ frequencies, dwellConfig, onToggle }: FrequencyTableProps) {
  const included = frequencies.filter((f) => f.included);
  const dwellMap = assignDwells(included, dwellConfig);

  return (
    <div className="frequency-table-container">
      <h3>Parsed Amino Acids ({frequencies.length} unique MW values)</h3>
      <table className="frequency-table">
        <thead>
          <tr>
            <th>Include</th>
            <th>MW Key</th>
            <th>Amino Acid</th>
            <th>Code</th>
            <th>Category</th>
            <th>Occurrences</th>
            <th>Dwell (s)</th>
          </tr>
        </thead>
        <tbody>
          {frequencies.map((freq) => (
            <tr key={freq.mwKey} className={freq.included ? '' : 'excluded'}>
              <td>
                <input
                  type="checkbox"
                  checked={freq.included}
                  onChange={() => onToggle(freq.mwKey)}
                />
              </td>
              <td className="mono">{freq.mwKey}</td>
              <td>{freq.aminoAcid?.name || <span className="unknown">Unknown</span>}</td>
              <td className="mono">{freq.aminoAcid?.code || '?'}</td>
              <td>
                {freq.aminoAcid ? (
                  <span className={`category-badge ${categoryClass(freq.aminoAcid.category)}`}>
                    {categoryLabel(freq.aminoAcid.category)}
                  </span>
                ) : (
                  <span className="category-badge cat-unknown">Unknown</span>
                )}
              </td>
              <td className="num">{freq.occurrences}</td>
              <td className="num">{freq.included ? (dwellMap.get(freq.mwKey) || '—') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
