///
/// The buttons
///
const operandbuttons = document.querySelectorAll(".operand");
const operatorbuttons = document.querySelectorAll(".operator");
const clearbutton = document.querySelector("#clearbutton");
const deletebutton = document.querySelector("#deletebutton");

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
let currentnumber = 0;
let memorynumber = 0;
let operator;
let previousoperator;
let lastkey = "";

let mathfunction = () => { };

///
/// Event listeners
///

clearbutton.addEventListener('click', () => clearDisplay());

deletebutton.addEventListener('click', (e) => {
    if (currentnumber == 0) {
        return;
    }
    
    currentnumber = Number(String(currentnumber).slice(0, -1));
    updateDisplay();
});

operatorbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        operator = e.target.value;
    });
});

operandbuttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        updateDisplay(button.value);
    });
});

// Each time a button is pressed save its primary class
// Probably more future proof to check for a couple of pre-defined classes
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener('click', (e) => {
        const cl = e.target.classList;

        if (cl.contains("buttondisabled")) {
            return;
        }

        lastkey = cl[0];
    });
});

window.addEventListener('keydown', function (e) {
    const button = document.querySelector(`button[value='${e.key}']`);
    if (button != null) {
        button.click();
    }
});

// Memory Buttons
memoryclearbutton.addEventListener('click', (e) => {
    memorynumber = 0;

    memoryclearbutton.classList.add("buttondisabled");
    memoryrecallbutton.classList.add("buttondisabled");
});

memoryrecallbutton.addEventListener('click', (e) => {
    
    if(memoryrecallbutton.classList.contains("buttondisabled")) {
        console.log("button disabled");
        return;
    }
    
    currentnumber = memorynumber;
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

    currentnumber = 0;

    updateDisplay();
}

function updateDisplay(number) {
    if (number != undefined)
    {
        currentnumber = Number(`${currentnumber}${number}`);
    }

    maindisplay.textContent = currentnumber;

}

function addNumbers(a, b) {
    return a + b;
}

function subtractNumbers(a, b) {
    return a - b;
}

function divideNumbers(a, b) {
    return a / b;
}

function multiplyNumbers(a, b) {
    return a * b;
}

function changeSign()
{
    if (currentnumber == 0) 
    {
        return;
    }

    // -1 * -1 = 1
    // -1 * 1 = -1
    currentnumber *= -1;    

    updateDisplay();

}