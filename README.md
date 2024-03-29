# websynth
Webaudio based polyphonic synthesizer with presets

## What's this thing?
It's an experiment I built around 2016 with a goal of creating a modular synth using the Web Audio API. 
The code was migrated to React in 2023. The project uses the [Qwerty Hancock](https://stuartmemo.com/qwerty-hancock/) keyboard by Stuart Memo, released under the MIT license.

## How do I run it?
1. Clone the repository to your computer: `git clone git@github.com:Kaivosukeltaja/websynth.git`
2. Go to the directory `cd websynth`
3. Run `npm install` to install the dependencies
4. Run `npm start` and access the service on http://localhost:3000.

## What does it do?
It's a synth with two presets: a very simple sine wave and a nice trance pad with 5 detuned sawtooth oscillators. You can play it with the on-screen keyboard
or your computer keyboard using the top two rows (QWERTY and ASDFG). Change the sounds by clicking either of the two presets.

## How does it work?
I might write a more thorough explanation some day but in a nutshell it creates a bunch of audio nodes for the oscillators, gain, reverb, delay, filter and so on.
Then it connects them together like a modular synthesizer. When you load a preset, it automatically creates the required bunch of oscillators for you.
When you play on the keyboard, it creates and plays the oscillator(s) and ramps them down as you release the keys.

## Do you accept Pull Requests?
Absolutely! I'd be happy to get any kind of changes, including but not limited to:
- Nicer UI
- Cleaning up the code
- Adding tests
- More cool sounds
- Tweakable knobs for the filters, detuning, ADSR, etc
- Smarter way to handle the oscillators
- Vocoder feature would be sooooo cool 🤖🥰
