import { Injectable, signal } from '@angular/core';
import * as Tone from 'tone';
import { SoundLibraryService } from './sound-library.service';

@Injectable({
    providedIn: 'root'
})
export class AudioEngineService {
    // ============================================
    // PROPIEDADES PRIVADAS
    // ============================================

    private transport: ReturnType<typeof Tone.getTransport> = Tone.getTransport();
    private mainLoop?: Tone.Loop;

    // Señales para el estado (Zoneless Angular)
    public isPlaying = signal<boolean>(false);
    public currentBPM = signal<number>(120);
    public isInitialized = signal<boolean>(false);

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(private soundLibrary: SoundLibraryService) {
        // Configuración inicial de Tone.js
        this.transport.bpm.value = 120;
    }

    // ============================================
    // MÉTODOS PÚBLICOS - Ciclo de Vida
    // ============================================

    /**
     * Inicializa el motor de audio.
     * DEBE llamarse antes de start() para activar el contexto de audio.
     * Precarga los sonidos básicos.
     */
    public async initialize(): Promise<void> {
        try {
            // Activar contexto de audio (requerido por navegadores)
            await Tone.start();
            console.log('🎵 Contexto de audio iniciado');

            //Esperar a que la librería de sonidos esté lista
            await this.soundLibrary.waitUntilReady();

            this.isInitialized.set(true);
        } catch (error) {
            console.error('❌ Error al inicializar audio:', error);
            throw error;
        }
    }

    /**
     * Inicia el metrónomo.
     * Crea el loop principal y arranca el Transport.
     */
    public start(): void {
        if (!this.isInitialized()) {
            throw new Error('AudioEngine no inicializado. Llama a initialize() primero.');
        }

        if (this.isPlaying()) {
            console.warn('⚠️ El metrónomo ya está sonando');
            return;
        }

        // Crear el loop principal
        this.createMainLoop();

        // Arrancar el Transport de Tone.js
        this.transport.start();
        this.isPlaying.set(true);

        console.log('▶️ Metrónomo iniciado');
    }

    /**
     * Detiene el metrónomo.
     * Limpia el loop y pausa el Transport.
     */
    public stop(): void {
        if (!this.isPlaying()) {
            return;
        }

        // Detener Transport
        this.transport.stop();

        // Limpiar loop
        if (this.mainLoop) {
            this.mainLoop.dispose();
            this.mainLoop = undefined;
        }

        this.isPlaying.set(false);
        console.log('⏹️ Metrónomo detenido');
    }

    // ============================================
    // MÉTODOS PÚBLICOS - Configuración
    // ============================================

    /**
     * Establece el BPM del metrónomo.
     * @param bpm - Tempo en beats por minuto (10-300)
     */
    public setBPM(bpm: number): void {
        // Validación de rango
        const clampedBPM = Math.max(10, Math.min(300, bpm));

        // Actualizar Transport de Tone.js
        this.transport.bpm.value = clampedBPM;

        // Actualizar señal
        this.currentBPM.set(clampedBPM);

        console.log(`🎚️ BPM establecido: ${clampedBPM}`);
    }

    /**
     * Cambia el BPM de forma incremental (con interpolación suave).
     * @param bpm - Nuevo BPM
     * @param rampTime - Tiempo de transición en segundos (default: 0.5)
     */
    public setBPMSmooth(bpm: number, rampTime: number = 0.5): void {
        const clampedBPM = Math.max(10, Math.min(300, bpm));

        // Interpolación suave usando rampTo de Tone.js
        this.transport.bpm.rampTo(clampedBPM, rampTime);

        this.currentBPM.set(clampedBPM);
    }


    // ============================================
    // MÉTODOS PRIVADOS - Core del Motor
    // ============================================

    /**
     * Crea el loop principal que ejecuta los clicks.
     * Se ejecuta en cada beat del compás.
     */
    private createMainLoop(): void {
        // Callback que se ejecuta en cada beat
        const callback = (time: Tone.Unit.Time) => {
            this.scheduleClick(time);
        };

        // Crear loop con intervalo de "4n" (negra)
        // Esto se ejecutará 1 vez por beat
        this.mainLoop = new Tone.Loop(callback, '4n');
        this.mainLoop.start(0);
    }

    /**
     * Programa un click en un tiempo específico.
     * Aquí es donde se reproduce el sonido.
     * 
     * @param time - Tiempo exacto en el que debe sonar (AudioContext time)
     */
    private scheduleClick(time: Tone.Unit.Time): void {
        const player = this.soundLibrary.getClickPlayer();
        if (!player) {
            console.warn('⚠️ No hay sonido cargado');
            return;
        }
        // Reproducir el click en el tiempo EXACTO especificado
        // Esto garantiza precisión milisegunda
        player.start(time);

        // TODO: Aquí consultarás a RhythmEngineService
        // para saber si este beat debe ser acentuado
        // y usar accentPlayer en vez de clickPlayer

        // Tocar nota directamente
        //const synth = new Tone.Synth().toDestination();
        //synth.triggerAttackRelease('C5', '32n', time);
    }


    /**
     * Calcula y compensa la latencia del sistema.
     * Útil para sincronización perfecta.
     * 
     * @returns Latencia en segundos
     */
    private compensateLatency(): number {
        // Tone.js ya maneja esto internamente con "lookAhead"
        // pero puedes ajustarlo si es necesario
        return Tone.getContext().lookAhead;
    }

    // ============================================
    // CLEANUP
    // ============================================

    /**
     * Limpia recursos al destruir el servicio.
     */
    public dispose(): void {
        this.stop();
        this.soundLibrary.dispose();

        console.log('🧹 AudioEngine limpiado');
    }
}