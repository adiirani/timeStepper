// The challenge involves shifting ASCII values by +2 for each character.

function shiftCharacters(inputString) {
  let output = '';
  for (let i = 0; i < inputString.length; i++) {
    let charCode = inputString.charCodeAt(i);
    // Shift the ASCII value by +2
    charCode += 2;
    output += String.fromCharCode(charCode);
  }
  return output;
}