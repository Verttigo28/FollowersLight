# Followers Light

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9840b247863b4975896b5b0466989c96)](https://www.codacy.com/manual/baptiste.ferrando/tiktoklight?utm_source=gitlab.com&amp;utm_medium=referral&amp;utm_content=Verttigo/tiktoklight&amp;utm_campaign=Badge_Grade)

NodeJS app that turn on and off with a random color when you have a new follower on differents platform (originally tiktok).
Currently, this app only work with Phillips Hue lights.

## Why?
I was browsing TikTok last night and a bunch of guys said "I created a bot that turn on and off my light when you sub"...<br>
You could clearly see that they were lying so... i did it cause yolo. (Sub to @Verttigo_ :)

## How it works?
Every minutes the app will get your followers count and calculate the difference from before, the difference will be put in a pipeline.<br>
Every 2 seconds the lightSystem will check if the pipeline is empty, if not he will start your light with a random color and shut it off after 1 seconds (the pipeline will decrement everytime).

## V1
The V1 of this app was only for TikTok API.

## V2
The V2 add supports for Twitter API.

## V3
The V3 add supports for Instagram "API".

---

## DISCLAIMER
TikTok API is like Youtube API : WE CAN'T GET YOUR EXACT FOLLOWERS COUNT (it's rounded) <br>
Example : if Charlie D'amelio has 87.7M fans so you will get 87'700'000...<br>
<br>
LiveCount website for TikTok followers are lying to you, they collect growth data for the biggest account and they make an estimation of followers gain per day.<br>
They are making basic math to estimate so they can fool you by showing you a false counter..
<img src="https://i.ibb.co/1921RHc/Capture-d-e-cran-2020-09-19-a-19-47-57.png" alt="Capture-d-e-cran-2020-09-19-a-19-47-57" border="0"><br>
You can see this JSON request from livecounts.io on the well known Charli D'Amelio, nothing is hide.
<br>
You can clearly see the business behind that, keeping live people on their website to show you ads and making money.
What a time to be alive. 


## RateLimit
The API i'm using to get TikTok followers is not "Authorized" so if you don't want to get your IP ban, don't check every 1MS...<br>
For the Phillips Hue lights, the rate limit for the bridge is 1 seconds, if you don't respect that, have fun with errors.
The Twitter API have a rate limit too, only 1 request per second.

## Dev Tools
For the dev env you will need Node, Git and the NPM modules installed.

## Config
You need to create a config file based on /Config/config_example.json.
To use Twitter API you will need to register as dev.

## Phillips Hue Bridge
You need to follow the instructions in the folder LinkHueBridge, very simple run the script after you pressed your Hue Bridge pairing button and that's it, you will be given a user.
Place the user in your config file.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.11.0

    $ npm --version
    6.14.8

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.
   
    $ npm install npm -g

###

## Install

    $ git clone https://gitlab.com/Verttigo/tiktoklight.git
    $ cd TikTokLight
    $ npm install
    