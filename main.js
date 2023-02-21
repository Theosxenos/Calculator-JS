///
/// The buttons
///
const operandbuttons = document.querySelectorAll(".operand");
const operatorbuttons = document.querySelectorAll(".operator");
const clearbutton = document.querySelector("#clearbutton");
const deletebutton = document.querySelector("#deletebutton");
const separatorbutton = document.querySelector(".separator");
const changesignbutton = document.querySelector(".changesign");

// Memory buttons
const memoryclearbutton = document.querySelector("#memoryclear");
const memoryrecallbutton = document.querySelector("#memoryrecall");
const memorysubtractbutton = document.querySelector("#memorysubtract");
const memoryaddbutton = document.querySelector("#memoryadd");

///
/// The displays
///
const maindisplay = document.querySelector("#maindisplay");
const subdisplay = document.querySelector("#subdisplay");


///
/// Declarations
///
let memorynumber = 0;
let operator = "";
let previousoperator = "";
let lastkey = "";
let numberhistory = [];
let displaylimit = 15;
let currentnumber = 0;

let operate = () => { };


///
/// Event listeners
///

clearbutton.addEventListener('click', () => {
    numberhistory = [];
    operate = () => { };
    previousoperator = "";
    operator = "";
    
    setCurrentNumber(0);
    clearDisplay();
});

deletebutton.addEventListener('click', (e) => {
    if (currentnumber === 0) {
        return;
    }

    let todisplay = currentnumber.toString().slice(0, -1);

    if (todisplay.length == 0 || todisplay == "-") {
        todisplay = "0";
    }

    setCurrentNumber(todisplay);
    setDisplay();
});

separatorbutton.addEventListener('click', () => {
    if (currentnumber.toString().includes(',') || currentnumber.toString().includes('.')) {
        if(!lastkey == "operator") {
            return;
        }

        setCurrentNumber(0);
        clearDisplay();
    }

    updateDisplay(".");
});

changesignbutton.addEventListener('click', () => {
    if (currentnumber == 0) {
        return;
    }

    // -1 * -1 = 1
    // -1 * 1 = -1
    setCurrentNumber(currentnumber * -1);
    updateDisplay();
});

operatorbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        previousoperator = operator;
        operator = e.target.value;

        // If '=' is pressed multiple times repeats the previous operation
        if (previousoperator == "=" && operator == "=") {
            numberhistory[0] = currentnumber;
        }
        // Any other operator is pressed
        else {
            if (numberhistory.length == 2) {
                numberhistory.shift();
            }
            numberhistory.push(currentnumber);

            // If the previous operator was `=` or empty string, then it should proceed as normal
            // However if the previous operator was another operator (!="=") then it should act as if `=` was pressed
            if (operator != "=" && (previousoperator != "=" && previousoperator != "")) {
                runOperate();

                numberhistory = [];
                numberhistory.push(currentnumber);
            }
        }

        if (operator == "+") {
            operate = (a, b) => a + b;
        }
        else if (operator == "-") {
            operate = (a, b) => a - b;
        }
        else if (operator == "/") {
            operate = (a, b) => a / b;
        }
        else if (operator == "*") {
            operate = (a, b) => a * b;
        }
        else if (operator == "=") {
            runOperate();
        }
        else if (operator == "%") {
            setCurrentNumber(currentnumber / 100);
            updateDisplay();
        }
    });
});

// Clears the display after the user presses certain buttons
operandbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        let keystoclearafter = ["operator", "memorysubtract", "memoryadd"];

        if (keystoclearafter.includes(lastkey)) {
            setCurrentNumber(0);
            updateDisplay();
        }

        if (currentnumber.toString().length == displaylimit) {
            return;
        }

        setCurrentNumber(button.value, true);
        updateDisplay();
    });
});

// Each time a button is pressed save its primary class
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener('click', (e) => {
        const cl = e.target.classList;

        if (cl.contains("buttondisabled")) {
            return;
        }

        if (e.target.id === "")
            lastkey = cl[0];
        else
            lastkey = e.target.id;
    });
});

window.addEventListener('keydown', function (e) {
    const button = document.querySelector(`button[value='${e.key}']`);

    if (button == null) {
        return;
    }

    if (e.shiftKey || e.altKey || e.ctrlKey) {
        return;
    }

    // Checks if it's a button used for the calculator
    // So that it doesn't prevent using the other not used keys (e.g. F11, etc.)
    if (button.classList.length >= 1) {
        e.preventDefault();
    }

    button.click();
});

// Memory Buttons
memoryclearbutton.addEventListener('click', (e) => {
    memorynumber = 0;

    memoryclearbutton.classList.add("buttondisabled");
    memoryrecallbutton.classList.add("buttondisabled");
});

memoryrecallbutton.addEventListener('click', (e) => {

    if (memoryrecallbutton.classList.contains("buttondisabled")) {
        console.log("button disabled");
        return;
    }

    setCurrentNumber(memorynumber);
    updateDisplay();
});

memoryaddbutton.addEventListener('click', (e) => {
    memorynumber += currentnumber;

    memoryclearbutton.classList.remove("buttondisabled");
    memoryrecallbutton.classList.remove("buttondisabled");
});

memorysubtractbutton.addEventListener('click', (e) => {
    memorynumber -= currentnumber;

    memoryclearbutton.classList.remove("buttondisabled");
    memoryrecallbutton.classList.remove("buttondisabled");
});

///
/// Functions
///

function clearDisplay() {
    maindisplay.textContent = "";
    subdisplay.textContent = "";

    updateDisplay();
}

/**
 * Appends to the existing value on the display.
 * @param {*} value A number or string to append to the displayed value
 * @returns 
 */
function updateDisplay(value = '') {

    if (value == "." || value == ",") {
        maindisplay.textContent = `${currentnumber}${value}`;

        return;
    }

    maindisplay.textContent = roundNumber(currentnumber);
}

/**
 * Clears display then calls updateDisplay with the passed param
 * @param {number|string} [value] A number or string to show on the display
 */
function setDisplay(value) {
    clearDisplay();
    updateDisplay(value);
}

function runOperate() {
    let result = operate(numberhistory[0], numberhistory[1]);

    if (result === undefined) {
        return;
    }

    currentnumber = result;
    setDisplay(roundNumber(result));
}

function roundNumber(number = 0) {
    let fixedpositionamount = 10;
    let numberasstr = number.toString();

    if (numberasstr.length > displaylimit) {
        if (!Number.isInteger(number)) {

            let dotindex = numberasstr.indexOf('.');
            let newfixedposamnt = fixedpositionamount - (dotindex + 1);

            fixedpositionamount = newfixedposamnt < 0 ? 0 : newfixedposamnt;
        }
    }

    return parseFloat(number.toFixed(fixedpositionamount));
}

/**
 * 
 * @param {number|string} value The value to change the currentnumber with
 * @param {boolean} combine If true combine the value with the currentnumber, if false set the currentnumber to the value
 * @returns 
 */
function setCurrentNumber(value, combine = false) {
    if (!combine) {
        currentnumber = Number(value);

        return;
    }

    currentnumber = Number(`${currentnumber}${value}`);
}