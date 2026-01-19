import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RhythmEngineService {
  
  // ============================================
  // PROPIEDADES
  // ============================================
  
  // PISTA: Necesitás guardar el compás actual (ej: 4/4, 3/4, 6/8)
  // Investigá: ¿Qué datos necesita un compás? (numerador, denominador, ¿es compuesto?)
  
  // PISTA: Necesitás un contador de beat actual (1, 2, 3, 4...)
  // Investigá: ¿Signal o variable privada? ¿Por qué?
  
  // PISTA: Necesitás saber qué subdivisión está activa (corcheas, tresillos, semicorcheas)
  // Investigá: ¿Enum? ¿String literal type? ¿Cuál es mejor?
  
  // PISTA: Necesitás un patrón de acentos (ej: [true, false, false, false] para 4/4)
  // Investigá: ¿Array de booleans? ¿Cómo representar acentos personalizados?

  constructor() {
    // PISTA: Inicializá con valores por defecto (4/4, sin subdivisión, acento en primer tiempo)
  }

  // ============================================
  // MÉTODOS PÚBLICOS - Time Signature
  // ============================================

  /**
   * Establece el compás actual.
   * PISTAS DE INVESTIGACIÓN:
   * - ¿Cómo validar que el compás sea válido? (no aceptar 0/4 o 4/0)
   * - ¿Qué compases son "compuestos"? (pista: 6/8, 9/8, 12/8)
   * - ¿Cómo detectar si es compuesto? (pista: numerador divisible por 3 y mayor a 3)
   * - Al cambiar el compás, ¿hay que resetear el beat actual a 1?
   */
  
      /**
       * Establece el compás (time signature).
       * Por ahora solo guarda el valor, la lógica de beats
       * la maneja RhythmEngineService.
       * 
       * @param numerator - Numerador del compás (ej: 4 en 4/4)
       * @param denominator - Denominador del compás (ej: 4 en 4/4)
       */
      public setTimeSignature(numerator: number, denominator: number): void {
          // El Transport de Tone.js usa "n" para representar subdivisiones
          // Por ejemplo: "4n" = negra, "8n" = corchea
          const noteValue = `${denominator}n` as Tone.Unit.Time;
  
          this.transport.timeSignature = numerator;
  
          console.log(`📊 Time signature establecido: ${numerator}/${denominator}`);
  
          // Si está sonando, recrear el loop con el nuevo compás
          if (this.isPlaying()) {
              this.stop();
              this.start();
          }
      }
  

  /**
   * Obtiene el compás actual.
   * PISTA: Devolver un objeto con { numerator, denominator, isCompound }
   */
  public getTimeSignature(): any {
    // TODO: Tu código aquí
  }

  // ============================================
  // MÉTODOS PÚBLICOS - Beat Tracking
  // ============================================

  /**
   * Avanza al siguiente beat.
   * PISTAS DE INVESTIGACIÓN:
   * - Si estás en beat 4 de un 4/4, el siguiente es...? (pista: vuelve a 1)
   * - ¿Cómo manejar compases de 3/4? ¿Y 5/4?
   * - ¿Deberías emitir un evento cuando cambia el beat? (para que la UI se actualice)
   * - Investigá: RxJS Subject vs Signal para esto
   */
  public advanceBeat(): void {
    // TODO: Tu código aquí
  }

  /**
   * Obtiene el número del beat actual (1-indexed).
   * PISTA: Los músicos cuentan desde 1, no desde 0. Ojo con esto.
   */
  public getCurrentBeat(): number {
    // TODO: Tu código aquí
  }

  /**
   * Resetea el beat a 1.
   * PISTA: ¿Cuándo se usa esto? (al detener el metrónomo, al cambiar compás)
   */
  public resetBeat(): void {
    // TODO: Tu código aquí
  }

  // ============================================
  // MÉTODOS PÚBLICOS - Acentos
  // ============================================

  /**
   * Determina si el beat actual debe ser acentuado.
   * PISTAS DE INVESTIGACIÓN:
   * - En 4/4: solo el beat 1 está acentuado (patrón básico)
   * - En 3/4: solo el beat 1 (vals)
   * - En 6/8: beats 1 y 4 están acentuados (compás compuesto)
   * - En 5/4: ¿beats 1 y 4? (depende del estilo, investigá)
   * - Investigá: ¿Cómo se acentúan compases compuestos vs simples?
   * 
   * @param beatNumber - Número del beat (1-indexed)
   */
  public isAccentedBeat(beatNumber: number): boolean {
    // TODO: Tu código aquí
    // PISTA: Usá un switch o map según el tipo de compás
  }

  /**
   * Permite establecer un patrón de acentos personalizado.
   * PISTAS DE INVESTIGACIÓN:
   * - ¿Cómo validar que el array tenga la longitud correcta? (debe coincidir con numerador)
   * - Ejemplo: [true, false, true, false] para acentuar beats 1 y 3 en 4/4
   * - ¿Deberías guardar este patrón o calcular acentos automáticamente?
   */
  public setAccentPattern(pattern: boolean[]): void {
    // TODO: Tu código aquí
  }

  // ============================================
  // MÉTODOS PÚBLICOS - Subdivisiones
  // ============================================

  /**
   * Establece la subdivisión activa.
   * PISTAS DE INVESTIGACIÓN:
   * - Subdivisiones: NONE, EIGHTH (corcheas), TRIPLET (tresillos), SIXTEENTH (semicorcheas)
   * - ¿Cómo calcular cuántas subdivisiones hay por beat?
   *   - EIGHTH: 2 por beat
   *   - TRIPLET: 3 por beat
   *   - SIXTEENTH: 4 por beat
   * - Investigá: En compases compuestos (6/8), ¿cambia el cálculo?
   */
  public setSubdivision(subdivision: string): void {
    // TODO: Tu código aquí
  }

  /**
   * Obtiene el número de subdivisiones por beat.
   * PISTAS DE INVESTIGACIÓN:
   * - Si subdivisión es NONE: return 1
   * - Si es EIGHTH: return 2
   * - Si es TRIPLET: return 3
   * - Si es SIXTEENTH: return 4
   * - CUIDADO: En 6/8, la "unidad" es la corchea, no la negra. Investigá cómo afecta esto.
   */
  public getSubdivisionsPerBeat(): number {
    // TODO: Tu código aquí
  }

  // ============================================
  // MÉTODOS PRIVADOS - Helpers
  // ============================================

  /**
   * Calcula el patrón de acentos automático según el compás.
   * PISTAS DE INVESTIGACIÓN:
   * - 2/4: [true, false]
   * - 3/4: [true, false, false]
   * - 4/4: [true, false, false, false]
   * - 6/8: [true, false, false, true, false, false] (acentos en 1 y 4)
   * - 5/4: [true, false, false, true, false] (agrupación 3+2, investigá otras agrupaciones)
   * - 7/8: ¿[true, false, true, false, true, false, false]? (2+2+3, investigá)
   * 
   * Investigá compases asimétricos y cómo se agrupan.
   */
  private calculateAccentPattern(): boolean[] {
    // TODO: Tu código aquí
  }

  /**
   * Determina si un compás es compuesto.
   * PISTAS DE INVESTIGACIÓN:
   * - Compás compuesto: numerador divisible por 3 Y mayor a 3
   * - Ejemplos: 6/8, 9/8, 12/8 son compuestos
   * - Pero 3/4 NO es compuesto (aunque el numerador es 3)
   * - ¿Por qué? Investigá la diferencia entre "ternario" y "compuesto"
   */
  private isCompoundMeter(): boolean {
    // TODO: Tu código aquí
  }

  /**
   * Obtiene el número total de beats en el compás.
   * PISTA: En la mayoría de casos es el numerador, pero...
   * ¿Qué pasa en 6/8? ¿Son 6 beats o 2? (investigá)
   */
  public getBeatsInMeasure(): number {
    // TODO: Tu código aquí
  }
}