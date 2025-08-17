import { Routes } from '@angular/router';
import { PromptBuilderComponent } from './prompt-builder.component';

export const routes: Routes = [
  { path: '', component: PromptBuilderComponent },
  { path: '**', redirectTo: '' }
];