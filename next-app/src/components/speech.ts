import * as tf from '@tensorflow/tfjs';

class Speech {
  private model: tf.LayersModel;

  constructor() {
    this.model = tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/speech_recognition/model.json');
  }

  async recognizeSpeech() {
    const audioContext = new AudioContext();
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioSource = audioContext.createMediaStreamSource(audioStream);
    const audioBuffer = await audioContext.createBuffer(audioSource, 1024);
    const audioData = await audioBuffer.getChannelData(0);

    const input = tf.tensor2d(audioData, [1, 1024]);
    const output = this.model.predict(input);
    const result = await output.data();

    return result;
  }
}

export default Speech;