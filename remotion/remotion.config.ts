import { Config } from "@remotion/cli/config";
// macOS: the downloaded chrome-headless-shell may fail to spawn (error -88); use installed Chrome.
Config.setBrowserExecutable("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
Config.setChromiumOpenGlRenderer("angle");
