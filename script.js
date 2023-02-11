/** @type {HTMLCanvasElement} **/ // This tells VS Code to suggest canvas methods
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect(); // Method that provides info about elements' size and position relative to the viewport

class Explosion { // Custom class to keep explosion objects
    constructor(x, y) { // Constructor accepts values "from outside" of the class
        this.spriteWidth = 200; // Width of a single animation on the sprite sheet
        this.spriteHeight = 179 // Height of a single row on the sprite sheet
        // Get smaller sprite
        this.width = this.spriteWidth * 0.8; // Multiplicatin is faster than division!
        this.height = this.spriteHeight * 0.8;
        // Assign arguments passed to the constructor and make sure the image is drawn around the cursor
        this.x = x - this.width / 2; // Offset the horizontal position by sprite's width
        this.y = y - this.height / 2; // Offset the vertical position by sprite's height
        // Get the image
        this.image = new Image();
        this.image.src = "resources/boom.png";
        this.frame = 0; // Keep track of frames
        this.timer = 0; // Keep track of time
        // Get the sound
        this.sound = new Audio();
        this.sound.src = "resources/boom.wav";
    }
    update () {
        // Play the sound once per the entire animation
        if (this.frame == 0) {
            this.sound.play();
        }
        this.timer++; 
        // The following code is run every 10 frames, slowing the animation x10
        if (this.timer % 10 == 0) {
            this.frame++; // Switch to the next animation only when the current timer (counting browser frames) in divisible by 10
        }
    }
    draw () {
        // Draw the image by taking:
        // -the image itself
        // -source file coordinates on the sprite sheet (sx, sy, sw, sh) to crop a single animation
        // -destination coordinates to draw the image on the canvas
        // context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

        // Multiplying spriteWidth by frames allows to switch to the next animation with every frame
        context.drawImage(this.image, this.spriteWidth * this.frame, 0 , this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

// Listen for mouse clicks in the browser
window.addEventListener("click", function(event) {
   createAnimation(event);
});

// Custom function to create animation expecting the event object from the above Listener
function createAnimation(event) {
    // Event properties x and y are coordinates of each mouse click in the browser
    // Position of rectangles drawn has to be offset by canvas position (margins from window borders to canvas borders) to appear where the cursor is
    // It also has to be offset by half of the rectangle size to appear around the cursor and not right-down of it
    let positionX = event.x - canvasPosition.left;
    let positionY = event.y - canvasPosition.top;
    // On click add (push) a new object to the explosions[] array as a new instance of the Explosion class
    // Pass as arguments for the class constructor the positions above
    explosions.push(new Explosion(positionX, positionY)); 
}

// Create animation loop
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas with every frame
    // Iterate over the explosions[] array containing Explosion-class objects
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();
        // Check if the entire animation has been drawn (5 animation on the sprite sheet)
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1); // If animation's finished, remove 1 object at the current i index (i.e. the current object)
            i--; // Adjust index after removing 1 object from the array
        }
    }
    requestAnimationFrame(animate); // Call the function recursively to create an endless loop
};
animate(); // Call the actual function to trigger it