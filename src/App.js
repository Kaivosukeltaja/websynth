import { useRef, useEffect } from 'react';

import Keyboard from './components/Keyboard';
import PresetSelector from './components/PresetSelector';
import Synth from './audio/Synth';
import presets from './audio/presets';

import './App.css';
const AudioContext = window.AudioContext || window.webkitAudioContext;

function App() {
  const audioContextRef = useRef();
  const synthRef = useRef();

  const keyUpHandler = (note) => {
    synthRef.current.keyUp(note);
  }

  const keyDownHandler = (note, freq) => {
    synthRef.current.keyDown(note, freq);
  }

  const loadPreset = (preset) => {
    synthRef.current.loadPreset(preset);
  }

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const synth = new Synth(audioContext);
    synthRef.current = synth;
    synth.loadPreset(presets[0]);

    return synth.disconnect;
  }, [])

  return (
    <div className="App">
      <h1>Callisto Polysynth</h1>
      <div className="Keyboard">
        <Keyboard keyDown={keyDownHandler} keyUp={keyUpHandler} />
      </div>
      <div className="Presets">
        { presets.map((preset) => (
          <PresetSelector preset={preset} key={preset.id} onSelect={loadPreset} />
        ))}
      </div>
      <div className="Instructions">
        Play the synth with the mouse or keyboard.<br />
        ASDFG... = white keys, WETYUOP = black keys.<br />
        Try the presets for different sounds.<br />
        Check out the code in <a href="https://github.com/Kaivosukeltaja/websynth">GitHub</a>!<br />
        <a href="https://stuartmemo.com/qwerty-hancock/">Qwerty Hancock</a> by Stuart Memo, used under MIT license.
      </div>
    </div>
  );
}

export default App;
