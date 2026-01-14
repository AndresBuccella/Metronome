from PySide6.QtMultimedia import QSoundEffect
from PySide6.QtCore import QUrl

class Audio_Beat:
    def __init__(self, beat_primario_path: str, beat_secundario_path: str):
        self.beat_primario = QSoundEffect()
        self.beat_primario.setSource(QUrl.fromLocalFile(beat_primario_path))
        self.beat_primario.setVolume(1)

        self.beat_secundario = QSoundEffect()
        self.beat_secundario.setSource(QUrl.fromLocalFile(beat_secundario_path))
        self.beat_secundario.setVolume(0.6)


    def play(self, accent: bool):
        if accent:
            self.beat_primario.play()
        else:
            self.beat_secundario.play()