
// load saved data
let savedClicks = localStorage.getItem("gurtClicks")
savedClicks = parseInt(savedClicks, 10);

let savedRebirths = localStorage.getItem("gurtRebirths")
savedRebirths = parseInt(savedRebirths, 10);

let savedGoons = localStorage.getItem("gurtGoons")
savedGoons = parseInt(savedGoons, 10);

let clicks = savedClicks || 0;
let rebirths = savedRebirths || 0;
let goons = savedGoons || 0;

const clicksLabel = document.getElementById("clickCount");
const clickStatsLabel = document.getElementById("clickStats");
const rebirthsLabel = document.getElementById("rebirthCount");
const goonsLabel = document.getElementById("goonCount");

const clickBtn = document.getElementById("clickBtn");
const rebirthBtn = document.getElementById("rebirthBtn");
const goonBtn = document.getElementById("goonBtn");

updateLabels();

// formulas
function calcRebirthCost() {
    return 100 + Math.pow(rebirths, 2) * 30;
}
function calcClickMult() {
    return 1 + (rebirths * 0.5);
}
function calcGoonIncome() {
    return goons * calcClickMult();
}
function calcGoonCost() {
    return 20 + Math.pow(goons, 2) * 10;
}

function updateLabels() {
    clicksLabel.textContent = `${Math.floor(clicks).toFixed(0)} Dubloons`;
    clickStatsLabel.textContent = `
  [Multiplier: ${calcClickMult().toFixed(1)}x]
   [Goons: $${calcGoonIncome().toFixed(1)}/s]
  `;
    rebirthsLabel.textContent = `${rebirths} Rebirths`;
    goonsLabel.textContent = `${goons} Goons`
    rebirthBtn.textContent = `Rebirth [$${calcRebirthCost()}]`
    goonBtn.textContent = `Buy Goon [$${calcGoonCost()}]`

    // enable/disable buttons if you can afford
    rebirthBtn.disabled = clicks < calcRebirthCost();
    goonBtn.disabled = clicks < calcGoonCost();
}

function saveData() {
    localStorage.setItem("gurtClicks", clicks);
    localStorage.setItem("gurtRebirths", rebirths);
    localStorage.setItem("gurtGoons", goons);
}

function resetData() {
    clicks = 0;
    rebirths = 0;
    goons = 0;
    saveData();
    updateLabels();
}

function spawnClickFx() {
    const fx = document.createElement("p");
    fx.classList.add("fx");
    fx.textContent = `+$${calcClickMult().toFixed(1)}`;
    document.body.append(fx);

    // random screen pos
    x = Math.floor(screen.width * Math.random() * 0.6 + (screen.width * 0.2));
    y = Math.floor(screen.height * Math.random() * 0.5);

    fx.style.top = y + "px";
    fx.style.left = x + "px";

    setTimeout(function () {
        fx.remove();
    }, 500);
}

function gurtClick() {
    clicks += calcClickMult();
    saveData();
    updateLabels();
    spawnClickFx();
}

function Rebirth() {
    const cost = calcRebirthCost();
    if (clicks < cost) { return };
    clicks = 0;
    goons = 0;
    rebirths += 1;
    saveData();
    updateLabels();
}

function buyGoon() {
    const cost = calcGoonCost();
    if (clicks < cost) { return };
    clicks -= cost;
    goons += 1;
    saveData();
    updateLabels();
}

// run goons
const timeID = setInterval(runGoons, 100);
let lastFullCashNum = 0;
function runGoons() {
    clicks += calcGoonIncome() * 0.1;

    if (Math.floor(clicks) > lastFullCashNum) {
        lastFullCashNum = clicks;
        spawnClickFx();
    }

    saveData();
    updateLabels();
}