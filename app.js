const apiUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
let leftCurrency = "rub";
let rightCurrency = "usd";
let leftExchangeRate, rightExchangeRate;
let activeField = null;

const leftMenuButtons = document.querySelectorAll("#left-menu button");
const rightMenuButtons = document.querySelectorAll("#right-menu button");
const leftInput = document.querySelector("#first-input");
const rightInput = document.querySelector("#second-input");
const leftFooter = document.querySelector("#first-input-footer");
const rightFooter = document.querySelector("#second-input-footer");

const showMessage = (message) => {
    const existingMessage = document.querySelector(".connection-message");
    if (!existingMessage) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "connection-message";
        messageDiv.textContent = message;
        messageDiv.style.position = "fixed";
        messageDiv.style.top = "10px";
        messageDiv.style.left = "50%";
        messageDiv.style.transform = "translateX(-50%)";
        messageDiv.style.backgroundColor = "#f44336";
        messageDiv.style.color = "#fff";
        messageDiv.style.padding = "10px 20px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.zIndex = "1000";
        document.body.appendChild(messageDiv);
    }
};

const hideMessage = () => {
    const existingMessage = document.querySelector(".connection-message");
    if (existingMessage) {
        existingMessage.remove();
    }
};

const checkConnection = () => {
    if (!navigator.onLine) {
        showMessage("Internet no");
        disableControls();
    } else {
        hideMessage();
        enableControls();
    }
};

const disableControls = () => {
    leftMenuButtons.forEach((button) => button.setAttribute("disabled", "true"));
    rightMenuButtons.forEach((button) => button.setAttribute("disabled", "true"));
    leftInput.setAttribute("disabled", "true");
    rightInput.setAttribute("disabled", "true");
};

const enableControls = () => {
    leftMenuButtons.forEach((button) => button.removeAttribute("disabled"));
    rightMenuButtons.forEach((button) => button.removeAttribute("disabled"));
    leftInput.removeAttribute("disabled");
    rightInput.removeAttribute("disabled");
};

async function loadExchangeRates(left, right) {
    if (!navigator.onLine) return; 

    try {
        const [leftData, rightData] = await Promise.all([
            fetch(`${apiUrl}${left}.json`).then((response) => response.json()),
            fetch(`${apiUrl}${right}.json`).then((response) => response.json())
        ]);

        leftExchangeRate = leftData[left][right];
        rightExchangeRate = rightData[right][left];

        leftFooter.textContent = `1 ${left.toUpperCase()} = ${leftExchangeRate} ${right.toUpperCase()}`;
        rightFooter.textContent = `1 ${right.toUpperCase()} = ${rightExchangeRate} ${left.toUpperCase()}`;

        if (activeField === "left" && leftInput.value !== "") {
            rightInput.value = left === right ? leftInput.value : (leftExchangeRate * leftInput.value).toFixed(6);
        } else if (activeField === "right" && rightInput.value !== "") {
            leftInput.value = left === right ? rightInput.value : (rightExchangeRate * rightInput.value).toFixed(6);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkConnection();
    loadExchangeRates(leftCurrency, rightCurrency);
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);
});

leftMenuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        leftMenuButtons.forEach((btn) => btn.classList.remove("selected"));
        event.target.classList.add("selected");
        leftCurrency = event.target.textContent.toLowerCase();
        loadExchangeRates(leftCurrency, rightCurrency);
    });
});

rightMenuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        rightMenuButtons.forEach((btn) => btn.classList.remove("selected"));
        event.target.classList.add("selected");
        rightCurrency = event.target.textContent.toLowerCase();
        loadExchangeRates(leftCurrency, rightCurrency);
    });
});

leftInput.addEventListener("focus", () => {
    activeField = "left";
});

rightInput.addEventListener("focus", () => {
    activeField = "right";
});

leftInput.addEventListener("input", (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
        rightInput.value = leftCurrency === rightCurrency ? value : (leftExchangeRate * value).toFixed(6);
    } else {
        rightInput.value = "";
    }
});

rightInput.addEventListener("input", (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
        leftInput.value = leftCurrency === rightCurrency ? value : (rightExchangeRate * value).toFixed(6);
    } else {
        leftInput.value = "";
    }
});
