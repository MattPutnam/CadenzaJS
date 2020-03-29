# Cadenza (JS version)

This project is a v2 of [the original](https://github.com/MattPutnam/Cadenza), completely redone in Electron+React.

Cadenza is a live MIDI performance manager, designed specifically to handle the large number of patches (and quick patch changes) that most modern musicals call for. It is designed to minimize cost--the software is free to use, and it's designed to require as few outside purchases as possible. If you already have a laptop made this century and a keyboard with MIDI I/O, you're already almost there. If the keyboard has USB MIDI, you just need a USB cable, otherwise you need a MIDI interface (for example the Roland UM-ONE at around $40). If you have a keyboard with built-in sounds that can be selected via MIDI, Cadenza can use that. For more sounds, I recommend picking up a Roland JV-1080, which can be found on eBay for around $200. No MacBook Pro, no expensive VST libraries, no need for fancy keyboards or other equipment. This should handle most shows out there, if they don't have triggered samples or something else that has to be done in software.

Basically, this is a clone of Apple MainStage, aimed at controlling hardware and with the features that are commonly used in musicals.

**Current status**: Pre-release. Mostly done with entering/editing the data. Zero output yet. Minimal hardware support.

## Development

This project uses Yarn. Just run `yarn` to install all packages. Run `yarn electron-dev` to start it.

### Easy ways you can contribute

* Plug in your USB-MIDI keyboard, and tell me what it shows up in the app as. I want to have a feature to auto-detect keyboards based on their MIDI ports.
* Write synth config files for your hardware. Find the manual, look up the MIDI specification, and crib off one of the existing ones in `src/synthesizers`. Let me know if there's something that Cadenza doesn't support. Or just tell me what you'd like to use.
* Contribute a better color scheme. I'm not much of a designer, so my colors are largely cribbed off of MainStage and other apps where I liked their colors.

### More advanced ways you can contribute

* Get webpack working with this project. I can't find the right incantation.

### Features I'm not adding

* Software synthesis. If you need that, use MainStage. Maaaaaybe I'll do triggering individual sound effects.
* Hardcore accessibility. I'm assuming that everyone using this plays keys for musicals, and thus they have good eyesight and dexterity. I *am* doing a little bit of accessibility, but that's only in service of a top-secret feature I'm working on...
