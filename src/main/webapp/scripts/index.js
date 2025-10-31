"use strict"

let x = "0";

let nbClicks = 0;
let startTime = null;

const CLICK_THRESHOLD = 10;
const TIME_THRESHOLD = 5 * 1000;

const showCaptcha = () => {
    let container = document.getElementById("canvas-area");

    let captcha = document.createElement("div");
    captcha.setAttribute("id", "captcha");

    container.appendChild(captcha);

    grecaptcha.render('captcha', {
        'sitekey': '6LcIgPUrAAAAAFdzwLPGpU57diKIjIvuscMbMwTJ',
        'callback': checkRecaptcha
    });

    document.getElementById("graph").hidden = true;
};

const clickMeasure = () => {
    nbClicks++;
    if (startTime == null) {
        startTime = Date.now();

        return;
    }

    let elapsed = Date.now() - startTime;
    if (elapsed <= TIME_THRESHOLD && nbClicks >= CLICK_THRESHOLD) {
        nbClicks = 0;
        startTime = null;
        showCaptcha();
    } else if (elapsed >= TIME_THRESHOLD ) {
        nbClicks = 0;
        startTime = null;
    }
};

const updateResultTable = (x, y, r, isHit) => {
    const table = document.getElementById("results-table");
    const newRow = table.insertRow(1);
    newRow.classList.add("result-row");

    const newX = newRow.insertCell();
    const newY = newRow.insertCell();
    const newR = newRow.insertCell();
    const newHit = newRow.insertCell();

    newX.innerText = x;
    newY.innerText = y;
    newR.innerText = r;
    newHit.innerText = isHit ? "Успех" : "Неудача";
};

const initCanvas = () => {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const R = 150;
    const centerX = width / 2;
    const centerY = height / 2;

    canvas.addEventListener("click", async function (ev) {
        var rect = canvas.getBoundingClientRect();

        const radius = 2;
        const x = ev.clientX - rect.left - 2 * radius;
        const y = ev.clientY - rect.top - 2 * radius;

        let r = parseFloat(document.getElementById("r").value.replace(",", "."));
        let planeX = (x - 200) / (150 / r);
        let planeY = (200 - y) / (150 / r);

        const dataString = {
            x: planeX.toString(),
            y: planeY.toString(),
            r: document.getElementById("r").value,
            action: "click",
        };

        try {
            validateData("0", "0", dataString.r);

            const params = new URLSearchParams(dataString);
            const response = await fetch("/web-lab2/controller?" + params.toString(),
                    { method: "POST" });

            if (response.ok) {
                const data = await response.json();

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = data.isHit ? "rgb(0, 150, 0)" : "red";
                ctx.fill();

                updateResultTable(data.x, data.y, data.r, data.isHit);
            } else {
                const data = await response.json();
                displayError(data.error);
            }
        } catch (e) {
            displayError(e.message);
        }

        clickMeasure();
    });
};

const drawCanvas = () => {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const R = 150;
    const centerX = width / 2;
    const centerY = height / 2;

    let rStr = document.getElementById("r").value.replace(",", ".");
    let r;
    let halfR;
    try {
        r = parseFloat(rStr);
        halfR = r / 2;

        if (!validateR(rStr)) {
            throw new Error("Неверное значение R");
        }

        r = r.toString();
        halfR = halfR.toString();

        if (r.length > 4) {
            r = r.slice(0, 4) + "..";
        }

        if (halfR.length > 4) {
            halfR = halfR.slice(0, 4) + "..";
        }
    } catch (e) {
        r = "R";
        halfR = "R/2"
    }

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Areas
    ctx.fillStyle = "rgb(0, 180, 255)";

    ctx.beginPath();
    ctx.rect(centerX - R / 2, centerY - R, R / 2, R);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - R / 2, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + R / 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, R / 2, 3 * Math.PI / 2, 2 * Math.PI, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Labels
    ctx.font = "12px monospace";

    ctx.strokeText(halfR, centerX + R / 2 - 6, centerY - 6);
    ctx.strokeText(r, centerX + R - 6, centerY - 6);

    ctx.strokeText("-" + halfR, centerX - R / 2 - 18, centerY - 6);
    ctx.strokeText("-" + r, centerX - R - 6, centerY - 6);

    ctx.strokeText(halfR, centerX + 6, centerY - R / 2 + 6);
    ctx.strokeText(r, centerX + 6, centerY - R + 6);

    ctx.strokeText("-" + halfR, centerX + 6, centerY + R / 2 + 6);
    ctx.strokeText("-" + r, centerX + 6, centerY + R + 6);

    // Ticks
    ctx.beginPath();

    ctx.moveTo(centerX - R, centerY + 3);
    ctx.lineTo(centerX - R, centerY - 3);
    ctx.moveTo(centerX - R / 2, centerY + 3);
    ctx.lineTo(centerX - R / 2, centerY - 3);
    ctx.moveTo(centerX + R, centerY + 3);
    ctx.lineTo(centerX + R, centerY - 3);
    ctx.moveTo(centerX + R / 2, centerY + 3);
    ctx.lineTo(centerX + R / 2, centerY - 3);

    ctx.moveTo(centerX + 3, centerY - R);
    ctx.lineTo(centerX - 3, centerY - R);
    ctx.moveTo(centerX + 3, centerY - R / 2);
    ctx.lineTo(centerX - 3, centerY - R / 2);
    ctx.moveTo(centerX + 3, centerY + R);
    ctx.lineTo(centerX - 3, centerY + R);
    ctx.moveTo(centerX + 3, centerY + R / 2);
    ctx.lineTo(centerX - 3, centerY + R / 2);

    ctx.strokeStyle = "black";
    ctx.stroke();
};

const drawPoints = async () => {
    const rStr = document.getElementById("r").value.replace(",", ".");

    let response;
    if (validateR(rStr)) {
        hideError();
        const params = new URLSearchParams({r: rStr});
        response = await fetch("/web-lab2/controller?" + params.toString());
    } else {
        if (rStr !== null && rStr !== "") {
            displayError("Неверное значение R");
        }
        response = await fetch("/web-lab2/controller");
    }

    const radius = 2;

    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    var rect = canvas.getBoundingClientRect();

    if (response.ok) {
        const data = await response.json();
        for (const p of data) {
            const dx = parseFloat(p.x);
            const dy = parseFloat(p.y);
            const dr = parseFloat(p.r);

            const px = 200 + (dx * (150 / dr));
            const py = -(dy * (150 / dr)) + 200;

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, 2 * Math.PI);
            ctx.fillStyle = p.isHit ? "rgb(0, 150, 0)" : "red";
            ctx.fill();
        }
    } else {
        const data = await response.json();
        displayError(data.error);
    }
};

const setError = (msg, hidden) => {
    const error = document.getElementById("error-field");

    error.innerText = msg;
    error.hidden = hidden;
}

const displayError = (msg) => setError(msg, false);
const hideError = () => setError("", true);

const validateR = (rStr) => {
    const rLowerBound = 2;
    const rUpperBound = 5;

    const r = parseFloat(rStr.replace(",", "."));
    return !(isNaN(r) || r < rLowerBound || r > rUpperBound);
};

const validateData = (xStr, yStr, rStr) => {
    const supportedX = new Set([-5, -4, -3, -2, -1, 0, 1, 2, 3]);
    const yLowerBound = -3;
    const yUpperBound = 5;
    const rLowerBound = 2;
    const rUpperBound = 5;

    const x = parseFloat(xStr.replace(",", "."));
    const y = parseFloat(yStr.replace(",", "."));

    if (isNaN(x) || !supportedX.has(x)) {
        displayError(`X должен быть в [${[...supportedX].join(", ")}]`);

        throw new Error("Неверное значение X");
    }

    if (isNaN(y) || y < yLowerBound || y > yUpperBound) {
        displayError(`Y должен быть в промежутке [${yLowerBound} ... ${yUpperBound}]`);

        throw new Error("Неверное значение Y");
    }

    if (!validateR(rStr)) {
        displayError(`R должен быть в промежутке [${rLowerBound} ... ${rUpperBound}]`);

        throw new Error("Неверное значение R");
    }

    hideError();
};

const checkRecaptcha = (response) => {
    const params = new URLSearchParams({response: response});
    fetch("/web-lab2/check-captcha?" + params.toString(), { method: "POST" })
        .then(res => res.json())
        .then(json => {
            console.log(json);

            setTimeout(() => {
                grecaptcha.reset();
                document.getElementById("captcha").remove();
                document.getElementById("graph").hidden = false;
            }, 1000);
        });
}

document.getElementById("submit-button").addEventListener("click", async function (ev) {
    ev.preventDefault();

    const dataString = {
        x: x,
        y: document.getElementById("y").value,
        r: document.getElementById("r").value,
    };

    validateData(dataString.x, dataString.y, dataString.r);

    let form = document.createElement("form");
    form.hidden = true;
    form.method = "POST";
    form.action = "/web-lab2/controller";

    let xElem = document.createElement("input");
    let yElem = document.createElement("input");
    let rElem = document.createElement("input");
    let actionElem = document.createElement("input");

    xElem.value = dataString.x;
    xElem.name = "x";
    form.appendChild(xElem);

    yElem.value = dataString.y;
    yElem.name = "y";
    form.appendChild(yElem);

    rElem.value = dataString.r;
    rElem.name = "r";
    form.appendChild(rElem);

    actionElem.value = "submit";
    actionElem.name = "action";
    form.appendChild(actionElem);

    document.body.appendChild(form);
    form.submit();
});

document.getElementById('history-clear-button').addEventListener("click",
    async function (ev) {
        const response = await fetch("/web-lab2/controller", { method: "DELETE" });
        hideError();
        drawCanvas();

        const tableHeaderRowCount = 1;
        const table = document.getElementById("results-table");
        let rowCount = table.rows.length;
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
    });

document.addEventListener("DOMContentLoaded", async () => {
    initCanvas();
    drawCanvas();
    await drawPoints();
    hideError();

    let xButtons = document.getElementsByClassName("x-button");

    const setX = function(ev) {
        x = ev.srcElement.value;

        for (var i = 0; i < xButtons.length; i++) {
            xButtons[i].classList.remove("chosen-x-button");
        }

        ev.srcElement.classList.add("chosen-x-button");
    };

    for (var i = 0; i < xButtons.length; i++) {
        xButtons[i].addEventListener('click', setX);
    }
});

document.getElementById("r").addEventListener('input', async function (evt) {
    drawCanvas();
    await drawPoints();
});