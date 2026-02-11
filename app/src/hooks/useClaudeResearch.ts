import { useCallback } from 'react';
import type { ParsedFrequency, LLMResearchResult } from '../types';
import { researchPeptideTargets } from '../services/claudeApi';

interface UseClaudeResearchProps {
  apiKey: string;
  conditionLabel: string;
  frequencies: ParsedFrequency[];
  setLLMLoading: (loading: boolean) => void;
  setLLMResult: (result: LLMResearchResult) => void;
  setLLMError: (error: string) => void;
}

export function useClaudeResearch({
  apiKey,
  conditionLabel,
  frequencies,
  setLLMLoading,
  setLLMResult,
  setLLMError,
}: UseClaudeResearchProps) {
  const runResearch = useCallback(async () => {
    if (!apiKey) {
      setLLMError('Please enter your Claude API key first.');
      return;
    }
    if (!conditionLabel) {
      setLLMError('Please enter a condition label first.');
      return;
    }

    setLLMLoading(true);
    try {
      const result = await researchPeptideTargets(apiKey, conditionLabel, frequencies);
      setLLMResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setLLMError(message);
    }
  }, [apiKey, conditionLabel, frequencies, setLLMLoading, setLLMResult, setLLMError]);

  return { runResearch };
}
