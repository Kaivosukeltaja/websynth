import { useRef, useEffect, useState } from 'react';

import Keyboard from './components/Keyboard';
import PresetSelector from './components/PresetSelector';
import Synth from './audio/Synth';
import presets from './audio/presets';

import './App.css';
const AudioContext = window.AudioContext || window.webkitAudioContext;

const OCTAVE_MIN = -2;
const OCTAVE_MAX = 2;

function App() {
  const audioContextRef = useRef();
  const synthRef = useRef();
  const audioReadyPromiseRef = useRef(null);
  const [octave, setOctave] = useState(0);

  function ensureAudioReady() {
    if (synthRef.current) return Promise.resolve();
    if (audioReadyPromiseRef.current) return audioReadyPromiseRef.current;
    let audioContext = audioContextRef.current;
    if (!audioContext) {
      audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      audioContext.resume(); // must be called synchronously during user gesture (Brave/Chrome)
    }
    audioReadyPromiseRef.current = (async () => {
      await audioContext.resume();
      const synth = new Synth(audioContext);
      synthRef.current = synth;
      synth.loadPreset(presets[0]);
    })();
    return audioReadyPromiseRef.current;
  }

  const keyUpHandler = (note) => {
    if (synthRef.current) synthRef.current.keyUp(note);
  }

  const keyDownHandler = async (note, freq) => {
    await ensureAudioReady();
    const shiftedFreq = freq * Math.pow(2, octave);
    synthRef.current.keyDown(note, shiftedFreq);
  }

  const loadPreset = (preset) => {
    ensureAudioReady().then(() => {
      synthRef.current.loadPreset(preset);
    });
  }

  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.disconnect();
    };
  }, [])

  return (
    <div className="App">
      <h1>Callisto Polysynth</h1>
      <div className="OctaveControl">
        <span className="OctaveLabel">Octave</span>
        <div className="OctaveButtons">
          {Array.from({ length: OCTAVE_MAX - OCTAVE_MIN + 1 }, (_, i) => OCTAVE_MIN + i).map((n) => (
            <button
              key={n}
              type="button"
              className={`OctaveButton ${octave === n ? 'active' : ''}`}
              onClick={() => {
                if (n !== octave) {
                  if (synthRef.current) synthRef.current.allNotesOff();
                  setOctave(n);
                }
              }}
            >
              {n >= 0 ? `+${n}` : n}
            </button>
          ))}
        </div>
      </div>
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
