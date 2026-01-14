import simpleaudio as sa
class Audio_Beat:
    
    def __init__(self, sound_file="assets/sounds/beat-primario.wav"):
        self.sound_file = sound_file
        self.wave = sa.WaveObject.from_wave_file(self.sound_file)
        
    def play(self):
        self.wave.play()

audio = Audio_Beat()
audio.play()