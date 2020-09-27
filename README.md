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
* Instagram Support, you can enter the name you want !
  * Every 2 seconds, the bot will check the account you specify and calculate the difference between the last.
  * No need to connect your account!
* Auto-Updater, since v1.2.0, the auto-updater has been implemented
  * Automatic / Manual update
  * No need to resinstall everything!
* Twitch Support, light on your stream with 4 events.
  * On Bits donation : Number of bits divided by 10, minimum 1
  * On Subscription : When someone sub to you.
  * On Bits Badge unlock : When someone have a new bits badge.
  * On Mod action : When your mod punish someone!
* Color Selection, For the moment only for TwitchBot
  
## TODO List

*̶ ̶A̶u̶t̶o̶-̶U̶p̶d̶a̶t̶e̶
  *̶ ̶T̶h̶e̶ ̶a̶u̶t̶o̶-̶u̶p̶d̶a̶t̶e̶ ̶w̶i̶l̶l̶ ̶b̶e̶ ̶i̶m̶p̶l̶e̶m̶e̶n̶t̶e̶d̶ ̶s̶o̶o̶n̶.̶ ̶ ̶ ̶
  *̶ ̶N̶o̶ ̶n̶e̶e̶d̶ ̶t̶o̶ ̶r̶e̶i̶n̶s̶t̶a̶l̶l̶ ̶t̶h̶e̶ ̶s̶o̶f̶t̶w̶a̶r̶e̶ ̶a̶f̶t̶e̶r̶ ̶t̶h̶a̶t̶ ̶r̶e̶l̶e̶a̶s̶e̶.̶
*̶ ̶I̶n̶s̶t̶a̶g̶r̶a̶m̶ ̶S̶u̶p̶p̶o̶r̶t̶ ̶ ̶ ̶
  *̶ ̶L̶i̶k̶e̶ ̶T̶w̶i̶t̶c̶h̶,̶ ̶i̶ ̶a̶l̶r̶e̶a̶d̶y̶ ̶k̶n̶o̶w̶ ̶h̶o̶w̶ ̶t̶o̶ ̶i̶m̶p̶l̶e̶m̶e̶n̶t̶ ̶t̶h̶a̶t̶,̶ ̶o̶n̶l̶y̶ ̶n̶e̶e̶d̶ ̶t̶i̶m̶e̶.̶  
*̶ ̶T̶w̶i̶t̶c̶h̶ ̶S̶u̶p̶p̶o̶r̶t̶ ̶ ̶ ̶
  *̶ ̶I̶ ̶a̶l̶r̶e̶a̶d̶y̶ ̶k̶n̶o̶w̶ ̶h̶o̶w̶ ̶t̶o̶ ̶i̶m̶p̶l̶e̶m̶e̶n̶t̶e̶d̶ ̶t̶h̶a̶t̶,̶ ̶i̶ ̶o̶n̶l̶y̶ ̶n̶e̶e̶d̶ ̶t̶i̶m̶e̶.̶ ̶ ̶
  ̶*̶ ̶W̶i̶l̶l̶ ̶s̶u̶p̶p̶o̶r̶t̶ ̶n̶e̶w̶ ̶s̶u̶b̶,̶ ̶b̶i̶t̶s̶ ̶d̶o̶n̶a̶t̶i̶o̶n̶,̶ ̶r̶e̶ ̶s̶u̶b̶ ̶,̶ ̶M̶o̶d̶ ̶a̶c̶t̶i̶o̶n̶s̶ ̶(̶l̶i̶k̶e̶ ̶b̶a̶n̶)̶,̶ ̶n̶e̶w̶ ̶b̶i̶t̶s̶ ̶b̶a̶d̶g̶e̶
*̶ ̶C̶o̶l̶o̶r̶ ̶s̶e̶l̶e̶c̶t̶i̶o̶n̶ ̶ ̶ 
  ̶*̶ ̶F̶o̶r̶ ̶t̶h̶e̶ ̶m̶o̶m̶e̶n̶t̶ ̶o̶n̶l̶y̶ ̶a̶ ̶r̶a̶n̶d̶o̶m̶ ̶c̶o̶l̶o̶r̶ ̶c̶a̶n̶ ̶b̶e̶ ̶s̶p̶e̶c̶i̶f̶i̶e̶d̶,̶ ̶d̶u̶e̶ ̶t̶o̶ ̶a̶ ̶l̶a̶c̶k̶ ̶o̶f̶ ̶t̶i̶m̶e̶.̶ ̶ ̶ ̶
  *̶ ̶S̶l̶i̶d̶e̶r̶ ̶b̶e̶t̶w̶e̶e̶n̶ ̶c̶o̶l̶o̶r̶ ̶r̶a̶n̶g̶e̶.̶ ̶ ̶ ̶
  *̶ ̶C̶o̶l̶o̶r̶ ̶p̶i̶c̶k̶e̶r̶.̶
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
