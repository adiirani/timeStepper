function reverseHalves(inputString) {
    const halfLength = Math.floor(inputString.length / 2);
    const firstHalf = inputString.slice(0, halfLength).split('').reverse().join('');
    const secondHalf = inputString.slice(halfLength).split('').reverse().join('');
    return firstHalf + secondHalf;
}
