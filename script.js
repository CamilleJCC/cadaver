var bodyLinks = [
    "https://i.imgur.com/ry9rlcS.jpg",
    "https://i.imgur.com/F86RJGC.jpg",
    "https://i.imgur.com/MV8CuIp.jpg",
    "https://i.imgur.com/MoPZIq6.jpg",
    "https://i.imgur.com/B4zQMg2.jpg",
    "https://i.imgur.com/rusORiz.jpg"
   
];

var feetLinks = [
    "https://i.imgur.com/LcbhFr8.jpg",
    "https://i.imgur.com/krAd3xO.jpg",
    "https://i.imgur.com/DH5AAwB.jpg",
    "https://i.imgur.com/DB2xV9M.jpg",
    "https://i.imgur.com/jNcqzd8.jpg",
    "https://i.imgur.com/8Al4SI4.jpg"
];

var headLinks = [
    "https://i.imgur.com/Om5DNbX.jpg",
    "https://i.imgur.com/C4x16an.jpg",
    "https://i.imgur.com/rOYwG2I.jpg",
    "https://i.imgur.com/IqEaqhB.jpg",
    "https://i.imgur.com/RDV1Ig2.jpg",
    "https://i.imgur.com/MB6URrg.jpg"
];

var headImages = [];
var bodyImages = [];
var feetImages = [];
var headIndex = 0;
var bodyIndex = 0;
var feetIndex = 0;

var currentPart = "head";  // Tracks which part the player is currently selecting

function preload(){
    for (let i = 0; i < headLinks.length; i++) {
        headImages[i] = loadImage(headLinks[i]);
    }
    for (let i = 0; i < bodyLinks.length; i++) {
        bodyImages[i] = loadImage(bodyLinks[i]);
    }
    for (let i = 0; i < feetLinks.length; i++) {
        feetImages[i] = loadImage(feetLinks[i]);
    }
}
  
function setup() {
    createCanvas(200, 400);  // Reduced to one column
    background(100);
    displayCadaver();  // Display the initial cadaver
}

function draw() {
    // No need to redraw continuously
}

function keyPressed() {
    if (key === ' ') {
        // Space bar cycles through images for the current part
        cycleCurrentPart();
    } else if (key === 'Enter') {
        // Enter moves to the next part of the body
        moveToNextPart();
    }
    displayCadaver();
}

function cycleCurrentPart() {
    // Cycles through the images of the current part
    if (currentPart === "head") {
        headIndex = (headIndex + 1) % headImages.length;
    } else if (currentPart === "body") {
        bodyIndex = (bodyIndex + 1) % bodyImages.length;
    } else if (currentPart === "feet") {
        feetIndex = (feetIndex + 1) % feetImages.length;
    }
}

function moveToNextPart() {
    // Switches to the next part in the sequence
    if (currentPart === "head") {
        currentPart = "body";
    } else if (currentPart === "body") {
        currentPart = "feet";
    } else if (currentPart === "feet") {
        currentPart = "head";  // Loops back to head after feet
    }
}

function displayCadaver() {
    background(100);  // Clear previous images
    image(headImages[headIndex], 0, 0, 200, 150);
    image(bodyImages[bodyIndex], 0, 150, 200, 150);
    image(feetImages[feetIndex], 0, 300, 200, 150);
}
 
