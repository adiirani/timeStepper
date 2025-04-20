const xorKey = 0x04; // Simple small key

function transform(inputString) {
    let output = "";
    for (let i = 0; i < input.length; i++) {
        output += String.fromCharCode(input.charCodeAt(i) ^ xorKey);
    }
    return output;
}