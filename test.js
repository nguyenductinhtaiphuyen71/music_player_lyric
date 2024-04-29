const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector("img");
const musicName = wrapper.querySelector(".name");
const musicArtist = wrapper.querySelector(".artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const lyric = document.querySelector(".lyric");
const canvas = document.getElementById('audioLyric');

// Set up the canvas size
canvas.width = 800;
canvas.height = 200;

const ctx = canvas.getContext('2d');

let allMusic = [
    {
        name: "Bệnh biến",
        artist: "china siêu gà",
        img: "back",
        lyricSrc: "lyric.txt",
        src:"music"
    },
    {
        name: "Nhạc tây nhạc tàu",
        artist: "tây tàu",
        img: "play",
        lyricSrc: "lyric.txt",
        src:"music"
    }
]

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let currentMin = 0;
let currentSec = 0;
let isMusicPaused = true;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

const loadMusic = (indexNumb) => {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb -1].artist;
    musicImg.src =`assets/icons/${allMusic[indexNumb -1].img}.png`;
    mainAudio.src =`assets/${allMusic[indexNumb -1].src}.mp3`
}

const playMusic = () => {
    wrapper.classList.add("paused");
    musicImg.classList.add("rotate");
    playPauseBtn.innerHTML = `<img class="img-play-pause" src="assets/icons/pause.png" alt="">`;
    mainAudio.play();
}

const pauseMusic = () => {
    wrapper.classList.remove("paused");
    musicImg.classList.remove("rotate");
    playPauseBtn.innerHTML = `<img class="img-play-pause" src="assets/icons/play.png" alt="">`;
    mainAudio.pause();
}

const prevMusic = () => {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

const nextMusic = () => {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", () => {
    prevMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
});

mainAudio.addEventListener("playing", (e) => {
    startLyric(e);
    startLyricCanvas(e);
});

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time");
    let musicDuration = wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata", () => {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    currentMin = Math.floor(currentTime / 60);
    currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

mainAudio.addEventListener("ended", () => {
    nextMusic();
});

async function loadFileLyric(fileName) {
    return await fetch(fileName)
        .then(data => data.text())
        .then(data => data.trim().split("\n")) // break lines to array
        .catch(err => console.error(err));
}

async function startLyric(e) {
    let index = 1;
    (await loadFileLyric("lyric.txt")).forEach(line => {
        line = line.trim();
        let minute = parseInt(line.substr(1, 2));
        let second = parseInt(line.substr(4, 5));
        if (isNaN(minute) || isNaN(second)) return;
        let text = line.substr(line.indexOf("]") + 1, line.length).trim();
        const myInterval = setInterval(() => {
            if (currentMin == minute && currentSec == second) {
                lyric.style.transform = `rotateZ(${index * 360}deg)`;
                lyric.innerText = text;
                clearInterval(myInterval);
            }
        }, 1000);
    })
}

async function startLyricCanvas(e) {
    const lyricData = await loadFileLyric("lyric.txt");
    const listArr = lyricData.map((data) => {
        return {
            minute: parseInt(data.substr(1, 2)),
            second: parseInt(data.substr(4, 5)),
            text: data.substr(data.indexOf("]") + 1, data.length).trim()
        }
    });
    listArr.forEach((line, index) => {
        let minute = line.minute;
        let second = line.second;
        if (isNaN(minute) || isNaN(second)) return;
        let text = line.text;
        let textWidth = ctx.measureText(text).width;
        let gradientOffset = 0;
        let timeRunText = (listArr[index + 1]?.minute * 60 + listArr[index + 1]?.second)
        - (minute * 60 + second) || 10;
        gradientOffset = timeRunText;
        if (minute == 0 && second == 0) {
            gradientOffset = canvas.width;
        }
        console.log(timeRunText);
        const myInterval = setInterval(() => {
            // console.log(canvas);
            // console.log(line);
            if (currentMin == minute && currentSec == second) {
                // const canvas = document.getElementById('karaokeCanvas');
                // const ctx = canvas.getContext('2d');
                // const textWidth = ctx.measureText(text).width;
                // let gradientOffset = 0; // Starting position of the gradient

                // Set up the canvas size
                // canvas.width = 800;
                // canvas.height = 200;

                // Function to draw the karaoke text
                function drawKaraokeText() {
                    // Clear the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Set the text properties
                    ctx.font = '36px Arial';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';

                    // Create a linear gradient that moves over time
                    const gradient = ctx.createLinearGradient(gradientOffset, 0, gradientOffset + textWidth, 0);
                    gradient.addColorStop(0, '#01fe87'); // Start with transparent
                    gradient.addColorStop(0.5,'#000000'); // Middle with bright green color
                    gradient.addColorStop(1, '#000000'); // End with transparent

                    // Apply the gradient to the text
                    ctx.fillStyle = gradient;
                    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
                    // Update the gradient offset to create the animation effect
                    gradientOffset += (canvas.width + textWidth) / (timeRunText * 60);
                    // if (gradientOffset > canvas.width) gradientOffset = -textWidth;
                    
                    // Request the next frame of the animation
                    requestAnimationFrame(drawKaraokeText);
                }

                // Start the animation
                drawKaraokeText();
            }
        }, 1000);
        // clearInterval(myInterval);
    });
}
