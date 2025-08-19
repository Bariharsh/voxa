import pvporcupine
import sounddevice as sd
import struct
import os
import subprocess
import sys

print(pvporcupine.KEYWORD_PATHS["porcupine"])

ACCESS_KEY = "eEJvbXHqdSbBlD723DesyttyQEwXJc0XlxbFMSpO2eQr1iVNe/qxOQ=="  

try:
    porcupine = pvporcupine.create(
        access_key=ACCESS_KEY,
        keywords=["porcupine"]  # You can use built-in keywords or custom ones
    )
except Exception as e:
    print("Failed to initialize Porcupine:", e)
    sys.exit(1)

def open_voxa():
    print("Opening Voxa...")
    subprocess.Popen(["start", "voxa.exe"], shell=True)

def audio_callback(indata, frames, time, status):
    if status:
        print("Status:", status)
    pcm = struct.unpack_from("h" * len(indata), indata)
    result = porcupine.process(pcm)
    if result >= 0:
        print("Wake word detected!")
        open_voxa()

def main():
    try:
        with sd.InputStream(
            channels=1,
            samplerate=porcupine.sample_rate,
            dtype='int16',
            blocksize=porcupine.frame_length,
            callback=audio_callback
        ):
            print("🎙 Listening for wake word...")
            while True:
                pass
    except KeyboardInterrupt:
        print("Stopping...")
    finally:
        if porcupine:
            porcupine.delete()

if __name__ == "__main__":
    main()
