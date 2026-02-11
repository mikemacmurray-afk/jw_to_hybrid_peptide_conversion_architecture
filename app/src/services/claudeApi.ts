import type { LLMResearchResult, ParsedFrequency } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

function buildResearchPrompt(
  conditionLabel: string,
  frequencies: ParsedFrequency[]
): string {
  const aaList = frequencies
    .filter((f) => f.aminoAcid)
    .map((f) => `${f.aminoAcid!.name} (${f.aminoAcid!.code}) - MW ${f.mw} - ${f.occurrences} occurrences`)
    .join('\n');

  return `You are a biochemistry research assistant specializing in peptide therapeutics and molecular weight analysis for frequency therapy applications using Spooky2 Remote hardware.

Given the medical condition: ${conditionLabel}

The following amino acids were found in a JW peptide preset (with their monoisotopic residue molecular weights and occurrence counts):
${aaList}

I need you to research and provide therapeutic targets for converting this into a hybrid peptide preset. The hybrid preset has 4 phases:
- Phase 1: Amino acid precursors (already handled)
- Phase 2: DNA ignition/assembly signal (already handled)
- Phase 3: Primary peptide lock - needs therapeutic peptide targets
- Phase 4: Synergists - receptor agonists, supporting molecules, brainwave frequencies

Please provide your response as a JSON object with this exact structure:
{
  "peptideTargets": [
    {
      "name": "Peptide/hormone name",
      "mw": 1069.22,
      "mwKey": "M1069.22",
      "description": "Brief description of therapeutic role",
      "suggestedDwell": 600
    }
  ],
  "synergists": [
    {
      "name": "Molecule name",
      "mw": 211.11,
      "mwKey": "M211.11",
      "description": "Brief description",
      "suggestedDwell": 20
    }
  ],
  "brainwaveFrequencies": [
    {
      "hz": 10.5,
      "description": "Alpha wave - tissue healing",
      "suggestedDwell": 20
    }
  ],
  "mechanism": "A paragraph describing how this preset addresses the condition...",
  "rationale": "Why these specific targets were chosen..."
}

Guidelines:
- The PRIMARY peptide target should have suggestedDwell of 600 (10 minutes) as the anchor
- Secondary peptide targets should have suggestedDwell of 40
- Synergists should have suggestedDwell of 20
- Brainwave frequencies should be plain Hz values (no M prefix), typically 3-10 Hz range
- The mwKey must be formatted as "M" followed by the molecular weight (e.g., "M1069.22")
- For brainwave frequencies, the hz field is used directly (no mwKey needed for those)
- Provide 1-3 peptide targets (first one is the primary anchor)
- Provide 1-3 synergists
- Provide 2-3 brainwave frequencies
- Use real, validated molecular weights from published research
- Return ONLY the JSON object, no other text`;
}

export async function researchPeptideTargets(
  apiKey: string,
  conditionLabel: string,
  frequencies: ParsedFrequency[]
): Promise<LLMResearchResult> {
  const prompt = buildResearchPrompt(conditionLabel, frequencies);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from Claude API');
  }

  // Extract JSON from response (handle potential markdown code blocks)
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  const result: LLMResearchResult = JSON.parse(jsonStr.trim());
  return result;
}
