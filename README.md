# pi-weather
Repo to easily modify front-end of raspberry-pi local weather visualization, forecast (eventually), *and* analytics server. Mathematical! (*maybe*)

## TO DO:
- [ ] Center weather data in CLI browsers
- [x] Make the data actually refresh somehow with magical object function passes
    - [x] ~~Obviously child-proc has to update local weather object. How to pass changes along though?~~ ~~Module exports are a dream!~~ Actually they're very convoluted but they keep things compartmentalized.
- [x] Rain effect
    - [ ] Clear background
    - [ ] Actually triggers when raining?
    - [ ] If temp < 32, snow instead
- [ ] Compress the dang background images with sharp
    - [ ] i GUESS use an <image> for the bg instead of CSS'ing the body so we can support webp
    - [ ] Use generic webcam npm package if raspistill fails
- [ ] *Embed webm timelapses?*
    - [ ] Probably just embed from imgur to reduce bandwidth
- [x] Clean up all the string formatter shit into parse-weather with `module.exports`
    - [ ] Move dynamic palette shit to parse-weather also
- [ ] **Incorporate influx** or similar timeseries database since ARM prob not supported
    - [ ] Perhaps grafana too, or at least some graphing utility.

* Perhaps export shit to xlsx? https://www.npmjs.com/package/xlsx

- [ ] *Somehow sync the photon code here?*
- [ ] **LOCAL SPARKSERVER FROM PI SO IT IS THE CENTRAL NERVOUS SYSTEM OF THE ENTIRE FRAMEWORK**
    - [ ] Update photon locally from pi, removing need for particle api
        - This part is probably gonna be really f*cking hard since it will probably invalidate particle.js ¯\_(ツ)_/¯

- [ ] **UPDATE THE DANG TUTORIAL THIS SHIT IS SIMPLY INCORRECT NOW**

#### Useful line: http://www.erol.si/2015/01/the-complete-list-of-all-timeseries-databases-for-your-iot-project/

## How to replicate:

* First, choose what sort stack you want
    * Follow [this guide](https://diyhacking.com/raspberry-pi-web-server/) to install apache2, and php5, otherwise known as a [LAMP stack](https://en.wikipedia.org/wiki/LAMP_(software_bundle)). 
    * *Or* **more prefered model:** Just install node.js since we're going to be using it regardless. Either way as long as you can make your pi send an HTML page, it doesn't really matter.
    
    ***See below steps for installing node.js on ARM architecture***

* Give pi static IP, portfoward port 80 from your router (I also recommend port 22 so you can SSH into your pi externally, for development at least)
* If you want, assign a DNS to your external IP. I used [this DNS provider](http://freedns.afraid.org/). Let this serve as me adhering to their desire to post a link to their site on my project!
    * If you forwarded port 22 you can ssh from this URL also, which is handy
* Install node & npm
    * Pi is arm so usual method won't work, follow [this guide](http://weworkweplay.com/play/raspberry-pi-nodejs/) or use the commands listed below
---
## Commands to get started:
```bash
# cd to where you would like the repo directory to be
# git clone this repo
# cd to repo directory
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
rm node_latest_armhf.deb
npm install # this will install all dependencies listed in package.json -
            # namely express, pug, particle-api, node scheduler, raspicam node api

# Assuming you don't want to run sudo everytime you launch the server, you'll likely
#   need to redirect a provisional port to port 80 so you can just type in the IP without 
#   specifying a port.
iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
#   This routes port 3000 to port 80. You'll still need to port-forward to access your
#   server remotely, but otherwise everything in this repo *should* work as it's written 
#   for port 3000.

npm run watch # to run the server but auto-restart if any file is modified.

# OR

node server.js # to simply run the server as-is
```

* IN THE FUTURE accessing the page should be enough to kick-start all the periodic updates. For right now, you must run `node weather.js` to update anything on the page.
