# websynth
Webaudio based polyphonic synthesizer with presets

## What's this thing?
It's an experiment I built around 2016 with a goal of creating a modular synth using the Web Audio API. 
The code is not very nicely structured and it uses a lot of outdated stuff such as Bower but still works
and can be built as long as you can install the necessary dependencies.

## How do I run it?
1. Clone the repository to your computer: `git clone git@github.com:Kaivosukeltaja/websynth.git`
2. Go to the directory `cd websynth`
3. You could try `npm install` but it might fail as it requires Python 2 to build node-sass. PR welcome if you can get it to build! :)
4. Install Bower: `npm install --global bower`
5. Install Bower dependencies: `bower install`
6. If you were able to install npm dependencies, you can run `npm run serve` and access the service on http://localhost:9000.
7. If not, you can serve the root directory with whatever you like. For example: `python3 -m http.server` will make it available for you on https://localhost/app:8000.

## What does it do?
It's a synth with two presets: a very simple sine wave and a nice trance pad with 5 detuned sawtooth oscillators. You can play it with the on-screen keyboard
or your computer keyboard using the top two rows (QWERTY and ASDFG). Change the sounds by clicking either of the two presets.

## How does it work?
I might write a more thorough explanation some day but in a nutshell it creates a bunch of audio nodes for the oscillators, gain, reverb, delay, filter and so on.
Then it connects them together like a modular synthesizer. When you load a preset, it automatically creates the required bunch of oscillators for you.
When you play on the keyboard, it creates and plays the oscillator(s) and ramps them down as you release the keys.

The ADSR envelopes (Attack/Decay/Sustain/Release) weren't part of the Web Audio API at least when I wrote this so I implemented them manually
in `/app/scripts/envelope.js` by creating linear ramps to the gain nodes. Most of the other stuff is handled by browser native functionality.

## Do you accept Pull Requests?
Absolutely! I'd be happy to get any kind of changes, including but not limited to:
- Getting this to build cleanly without extra complexities
- Cleaning up the code
- Modernizing the implementation (ie. get rid of Bower, Gulp and jQuery)
- Make it deployable on Netlify, GitHub Pages or other similar service
- More cool sounds
- Tweakable knobs for the filters, detuning, ADSR, etc
- Smarter way to handle the oscillators
- Vocoder feature would be sooooo cool 🤖🥰
