
// load saved data
let savedCoins = localStorage.getItem("gurtCoins");
savedCoins = parseInt(savedCoins, 10);

let savedRebirths = localStorage.getItem("gurtRebirths")
savedRebirths = parseInt(savedRebirths, 10);

let savedGoons = localStorage.getItem("gurtGoons");
savedGoons = parseInt(savedGoons, 10);

let coins = savedCoins || 0;
let rebirths = savedRebirths || 0;
let goons = savedGoons || 0;

// get html elements
const coinsLabel = document.getElementById("clickCount");
const coinStatsLabel = document.getElementById("incomeStats");
const rebirthsLabel = document.getElementById("rebirthCount");
const goonsLabel = document.getElementById("goonCount");

const clickBtn = document.getElementById("clickBtn");
const rebirthBtn = document.getElementById("rebirthBtn");
const goonBtn = document.getElementById("goonBtn");

updateLabels();

// formulas
function calcRebirthCost() { return 100 + Math.pow(rebirths, 2) * 30; };
function calcClickMult() { return 1 + (rebirths * 0.5); };
function calcGoonIncome() { return goons * calcClickMult(); };
function calcGoonCost() { return 20 + Math.pow(goons, 2) * 10; };

// common funcs

function updateLabels() {
    coinsLabel.textContent = `${Math.floor(coins).toFixed(0)} Dubloons`;
    coinStatsLabel.textContent = `
  [Multiplier: ${calcClickMult().toFixed(1)}x]
   [Goons: $${calcGoonIncome().toFixed(1)}/s]
  `;
    rebirthsLabel.textContent = `${rebirths} Rebirths`;
    goonsLabel.textContent = `${goons} Goons`
    rebirthBtn.textContent = `Rebirth [$${calcRebirthCost()}]`
    goonBtn.textContent = `Buy Goon [$${calcGoonCost()}]`

    // enable/disable buttons if you can afford
    rebirthBtn.disabled = coins < calcRebirthCost();
    goonBtn.disabled = coins < calcGoonCost();
};

function saveData() {
    localStorage.setItem("gurtCoins", coins);
    localStorage.setItem("gurtRebirths", rebirths);
    localStorage.setItem("gurtGoons", goons);
};

function resetData() {
    coins = 0;
    rebirths = 0;
    goons = 0;
    saveData();
    updateLabels();
};

// creates the "+$1.0" effect when earning coins
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
};

// button callbacks:

function gurtClick() {
    coins += calcClickMult();
    saveData();
    updateLabels();
    spawnClickFx();
};

// reset all stats but get income multiplier
function Rebirth() {
    const cost = calcRebirthCost();
    if (coins < cost) { return };
    coins = 0;
    goons = 0;
    rebirths += 1;
    saveData();
    updateLabels();
};

// buy worker
function buyGoon() {
    const cost = calcGoonCost();
    if (coins < cost) { return };
    coins -= cost;
    goons += 1;
    saveData();
    updateLabels();
};

// run workers every 100ms (they auto click for you)
const timeID = setInterval(runGoons, 100);
let lastFullCashNum = 0;
function runGoons() {
    coins += calcGoonIncome() * 0.1;

    if (Math.floor(coins) > lastFullCashNum) {
        lastFullCashNum = coins;
        spawnClickFx();
    }

    saveData();
    updateLabels();
};