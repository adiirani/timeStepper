// Your task is to reverse this transformation:
// The original string had each character interleaved with its index+1.
// Example: "abc" became "a1b2c3"

function check(inputString) {
    // Recreate the transformation
    let transformed = '';
    for (let i = 0; i < inputString.length; i++) {
        transformed += inputString[i] + (i + 1).toString();
    }
    return transformed === "{passphrase}";
}
