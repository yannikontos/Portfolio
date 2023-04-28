const navbar = document.getElementById('navbar');
const burgerIcon = document.getElementById('burgerIcon');
const burgerContainer = document.getElementById('burgerContainer');
const crossIcon = document.getElementById('crossIcon');
const formContainer = document.getElementById('formContainer');
const projectQuery = document.getElementById('projectQuery');
const trackIcon = document.getElementById('trackIcon');
const trackName = document.getElementById('trackName');
const artistName = document.getElementById('artistName');
const albumName = document.getElementById('albumName');
const statusType = document.getElementById("statusType");
const discordApiKey = `https://api.lanyard.rest/v1/users/265134455708975104`;
const githubApiKey = `https://api.github.com/users/YanniKontos/repos`;
const socketUrl = 'wss://api.lanyard.rest/socket';

let isOn = false;

window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 1025)  {
        document.body.style.overflow = 'hidden';
    }
    else {
        document.body.style.overflowY = 'visible';
    }
});

document.addEventListener('DOMContentLoaded', (e) => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        navbar.classList.remove();
        console.log("refresh page for full mobile experience");
        isMobile(true);
    } 
    else {
        navbar.classList.remove();
        isMobile(false);
    }
});

function displayNavbar() {
    document.body.append(navbar);
    navbar.classList.add("side-navbar-2");
    navbar.style.display = 'flex';
    burgerIcon.remove();
};

burgerIcon.addEventListener('click', () => {
    isOn = !isOn;
    isOn == false ? isMobile(true) : displayNavbar();
    burgerContainer.appendChild(crossIcon);
});

crossIcon.addEventListener('click', () => {
    isOn = !isOn;
    burgerContainer.append(burgerIcon);
    isMobile(true);
});

formContainer.addEventListener('submit', (e) => {
    const value = projectQuery.value.toLowerCase();
    e.preventDefault();
    window.open(`https://github.com/YanniKontos?tab=repositories&q=${value.replace(" ", "-")}&type=&language=&sort=`);
});

function isMobile(bool) {
    if (bool == true){
        burgerContainer.style.display = 'flex';
        return navbar.remove(), crossIcon.remove();
    }

    else {
        return crossIcon.remove();
    }
};

async function getDiscordData() {
    try {
        const res = await fetch(discordApiKey);
        const e = await res.json()
        const discordStatus = e.data.discord_status;

        discordStatus == "online" ? statusType.textContent = "Online" : 
        discordStatus == "idle" ?   statusType.textContent = "Idle" : 
        discordStatus == "dnd" ?   statusType.textContent = "Online" :
        statusType.textContent = "Offline"
    }
    catch(error){
        console.log(error);
    }
};

async function getSpotifyData() {
    try {
        const res = await fetch(discordApiKey);
        const e = await res.json()
        const spotifyData = e.data.spotify;

        trackIcon.src = spotifyData.album_art_url;
        trackName.textContent = spotifyData.song;
        artistName.textContent = spotifyData.artist;
        albumName.textContent = spotifyData.album;

    }
    catch(error){
        console.log("User's Spotify Is Offline / Paused");
        trackIcon.src = '/img/no-song-icon.jpg';
        trackName.textContent = "Nothing Playing"
        artistName.textContent = "Unknown Artist Name";
        albumName.textContent = "Unknown Album";
    }
};

async function getRepoInfo() {
    const item1Starred = document.getElementById('item1Starred');
    const item2Starred = document.getElementById('item2Starred');
    const item3Starred = document.getElementById('item3Starred');
    const item4Starred = document.getElementById('item4Starred');

    const item1Forked = document.getElementById('item1Forked');
    const item2Forked = document.getElementById('item2Forked');
    const item3Forked = document.getElementById('item3Forked');
    const item4Forked = document.getElementById('item4Forked');

    try {
        const res = await fetch(githubApiKey);
        const data = await res.json();
        const jsonArr = [];

        
        for (let i = 0; i < data.length; i++) {
            const projects = data[i];
            const stargazers_count = projects.stargazers_count;
            const forks = projects.forks;
            
            switch(projects.name) {
                
                case "dictionary-app": 
                item1Starred.textContent = " " + stargazers_count;
                item1Forked.textContent = " " + forks;
                
                case "todos-app":
                    item2Starred.textContent = " " + stargazers_count;
                item2Forked.textContent = " " + forks;
                
                case "weather-app":
                    item3Starred.textContent = " " + stargazers_count;
                    item3Forked.textContent = " " + forks;
                    
                case "String-Encryption":
                    item4Starred.textContent = " " + stargazers_count;
                    item4Forked.textContent = " " + forks;
                }
        }
    }

    catch(error){
        console.log(error);
    }
};

function createWebSocket(){
    const socket = new WebSocket(socketUrl);
    
    socket.addEventListener('open', event => {
        console.log('WebSocket connection opened');
        
        socket.send(JSON.stringify({op: 2, d: {
            subscribe_to_ids: ["265134455708975104"]
        } }));
    });
    
    socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        getSpotifyData();
        getDiscordData();
    });
    
    socket.addEventListener('close', event => {
        console.clear();
        console.log('WebSocket connection closed');
        setTimeout(2000, createWebSocket());
    });
};

getRepoInfo();
createWebSocket();