import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioEngineService } from '../core/services/audio-engine.service';

@Component({
  selector: 'app-test-metronome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; text-align: center; font-family: Arial;">
      <h1>🎵 Test AudioEngine</h1>
      
      <div style="margin: 30px 0;">
        <p>Estado: {{ audioEngine.isInitialized() ? '✅ Inicializado' : '❌ No inicializado' }}</p>
        <p>Reproduciendo: {{ audioEngine.isPlaying() ? '▶️ SÍ' : '⏹️ NO' }}</p>
        <p>BPM: {{ audioEngine.currentBPM() }}</p>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;">
        <button 
          (click)="initialize()" 
          [disabled]="audioEngine.isInitialized()"
          style="padding: 15px 30px; font-size: 16px; cursor: pointer;">
          Inicializar Audio
        </button>

        <button 
          (click)="togglePlay()"
          [disabled]="!audioEngine.isInitialized()"
          style="padding: 15px 30px; font-size: 16px; cursor: pointer;">
          {{ audioEngine.isPlaying() ? 'Detener' : 'Iniciar' }}
        </button>
      </div>

      <div style="margin: 30px 0;">
        <label>BPM: {{ audioEngine.currentBPM() }}</label><br>
        <input 
          type="range" 
          min="10" 
          max="300" 
          [value]="audioEngine.currentBPM()"
          (input)="changeBPM($event)"
          [disabled]="!audioEngine.isInitialized()"
          style="width: 300px; margin-top: 10px;">
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
        <h3>Instrucciones:</h3>
        <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
          <li>Haz click en "Inicializar Audio"</li>
          <li>Haz click en "Iniciar"</li>
          <li>Deberías escuchar un beep cada segundo (120 BPM)</li>
          <li>Mueve el slider para cambiar la velocidad</li>
          <li>Haz click en "Detener" para parar</li>
        </ol>
      </div>
    </div>
  `
})
export class TestMetronomeComponent implements OnInit, OnDestroy {
  
  constructor(public audioEngine: AudioEngineService) {}

  ngOnInit() {
    console.log('🧪 Componente de prueba cargado');
  }

  async initialize() {
    try {
      await this.audioEngine.initialize();
      console.log('✅ AudioEngine inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar:', error);
      alert('Error al inicializar el audio. Revisa la consola.');
    }
  }

  togglePlay() {
    if (this.audioEngine.isPlaying()) {
      this.audioEngine.stop();
    } else {
      this.audioEngine.start();
    }
  }

  changeBPM(event: Event) {
    const target = event.target as HTMLInputElement;
    const bpm = parseInt(target.value);
    this.audioEngine.setBPM(bpm);
  }

  ngOnDestroy() {
    this.audioEngine.dispose();
  }
}