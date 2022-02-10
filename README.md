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

## Tech notes

### Architecture

The browser UI thread (starting point in runtime/jsspeccy.js) is kept as lightweight 
as possible, only performing tasks that are directly related to communication with 
the "outside world": rendering the screen data to a canvas, handling keyboard events, 
outputting audio and managing UI actions such as loading files.

All the actual emulation happens inside a Web Worker (runtime/worker.js), with all 
communcation between the UI thread and the worker happening through `postMessage`. 
The most important messages are `runFrame` (sent from the UI thread to the worker, 
to tell it to run one frame of emulation and fill the passed video and audio buffers 
with the resulting output) and `frameCompleted` (sent from the worker to the UI thread
when execution of the frame is complete, passing the filled video and audio buffers back).

Within the Web Worker, all of the performance-critical work is handled by a WebAssembly 
module (jsspeccy-core.wasm). The main entry point into this is the `runFrame` function, 
which runs the Z80 and all related 'continuous' processes (memory reads / writes, 
responding to port reads / writes, building the screen and generating audio) for one 
video frame. `runFrame` returns a status of 1 to indicate that the frame has completed 
execution (and thus the video / audio buffers are ready to send back to the UI thread), 
with other status values serving as 'exceptions', indicating that execution was 
interrupted and needs action from the calling code before it can be continued (by 
calling `resumeFrame`). At the time of writing, the only kind of exception implemented
is a tape loading trap.

All state required for the WebAssembly core module to run - including memory 
contents (ROM and RAM), registers, audio / video buffers and lookup tables - is 
contained within the module's own memory map, and statically allocated at compile time.

On the real machine, generating video and audio output happens in parallel with 
the Z80's execution - an emulator implementing this naïvely would have to break 
out of the Z80 loop every few cycles to perform these tasks. In fact, these 
processes can be deferred for as long as we like, as long as we catch up on them 
before any state changes occur that would affect the output. With this in mind, 
the JSSpeccy core implements two functions `updateFramebuffer` and `updateAudioBuffer` 
which perform all pending video / audio generation as far as the current Z80 cycle. 
These are called immediately before any state change (which means, for audio, a
write to any AY register or the beeper port; and for video, a write to video memory,
change of border colour or a write to the memory paging port).

### Building the core

To build jsspeccy-core.wasm, we run the script generator/gencore.mjs, which runs 
a preprocessing pass over the input file generator/core.ts.in, to generate the
[AssemblyScript](https://www.assemblyscript.org/) source file build/core.ts. This 
is then passed to the AssemblyScript compiler to produce the final dist/jsspeccy-core.wasm module.

The preprocessor step serves two purposes: firstly, it allows us to programmatically 
build the large repetitive `switch` statements that form the Z80 core. Secondly, 
it allows us to use conventional array syntax to access our statically-defined arrays. 
Currently, AssemblyScript does not appear to have any native support for static 
arrays - any use of array syntax causes it to immediately pull in a `malloc` 
implementation and a higher-level array construct with bounds checking, all of which 
is unwanted overhead for our purposes. The gencore.mjs processor rewrites array 
syntax into direct memory access [`load` / `store` instructions](https://www.assemblyscript.org/stdlib/builtins.html#memory).

All statically-defined arrays are allocated at the start of the module's memory map, 
from address 0 onward. Currently a 512Kb block is allocated for these - if you need 
more, increase `memoryBase` in asconfig.json.

The gencore.mjs preprocessor recognises the following directives:

* `#alloc` - allocates an array of the given size and type. For example, if `#alloc frameBuffer[0x6600]: u8` is the first line of the file, then 0x6600 bytes from address 0 will be allocated to an array named `frameBuffer`. This will then rewrite subsequent lines as follows:
   * An assignment such as `frameBuffer = [0x00, 0x01, 0x02];` will be rewritten as a sequence of `store<u8>(0, 0x00);`, `store<u8>(1, 0x01);` lines
   * An assignment such as `frameBuffer[ptr] = 0x00;` will be rewritten as `store<u8>(0 + ptr, 0x00);`
   * A lookup such as `val = frameBuffer[ptr];` will be rewritten as `val = load<u8>(0 + ptr);`
   * `(&frameBuffer)` will be replaced with the array's base address, e.g. `const FRAME_BUFFER = (&frameBuffer);` becomes `const FRAME_BUFFER = 0;`
   * Keep in mind that these are simple regexp replacements, not a full parser - it's likely to fail on statements that are split over multiple lines, or have nested brackets. If you don't like this, feel free to submit a better implementation of static arrays to the AssemblyScript project :-)
* `#const` - defines an identifier to be replaced by the given expression. For example, given a directive `#const FLAG_C 0x01`, a subsequent line `result &= FLAG_C;` will be rewritten to `result &= 0x01;`. `const FLAG_C = 0x01;` would achieve the same thing, but will also define a symbol in the resulting module, which we probably don't want.
* `#regpair` - allocates two bytes to store a Z80 register pair. This is always little-endian, as per the WebAssembly spec. For example, if the next memory address to be allocated is 0x1000, then `#regpair BC B C` will define identifiers `BC`, `B` and `C` such that:
   * `val = BC;` is rewritten to `val = load<u16>(0x1000);`
   * `BC = 0x1234;` is rewritten to `store<u16>(0x1000, 0x1234);`
   * `val = B;` is rewritten to `val = load<u8>(0x1001);`
   * `B = result;` is rewritten to `store<u8>(0x1001, result);`
   * `val = C;` is rewritten to `val = load<u8>(0x1000);`
   * `C = result;` is rewritten to `store<u8>(0x1000, result);`
* `#optable` - generates the sequence of `case` statements that decode an opcode byte. The subroutine bodies for each class of instruction are defined in generator/instructions.mjs, and these are pattern-matched to the actual instruction lists in generator/opcodes_*.txt.

### Frame buffer format

The frame buffer data structure (as written by the WebAssembly core and passed to
the UI thread in the `frameCompleted` message) is essentially a log of all border, 
screen and attribute bytes in the order that they would be read to build the video
output. This is based on a 320x240 output image consisting of 24 lines of upper 
border, 192 lines of main screen (each consisting of 32px left border, 256px main 
screen, and 32px right border), and 24 lines of lower border. This results in a 
0x6600 byte buffer, breaking down as follows:

* 0x0000..0x009f: line 0 of the upper border. 160 bytes, each one being a border colour (0..7) and contributing two pixels to the final image. (This corresponds to the maximum resolution at which border colour changes happen on the Pentagon; these take effect on every cycle, and one cycle equals two pixels.)
* 0x00a0..0x013f: line 1 of the upper border
* ...
* 0x0e60..0x0eff: line 23 of the upper border
* 0x0f00..0x0f0f: left border of main screen line 0. 16 bytes, each contributing two pixels of border as before
* 0x0f10..0x0f4f: main screen line 0. 32*2 bytes, consisting of the pixel byte and attribute byte for each of the 32 character cells
* 0x0f50..0x0f5f: right border of main screen line 0. 16 bytes, each contributing two pixels of border as before
* 0x0f60..0x0f6f: left border of main screen line 1
* 0x0f70..0x0faf: main screen line 1. (Again, since the data here is in the order that the video output would be generated, this is the data pulled from address 0x4100 onward, not 0x4020.)
* 0x0fb0..0x0fbf: right border of main screen line 2
* ...
* 0x56a0..0x56af: left border of main screen line 191
* 0x56b0..0x56ef: main screen line 191
* 0x56f0..0x56ff: right border of main screen line 191
* 0x5700..0x579f: line 0 of the lower border. 160 bytes, as per upper border
* 0x57a0..0x583f: line 1 of the lower border
* ...
* 0x6560..0x65ff: line 23 of the lower border

## Change log

### 3.1 (2021-08-26)

* Real-time tape loading, including turbo loaders (except for direct recording, CSW and generalized data TZX blocks)
* Emulate floating bus behaviour
* Fix typo in docs (`openURL` -> `openUrl`)

### 3.0.1 (2021-08-16)

* Fix relative jump instructions to not treat +0x7f as -0x81 (which broke the Protracker 3 player)

### 3.0 (2021-08-14)

Initial release of JSSpeccy 3.

* Web Worker and WebAssembly emulation core
* 48K, 128K, Pentagon emulaton
* Accurate multicolour
* AY and beeper audio
* TAP, TZX, Z80, SNA, SZX, ZIP loading
* Fullscreen mode
* Browsing games from Internet Archive

## Licence

JSSpeccy 3 is licensed under the GPL version 3 - see COPYING.
