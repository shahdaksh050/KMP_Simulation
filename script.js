let currentIteration = 0;
let iterations = [];
let timeoutId = null;

function startKMP() 
{
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
    if (!text || !pattern) 
    {
        infoPanel.innerHTML = '<div class="alert alert-danger">Please enter both text and pattern!</div>';
        return;
    }
    const lps = computeLPSArray(pattern);
    lpsDisplay.innerHTML = `<strong>LPS Array:</strong> [${lps.join(', ')}]`;
    const visualizationContainer = document.createElement('div');
    visualizationContainer.className = 'visualization-container';
    visualArea.appendChild(visualizationContainer);
    let i = 0;
    let j = 0;
    let found = false;

    while (i < text.length) 
    {
        const state = {
            textPos: i,
            patternPos: j,
            text: text,
            pattern: pattern,
            match: pattern[j] === text[i],
            lpsValue: j > 0 ? lps[j - 1] : 0,
            found: false
        };

        if (pattern[j] === text[i]) 
        {
            state.match = true;
            iterations.push({...state});
            i++;
            j++;
        }
        else
        {
            state.match = false;
            iterations.push({...state});
        }

        if (j === pattern.length) 
        {
            state.found = true;
            iterations.push({...state});
            found = true;
            break;
        } 
        else if (i < text.length && pattern[j] !== text[i]) 
        {
            if (j !== 0) 
            {
                j = lps[j - 1];
            } 
            else 
            {
                i++;
            }
        }
    }

    if (!found) 
    {
        iterations.push({
            textPos: i,
            patternPos: j,
            text: text,
            pattern: pattern,
            match: false,
            lpsValue: 0,
            found: false
        });
    }
    showNextIteration(found);
}

function showNextIteration(found) 
{
    if (currentIteration >= iterations.length) 
    {
        const infoPanel = document.getElementById('infoPanel');
        if (found) 
        {
            const lastIteration = iterations[iterations.length - 1];
            const index = lastIteration.textPos - lastIteration.pattern.length;
            infoPanel.innerHTML = `<div class="alert alert-success">Pattern found at index ${index}!</div>`;
        } 
        else 
        {
            infoPanel.innerHTML = '<div class="alert alert-danger">Pattern not found in the text!</div>';
        }
        return;
    }

    const iteration = iterations[currentIteration];
    const visualArea = document.getElementById('visualArea');
    visualArea.innerHTML = '';

    const iterationInfo = document.createElement('div');
    iterationInfo.className = 'iteration-info mb-3';
    iterationInfo.innerHTML = `
        <h5>Iteration ${currentIteration + 1}</h5>
        <p>Text position: ${iteration.textPos} (${iteration.text[iteration.textPos] || 'end'})</p>
        <p>Pattern position: ${iteration.patternPos} (${iteration.pattern[iteration.patternPos] || 'end'})</p>
        ${iteration.lpsValue > 0 ? `<p>LPS value used: ${iteration.lpsValue}</p>` : ''}
    `;

    const textDisplay = document.createElement('div');
    textDisplay.className = 'text-display mb-2';
    textDisplay.innerHTML = iteration.text.split('').map((char, idx) => 
        `<span class="${idx === iteration.textPos ? 'highlight' : ''}">${char}</span>`
    ).join('');
    const patternDisplay = document.createElement('div');
    patternDisplay.className = 'pattern-display mb-2';
    patternDisplay.innerHTML = iteration.pattern.split('').map((char, idx) => 
        `<span class="${idx === iteration.patternPos ? (iteration.match ? 'match' : 'mismatch') : ''}">${char}</span>`
    ).join('');
    const statusDisplay = document.createElement('div');
    statusDisplay.className = 'status-display mb-3';
    statusDisplay.innerHTML = iteration.match ? 
        '<div class="alert alert-success">Characters match!</div>' : 
        '<div class="alert alert-danger">Characters don\'t match!</div>';
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button class="btn btn-primary me-2" onclick="showNextIteration(${found})">Next Step</button>
        <button class="btn btn-success" onclick="autoPlay(${found})">Auto Play</button>
    `;
    visualArea.appendChild(iterationInfo);
    visualArea.appendChild(textDisplay);
    visualArea.appendChild(patternDisplay);
    visualArea.appendChild(statusDisplay);
    visualArea.appendChild(controls);
    currentIteration++;
}
function autoPlay(found) 
{
    if (timeoutId) clearTimeout(timeoutId);
    if (currentIteration >= iterations.length) return;
    
    showNextIteration(found);
    timeoutId = setTimeout(() => autoPlay(found), 1000);
}

function computeLPSArray(pattern) 
{
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) 
    {
        if (pattern[i] === pattern[length]) 
        {
            length++;
            lps[i] = length;
            i++;
        } 
        else 
        {
            if (length !== 0) 
            {
                length = lps[length - 1];
            } 
            else 
            {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}
