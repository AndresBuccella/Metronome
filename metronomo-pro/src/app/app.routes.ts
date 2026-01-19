import { Routes } from '@angular/router';
import { TestMetronomeComponent } from './test-metronome/test-metronome.component';

export const routes: Routes = [
  { path: '', component: TestMetronomeComponent },
  { path: '**', redirectTo: '' }
];