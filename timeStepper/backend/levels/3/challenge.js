// This function takes a string and swaps every adjacent pair of characters

function swapPairs(inputString) {
  let result = '';
  for (let i = 0; i < inputString.length; i += 2) {
      // Swap the characters in adjacent positions
      if (i + 1 < inputString.length) {
          result += inputString[i + 1] + inputString[i];
      } else {
          // If the string has an odd number of characters, add the last character as it is
          result += inputString[i];
      }
  }
  return result;
}