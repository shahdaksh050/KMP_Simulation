function runKMP() {
    const text = document.getElementById('text').value;
    const pattern = document.getElementById('pattern').value;
    const output = document.getElementById('output');

    const lps = computeLPSArray(pattern);
    let i = 0;
    let j = 0;
    let found = false;
    
    while (i < text.length) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        if (j === pattern.length) {
            output.innerHTML = `Pattern found at index ${i - j}`;
            found = true;
            break;  // Terminate as soon as the pattern is found
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    if (!found) {
        output.innerHTML = "Pattern not found!";
    }
}

function computeLPSArray(pattern) {
    const lps = Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}
