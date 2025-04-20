function reversePairs(input) {
    let output = '';
    for (let i = 0; i < input.length; i += 2) {
        // Reverse the pair
        output += input.charAt(i + 1) + input.charAt(i);
    }
    return output;
}
