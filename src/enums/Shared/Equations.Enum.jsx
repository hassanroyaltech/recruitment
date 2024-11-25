export const EquationsEnum = {
  '+': { precedence: 1, operation: (a, b) => a + b },
  '-': { precedence: 1, operation: (a, b) => a - b },
  '*': { precedence: 2, operation: (a, b) => a * b },
  '/': { precedence: 2, operation: (a, b) => a / b },
  '%': { precedence: 2, operation: (a, b) => a % b },
  '^': { precedence: 3, operation: Math.pow },
};
