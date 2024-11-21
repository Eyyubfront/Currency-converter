const apiUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
let leftCurrency = "rub";
let rightCurrency = "usd";
let leftExchangeRate, rightExchangeRate;



const leftMenuButtons = document.querySelectorAll("#left-menu button"); 
const rightMenuButtons = document.querySelectorAll("#right-menu button"); 
const leftInput = document.querySelector("#first-input"); 
const rightInput = document.querySelector("#second-input"); 
const leftFooter = document.querySelector("#first-input-footer");
const rightFooter = document.querySelector("#second-input-footer"); 

async function loadExchangeRates(left, right) {
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
    loadExchangeRates(leftCurrency, rightCurrency);
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

let activeField = null;

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
