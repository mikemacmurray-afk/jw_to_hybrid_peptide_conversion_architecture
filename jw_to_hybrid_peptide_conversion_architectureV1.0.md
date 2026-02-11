# JW to Hybrid Peptide Conversion Architecture — V1.0 Specification

## Document Purpose

Complete technical specification for the JW-to-Hybrid Peptide Conversion Agent — a browser-based tool that converts Spooky2 JW-style peptide presets (short-dwell, high-repetition, fragmented MW chains) into structured 4-phase hybrid presets optimized for Remote overnight/24-7 operation.

**Version:** 1.0
**Status:** Implemented and operational
**Repository:** `github.com/mikemacmurray-afk/jw_to_hybrid_peptide_conversion_architecture`

---

## Table of Contents

1. [Core Paradigm Shift](#1-core-paradigm-shift)
2. [Operational Context](#2-operational-context)
3. [Tech Stack & Project Structure](#3-tech-stack--project-structure)
4. [Amino Acid Database](#4-amino-acid-database)
5. [Force Factor Constants](#5-force-factor-constants)
6. [Conversion Pipeline](#6-conversion-pipeline)
7. [JW Preset Parser](#7-jw-preset-parser)
8. [Frequency Classification Engine](#8-frequency-classification-engine)
9. [Dwell Assignment System](#9-dwell-assignment-system)
10. [4-Phase Architecture](#10-4-phase-architecture)
11. [Preset Output Format](#11-preset-output-format)
12. [Claude API Integration](#12-claude-api-integration)
13. [State Management](#13-state-management)
14. [TypeScript Interfaces](#14-typescript-interfaces)
15. [UI Component Architecture](#15-ui-component-architecture)
16. [JW vs Hybrid Format Mapping](#16-jw-vs-hybrid-format-mapping)
17. [Verification Plan](#17-verification-plan)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Core Paradigm Shift

### JW Model (Looped Fragment Signalling)
- Very short dwell (1-4 sec typical)
- High repetition density
- Fragmented peptide chain delivery
- Continuous looping
- Informational nudging

### Hybrid Model (Staged Assembly & Locking)
- Structured 4-phase architecture
- Weighted dwell by biological importance
- Assembly/ignition step with DNA force factors
- Long peptide anchor dwell (up to 10 minutes)
- Synergist stabilization with brainwave entrainment

**Conversion is NOT time scaling.**
It is a paradigm shift from **repetition signalling** to **staged biological instruction architecture**, optimized for long-duration Remote transmission.

---

## 2. Operational Context

| Parameter | Value |
|-----------|-------|
| Primary hardware | Spooky2 Remote (DNA entanglement) |
| Run duration | Overnight to continuous 24/7 |
| Deployment | Single generator per condition (Phase 1) |
| Future deployment | Multi-generator split architecture (Phase 2) |
| Conversion philosophy | Preserve original peptide logic, optional intelligent additions with justification |
| Scale | One-by-one conversion with optional batch later |

---

## 3. Tech Stack & Project Structure

### Technology
- **React 19** + **Vite 7** + **TypeScript 5.8**
- **Claude API** (Sonnet 4.5) for peptide target research
- Browser-direct API calls via `anthropic-dangerous-direct-browser-access` header
- Fully client-side — no backend required

### Project Structure

```
app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx                      # Entry point
│   ├── App.tsx                       # Root component
│   ├── index.css                     # Complete application styling
│   │
│   ├── data/
│   │   ├── amino_acids.json          # 19 AA entries (MW, name, code, category)
│   │   └── preset_template.txt       # 227-line Spooky2 settings template
│   │
│   ├── types/
│   │   └── index.ts                  # All TypeScript interfaces
│   │
│   ├── engine/
│   │   ├── parser.ts                 # JW preset → structured data
│   │   ├── classifier.ts             # MW → amino acid lookup
│   │   ├── dwell.ts                  # Mode A (binary) + Mode B (weighted)
│   │   ├── phaseBuilder.ts           # Builds 4 phases from classified data
│   │   ├── presetGenerator.ts        # Assembles final Spooky2 .txt output
│   │   └── pipeline.ts              # Orchestrates full conversion
│   │
│   ├── services/
│   │   └── claudeApi.ts             # Claude API for peptide research
│   │
│   ├── hooks/
│   │   ├── useConversionState.ts    # Central useReducer state management
│   │   └── useClaudeResearch.ts     # LLM research hook
│   │
│   ├── components/
│   │   ├── FileUpload.tsx           # Drag & drop JW file input
│   │   ├── ConditionInput.tsx       # Condition label text field
│   │   ├── FrequencyTable.tsx       # AA table with include/exclude toggles
│   │   ├── DwellModeSelector.tsx    # Mode A/B selection + parameters
│   │   ├── PhaseEditor.tsx          # Tabbed container for 4 phases
│   │   ├── ClaudeResearchPanel.tsx  # LLM research trigger + results
│   │   ├── ApiKeyInput.tsx          # API key input (localStorage)
│   │   ├── PresetPreview.tsx        # Editable output textarea
│   │   └── DownloadButton.tsx       # Download .txt file
│   │
│   └── utils/
│       ├── constants.ts             # Force factors, default dwells
│       └── formatting.ts            # Preset naming, note generation
```

---

## 4. Amino Acid Database

19 standard amino acids mapped by monoisotopic residue molecular weight:

| MW | mwKey | Name | Code | Category |
|----|-------|------|------|----------|
| 57.021 | M57.021 | Glycine | G | non_essential |
| 71.037 | M71.037 | Alanine | A | non_essential |
| 87.032 | M87.032 | Serine | S | non_essential |
| 97.053 | M97.053 | Proline | P | conditionally_essential |
| 99.068 | M99.068 | Valine | V | essential |
| 101.048 | M101.048 | Threonine | T | essential |
| 103.009 | M103.009 | Cysteine | C | conditionally_essential |
| 113.084 | M113.084 | Leucine/Isoleucine | L/I | essential |
| 114.043 | M114.043 | Asparagine | N | non_essential |
| 115.027 | M115.027 | Aspartic acid | D | non_essential |
| 128.058 | M128.058 | Glutamine | Q | conditionally_essential |
| 128.095 | M128.095 | Lysine | K | essential |
| 129.043 | M129.043 | Glutamic acid | E | non_essential |
| 131.040 | M131.040 | Methionine | M | essential |
| 137.059 | M137.059 | Histidine | H | essential |
| 147.068 | M147.068 | Phenylalanine | F | essential |
| 156.101 | M156.101 | Arginine | R | conditionally_essential |
| 163.063 | M163.063 | Tyrosine | Y | conditionally_essential |
| 186.079 | M186.079 | Tryptophan | W | essential |

**Categories:**
- **Essential** (7): Val, Thr, Leu/Ile, Lys, Met, His, Phe, Trp — must be obtained from diet
- **Conditionally Essential** (5): Pro, Cys, Gln, Arg, Tyr — essential under certain conditions
- **Non-Essential** (6): Gly, Ala, Ser, Asn, Asp, Glu — body can synthesize

**Note:** Leucine and Isoleucine share the same monoisotopic residue MW (113.084) and are treated as a single entry (L/I).

---

## 5. Force Factor Constants

These are fixed Spooky2 force factors applied to every hybrid preset:

| Constant | Value | Purpose |
|----------|-------|---------|
| `MW_TO_HZ_FACTOR` | `2.2523430883E+23` | Molecular weight to Hz conversion |
| `DNA_TO_HZ_FACTOR` | `4.35589935811E+17` | DNA force factor |
| `RNA_TO_HZ_FACTOR` | `4.35589935811E+17` | RNA force factor |
| `MRNA_TO_HZ_FACTOR` | `4.35589935811E+17` | mRNA force factor |

### Default Dwell Values

| Constant | Value | Purpose |
|----------|-------|---------|
| `DNA_FORCE_MW_KEY` | `M4.35589935811E+17` | MW key for DNA ignition entry |
| `DNA_FORCE_DWELL` | 60s | Dwell time for DNA force factor |
| `DEFAULT_ANCHOR_DWELL` | 600s (10 min) | Primary peptide anchor |
| `DEFAULT_SECONDARY_DWELL` | 40s | Secondary peptide targets |
| `DEFAULT_SYNERGIST_DWELL` | 20s | Supporting molecules |

### Default Dwell Configuration

```
Mode: binary
Common (non-essential) dwell: 12 seconds
Essential dwell: 60 seconds
Base dwell (weighted mode): 8 seconds
Multiplier (weighted mode): 4
Max dwell (weighted mode): 75 seconds
```

---

## 6. Conversion Pipeline

The full pipeline orchestrated by `pipeline.ts`:

```
JW Preset File (.txt)
       │
       ▼
   ┌─────────┐
   │  PARSE   │  Extract frequencies, count occurrences, strip markers
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │ CLASSIFY  │  Map MW → amino acid, flag unknowns
   └────┬──────┘
        │
        ▼
   ┌──────────┐
   │  DWELL    │  Assign dwell times (Mode A or Mode B)
   └────┬──────┘
        │
        ▼
   ┌───────────┐
   │   PHASE    │  Build 4-phase structure
   │  BUILDER   │  (+ optional LLM research for phases 3 & 4)
   └────┬───────┘
        │
        ▼
   ┌───────────┐
   │  PRESET    │  Assemble final Spooky2 .txt output
   │ GENERATOR  │  using template + force factors
   └────┬───────┘
        │
        ▼
  Hybrid Preset (.txt)
```

---

## 7. JW Preset Parser

**Input:** Raw JW preset text file content

### Parsing Steps

1. **Line Processing:** Split by newlines, strip outer double quotes from each line
2. **Field Extraction:** Extract `PresetName`, `Preset_Notes`, `Base_Preset` using key=value matching
3. **Program Names:** Collect all `Loaded_Programs=` values (one per line in JW format)
4. **Frequency Lines:** Collect all `Loaded_Frequencies=` values, split each by comma
5. **MW Key Processing:**
   - Strip dwell suffixes: `M147.068=1` → `M147.068`
   - Discard `0=4` rest markers (return null)
   - Discard bare `0` tokens
6. **Occurrence Counting:** Count each unique mwKey across ALL frequency lines using a `Map<string, number>`

### Output: `ParsedPreset`

```typescript
{
  presetName: string;          // e.g., "Overactive Bladder (OAB) (R)"
  basePreset: string;          // e.g., "\JW_Peptides\Shells\Remote"
  presetNotes: string;         // Original notes text
  programNames: string[];      // Array of program names (12+ typical)
  frequencyLines: string[][];  // Raw frequency token arrays
  allFrequencies: ParsedFrequency[];  // Classified frequency objects
  unknownMWs: string[];        // MW keys not matching any amino acid
}
```

---

## 8. Frequency Classification Engine

### Process

1. Load amino acid database into a `Map<mwKey, AminoAcid>` lookup
2. For each unique (mwKey, occurrences) pair from the parser:
   - Look up amino acid data by mwKey
   - If found: create `ParsedFrequency` with amino acid metadata, `included: true`
   - If not found: add to `unknownMWs` array, create entry with `aminoAcid: undefined`
3. Sort all frequencies by occurrence count (descending)

### Biological Classification

| Category | Dwell Priority | Role |
|----------|---------------|------|
| Essential | High (60s default) | Must be supplied externally, critical building blocks |
| Conditionally Essential | High (60s default) | Essential under stress/illness — key for therapeutic presets |
| Non-Essential | Low (12s default) | Body can synthesize, shorter exposure sufficient |

---

## 9. Dwell Assignment System

Two modes available, selectable in the UI:

### Mode A: Binary (Category-Based)

Simple two-tier assignment based on amino acid classification:

```
IF category = 'essential' OR 'conditionally_essential':
    dwell = essentialDwell (default: 60 seconds)
ELSE:
    dwell = commonDwell (default: 12 seconds)
```

**Rationale:** Biological importance determines exposure time. Essential amino acids need longer dwell because the body cannot synthesize them.

### Mode B: Weighted (Occurrence-Based)

Occurrence count from the JW preset drives dwell duration:

```
dwell = baseDwell + (occurrences × multiplier)
dwell = CLAMP(dwell, baseDwell, maxDwell)
dwell = ROUND(dwell)
```

**Default Parameters:**
- `baseDwell` = 8 seconds (minimum floor)
- `multiplier` = 4 seconds per occurrence
- `maxDwell` = 75 seconds (ceiling cap)

**Rationale:** JW presets encode biological priority through repetition count. High-repetition frequencies were deemed more important by the original designer. This mode preserves that weighting as dwell duration.

**Example (Mode B):**

| MW | Occurrences | Calculation | Dwell |
|----|-------------|-------------|-------|
| M147.068 (Phe) | 12 | 8 + (12 × 4) = 56 | 56s |
| M57.021 (Gly) | 3 | 8 + (3 × 4) = 20 | 20s |
| M186.079 (Trp) | 16 | 8 + (16 × 4) = 72 | 72s |
| M99.068 (Val) | 18 | 8 + (18 × 4) = 80 → capped | 75s |

---

## 10. 4-Phase Architecture

### Phase 1: Precursor Supply ("Bricks")

**Purpose:** Deliver amino acid building blocks with weighted dwell times.

**Content:**
- All included frequencies from the JW preset (after classification and dwell assignment)
- Sorted by category: non_essential → conditionally_essential → essential
- Each entry labeled as `"AminoAcidName (Code)"` (e.g., "Glycine (G)")

**Program Name:** `Phase 1: Precursor Supply ({ABBREV} Bricks)`

**Target Duration:** 12-25 minutes depending on number of included frequencies and dwell times.

---

### Phase 2: Ignition (Genomic Instruction)

**Purpose:** Signal the body to assemble provided amino acid components into functional peptides.

**Content:**
- DNA Force Factor: `M4.35589935811E+17` at 60s dwell
- Optional additional genomic activation tones (user-editable)

**Program Name:** `Phase 2: Ignition (Genomic Instruction)`

**Placement:** Immediately after precursor delivery. Never anchor (Phase 3) before ignition.

---

### Phase 3: Molecular Verification ("Peptide Lock")

**Purpose:** Primary peptide anchor with sustained dwell for entrainment. Most critical phase.

**Content (LLM-populated):**
- Primary therapeutic peptide target: 600s dwell (10-minute anchor)
- Secondary supporting peptides: 40s dwell each
- Typically 1-3 peptide targets identified by Claude research

**Program Name:** `Phase 3: Molecular Verification ({ABBREV} Lock)`

**Note:** This phase is empty until Claude API research is performed. All entries are fully editable.

---

### Phase 4: Receptor Agonists & Synergists

**Purpose:** Supporting molecules and brainwave frequencies for stabilization and receptor sensitivity.

**Content (LLM-populated):**
- Synergist molecules: 20s dwell each (receptor agonists, neurotransmitter stabilizers)
- Brainwave frequencies (optional, toggleable): plain Hz values (e.g., `10.5=20`)
  - Typical range: 3-10 Hz
  - Labeled as `"{hz} Hz - {description}"`

**Program Name:** `Phase 4: Receptor Agonists & Synergists`

### Phase Execution Order

```
Phase 1 (Precursors) → Phase 2 (Ignition) → Phase 3 (Anchor) → Phase 4 (Stabilize) → repeat
```

**Critical Rule:** Never anchor before precursor delivery. Order must be preserved.

---

## 11. Preset Output Format

### Structural Rules

1. **Every line** wrapped in double quotes: `"key=value"`
2. **Loaded_Programs:** ALL phases on ONE line, each separately quoted, space-separated
3. **Loaded_Frequencies:** ALL frequency sets on ONE line, each separately quoted, space-separated
4. **Empty line** between programs line and frequencies line
5. **Preset_Notes** sits mid-template at line 70 (between two settings blocks), NOT at the end
6. **Frequency format:** `MW=dwell` with integer dwell (e.g., `M147.068=60`)
7. **Brainwave format:** Plain Hz, no M prefix (e.g., `10.5=20`)

### Output Assembly

```
"[Preset]"
"PresetName={presetName}"
"Force_MW_to_Hz_Factor=2.2523430883E+23"
"Force_DNA_to_Hz_Factor=4.35589935811E+17"
"Force_RNA_to_Hz_Factor=4.35589935811E+17"
"Force_mRNA_to_Hz_Factor=4.35589935811E+17"
{--- 227 lines of template settings with injected Preset_Notes at line 70 ---}
"Loaded_Programs=Phase 1: ..." "Loaded_Programs=Phase 2: ..." "Loaded_Programs=Phase 3: ..." "Loaded_Programs=Phase 4: ..."

"Loaded_Frequencies=M57.021=12,M71.037=60,..." "Loaded_Frequencies=M4.35589935811E+17=60" "Loaded_Frequencies=M1069.22=600,..." "Loaded_Frequencies=M371.15=20,..."
"[/Preset]"
```

### Preset Template

The template (`preset_template.txt`) contains 227 lines of fixed Spooky2 hardware settings including:
- BFB scan parameters
- Waveform configuration
- Gate settings
- Amplitude/offset controls
- Generator hardware settings
- Enable/disable flags for all features

The `{{PRESET_NOTES}}` placeholder at line 70 is replaced with generated notes containing:
- Condition label
- Phase descriptions
- Conversion metadata

---

## 12. Claude API Integration

### Configuration

| Parameter | Value |
|-----------|-------|
| Endpoint | `https://api.anthropic.com/v1/messages` |
| Model | `claude-sonnet-4-5-20250929` |
| Max Tokens | 2000 |
| API Version | `2023-06-01` |
| Browser Access | `anthropic-dangerous-direct-browser-access: true` |

### Research Prompt

The API is called with the condition label and the amino acid frequency list from Phase 1. It returns a structured JSON response with:

- **peptideTargets** (1-3): Named therapeutic peptides with MW, mwKey, description, and suggested dwell (primary = 600s, secondary = 40s)
- **synergists** (1-3): Supporting molecules with MW, mwKey, description, and suggested dwell (20s)
- **brainwaveFrequencies** (2-3): Hz values with descriptions and suggested dwell (typically 3-10 Hz range)
- **mechanism**: Text explanation of the therapeutic mechanism
- **rationale**: Text explanation of why these targets were selected

### Usage Flow

1. User enters condition label and API key
2. User clicks "Research" button
3. Claude analyzes the amino acid profile against the condition
4. Results populate Phases 3 and 4
5. All LLM-generated entries are fully editable by the user
6. User can re-run research or manually adjust before generating output

---

## 13. State Management

Central state managed via `useReducer` in `useConversionState.ts`.

### State Shape

```typescript
{
  rawFileContent: string | null;       // Original file content
  parsedPreset: ParsedPreset | null;   // Parsed JW preset data
  conditionLabel: string;              // User-editable condition name
  dwellConfig: DwellConfig;            // Current dwell mode & parameters
  phases: Phase[];                     // 4-phase structure
  apiKey: string;                      // Claude API key (localStorage)
  llmResult: LLMResearchResult | null; // Claude research results
  llmLoading: boolean;                 // API loading state
  conversionResult: ConversionResult | null; // Generated output
  editedPresetText: string;            // User-editable final text
}
```

### Actions

| Action | Trigger | Effect |
|--------|---------|--------|
| `SET_FILE` | File uploaded | Parse preset, extract condition, rebuild all phases |
| `SET_CONDITION` | Label edited | Update label, regenerate phases |
| `SET_DWELL_CONFIG` | Mode/params changed | Recalculate all dwells |
| `TOGGLE_FREQUENCY` | Checkbox toggled | Include/exclude individual frequency |
| `SET_API_KEY` | Key entered | Store in localStorage |
| `SET_LLM_LOADING` | Research started | Set loading spinner |
| `SET_LLM_RESULT` | Research complete | Store results, rebuild phases 3 & 4 |
| `SET_LLM_ERROR` | Research failed | Clear loading, show error |
| `UPDATE_PHASE` | Phase manually edited | Update specific phase frequencies |
| `SET_EDITED_TEXT` | Preview text edited | Update editable preset text |
| `SET_BRAINWAVE_ENABLED` | Toggle switched | Include/exclude brainwave frequencies in Phase 4 |
| `REGENERATE` | Any config change | Rebuild all phases and generate new preset |

### Auto-Regeneration

Any change to dwell config, frequency inclusion, or phase editing automatically triggers full preset regeneration. The preview text updates in real-time.

---

## 14. TypeScript Interfaces

```typescript
// Amino acid from the database
interface AminoAcid {
  mw: number;                    // Monoisotopic residue MW
  mwKey: string;                 // "M{mw}" format key
  name: string;                  // Full name
  code: string;                  // Single-letter code
  category: 'essential' | 'conditionally_essential' | 'non_essential';
}

// Parsed frequency from JW preset
interface ParsedFrequency {
  mwKey: string;                 // "M{mw}" format
  mw: number;                   // Numeric MW value
  occurrences: number;           // Count across all JW programs
  aminoAcid?: AminoAcid;        // Matched AA (undefined if unknown)
  included: boolean;             // User toggle for inclusion
}

// Parsed JW preset structure
interface ParsedPreset {
  presetName: string;
  basePreset: string;
  presetNotes: string;
  programNames: string[];
  frequencyLines: string[][];
  allFrequencies: ParsedFrequency[];
  unknownMWs: string[];
}

// Dwell configuration
type DwellMode = 'binary' | 'weighted';

interface DwellConfig {
  mode: DwellMode;
  commonDwell: number;           // Mode A: non-essential dwell
  essentialDwell: number;        // Mode A: essential/conditional dwell
  baseDwell: number;             // Mode B: base value
  multiplier: number;            // Mode B: per-occurrence multiplier
  maxDwell: number;              // Mode B: ceiling cap
}

// Single frequency within a phase
interface PhaseFrequency {
  mwKey: string;                 // MW key or Hz value (brainwave)
  dwell: number;                 // Assigned dwell in seconds
  label?: string;                // Human-readable label
}

// One of the 4 phases
interface Phase {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  frequencies: PhaseFrequency[];
  programName: string;           // Spooky2 program name
}

// Full conversion output
interface ConversionResult {
  phases: Phase[];
  presetName: string;
  presetNotes: string;
  fullPresetText: string;        // Complete .txt content
}

// Claude API research response
interface LLMResearchResult {
  peptideTargets: Array<{
    name: string;
    mw: number;
    mwKey: string;
    description: string;
    suggestedDwell: number;      // 600 primary, 40 secondary
  }>;
  synergists: Array<{
    name: string;
    mw: number;
    mwKey: string;
    description: string;
    suggestedDwell: number;      // 20 default
  }>;
  brainwaveFrequencies: Array<{
    hz: number;                  // Plain Hz (e.g., 7.83)
    description: string;
    suggestedDwell: number;
  }>;
  mechanism: string;
  rationale: string;
}

// Application state
interface AppState {
  rawFileContent: string | null;
  parsedPreset: ParsedPreset | null;
  conditionLabel: string;
  dwellConfig: DwellConfig;
  phases: Phase[];
  apiKey: string;
  llmResult: LLMResearchResult | null;
  llmLoading: boolean;
  conversionResult: ConversionResult | null;
  editedPresetText: string;
}
```

---

## 15. UI Component Architecture

### Layout

Single-page application with sequential sections that appear as the user progresses:

```
┌──────────────────────────────────────────────┐
│  JW to Hybrid Peptide Converter              │
│  Convert JW-style presets into structured    │
│  hybrid programs for Spooky2 Remote          │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │  File Upload      │ │ Condition Input   │  │
│  │  (drag & drop)    │ │ (auto-extracted)  │  │
│  └──────────────────┘ └──────────────────┘  │
│                                              │
│  ── Appears after file upload ──             │
│                                              │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │  Frequency Table  │ │ Dwell Mode       │  │
│  │  (checkboxes,     │ │ Selector         │  │
│  │   MW, AA, dwell)  │ │ (A/B + params)   │  │
│  └──────────────────┘ └──────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  API Key Input                           ││
│  │  Claude Research Panel (button + results) ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Phase Editor (tabbed: 1 | 2 | 3 | 4)   ││
│  │  Brainwave toggle                        ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Preset Preview (editable textarea)      ││
│  │  [ Download Preset (.txt) ]              ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### Component Details

| Component | Purpose | Key Features |
|-----------|---------|-------------|
| `FileUpload` | JW preset file input | Drag & drop zone, FileReader API, triggers parser |
| `ConditionInput` | Condition label | Auto-extracted from preset name, user-editable |
| `FrequencyTable` | Amino acid display | Columns: Include, MW, AA Name, Code, Category, Occurrences, Dwell |
| `DwellModeSelector` | Dwell configuration | Radio (Mode A/B), parameter inputs for each mode |
| `ApiKeyInput` | Claude API key | Password field, persisted to localStorage |
| `ClaudeResearchPanel` | LLM research | Trigger button, loading state, results display |
| `PhaseEditor` | 4-phase editing | Tabbed container, per-frequency editing, brainwave toggle |
| `PresetPreview` | Output preview | Large editable textarea showing final preset text |
| `DownloadButton` | File download | Blob + object URL, filename = `{conditionLabel}.txt` |

---

## 16. JW vs Hybrid Format Mapping

| JW Concept | Hybrid Equivalent |
|------------|-------------------|
| 12+ programs with repeated MW chains | 4 named phases, deduplicated |
| Implicit 1s dwell per frequency | Explicit per-frequency dwell (12-600s) |
| Repetition count = importance | Dwell duration = importance |
| `Base_Preset=\JW_Peptides\Shells\Remote` | All settings explicit + force factors |
| One `Loaded_Programs=` per line | ALL programs on ONE line, space-separated |
| One `Loaded_Frequencies=` per line | ALL frequency sets on ONE line, space-separated |
| No force factors | MW/DNA/RNA/mRNA force factors always present |
| No phase structure | Phase 1→2→3→4 sequential |
| `0=4` rest markers | No rest markers, continuous delivery |
| MW values only (amino acids) | MW values + peptide targets + synergists + brainwave Hz |

---

## 17. Verification Plan

### Parse Test
- Load JW sample (e.g., OAB) → verify correct number of programs extracted
- Verify unique MW count and occurrence numbers match manual analysis
- Confirm `0=4` rest markers are discarded

### Classification Test
- All 19 known amino acids resolve correctly from MW lookup
- Unknown MW values (e.g., M146.084, M127.111, M130.056) flagged appropriately

### Dwell Test
- Mode A: Essential/conditional AAs get 60s, non-essential get 12s
- Mode B: Formula correctly applies `base + (occurrences × multiplier)` with clamping

### Output Format Test
- Generated preset matches Spooky2 format: quoted lines, single-line programs/frequencies
- Force factors present and correct
- Template settings intact (227 lines)
- Preset_Notes injected at correct position

### End-to-End Test
- Upload JW file → configure → generate → download
- Verify .txt file is valid Spooky2 preset format

### LLM Test
- Research returns valid JSON with peptide targets, synergists, brainwave frequencies
- Results correctly populate Phases 3 and 4
- All LLM-generated entries are editable

---

## 18. Future Roadmap

### Phase 2: Multi-Generator Architecture (Documented Only)

| Generator | Role | Description |
|-----------|------|-------------|
| Gen 1 | Precursor field | Continuous amino acid supply |
| Gen 2 | Assembly signal | Ignition repeating |
| Gen 3 | Peptide anchor | Primary long dwell |
| Gen 4 | CNS stabilizer | Optional |

### Advanced Adaptive System (Future)

1. Scan amino acid set
2. Detect strongest resonance
3. Auto-prioritize dwell dynamically
4. Dynamic peptide locking

This would become a responsive peptide construction engine.

### Potential Enhancements

- Batch conversion mode (multiple JW presets at once)
- Preset library / history
- Export to multiple Spooky2 formats
- Frequency conflict detection
- Phase timing visualization
- Comparison view (JW original vs hybrid output)

---

## End of V1.0 Specification
