from PySide6.QtWidgets import (
    QMainWindow, QWidget, QPushButton, QVBoxLayout
)
from PySide6.QtCore import QTimer
import queue

from core.metronome_engine import Metronome_Engine
from audio.audio_beat import Audio_Beat
from core.metronome_controller import Metronome_Controller

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Metronome Prototype")

        # 🔑 infraestructura
        self.tick_queue = queue.Queue(maxsize=1)
        self.engine = Metronome_Engine(bpm=120, out_queue=self.tick_queue)
        self.controller = Metronome_Controller(beats_per_bar=4)
        self.audio = Audio_Beat("assets/sounds/beat-primario.wav",
                                "assets/sounds/beat-secundario.wav")

        # UI
        self.play_btn = QPushButton("Play")
        self.play_btn.clicked.connect(self.toggle)

        layout = QVBoxLayout()
        layout.addWidget(self.play_btn)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        # 🔄 timer UI
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.process_ticks)
        self.timer.start(5)

        self.running = False

    def toggle(self):
        if not self.running:
            self.engine.start()
            self.play_btn.setText("Stop")
            self.controller.reset()

        else:
            self.engine.stop()
            self.play_btn.setText("Play")

        self.running = not self.running

    def process_ticks(self):
        try:
            self.tick_queue.get_nowait()
            accent = self.controller.next_beat()
            self.audio.play(accent)
        except queue.Empty:
            pass

    def closeEvent(self, event):
        self.engine.stop()
        event.accept()

    def change_time_signature(self, beats):
        self.controller.set_time_signature(beats)

    def change_bpm(self, bpm):
        self.engine.set_bpm(bpm)