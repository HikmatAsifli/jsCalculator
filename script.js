document.addEventListener('DOMContentLoaded', function () {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        memory: 0
    };

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = calculator.displayValue;
    }

    function handleKeyPress(target) {
        const { value } = target;

        if (target.classList.contains('operator')) {
            handleOperator(value);
            updateDisplay();
            return;
        }

        if (target.classList.contains('memory')) {
            handleMemory(value);
            return;
        }

        if (value === 'all-clear') {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (value === '=') {
            performCalculation();
            updateDisplay();
            return;
        }

        if (value === '%') {
            calculatePercentage();
            updateDisplay();
            return;
        }

        inputDigit(value);
        updateDisplay();
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        if (operator === '+') return firstOperand + secondOperand;
        if (operator === '-') return firstOperand - secondOperand;
        if (operator === '*') return firstOperand * secondOperand;
        if (operator === '/') return firstOperand / secondOperand;
        return secondOperand;
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function performCalculation() {
        const { firstOperand, displayValue, operator } = calculator;
        const secondOperand = parseFloat(displayValue);

        if (operator && !calculator.waitingForSecondOperand) {
            const result = calculate(firstOperand, secondOperand, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = null;
            calculator.waitingForSecondOperand = true;
            calculator.operator = null;
        }
    }

    function calculatePercentage() {
        const currentValue = parseFloat(calculator.displayValue);
        if (currentValue) {
            calculator.displayValue = `${currentValue / 100}`;
        }
    }

    function handleMemory(action) {
        const currentValue = parseFloat(calculator.displayValue);

        if (action === 'MC') {
            calculator.memory = 0;
        } else if (action === 'MR') {
            calculator.displayValue = `${calculator.memory}`;
            updateDisplay();
        } else if (action === 'M+') {
            calculator.memory += currentValue;
        } else if (action === 'M-') {
            calculator.memory -= currentValue;
        }
    }

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', event => {
        const { target } = event;
        if (!target.matches('button')) return;
        handleKeyPress(target);
    });

    document.addEventListener('keydown', event => {
        const keyMap = {
            '+': '+', '-': '-', '*': '*', '/': '/', '=': '=', 'Enter': '=',
            'Escape': 'all-clear', '%': '%'
        };

        const key = event.key;
        if (/[0-9.]/.test(key)) {
            inputDigit(key);
            updateDisplay();
        } else if (key in keyMap) {
            handleKeyPress({ value: keyMap[key] });
        }
    });

    updateDisplay();
});