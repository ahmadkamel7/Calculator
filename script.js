class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() { //limpa o visor
        this.currentOperand= '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() { //deleta um único caractere do visor (o último)
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    appendNumber(number) { //chamada sempre que o usuário clica em um número
        if(number === ',') number = '.'; //números flutuantes por padrão usam ponto, precisa converter (pensando no sistema de numeração brasileiro)!
        if (number === '.' && this.currentOperand.includes('.')) return; //para o usuário não poder digitar mais de uma vírgula!
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) { //chamada sempre que o usuário clica em uma operação
        if (this.currentOperand === '') return; //não dá pra fazer uma operação no nada!
        if (this.previousOperand !== '') { //se já havia conteúdo antes (havendo outra operação também)
            this.compute(); //compute o resultado do que já estava no visor
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if(isNaN(prev) || isNaN(current)) return; //se o usuário n digitou um dos números, n faz nada
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;

            case '-':
                computation = prev - current;
                break;
        
            case '*':
                computation = prev * current;
                break;
                
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) { //pra deixar os números visualmente mais bonitinhos
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        }
        else {
            integerDisplay = integerDigits.toLocaleString('pt-br', {maximumFractionDigits: 0});
        }

        if(decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`
        }
        else { return integerDisplay; }
    }

    updateDisplay() { //atualiza os valores dentro do visor
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`; 
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => { //pra cada botão...
    button.addEventListener('click', () => { //quando é clicado...
        calculator.appendNumber(button.innerText) //adiciona seu valor em texto no visor
        calculator.updateDisplay() //atualiza o visor
    })
});

operationButtons.forEach(button => { //pra cada botão...
    button.addEventListener('click', () => { //quando é clicado...
        calculator.chooseOperation(button.innerText) //adiciona seu valor em texto no visor
        calculator.updateDisplay() //atualiza o visor
    })
});

equalsButton.addEventListener('click', (button) => { //quando clicar no =... 
    calculator.compute(); //computar o resultado e
    calculator.updateDisplay(); //exibi-lo
});

allClearButton.addEventListener('click', (button) => { //quando clicar em AC...
    calculator.clear(); //limpar os valores obtidos anteriormente e 
    calculator.updateDisplay(); //exibir o visor limpo
});

deleteButton.addEventListener('click', (button) => { //quando clicar em DEL...
    calculator.delete(); //apagar o último caractere clicado e
    calculator.updateDisplay(); //atualizar o visor sem ele
});