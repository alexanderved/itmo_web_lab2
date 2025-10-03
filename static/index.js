"use strict"

const setError = (msg, hidden) => {
    const error = document.getElementById("error-field");

    error.innerText = msg;
    error.hidden = hidden;
}

const displayError = (msg) => setError(msg, false);
const hideError = () => setError("", true);

const validateData = (xStr, yStr, rStr) => {
    const xLowerBound = -5;
    const xHigherBound = 5;
    const supportedY = new Set([-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]);
    const supportedR = new Set([1, 1.5, 2, 2.5, 3]);

    const x = parseFloat(xStr.replace(",", "."));
    const y = parseFloat(yStr.replace(",", "."));
    const r = parseFloat(rStr.replace(",", "."));

    console.log(x);

    if (isNaN(x) || x < xLowerBound || x > xHigherBound) {
        displayError(`X должен быть в промежутке [${xLowerBound} ... ${xHigherBound}]`);

        throw new Error("Неверное значение X");
    }

    if (isNaN(y) || !supportedY.has(y)) {
        displayError(`Y должен быть в [${[...supportedY].join(", ")}]`);

        throw new Error("Неверное значение Y");
    }

    if (isNaN(r) || !supportedR.has(r)) {
        displayError(`R должен быть в [${[...supportedR].join(", ")}]`);

        throw new Error("Неверное значение R");
    }

    hideError();
};

const parseResponse = async (response) => {
    if (response.ok) {
        const data = await response.json();
        return {
            hit: data.hit ? "Успех" : "Неудача",
            currentTime: new Date(data.currentTime).toLocaleString(),
            executionTime: data.executionTime
        };
    } else if (response.status === 400) {
        const data = await response.json();
        return {
            hit: "Ошибка: " + data.reason,
            currentTime: new Date(data.currentTime).toLocaleString(),
            executionTime: "N/A"
        };
    } else {
        return {
            hit: "Неопределенная ошибка",
            currentTime: "N/A",
            executionTime: "N/A"
        };
    }
};

const storeCookie = (x, y, r, hit, currentTime, executionTime, rowi) => {
    const data = {
        x: x,
        y: y,
        r: r,
        hit: hit,
        currentTime: currentTime,
        executionTime: executionTime,
    };

    document.cookie = "nextRow=" + (rowi + 1);
    document.cookie = "row" + rowi + "=" + JSON.stringify(data);
};

var row = 1;
document.getElementById("data-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const dataString = {
        x: document.getElementById("x").value,
        y: document.getElementById("y").value,
        r: document.getElementById("r").value,
    };

    validateData(dataString.x, dataString.y, dataString.r);

    const params = new URLSearchParams(dataString);
    const response = await fetch("/fcgi-bin/web-lab1.jar?" + params.toString());
    const result = await parseResponse(response);

    const tfoot = document.getElementById("main-table")
            .getElementsByTagName("tfoot")[0];
    const newRow = tfoot.insertRow(1);
    const newX = newRow.insertCell();
    const newY = newRow.insertCell();
    const newR = newRow.insertCell();
    const newHit = newRow.insertCell();
    const newCurrentTime = newRow.insertCell();
    const newExecutionTime = newRow.insertCell();

//    const xDetails = document.createElement("span");
//    xDetails.classList.add("details");
//    xDetails.innerText = dataString.x;

    newX.innerText = dataString.x;
//    newX.append(xDetails);

    newY.innerText = dataString.y;
    newR.innerText = dataString.r;
    newHit.innerText = result.hit;
    newCurrentTime.innerText = result.currentTime;
    newExecutionTime.innerText = result.executionTime;

    storeCookie(dataString.x, dataString.y, dataString.r,
            result.hit, result.currentTime, result.executionTime, row++);
});

document.getElementById('history-clear-button').onclick = () => {
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    let tableHeaderRowCount = 1;
    let tfoot = document.getElementById("main-table")
            .getElementsByTagName("tfoot")[0];
    let rowCount = tfoot.rows.length;
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
        tfoot.deleteRow(tableHeaderRowCount);
    }
    row = 1;

    hideError();
};

document.cookie.split(";").forEach(c => {
    const s = c.replace(/^ +/, "").split("=");
    const name = s[0];
    const value = s[1];

    if (name === "" || (name !== "nextRow" && !name.startsWith("row"))) {
        return;
    }

    console.log(name, value);

    if (name === "nextRow") {
        row = parseInt(value);

        return;
    }

    const tfoot = document.getElementById("main-table")
            .getElementsByTagName("tfoot")[0];
    const newRow = tfoot.insertRow(1);
    const newX = newRow.insertCell();
    const newY = newRow.insertCell();
    const newR = newRow.insertCell();
    const newHit = newRow.insertCell();
    const newCurrentTime = newRow.insertCell();
    const newExecutionTime = newRow.insertCell();

    const data = JSON.parse(value);

//    const xDetails = document.createElement("span");
//    xDetails.classList.add("details");
//    xDetails.innerText = data.x;

    newX.innerText = data.x;
//    newX.append(xDetails);

    newY.innerText = data.y;
    newR.innerText = data.r;
    newHit.innerText = data.hit;
    newCurrentTime.innerText = data.currentTime;
    newExecutionTime.innerText = data.executionTime;
});

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const R = 150;
const centerX = width / 2;
const centerY = height / 2;

// Background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Areas
ctx.fillStyle = "rgb(51, 153, 255)";

ctx.beginPath();
ctx.rect(centerX - R, centerY, R, R / 2);
ctx.fill();

ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.lineTo(centerX + R / 2, centerY);
ctx.lineTo(centerX, centerY - R);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.arc(centerX, centerY, R, 0, Math.PI / 2, false);
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

ctx.strokeText("R/2", centerX + R / 2 - 6, centerY - 6);
ctx.strokeText("R", centerX + R - 6, centerY - 6);

ctx.strokeText("-R/2", centerX - R / 2 - 18, centerY - 6);
ctx.strokeText("-R", centerX - R - 6, centerY - 6);

ctx.strokeText("R/2", centerX + 6, centerY - R / 2 + 6);
ctx.strokeText("R", centerX + 6, centerY - R + 6);

ctx.strokeText("-R/2", centerX + 6, centerY + R / 2 + 6);
ctx.strokeText("-R", centerX + 6, centerY + R + 6);

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