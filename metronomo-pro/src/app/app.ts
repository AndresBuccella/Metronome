import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestMetronomeComponent } from "./test-metronome/test-metronome.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestMetronomeComponent, TestMetronomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('metronomo-pro');
}
