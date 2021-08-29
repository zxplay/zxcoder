# JSSpeccy 3 mobile

A ZX Spectrum emulator for mobile browsers with per-game customizable soft keys.

## Quick example

As a example, I am showing a simple snake game made by me, but ANY (*) game can be loaded.

![Snake](https://dcrespo3d.github.io/jsspeccy3-mobile/img/jss3m-snake.png)

Notice the soft keys imitating speccy keys at the bottom.

Those keys have been created dynamically with a string present in the URL:

```
-W-P,ASDe,123456789M
```

The syntax is simple: keys are arranged as rows, and rows are separated by commas. So, the previous strings has 3 rows:

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

The full URL is this:

[https://dcrespo3d.github.io/jsspeccy3-mobile/?k=-W-P,ASDe,123456789M&m=48&u=https://davidprograma.github.io/ytc/09-ZxSpectrum/snake-1.01.tap](https://dcrespo3d.github.io/jsspeccy3-mobile/?k=-W-P,ASDe,123456789M&m=48&u=https://davidprograma.github.io/ytc/09-ZxSpectrum/snake-1.01.tap)

The URL can be decomposed in these parts:
- Main part:
```
https://dcrespo3d.github.io/jsspeccy3-mobile/
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

You can build your own URL setting soft keys, machine type (defaults to 128) and a URL (*) for a Z80, SNA, SZX, TZX or TAP file containing the desired game or program.

(*) Target URL **must** be hosted in a website with CORS enabled. 

- Optional filtering (default is no filtered, good old pixels):
```
&f=1
```


## Authors

- 99% of the work is from [gasman (Matt Westcott)](https://github.com/gasman) who created the [JSSpeccy3 emulator](https://github.com/gasman/jsspeccy3) and did all the hard work.
- The remaining 1% (quick & dirty soft keys, URL scheme) is from me, [dcrespo](https://github.com/dcrespo3d).

## Disclaimer

This is a weekend project for sending some speccy games to friends with soft keys set for those games, just sending them an URL via Telegram or Whatsapp.

It works for me, as is. What I mean is that for me, this project is finished and I don't intend to add any more features.

If you like it, use it. If you would like to change something, just fork the repo and perform any modification you'd like.

I also adhere to what Matt Westcott says in the Contributons section below.

## Contributions (by Matt Westcott)

These days, releasing open source code tends to come with an unspoken social contract, so I'd like to set some expectations...

This is a personal project, created for my own enjoyment, and my act of publishing the code does not come with any commitment to provide technical support or assistance. I'm always happy to hear of other people getting similar enjoyment from hacking on the code, and pull requests are welcome, but I can't promise to review them or shepherd them into an "official" release on any sort of timescale. Managing external contributions is often the point at which a "fun" project stops being fun. If there's a feature you need in the project - feel free to fork.

## Licence

JSSpeccy 3 is licensed under the GPL version 3 - see COPYING.
JSSpeccy 3 mobile is licensed under the GPL version 3 - see COPYING.

