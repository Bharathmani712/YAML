import { Component, Input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-yaml-preview',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './yaml-preview.component.html',
  styleUrls: ['./yaml-preview.component.scss']
})
export class YamlPreviewComponent {
  @Input({ required: true }) yamlText = '';
  copied = signal(false);

  copy() {
    navigator.clipboard.writeText(this.yamlText || '').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  download() {
    const blob = new Blob([this.yamlText || ''], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sora_prompt.yaml';
    a.click();
    URL.revokeObjectURL(url);
  }
}