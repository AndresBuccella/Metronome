class Metronome_Controller:
    def __init__(self, beats_per_bar: int):
        self.beats_per_bar = beats_per_bar
        self.current_beat = 0

    def next_beat(self) -> bool:
        """
        Devuelve True si es acento (primer tiempo)
        """
        accent = self.current_beat == 0
        self.current_beat = (self.current_beat + 1) % self.beats_per_bar
        return accent
    
    def set_time_signature(self, beats_per_bar: int):
        self.beats_per_bar = beats_per_bar
        self.reset()

    def reset(self):
        self.current_beat = 0