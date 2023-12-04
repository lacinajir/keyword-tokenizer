const submitButton = document.getElementById('submit');
const resetButton = document.getElementById('reset');
const keywordsInput = document.getElementById('keywords');
const volumesInput = document.getElementById('volumes');
const resultsTable = document.getElementById('results');
const resultsBody = resultsTable.getElementsByTagName('tbody')[0];
const copyButton = document.getElementById('copy');
const volumeCounter = document.getElementById('volumesCounter');
const keywordCounter = document.getElementById('keywordsCounter');
const exportCsvButton = document.getElementById('export-csv');

const stopwords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'];

function updateCountsAndTotal() {
  let keywordValues = keywordsInput.value.split('\n').filter(val => val !== '');
  let volumeValues = volumesInput.value.split('\n').filter(val => val !== '');

  let keywordCounter = keywordValues.length;
  keywordsCounter.textContent = `${keywordCounter}`;

  let volumeCounter = volumeValues.length;
  volumesCounter.textContent = `${volumeCounter}`;

  let totalVolume = 0;
  for (let i = 0; i < keywordValues.length; i++) {
    if (volumeValues[i]) {
      totalVolume += parseInt(volumeValues[i], 10);
    }
  }

  let formattedTotalVolume = totalVolume.toLocaleString();
  volumeSum.textContent = formattedTotalVolume;
}

keywordsInput.addEventListener('input', updateCountsAndTotal);
volumesInput.addEventListener('input', updateCountsAndTotal);

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("results");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

submitButton.addEventListener('click', () => {
  const keywords = keywordsInput.value.trim().split('\n');
  const volumes = volumesInput.value.trim().split('\n');

  if (!keywords || !keywords[0] || !volumes || !volumes[0]) {
    alert('Enter keywords and volumes.');
    document.getElementById('hiddenPara').style.display = "none";
    return;
  }
  
  if (keywords.length !== volumes.length) {
    alert('Number of keywords and number of volumes do not match.');
    document.getElementById('hiddenPara').style.display = "none";
    return;
  }

  const tokensMap = {};

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i].toLowerCase();
    const volume = parseInt(volumes[i].replace(/\D/g, ''));
   
    if (isNaN(volume)) {
        return;
      }

    const tokens = keyword.split(/\s+/);
    for (const token of tokens) {
      if (stopwords.indexOf(token) === -1) {
        if (tokensMap[token]) {
          tokensMap[token] += volume;
        } else {
          tokensMap[token] = volume;
        }
      }
    }
  }

  resultsBody.innerHTML = '';
  for (const token in tokensMap) {
    const row = document.createElement('tr');
    const tokenCell = document.createElement('td');
    tokenCell.textContent = token;
    row.appendChild(tokenCell);
    const volumeCell = document.createElement('td');
    volumeCell.textContent = tokensMap[token];
    row.appendChild(volumeCell);
    resultsBody.appendChild(row);
    document.getElementById('hiddenDiv').style.display = "block";
    document.getElementById('hiddenPara').style.display = "block";

  }
});

resetButton.addEventListener('click', () => {
    keywordsInput.value = "";
    volumesInput.value = "";
    resultsBody.innerHTML = '';
    volumesCounter.textContent = 0;
    keywordsCounter.textContent = 0;
    volumeSum.textContent = 0;
    document.getElementById('hiddenDiv').style.display = "none";
    document.getElementById('hiddenPara').style.display = "none";
    copyButton.textContent = 'Copy table';
  });
  

copyButton.addEventListener('click', () => {
    let tableContent = '';
  
    for (const row of resultsTable.rows) {
      let rowContent = '';
      for (const cell of row.cells) {
        rowContent += cell.textContent + '\t';
      }
      tableContent += rowContent.slice(0, -1) + '\n';
    }
  
    const tempInput = document.createElement('textarea');
    tempInput.value = tableContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    copyButton.textContent = 'Copied!';
  });
  
  exportCsvButton.addEventListener('click', () => {
    let tableContent = '';
  
    for (const row of resultsTable.rows) {
      let rowContent = '';
      for (const cell of row.cells) {
        rowContent += cell.textContent + ',';
      }
      tableContent += rowContent.slice(0, -1) + '\n';
    }
  
    const blob = new Blob([tableContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'token_table.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
