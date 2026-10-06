"""
Narration for the pilot, made with Kokoro (open-source text-to-speech, Apache 2.0),
so it costs nothing and needs no account.

  pip install kokoro-onnx soundfile
  # model files, once, from github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0):
  #   kokoro-v1.0.onnx and voices-v1.0.bin, in KOKORO_DIR (default: this folder's .models/)
  python tts.py

Writes .out/vo/<id>.wav for each line in narration.json and .out/vo.json with
each line's length, which build.mjs uses to time the scenes to the voice.
"""
import json
import os
import pathlib

import soundfile as sf
from kokoro_onnx import Kokoro

here = pathlib.Path(__file__).parent
out = here / ".out" / "vo"
out.mkdir(parents=True, exist_ok=True)
models = pathlib.Path(os.environ.get("KOKORO_DIR", here / ".models"))

script = json.loads((here / "narration.json").read_text(encoding="utf-8"))
kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))

# "voice" is either one voice name, or a blend: {"af_heart": 0.6, "af_nicole": 0.4}.
voice = script["voice"]
if isinstance(voice, dict):
    voice = sum(weight * kokoro.get_voice_style(name) for name, weight in voice.items())

durations = {}
for line in script["lines"]:
    samples, rate = kokoro.create(line["say"], voice=voice, speed=script["speed"], lang=script["lang"])
    sf.write(out / f"{line['id']}.wav", samples, rate)
    durations[line["id"]] = round(len(samples) / rate, 3)
    print(f"{line['id']}: {durations[line['id']]} s")

(here / ".out" / "vo.json").write_text(json.dumps(durations, indent=2))
print(f"total {sum(durations.values()):.1f} s of narration")
