import time, threading, queue

class MetronomeEngine:
    def __init__(self, bpm: int, interval, out_queue: queue.Queue):
        self.interval = 60 / bpm * interval
        self.queue = out_queue
        self.running = False
    
    def set_bpm(self, interval, bpm: int):
        self.interval = 60 / bpm * interval

    def start(self):
        if self.running:
            return
        self.running = True
        threading.Thread(target=self._run, daemon=True).start()

    def stop(self):
        self.running = False

    def _run(self):
        next_tick = time.perf_counter()
        while self.running:
            sleep = next_tick - time.perf_counter()
            if sleep > 0:
                time.sleep(sleep)

            if not self.queue.full():
            # 🔑 solo emite el evento
                self.queue.put_nowait("tick")

            next_tick += self.interval
