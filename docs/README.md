# JSSpeccy 3

A ZX Spectrum emulator for the browser.

This is a personal fork for some customisation also using mods from other forks.

Original version: https://github.com/gasman/jsspeccy3

## Features

* Emulates the Spectrum 48K, Spectrum 128K and Pentagon machines
* Handles all Z80 instructions, documented and undocumented
* Cycle-accurate emulation of scanline / multicolour effects
* AY and beeper audio
* Loads SZX, Z80 and SNA snapshots
* Loads TZX and TAP tape images (via traps only)
* Loads any of the above files from inside a ZIP file
* 100% / 200% / 300% and fullscreen display modes

## Implementation notes

JSSpeccy 3 is a complete rewrite of JSSpeccy to make full use of the web technologies 
and APIs available as of 2021 for high-performance web apps. The emulation runs in a 
Web Worker, freeing up the UI thread to handle screen and audio updates, with the 
emulator core (consisting of the Z80 processor emulation and any auxiliary processes 
that are likely to interrupt its execution multiple times per frame, such as constructing 
the video output, reading the keyboard and generating audio) running in WebAssembly, 
compiled from AssemblyScript (with a custom preprocessor).

## Embedding

JSSpeccy 3 is designed with embedding in mind. To include it in your own site, download
[a release archive](https://github.com/gasman/jsspeccy3/releases) and copy the contents 
of the `jsspeccy` folder somewhere web-accessible. Be sure to keep the .js and .wasm 
files and the subdirectories in the same place relative to jsspeccy.js.

In the `<head>` of your HTML page, include the tag

```html
    <script src="/path/to/jsspeccy.js"></script>
```

replacing `/path/to/jsspeccy.js` with (yes!) the path to jsspeccy.js. At the point
in the page where you want the emulator to show, place the code:

```html
    <div id="jsspeccy"></div>
    <script>JSSpeccy(document.getElementById('jsspeccy'))</script>
```

If you're suitably confident with JavaScript, you can put the call to `JSSpeccy` 
anywhere else that runs on page load, or in response to any user action.

You can also pass configuration options as a second argument to `JSSpeccy`:

```html
    <script>JSSpeccy(document.getElementById('jsspeccy'), {zoom: 2, machine: 48})</script>
```

The available configuration options are:

* `autoStart`: if true, the emulator will start immediately with no need to press 
   the play button. Bear in mind that browser policies usually don't allow enabling 
   audio without a user interaction, so if you enable this option (and don't put 
   the `JSSpeccy` call behind an onclick event or similar), expect things to be silent.
* `autoLoadTapes`: if true, any tape files opened (either manually or through the 
   openUrl option) will be loaded automatically without the user having to enter 
   LOAD "" or select the Tape Loader menu option.
* `tapeAutoLoadMode`: specifies the mode that the machine should be set to before 
   auto-loading tape files. When set to 'default' (the default), this is equivalent 
   to selecting the Tape Loader menu option on machines that support it; when set 
   to 'usr0', this is equivalent to entering 'usr0' in 128 BASIC then LOAD "" from 
   the resulting 48K BASIC prompt (which leaves 128K memory paging available without 
   the extra housekeeping of the 128K ROM - this mode is commonly used for launching demos).
* `machine`: specifies the machine to emulate. Can be `48` (for a 48K Spectrum), 
   `128` (for a 128K Spectrum), or `5` (for a Pentagon 128).
* `openUrl`: specifies a URL, or an array of URLs, to a file (or files) to load on 
   startup, in any supported snapshot, tape or archive format. Standard browser 
   security restrictions apply for loading remote files: if the URL being loaded is 
   not on the same domain as the calling page, it must serve 
   [CORS HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to be loadable.
* `zoom`: specifies the size of the emulator window; 1 for 100% size (one Spectrum 
   pixel per screen pixel), 2 for 200% size and so on.
* `sandbox`: if true, all UI options for opening a new file are disabled - useful if 
   you're showcasing a specific bit of Spectrum software on your page.
* `tapeTrapsEnabled`: if true (the default), the emulator will recognise when the tape 
   loading routine in the ROM is called, and load tape files instantly instead.

For additional JavaScript hackery, the return value of the JSSpeccy function call 
is an object exposing a number of functions for controlling the running emulator:

```html
    <script>
        let emu = JSSpeccy(document.getElementById('jsspeccy'));
        emu.openFileDialog();
    </script>
```

* `emu.setZoom(zoomLevel)` - set the zoom level of the emulator
* `emu.enterFullscreen()` - activate full-screen mode
* `emu.exitFullscreen()` - exit full-screen mode
* `emu.toggleFullscreen()` - enter or exit full-screen mode
* `emu.setMachine(machine)` - set the emulated machine type
* `emu.openFileDialog()` - open the file chooser dialog
* `emu.openUrl(url)` - open the file at the given URL
* `emu.exit()` - immediately stop the emulator and remove it from the document

## JSSpeccy 3 mobile mod

Source: https://github.com/dcrespo3d/jsspeccy3-mobile

Designed for mobile browsers with per-game customizable soft keys.

Configured using URL parameters.

### Example URL

https://stever.github.io/jsspeccy3/?k=-W-P,ASDe,123456789M&m=48&u=https://davidprograma.github.io/ytc/09-ZxSpectrum/snake-1.01.tap

The URL can be decomposed in these parts:
- Main part:
```
https://stever.github.io/jsspeccy3/
```
- Soft keys:
```
?k=-W-P,ASDe,123456789M
```
- Machine type (48, 128, 5 for pentagon)
```
&m=48
```
- Program/game URL to load:
```
&u=https://davidprograma.github.io/ytc/09-ZxSpectrum/snake-1.01.tap
```

You can build your own URL setting soft keys, machine type (defaults to 128) and a 
URL (*) for a Z80, SNA, SZX, TZX or TAP file containing the desired game or program.

(*) Target URL **must** be hosted in a website with CORS enabled.

- Optional filtering (default is no filtered, good old pixels):
```
&f=1
```

### Soft key syntax

The syntax is simple: keys are arranged as rows, and rows are separated by commas. 
So, the previous strings has 3 rows:

```
-W-P
ASDe
123456789M
```

A key is defined by its UPPERCASE character, and a hyphen (-) means a blank.

The exceptions are:
- Enter key: e (lowercase e)
- Caps shift: c (lowercase c)
- Symbol shift: s (lowercase s)
- Space: _ (underscore)

## Palette mod

Source: https://github.com/cronomantic/jsspeccy3

The RGB values described [here](https://en.wikipedia.org/wiki/ZX_Spectrum_graphic_modes#Colour_palette)
are most likely calculated by measuring voltages on the RGB output of the 128k models, since the ULAs of 
those systems generate RGBI signals that later are encoded to composite by the TEA2000 IC.
Those are the colors that most emulators use and most people are used to.

## Licence

JSSpeccy 3 is licensed under the GPL version 3 - see COPYING.
