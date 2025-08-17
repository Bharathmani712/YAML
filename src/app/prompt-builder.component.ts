import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from './material.module';
import { OPTIONS, PromptModel, PromptType, defaultModel } from './prompt-schemas';
import { YamlService } from './yaml.service';
import { YamlPreviewComponent } from './yaml-preview.component';

@Component({
  selector: 'app-prompt-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, YamlPreviewComponent],
  templateUrl: './prompt-builder.component.html',
  styleUrls: ['./prompt-builder.component.scss']
})
export class PromptBuilderComponent {
  options = OPTIONS;
  form: FormGroup;
  yaml = signal('');

  presets: { label: string; patch: Partial<PromptModel> }[] = [
    {
      label: 'Subtitle Page • Photoreal Corridor + Sora cameo',
      patch: {
        promptType: 'Subtitle Page (Photoreal)',
        style: 'photoreal',
        mood: 'policy-brief',
        background: 'Indian secondary school corridor at dismissal',
        camera: 'medium shot',
        lighting: 'golden hour',
        composition: 'shallow depth of field',
        includeSoraCameo: true,
        rationale: 'Sets tone (calm, institutional, credible) and introduces Sora.'
      }
    },
    {
      label: 'Character Sheet • Sora Kite (non-human narrator)',
      patch: {
        promptType: 'Character Sheet: Sora Kite',
        style: 'photoreal',
        mood: 'neutral',
        background: 'Plain color backdrop (title page)',
        camera: 'close-up',
        lighting: 'soft natural light',
        composition: 'centered',
        includeSoraCameo: true
      }
    },
    {
      label: 'Dialogue Panel • Club room circle (rights foundation)',
      patch: {
        promptType: 'Dialogue Panel',
        background: 'Club room circle seating',
        style: 'photoreal',
        mood: 'uplifting',
        camera: 'medium shot',
        composition: 'rule of thirds',
        lighting: 'bright classroom',
        dialogue: [
          { speaker: 'Ms. Asha', line: 'Our School Health & Wellness program builds life skills—respect, boundaries, mental health, and how to get help.' },
          { speaker: 'Meera', line: 'It’s good to know where to go if something feels unsafe.' }
        ],
        caption: 'Rights-anchored foundation.'
      }
    },
    {
      label: '3D Foreground Text • Company Tagline',
      patch: {
        promptType: '3D Foreground Text',
        style: 'poster',
        background: 'Plain color backdrop (title page)',
        text3d: { text: 'Every child • Every right • Everywhere', bevel: TrueBool, extrude: 'high', material: 'matte', alignment: 'center' }
      }
    }
  ];

  constructor(private fb: FormBuilder, private yamlSvc: YamlService) {
    const m = defaultModel();
    this.form = this.fb.group({
      topic: [m.topic, [Validators.required, Validators.minLength(3)]],
      promptType: [m.promptType, Validators.required],
      title: [m.title],
      subtitle: [m.subtitle],
      caption: [m.caption],
      includeSoraCameo: [m.includeSoraCameo],
      rationale: [m.rationale],

      mood: [m.mood],
      aspect_ratio: [m.aspect_ratio],
      style: [m.style],
      camera: [m.camera],
      lighting: [m.lighting],
      composition: [m.composition],
      background: [m.background],

      characters: this.fb.array<string>([]),
      dialogue: this.fb.array<FormGroup>([]),
      text_overlays: this.fb.array<FormGroup>([]),
      safeguards: [m.safeguards],

      text3d: this.fb.group({
        text: [m.text3d?.text || ''],
        bevel: [m.text3d?.bevel ?? true],
        extrude: [m.text3d?.extrude || 'medium'],
        material: [m.text3d?.material || 'matte'],
        alignment: [m.text3d?.alignment || 'center'],
      })
    });

    this.form.valueChanges.subscribe(() => this.updateYaml());
    this.updateYaml();
  }

  get charactersFA(): FormArray<FormControl<string>> { return this.form.get('characters') as  FormArray<FormControl<string>>; }
  get dialogueFA(): FormArray<FormGroup> { return this.form.get('dialogue') as FormArray<FormGroup>; }
  get overlaysFA(): FormArray<FormGroup>{ return this.form.get('text_overlays') as FormArray<FormGroup>; }
  get text3dFG(): FormGroup {
  return this.form.get('text3d') as FormGroup;
   }
  addCharacter() { this.charactersFA.push(new FormControl<string>('', { nonNullable: true }));}
  removeCharacter(i: number) { this.charactersFA.removeAt(i); }

  addDialogue() { this.dialogueFA.push(this.fb.group({ speaker: [''], line: [''] })); }
  removeDialogue(i: number) { this.dialogueFA.removeAt(i); }

  addOverlay() { this.overlaysFA.push(this.fb.group({ text: [''], position: [''], style: [''] })); }
  removeOverlay(i: number) { this.overlaysFA.removeAt(i); }

  applyPreset(patch: Partial<PromptModel>) {
    this.form.patchValue(patch);
    // reset arrays if provided in patch
    if (patch.dialogue) {
      this.dialogueFA.clear();
      patch.dialogue.forEach(d => this.dialogueFA.push(this.fb.group({ speaker: [d.speaker], line: [d.line] })));
    }
  }

  insertSoraReusable() {
    const caption = this.form.get('caption')?.value || '';
    const cameo = this.options.soraCameoReusable;
    this.form.patchValue({ caption: caption ? caption + "\n" + cameo : cameo });
  }

  updateYaml() {
    const model = this.form.getRawValue() as PromptModel;
    this.yaml.set(this.yamlSvc.buildYaml(model));
  }
}

const TrueBool = true;
