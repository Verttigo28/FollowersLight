<p align="center"><img src="./build/icon.png" width="150px" height="150px" alt="FollowersLight"></p>

<h1 align="center">Followers Light</h1>

![Build/release](https://github.com/Verttigo28/FollowersLight/workflows/Build/release/badge.svg)

<p align="center">Let your followers light on your room! (Only supporting Phillips Hue, for the moment)</p>

![Image of Dashboard](https://i.ibb.co/BGpKTmT/Dashboard.png)
![Image of Bridge](https://i.ibb.co/0cCv0jT/Bridge.png)
![Image of Twitter](https://i.ibb.co/tsJS7Rd/Twitter.png)

## Why in this project alive?

I was browsing TikTok last night and a bunch of guys said "I created a bot that turn on and off my light when you sub"...<br>
You could clearly see that they were lying so... i did it cause yolo. (Sub to @Verttigo_ :)
In the "OLD" folder you can see the V1 that worked, please read the README.MD file in it, it contains a lot of info.

## BETA - Use with care

So basically this project is a V2 of my previous one, check the "OLD" folder for more information.
In the V1, the GUI wasn't here and it was just few scripts with NodeJS
In this V2, an Electron APP has been created and i already implemented several features that you can read bellow.

## Code Quality and English mistakes

I'm not the best developer, i do that for fun and a little bit at work, so i know my code is disgusting.<br>
But please, it's a beta and my only goal is to make the app work, i will recode bad part later.
My mother tongue is not english, if you see mistakes, tell me (probably a lot). 

## How it works?

Every minutes the app will get your followers count and calculate the difference from before, the difference will be put in a pipeline.<br>
Every 2 seconds the lightSystem will check if the pipeline is empty, if not he will start your light with a random color and shut it off after 1 seconds (the pipeline will decrement everytime).

## Features

* Phillips Hue, you can connect your Phillips Hue Bridge with all your lights.
  * Multiple lights are supported
  * Randomly generate a color
  * Start and stop your light every seconds.
* Twitter Support, you can connect your account to the Followers Light app and check every account you want.
  * Every 2 seconds, the bot will check the account you specify and calculate the difference between the last.
  * You can specify the account name you want!
  
## TODO List

* Auto-Update
  * The auto-update will be implemented soon.
  * No need to reinstall the software after that release.
* Twitch Support
  * I already know how to implemented that, i only need time.
  * Will support new sub, bits donation, re sub , Mod actions (like ban), new bits badge
* Color selection
  * For the moment only a random color can be specified, due to a lack of time.
  * Slider between color range.
  * Color picker.
* Instagram Support
  * Like Twitch, i already know how to implement that, only need time.
* TikTok
  * Like Twitch and Instagram, i already know how to implement that, only need time.
  * I will add TikTok support even if the API return rounded sub count.
* Multi bridge support
* Other smart light support.

## Downloads

You can download from [Github Releases](https://github.com/Verttigo28/FollowersLight/releases/)


**Supported Platforms**

If you download from the [Releases](https://github.com/Verttigo28/FollowersLight/releases/) tab, select the installer for your system.

| Platform | File |
| -------- | ---- |
| Windows x64 | `Followers Light-setup-VERSION.exe` |
| macOS | `Followers Light-VERSION.dmg` |
| Linux x64 | `Followers Light-VERSION-x86_64.AppImage` |

## Console

To open the console, use the following keybind.

```console
ctrl + shift + i
```

## Development

### Getting Started

**System Requirements**

* [Node.js] v12

---

**Clone and Install Dependencies**

```console
> git clone https://gitlab.com/Verttigo/followerslight.git
> cd FollowersLight
> npm install
```

---

**Launch Application**

```console
> npm start
```

---

**Build Installers**

To build for your current platform.

```console
> npm run dist
```

Build for a specific platform.

| Platform    | Command              |
| ----------- | -------------------- |
| Windows x64 | `npm run dist:win`   |
| macOS       | `npm run dist:mac`   |
| Linux x64   | `npm run dist:linux` |

Builds for macOS may not work on Windows/Linux and vice-versa.

---
