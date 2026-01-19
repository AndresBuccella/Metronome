import { Injectable, signal } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
    providedIn: 'root'
})
export class SoundLibraryService {

    private clickPlayer?: Tone.Player
    private accentPlayer?: Tone.Player;
    private isReady = signal<boolean>(false);

    constructor() {
        this.loadDefaultSounds();
    }

    /**
     * Obtiene el player de click actual.
     * AudioEngine lo usa para reproducir en tiempo exacto.
     */
    public getClickPlayer(): Tone.Player | undefined {
        return this.clickPlayer;
    }

    /**
     * Obtiene el player de acento.
     */
    public getAccentPlayer(): Tone.Player | undefined {
        return this.accentPlayer;
    }

    public async waitUntilReady(): Promise<void> {
        if (this.isReady()) return;

        await this.loadDefaultSounds();
        this.isReady.set(true);
    }

    public getIsReady(): boolean {
        return this.isReady();
    }
    /**
     * Precarga los sonidos por defecto.
     */
    private async loadDefaultSounds(): Promise<void> {

        await this.loadSound('beat-primario');

        console.log('🔊 Sintetizador creado');
    }

    // ============================================
    // MÉTODOS PÚBLICOS - Gestión de Sonidos
    // ============================================
    /**
     * Carga un tipo de sonido específico.
     * Los sonidos deben estar en public/sounds/
     * 
     * @param soundType - Tipo de sonido ('beat-primario', 'beat-secundario', 'beat-corchea')
     */
    public async loadSound(soundType: string): Promise<void> {
        try {
            const soundPath = `/sounds/${soundType}.wav`;

            // Disponer del player anterior si existe
            if (this.clickPlayer) {
                this.clickPlayer.dispose();
            }

            // Crear nuevo player
            this.clickPlayer = new Tone.Player(soundPath).toDestination();

            // Esperar a que se cargue
            await Tone.loaded();

            console.log(`🔊 Sonido cargado: ${soundType}`);
        } catch (error) {
            console.error(`❌ Error cargando sonido ${soundType}:`, error);
            throw error;
        }
    }

    /**
     * Establece el volumen maestro del metrónomo.
     * @param volume - Volumen en dB (-60 a 0, donde 0 es máximo)
     */
    public setMasterVolume(volume: number): void {
        // Tone.js usa dB, convertir de 0-100 a -60 a 0
        const volumeDB = (volume / 100) * 60 - 60;
        Tone.getDestination().volume.value = volumeDB;
    }

    /**
     * Limpia recursos al destruir el servicio.
     */
    public dispose(): void {

        if (this.clickPlayer) {
            this.clickPlayer.dispose();
        }

        if (this.accentPlayer) {
            this.accentPlayer.dispose();
        }

        console.log('🧹 Sound Library limpiado');
    }

}