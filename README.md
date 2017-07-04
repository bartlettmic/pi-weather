# pi-weather
Repo to easily modify front-end of raspberry-pi local weather informatics server

## How to replicate:
In hindsight I should have used a node.js server backend, but I went with a LAMP model because it was the first good result on google.
* Follow [this guide](https://diyhacking.com/raspberry-pi-web-server/) to install apache2, and php5. 
* Give pi static IP, portfoward port 80 from your router (I also recommend port 22 so you can SSH into your pi externally, for development at least)
* If you want, assign a DNS to your external IP. I used [this DNS provider](http://freedns.afraid.org/). Let this serve as me adhering to their desire to post a link to their site on my project!
    * If you forwarded port 22 you can ssh from this URL also, which is handy
* Place this repo in `/var/www/html` once you have confirmed you can connect to your pi and get the apache default page.
* Install node & npm
    * Pi is arm so usual method won't work, follow [this guide](http://weworkweplay.com/play/raspberry-pi-nodejs/)
    * Gist of article: 
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
```
* Run `npm install` in `/var/www/html`
* IN THE FUTURE accessing the page should be enough to kick-start all the periodic updates. For right now, you must run `node index.js` to update anything on the page.
* Todo:
    * Add periodic functions
    * Add photon code to this repository
