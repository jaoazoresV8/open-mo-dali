/**
 * Sophia's Birthday Webpage - Logic
 * Handles cinematic background transitions based on YouTube video timeline.
 */

// 1. CONFIGURATION: Background Timeline
const backgroundTimeline = [
    {
        start: 0,
        end: 35,
        image: "assets/default-bg.png",
        label: "A little something from me"
    },
    {
        start: 35,
        end: 70,
        image: "assets/bg-2.jpg",
        label: "The moments we share"
    },
    {
        start: 70,
        end: 115,
        image: "assets/bg-3.jpg",
        label: "Thinking of you always"
    },
    {
        start: 115,
        end: 160,
        image: "assets/bg-4.jpg",
        label: "Every song reminds me of you"
    },
    {
        start: 160,
        end: 210,
        image: "assets/bg-5.jpg",
        label: "Waiting for our next hug"
    },
    {
        start: 210,
        end: 9999,
        image: "assets/bg-6.jpg",
        label: "Forever yours"
    }
];

// 2. STATE MANAGEMENT & YOUTUBE API
let player;
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');
const dynamicLabel = document.getElementById('dynamic-label');
const envelopeOverlay = document.getElementById('envelope-overlay');
const openEnvelopeBtn = document.getElementById('open-envelope');
const creditsOverlay = document.getElementById('credits-overlay');
const playOverlay = document.getElementById('play-overlay');

let currentSectionIndex = -1;
let activeLayer = bgLayer1;
let timeCheckInterval;

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Ready, initializing player...");
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: '_jWC7ljw3nc',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player is ready");
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        playOverlay.classList.add('hidden');
        // Start polling for time updates
        if (!timeCheckInterval) {
            timeCheckInterval = setInterval(() => {
                updateBackground(player.getCurrentTime());
            }, 500);
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        // Show play button if video is paused (unless it's near the end)
        if (player.getCurrentTime() < player.getDuration() - 1) {
            playOverlay.classList.remove('hidden');
        }
    } else if (event.data == YT.PlayerState.ENDED) {
        creditsOverlay.classList.add('visible');
        playOverlay.classList.add('hidden');
        clearInterval(timeCheckInterval);
        timeCheckInterval = null;
    }
}

/**
 * Updates the background image and label based on the current video time.
 */
function updateBackground(currentTime) {
    const sectionIndex = backgroundTimeline.findIndex(section =>
        currentTime >= section.start && currentTime < section.end
    );

    if (sectionIndex !== -1 && sectionIndex !== currentSectionIndex) {
        const nextSection = backgroundTimeline[sectionIndex];
        currentSectionIndex = sectionIndex;

        transitionToImage(nextSection.image);
        updateLabel(nextSection.label);
    }
}

/**
 * Softly fades the label text.
 */
function updateLabel(text) {
    if (!dynamicLabel) return;
    dynamicLabel.style.opacity = 0;
    setTimeout(() => {
        dynamicLabel.textContent = text;
        dynamicLabel.style.opacity = 0.6;
    }, 1000);
}

/**
 * Handles the crossfade logic between background layers.
 */
function transitionToImage(imagePath) {
    const nextLayer = (activeLayer === bgLayer1) ? bgLayer2 : bgLayer1;

    const tempImg = new Image();
    tempImg.src = imagePath;
    tempImg.onload = () => {
        nextLayer.style.backgroundImage = `url('${imagePath}')`;
        nextLayer.classList.add('active');
        activeLayer.classList.remove('active');
        activeLayer = nextLayer;
    };
}

// 3. EVENT LISTENERS

const letterOverlay = document.getElementById('letter-overlay');
const secretSunflower = document.getElementById('secret-sunflower');
const closeLetterBtn = document.getElementById('close-letter');

// Handle Envelope Open
openEnvelopeBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('opened');
});

// Handle Play Overlay Click
playOverlay.addEventListener('click', () => {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
        playOverlay.classList.add('hidden');
    } else {
        console.log("Player not ready, attempting to play anyway...");
        // If API failed, clicking the overlay should ideally let the user interact with the iframe
        playOverlay.classList.add('hidden');
    }
});

// Handle Secret Letter
secretSunflower.addEventListener('click', () => {
    letterOverlay.classList.add('visible');
    // Pause video if playing when reading letter
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    }
});

closeLetterBtn.addEventListener('click', () => {
    letterOverlay.classList.remove('visible');
});

// Initial background load
window.addEventListener('load', () => {
    if (backgroundTimeline.length > 0) {
        updateBackground(0);
    }
});

// Preload all background images
function preloadAllImages() {
    backgroundTimeline.forEach(section => {
        const img = new Image();
        img.src = section.image;
    });
}
preloadAllImages();
