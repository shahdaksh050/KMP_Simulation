function buildLPS(pattern) 
{
    const lps=Array(pattern.length).fill(0);
    let len=0, i=1;
  
    while (i < pattern.length)
    {
      if (pattern[i]===pattern[len]) 
      {
        len++;
        lps[i] = len;
        i++;
      } 
      else 
      {
        if (len!==0) 
            {
          len = lps[len-1];
        } 
        else 
        {
          lps[i]=0;
          i++;
        }
      }
    }
  
    return lps;
  }
  
  function pause(ms) 
  {
    return new Promise(res => setTimeout(res, ms));
  }
  
  async function startKMP() 
  {
    const text = document.getElementById("textInput").value.trim();
    const pattern = document.getElementById("patternInput").value.trim();
    const lpsDisplay = document.getElementById("lpsDisplay");
    const visual = document.getElementById("visualArea");
    const infoPanel = document.getElementById("infoPanel");
  
    if (!text||!pattern) 
    {
      alert("Incomplete Information!");
      return;
    }
  
    lpsDisplay.innerHTML = "";
    visual.innerHTML = "";
    infoPanel.innerHTML = "";
    const lps = buildLPS(pattern);
    const lpsTitle = document.createElement("h5");
    lpsTitle.textContent = "LPS Array:";
    lpsDisplay.appendChild(lpsTitle);
    for (let i=0;i<lps.length;i++) 
    {
      const span = document.createElement("span");
      span.textContent = `P[${i}] = ${lps[i]}`;
      lpsDisplay.appendChild(span);
    }
    await pause(1000);
    let i=0, j=0, iteration=1;
    while (i<text.length) 
    {
      visual.innerHTML = "";
      infoPanel.innerHTML = `<h5>Iteration: ${iteration++}</h5><p>Text Index: ${i}, Pattern Index: ${j}</p>`;
      for (let k=0;k<text.length;k++) 
      {
        const span = document.createElement("span");
        span.textContent = text[k];
        if (k===i) span.classList.add("highlight");
        visual.appendChild(span);
      }
      visual.appendChild(document.createElement("br"));
      for (let k=0;k<i;k++) 
      {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        visual.appendChild(space);
      }
  
      for (let k=0;k<pattern.length;k++) 
      {
        const span = document.createElement("span");
        span.textContent = pattern[k];
        if (k===j) 
        {
          span.classList.add(pattern[j]===text[i]?"match":"mismatch");
        }
        visual.appendChild(span);
      }
  
      await pause(1000);
  
      if (pattern[j]===text[i]) 
      {
        i++;
        j++;
      }
  
      if (j===pattern.length) 
      {
        const matchNote = document.createElement("p");
        matchNote.innerHTML = `<strong class="text-success">Pattern is found at index ${i-j+1}</strong>`;
        infoPanel.appendChild(matchNote);
        j = lps[j-1];
      } 
      else if (i<text.length&&pattern[j]!==text[i]) 
      {
        j!==0?j=lps[j-1]:i++;
      }
    }
  
    const doneNote = document.createElement("p");
    doneNote.innerHTML = `<strong class="text-primary">KMP Simulation finished!</strong>`;
    infoPanel.appendChild(doneNote);
}
  