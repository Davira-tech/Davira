let result = document.getElementById('result');

// Append values to the result input field
function appendToResult(value) {
  result.value += value;
}

// Clear the result input field
function clearResult() {
  result.value = '';
}

// Calculate the result
function calculateResult() {
  try {
    result.value = eval(result.value);
  } catch (e) {
    result.value = 'Error';
  }
}

// Cut the last symbol, number, or operator (acts like backspace)
function cutResult() {
  let currentValue = result.value;
  
  // If there's no value in the input field, do nothing
  if (currentValue.length === 0) {
    return;
  }

  // Remove the last character (could be a number, operator, or symbol)
  result.value = currentValue.slice(0, -1);
}
