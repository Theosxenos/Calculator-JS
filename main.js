///
/// The buttons
///
const operandbuttons = document.querySelectorAll(".operand");
const operatorbuttons = document.querySelectorAll(".operator");
const clearbutton = document.querySelector("#clearbutton");
const deletebutton = document.querySelector("#deletebutton");
const separatorbutton = document.querySelector(".separator");

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
let makenumberfloat = false;

let operate = () => { };

const currentnumber = () => maindisplay.textContent;

///
/// Event listeners
///

clearbutton.addEventListener('click', () => {
    numberhistory = [];
    operate = () => {};
    previousoperator = "";
    operator = "";
    
    setDisplay(0);
});

deletebutton.addEventListener('click', (e) => {
    if (currentnumber() === "0") {
        return;
    }

    let todisplay = currentnumber().slice(0, -1);
    
    if (todisplay.length == 0 || todisplay == "-") {
        todisplay = "0";
    }

    setDisplay(todisplay);
});

separatorbutton.addEventListener('click', () => {
    if(currentnumber().includes(',') || currentnumber().includes('.')) {
        makenumberfloat = false;
        return;
    }

    makenumberfloat = true;

    updateDisplay(".");
});

operatorbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        previousoperator = operator;
        operator = e.target.value;

        // If '=' is pressed multiple times repeats the previous operation
        if(previousoperator == "=" && operator == "=") {
            numberhistory[0] = Number(currentnumber());
        } 
        // Any other operator is pressed
        else {
            if (numberhistory.length == 2) {
                numberhistory.shift();
            }
            numberhistory.push(Number(currentnumber()));

            // If the previous operator was `=` or empty string, then it should proceed as normal
            // However if the previous operator was another operator (!="=") then it should act as if `=` was pressed
            if (operator != "=" && (previousoperator != "=" && previousoperator != "")) {
                runOperate();

                numberhistory = [];
                numberhistory.push(currentnumber())
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
        else if (operator == "chs") {
            if (currentnumber() == "0") {
                return;
            }

            // -1 * -1 = 1
            // -1 * 1 = -1
            let changednumber = -1 * Number(currentnumber());

            setDisplay(changednumber);
        }
        else if(operator =="%") {
            setDisplay(Number(currentnumber()) / 100)
        }
    });
});

operandbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        let keystoclearafter = ["operator", "memorysubtract", "memoryadd"];

        if (keystoclearafter.includes(lastkey)) {
            clearDisplay();
        }

        updateDisplay(button.value);
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

    if(button == null) {
        return;
    }

    // Checks if it's a button used for the calculator
    // So that it doesn't prevent using the other not used keys (e.g. F11, etc.)
    if(button.classList.length >= 1)
    {
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

    setDisplay(memorynumber);
});

memoryaddbutton.addEventListener('click', (e) => {
    memorynumber += Number(currentnumber());

    memoryclearbutton.classList.remove("buttondisabled");
    memoryrecallbutton.classList.remove("buttondisabled");
});

memorysubtractbutton.addEventListener('click', (e) => {
    memorynumber -= Number(currentnumber());

    memoryclearbutton.classList.remove("buttondisabled");
    memoryrecallbutton.classList.remove("buttondisabled");
});

///
/// Functions
///

function clearDisplay() {
    maindisplay.textContent = "";
    subdisplay.textContent = "";

    updateDisplay(0);
}

/**
 * Appends to the existing value on the display.
 * @param {*} number A number or string to append to the displayed value
 * @returns 
 */
function updateDisplay(number) {

    if(currentnumber() === "0" && number != ".") {
        maindisplay.textContent = number;

        return;
    }

    maindisplay.textContent = `${currentnumber()}${number}`;
}

/**
 * Clears display then calls updateDisplay with the passed param
 * @param {*} number A number or string to show on the display
 */
function setDisplay(number) {
    clearDisplay();
    updateDisplay(number);
}

function runOperate() {
    let result = operate(numberhistory[0], numberhistory[1]);
            
    if(result === undefined) {
        return;
    }

    setDisplay(parseFloat(result.toFixed(10)));
}