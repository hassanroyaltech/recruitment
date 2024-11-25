import { EquationsEnum } from '../enums';

export const EquationsParser = (expression) => {
  const operators = Object.keys(EquationsEnum);
  const outputQueue = [];
  const operatorStack = [];

  let currentNumber = '';
  for (const char of expression)
    if (/\d/.test(char) || char === '.') currentNumber += char;
    else {
      if (currentNumber !== '') {
        outputQueue.push(parseFloat(currentNumber));
        currentNumber = '';
      }

      if (operators.includes(char)) {
        while (
          operatorStack.length > 0
          && precedence(operatorStack[operatorStack.length - 1]) >= precedence(char)
          && char !== '('
        )
          outputQueue.push(operatorStack.pop());

        operatorStack.push(char);
      } else if (char === '(') operatorStack.push(char);
      else if (char === ')') {
        while (
          operatorStack.length > 0
          && operatorStack[operatorStack.length - 1] !== '('
        )
          outputQueue.push(operatorStack.pop());

        operatorStack.pop();
      } else
        throw new Error(
          'Cannot calculate this equation, please make sure to fill all if the fields values',
        );
    }

  if (currentNumber !== '') outputQueue.push(parseFloat(currentNumber));

  while (operatorStack.length > 0) outputQueue.push(operatorStack.pop());

  const stack = [];
  for (const char of outputQueue)
    if (!operators.includes(char)) stack.push(char);
    else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
      const operation = EquationsEnum[char].operation;
      stack.push(operation(operand1, operand2));
    }

  if (stack.length !== 1) throw new Error('Invalid expression format');

  return stack.pop();
};

const precedence = (operator) => {
  // Define precedence based on operator (adjust as needed)
  switch (operator) {
  case '^':
    return 3;
  case '*':
  case '/':
  case '%':
    return 2;
  case '+':
  case '-':
    return 1;
  default:
    return 0;
  }
};
