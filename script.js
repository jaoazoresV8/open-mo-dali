/**
 * Sophia's Birthday Webpage - Logic
 * Handles cinematic background transitions based on video timeline.
 */

// 1. CONFIGURATION: Background Timeline
// Edit these values to match your video's song changes.
// 'start' and 'end' are in seconds.
const backgroundTimeline = [
    {
        start: 0,
        end: 35,
        image: "assets/default-bg.png",
        label: "A little something from me 🌻"
    },
    {
        start: 35,
        end: 70,
        image: "assets/bg-2.jpg",
        label: "The moments we share 🌻"
    },
    {
        start: 70,
        end: 115,
        image: "assets/bg-3.jpg",
        label: "Thinking of you always 🌻"
    },
    {
        start: 115,
        end: 160,
        image: "assets/bg-4.jpg",
        label: "Every song reminds me of you 🌻"
    },
    {
        start: 160,
        end: 210,
        image: "assets/bg-5.jpg",
        label: "Waiting for our next hug 🌻"
    },
    {
        start: 210,
        end: 9999,
        image: "assets/bg-6.jpg",
        label: "Forever yours 🌻"
    }
];

// 2. STATE MANAGEMENT
const video = document.getElementById('main-video');
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');
const dynamicLabel = document.getElementById('dynamic-label');
const envelopeOverlay = document.getElementById('envelope-overlay');
const openEnvelopeBtn = document.getElementById('open-envelope');
const creditsOverlay = document.getElementById('credits-overlay');

let currentSectionIndex = -1;
let activeLayer = bgLayer1;

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

    // Preload image before showing it
    const tempImg = new Image();
    tempImg.src = imagePath;
    tempImg.onload = () => {
        // Set the background image on the hidden layer
        nextLayer.style.backgroundImage = `url('${imagePath}')`;

        // Fade in the next layer, fade out the current active layer
        nextLayer.classList.add('active');
        activeLayer.classList.remove('active');

        // Swap references
        activeLayer = nextLayer;
    };
}

// 3. EVENT LISTENERS

const playOverlay = document.getElementById('play-overlay');

// Handle Envelope Open
openEnvelopeBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('opened');
});

// Handle Play Overlay Click
playOverlay.addEventListener('click', () => {
    video.play();
    playOverlay.classList.add('hidden');
    video.setAttribute('controls', 'true');
});

// Show Credits when video ends
video.addEventListener('ended', () => {
    creditsOverlay.classList.add('visible');
    video.removeAttribute('controls');
});

// If the video is paused/ends, show overlay again
video.addEventListener('pause', () => {
    if (!video.ended) {
        playOverlay.classList.remove('hidden');
    }
});

video.addEventListener('play', () => {
    playOverlay.classList.add('hidden');
});

// Listen for video time updates
video.addEventListener('timeupdate', () => {
    updateBackground(video.currentTime);
});

// Handle seeking (jump to specific time)
video.addEventListener('seeking', () => {
    updateBackground(video.currentTime);
});

// Initial background load
window.addEventListener('load', () => {
    // Set initial background immediately if video starts at 0
    if (backgroundTimeline.length > 0) {
        updateBackground(0);
    }
});

// Preload all background images to avoid delays during playback
function preloadAllImages() {
    backgroundTimeline.forEach(section => {
        const img = new Image();
        img.src = section.image;
    });
}
preloadAllImages();
