let currentIteration = 0;
let iterations = [];
let timeoutId = null;

function startKMP() {
    const text = document.getElementById('textInput').value;
    const pattern = document.getElementById('patternInput').value;
    const visualArea = document.getElementById('visualArea');
    const infoPanel = document.getElementById('infoPanel');
    const lpsDisplay = document.getElementById('lpsDisplay');

    if (timeoutId) clearTimeout(timeoutId);
    visualArea.innerHTML = '';
    infoPanel.innerHTML = '';
    lpsDisplay.innerHTML = '';
    currentIteration = 0;
    iterations = [];

    if (!text || !pattern) {
        infoPanel.innerHTML = '<div class="alert alert-danger">Please enter both text and pattern!</div>';
        return;
    }

    const lps = computeLPSArray(pattern);
    lpsDisplay.innerHTML = `<strong>LPS Array:</strong> [${lps.join(', ')}]`;

    let i = 0;
    let j = 0;
    const foundIndexes = [];

    while (i < text.length) {
        const currentState = {
            textPos: i,
            patternPos: j,
            text: text,
            pattern: pattern,
            matchState: pattern[j] === text[i],
            lpsValue: j > 0 ? lps[j - 1] : 0,
            found: false,
            index: -1
        };

        iterations.push({ ...currentState });

        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === pattern.length) {
            const foundIndex = i - j;
            foundIndexes.push(foundIndex);
            iterations.push({
                ...currentState,
                found: true,
                index: foundIndex
            });
            j = lps[j - 1]; // Reset j to search for subsequent matches
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }

    showNextIteration(foundIndexes);
}

function showNextIteration(foundIndexes) {
    if (currentIteration >= iterations.length) {
        const infoPanel = document.getElementById('infoPanel');
        const indexesMessage = foundIndexes.length > 0 
            ? `Pattern found at index(es): ${foundIndexes.join(', ')}`
            : 'Pattern not found in the text!';
        infoPanel.innerHTML = `<div class="alert alert-${foundIndexes.length > 0 ? 'success' : 'danger'}">${indexesMessage}</div>`;
        return;
    }

    const iteration = iterations[currentIteration];
    const visualArea = document.getElementById('visualArea');
    visualArea.innerHTML = '';

    const iterationInfo = document.createElement('div');
    iterationInfo.innerHTML = `
        <h5>Step ${currentIteration + 1}</h5>
        <p>Text Index: ${iteration.textPos} → "${iteration.text[iteration.textPos] || 'EOF'}"</p>
        <p>Pattern Index: ${iteration.patternPos} → "${iteration.pattern[iteration.patternPos] || 'EOF'}"</p>
        ${iteration.lpsValue > 0 ? `<p>LPS Jump: ${iteration.lpsValue}</p>` : ''}
    `;

    const textDisplay = document.createElement('div');
    textDisplay.className = 'mb-3';
    textDisplay.innerHTML = iteration.text.split('').map((c, idx) => 
        `<span class="${idx === iteration.textPos ? 'highlight' : ''}">${c}</span>`
    ).join('');

    const patternDisplay = document.createElement('div');
    patternDisplay.className = 'mb-3';
    patternDisplay.innerHTML = iteration.pattern.split('').map((c, idx) => 
        `<span class="${idx === iteration.patternPos ? (iteration.matchState ? 'match' : 'mismatch') : ''}">${c}</span>`
    ).join('');

    const controls = document.createElement('div');
    controls.innerHTML = `
        <button class="btn btn-primary me-2" onclick="showNextIteration(${JSON.stringify(foundIndexes)})">Next Step</button>
        <button class="btn btn-success" onclick="autoPlay(${JSON.stringify(foundIndexes)})">Auto Play</button>
    `;

    visualArea.append(iterationInfo, textDisplay, patternDisplay, controls);
    currentIteration++;
}

function autoPlay(foundIndexes) {
    if (timeoutId) clearTimeout(timeoutId);
    if (currentIteration >= iterations.length) return;

    showNextIteration(foundIndexes);
    timeoutId = setTimeout(() => autoPlay(foundIndexes), 1000);
}

function computeLPSArray(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
    }
    return lps;
}
