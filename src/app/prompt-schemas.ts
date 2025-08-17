export type PromptType =
  | 'Title Page (Text-only Poster)'
  | 'Subtitle Page (Photoreal)'
  | 'Character Sheet: Sora Kite'
  | 'Character Sheet: Pixar Student'
  | 'Scene: Photoreal Classroom'
  | 'Dialogue Panel'
  | 'Expression & Pose Sheet'
  | '3D Foreground Text';

export interface PromptModel {
  topic: string;
  promptType: PromptType;
  title?: string;
  subtitle?: string;
  caption?: string;
  dialogue?: { speaker: string; line: string; }[];
  characters?: string[];
  includeSoraCameo?: boolean;
  rationale?: string;
  mood?: string;
  aspect_ratio?: string;
  style?: string;
  camera?: string;
  lighting?: string;
  composition?: string;
  depth_of_field?: string;
  background?: string;
  text_overlays?: { text: string; position?: string; style?: string }[];
  safeguards?: string[];
  // 3D text specific
  text3d?: { text: string; bevel?: boolean; extrude?: string; material?: string; alignment?: string; };
}

export const OPTIONS = {
  aspectRatios: ['3:2', '16:9', '4:3', '1:1', '9:16'],
  moods: ['calm', 'documentary', 'policy-brief', 'uplifting', 'serious', 'neutral'],
  styles: ['photoreal', 'Pixar-style 3D', 'studio portrait', 'documentary realism', 'poster'],
  cameras: ['close-up', 'medium shot', 'wide shot', 'over-the-shoulder', 'establishing'],
  lighting: ['soft natural light', 'golden hour', 'bright classroom', 'overcast softbox', 'dramatic rim light'],
  composition: ['rule of thirds', 'centered', 'leading lines', 'shallow depth of field', 'symmetry'],
  background: [
    'Indian secondary school corridor at dismissal',
    'Classroom with posters blurred',
    'Principal office',
    'Club room circle seating',
    'Plain color backdrop (title page)'
  ],
  safeguardsBase: [
    'no text in image', 'no logos', 'no watermarks',
    'no touching between adult/minor', 'respectful distance',
    'classroom/home/public settings only', 'everyday attire only'
  ],
  soraCameoReusable: 'photoreal close-up of a handcrafted paper-kite puppet named Sora, handloom paper texture, tiny embroidered eyes, short cotton string tail, small metal clipboard attached; soft natural light; Indian school/office setting; 3:2 landscape; documentary realism; no text, no logos, no watermarks'
} as const;

export function defaultModel(): PromptModel {
  return {
    topic: '',
    promptType: 'Subtitle Page (Photoreal)',
    title: '',
    subtitle: '',
    caption: '',
    dialogue: [],
    characters: [],
    includeSoraCameo: false,
    rationale: 'Sets tone (calm, institutional, credible).',
    mood: 'policy-brief',
    aspect_ratio: '3:2',
    style: 'photoreal',
    camera: 'medium shot',
    lighting: 'soft natural light',
    composition: 'shallow depth of field',
    background: 'Indian secondary school corridor at dismissal',
    text_overlays: [],
    safeguards: [...OPTIONS.safeguardsBase],
    text3d: { text: '', bevel: TrueBool, extrude: 'medium', material: 'matte', alignment: 'center' }
  };
}

// Helper const because Angular template booleans sometimes stringify
const TrueBool = true;