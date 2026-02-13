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

document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (running) input();
    }
});

function input() {
    if (mode === "cube" && y === FLOOR) velocity = 15;
    else if (mode === "ship") velocity = 7;
    else if (mode === "ball") gravity *= -1;
    else if (mode === "ufo") velocity = 12;
    else if (mode === "wave") velocity = -velocity || 6;
}

function loadLevel(level) {
    clearLevel();
    mode = "cube";
    gravity = 0.9;
    y = FLOOR;
    velocity = 0;
    updateModeDisplay();

    createLevel(level);

    statusText.innerText = "Level " + level;
    running = true;
    loop = setInterval(update, 20);
}

function restart() {
    clearInterval(loop);
    running = false;
    loadLevel(1);
}

function clearLevel() {
    document.querySelectorAll(".block, .spike, .portal").forEach(e => e.remove());
}

function createLevel(level) {

    let layouts = {
        1: {
            spikes: [600, 700, 740, 780, 1000],
            portals: [{pos: 900, type:"ship"}]
        },
        2: {
            spikes: [500, 650, 900, 950, 1000],
            portals: [{pos: 800, type:"ball"}, {pos:1200, type:"cube"}]
        },
        3: {
            spikes: [550, 600, 650, 1000, 1050],
            portals: [{pos:750,type:"ufo"},{pos:1300,type:"wave"}]
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

function update() {

    velocity -= gravity;
    y += velocity;

    if (y <= FLOOR) {
        y = FLOOR;
        velocity = 0;
    }

    if (y >= CEILING) {
        y = CEILING;
        velocity = 0;
    }

    player.style.bottom = y + "px";

    moveObjects();
    collisions();
}

function moveObjects() {
    document.querySelectorAll(".spike, .portal").forEach(obj => {
        let left = parseFloat(obj.style.left);
        obj.style.left = (left - speed) + "px";
    });
}

function collisions() {
    const p = player.getBoundingClientRect();

    document.querySelectorAll(".spike").forEach(spike => {
        const r = spike.getBoundingClientRect();
        if (
            p.left < r.right &&
            p.right > r.left &&
            p.bottom > r.top &&
            p.top < r.bottom
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
