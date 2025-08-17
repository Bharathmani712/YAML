import { Injectable } from '@angular/core';
import { dump } from 'js-yaml';
import { PromptModel } from './prompt-schemas';

@Injectable({ providedIn: 'root' })
export class YamlService {
  buildYaml(model: PromptModel): string {
    const obj: any = {
      topic: model.topic || undefined,
      type: model.promptType,
      title: model.title || undefined,
      subtitle: model.subtitle || undefined,
      caption: model.caption || undefined,
      mood: model.mood,
      aspect_ratio: model.aspect_ratio,
      style: model.style,
      camera: model.camera,
      lighting: model.lighting,
      composition: model.composition,
      background: model.background,
      characters: (model.characters && model.characters.length) ? model.characters : undefined,
      dialogue: (model.dialogue && model.dialogue.length) ? model.dialogue : undefined,
      text_overlays: (model.text_overlays && model.text_overlays.length) ? model.text_overlays : undefined,
      include_sora_cameo: model.includeSoraCameo || undefined,
      safeguards: model.safeguards && model.safeguards.length ? model.safeguards : undefined,
      rationale: model.rationale || undefined,
      text3d: model.promptType === '3D Foreground Text' ? model.text3d : undefined
    };

    // Remove undefined keys
    Object.keys(obj).forEach(k => (obj[k] === undefined) && delete obj[k]);

    return dump(obj, { noRefs: true, lineWidth: 120 });
  }
}