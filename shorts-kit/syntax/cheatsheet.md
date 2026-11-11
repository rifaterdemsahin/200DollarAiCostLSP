---
published: false
---
# Syntax cheatsheet (everything used in the LSP Short)

## Remotion
```tsx
const f = useCurrentFrame(); const {fps} = useVideoConfig();
spring({frame: f - delay, fps, config:{damping:9, stiffness:140, mass:.7}})      // pop-in
interpolate(f, [0,30], [0,1], {extrapolateLeft:"clamp", extrapolateRight:"clamp"}) // ease
<Sequence from={90} durationInFrames={60}><Scene/></Sequence>                      // local frame resets to 0
<Audio src={staticFile("mix.wav")} />
<Composition id="Short" component={Short} durationInFrames={N} fps={30} width={1080} height={1920}/>
<Still id="Thumb" component={Thumb} width={1080} height={1920}/>
```
```bash
npx remotion still src/index.ts Short out/f.png --frame=300     # check a frame
npx remotion render src/index.ts Short out/short.mp4 --codec=h264 --crf=18
npx remotion still src/index.ts Thumb out/thumbnail.png
```
macOS chrome-headless-shell "spawn -88": `Config.setBrowserExecutable("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")` in `remotion.config.ts`.

## Whisper / ffmpeg
```bash
ffmpeg -i in.WAV -ac 1 -ar 16000 a16.wav
whisper a16.wav --model medium --language en --word_timestamps True --initial_prompt "Kilo Code, LSP" --output_format json
ffmpeg -ss 68.2 -t 46.2 -i in.WAV -ac 1 -af "highpass=f=80,afftdn=nf=-30,loudnorm=I=-14:TP=-3:LRA=7" voice.wav   # cut + clean the take
ffmpeg -i mix.wav -af ebur128=peak=true -f null -                                                              # measure loudness
ffmpeg -y -pattern_type glob -i 'f*.png' -vf "scale=300:-1,tile=6x2" -frames:v 1 sheet.png                     # contact sheet
```
Sidechain duck: `[music][voice]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300`

## Git / deploy
```bash
git checkout -b my-short-v1 && git add -A && git commit -m "…" && git push -u origin my-short-v1
gh api -X POST repos/<user>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"     # enable Pages (once)
open -a "Google Chrome" "https://<user>.github.io/<repo>/"
```
