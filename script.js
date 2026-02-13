const game = document.getElementById("game");
const player = document.getElementById("player");
const statusText = document.getElementById("status");
const modeDisplay = document.getElementById("modeDisplay");

let gravity = 0.9;
let velocity = 0;
let y = 40;
let mode = "cube";
let speed = 5;
let running = false;
let loop;

const FLOOR = 40;
const CEILING = 260;

// -------- INPUT --------
document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (running) handleJump();
    }
});

function handleJump() {

    if (mode === "cube") {
        // Only jump if on ground
        if (y <= FLOOR + 0.1) {
            velocity = 16;
        }
    }

    else if (mode === "ship") {
        velocity = 8;
    }

    else if (mode === "ball") {
        gravity *= -1;
    }

    else if (mode === "ufo") {
        velocity = 13;
    }

    else if (mode === "wave") {
        velocity = velocity === 8 ? -8 : 8;
    }
}

// -------- LEVEL LOAD --------
function loadLevel(level) {

    clearInterval(loop);
    clearLevel();

    gravity = 0.9;
    velocity = 0;
    y = FLOOR;
    mode = "cube";
    updateModeDisplay();

    createLevel(level);

    running = true;
    statusText.innerText = "Level " + level;
    loop = setInterval(update, 16);
}

function clearLevel() {
    document.querySelectorAll(".spike, .portal").forEach(e => e.remove());
}

// -------- LEVEL DESIGN --------
function createLevel(level) {

    const layouts = {
        1: {
            spikes: [600, 750, 900],
            portals: [{pos:1000,type:"ship"}]
        },
        2: {
            spikes: [500, 650, 800, 950],
            portals: [{pos:1100,type:"ball"}]
        },
        3: {
            spikes: [550, 600, 650, 900],
            portals: [{pos:1000,type:"ufo"}]
        }
    };

    layouts[level].spikes.forEach(pos => {
        let spike = document.createElement("div");
        spike.className = "spike";
        spike.style.left = pos + "px";
        spike.style.bottom = FLOOR + "px";
        game.appendChild(spike);
    });

    layouts[level].portals.forEach(p => {
        let portal = document.createElement("div");
        portal.className = "portal";
        portal.dataset.mode = p.type;
        portal.style.left = p.pos + "px";
        portal.style.bottom = FLOOR + "px";
        game.appendChild(portal);
    });
}

// -------- GAME LOOP --------
function update() {

    // Apply gravity ONLY in relevant modes
    if (mode === "cube" || mode === "ufo" || mode === "ship") {
        velocity -= gravity;
        y += velocity;
    }

    if (mode === "wave") {
        y += velocity;
    }

    // Clamp
    if (y < FLOOR) {
        y = FLOOR;
        velocity = 0;
    }

    if (y > CEILING) {
        y = CEILING;
        velocity = 0;
    }

    player.style.bottom = y + "px";

    moveObjects();
    checkCollisions();
}

function moveObjects() {
    document.querySelectorAll(".spike, .portal").forEach(obj => {
        obj.style.left = (parseFloat(obj.style.left) - speed) + "px";
    });
}

// -------- COLLISIONS --------
function checkCollisions() {

    const p = player.getBoundingClientRect();

    document.querySelectorAll(".spike").forEach(spike => {

        const r = spike.getBoundingClientRect();

        // Smaller hitbox to prevent false deaths
        const padding = 10;

        if (
            p.left + padding < r.right &&
            p.right - padding > r.left &&
            p.bottom - padding > r.top &&
            p.top + padding < r.bottom
        ) {
            death();
        }
    });

    document.querySelectorAll(".portal").forEach(portal => {

        const r = portal.getBoundingClientRect();

        if (
            p.left < r.right &&
            p.right > r.left &&
            p.bottom > r.top &&
            p.top < r.bottom
        ) {
            mode = portal.dataset.mode;
            updateModeDisplay();
        }
    });
}

function updateModeDisplay() {
    const icons = {
        cube: "⬛ Cube",
        ship: "🚀 Ship",
        ball: "⚪ Ball",
        ufo: "🛸 UFO",
        wave: "🔺 Wave"
    };
    modeDisplay.innerText = icons[mode];
}

function death() {
    clearInterval(loop);
    running = false;
    statusText.innerText = "💀 You Died";
}
    statusText.innerText = "💀 You Died";
}
