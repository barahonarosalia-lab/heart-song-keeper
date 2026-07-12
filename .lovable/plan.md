# Story Intake Wizard — Staged Rebuild

All work in `src/pages/Start.tsx`. Voice/Memory paths are untouched.

## Routing

After the tier picker sets `order.tier`:
- `story` → render new `<StoryWizard />` in place of the current Story Step 2 block (occasion + song_version). Existing Steps 3+ (product, card, shipping, review) remain and mount once the wizard's final "Continue" is pressed.
- `voice` | `memory` → render the existing untouched Step 2 block and downstream flow exactly as today.

A local `storyWizardComplete` boolean gates the existing Step 3 reveal for Story, mirroring how `step2Complete` gates it for Voice/Memory. `song_version` is no longer required for Story (drops out of the flow, as it's not in the spec's reused-fields list).

## Wizard shell (reusable, but only Story wired now)

```
┌──────────────────────────────────────────┐
│  Step 3 of 6                    [ Back ] │
│                                          │
│         <question heading>               │
│         <question body / inputs>         │
│                                          │
│                          [ Next → ]      │
└──────────────────────────────────────────┘
```

- Container: full-width cream card, navy heading in Playfair Display, gold accent for progress + Next button, matching existing `Step`/`OccasionCard` visual language.
- One step visible at a time; fade+slide transition via `animate-in fade-in slide-in-from-bottom-2`.
- Back disabled on step 1; Next disabled until `isValid(currentStep)` returns true.
- State: `const [wizardStep, setWizardStep] = useState(1)` scoped to the wizard component.
- Accepts an array of step descriptors `{ title, render, isValid }` so Voice/Memory can plug in later without touching the shell.

## Story steps (in order)

1. **Relationship** — chip grid using existing chip styling. Options: Husband, Wife, Partner, Girlfriend, Boyfriend, Son, Daughter, Fiancé, Father, Mother, Grandparent, Grandson, Granddaughter, Sibling, Friend, Myself, Other. Writes `relationship`. Valid when non-empty.
2. **Recipient name** — single text input. Writes `recipient_name`. Valid when trimmed length > 0.
3. **Occasion** — reuse `OCCASIONS` array as chips + a "Something else" chip that, when active, reveals a text input. Whatever the user selects/types is written directly to `occasion`. Valid when `occasion.trim()` non-empty.
4. **Genre + voice** — two chip pickers stacked on one screen.
   - Genre chips → `music_style_preference`. Options: Pop, Country, Rock, R&B, Jazz, Acoustic, Rap/Hip-Hop, Indie, Latin, Worship, Reggaeton, Reggae.
   - Voice chips → `voice_preference`. Options: Male, Female, Surprise Me. "Surprise Me" is stored as the literal `"surprise"` UI selection so the chip stays highlighted; it is resolved to `"male"`/`"female"` only at payload build time (see helper below).
   - Valid when both selected.
5. **Story content** — three stacked textareas on one screen writing `story_who` ("What makes them special?"), `story_memory` ("Share a favorite memory"), `story_feeling` ("A message from your heart"), plus a checkbox "Use their name in the lyrics" bound to `use_name_in_lyrics` (default false). Valid when all three textareas have non-empty trimmed content (checkbox optional).
6. **Continue bridge** — small confirmation screen ("You're all set — let's pick their gift") with a single "Continue" button that sets `storyWizardComplete = true`. This reveals the existing Step 3 product picker exactly as it works today; no other logic changes.

Back on step 1 of the wizard returns to the tier picker (same as current "change tier" behavior for Story).

## Surprise-Me resolver

Small helper near `tierPayloadLabel`:

```ts
function resolveVoicePreference(v: VoicePreference | null): "male" | "female" | null {
  if (v === "surprise") return Math.random() < 0.5 ? "male" : "female";
  return v;
}
```

Called inside the existing checkout payload builder (around line 476 where `tierPayloadLabel` is used) to replace `order.voice_preference` in the outbound payload only. UI state remains `"surprise"` so the chip stays selected.

If `VoicePreference` doesn't currently include `"surprise"`, add it to the type union in this file only.

## Guardrails checklist

- No changes to Voice/Memory Step 2 block or their gating (`step2Complete` logic for those tiers is left alone).
- No changes to `PRODUCTS`, pricing, card art, jewelry, ornament, shipping, submit/checkout logic beyond the one-line voice_preference resolve.
- No renames or new persisted fields — only the reused fields listed in the prompt plus a local `wizardStep` and `storyWizardComplete`.
- Existing Story `song_version` UI is removed from the Story path only (Voice/Memory don't use it either, per current code).

## Technical notes

- New components live inside `Start.tsx`: `WizardShell` (generic), `StoryWizard` (Story step definitions + shell usage), `ChipGrid` (thin wrapper around existing chip styling for reuse across steps 1/3/4). No new files.
- Step gating for existing Step 3 becomes `((order.tier === "story" && storyWizardComplete) || ((order.tier === "voice" || "memory") && step2Complete))`.
- Transitions use Tailwind `animate-in` classes already in the project; no new deps.
