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

keywordsInput.addEventListener('input', function () {
    let keywordCounter = this.value.split('\n').length;
    if (keywordCounter === 1 && this.value === '') {
      keywordCounter = 0;
    }
    keywordsCounter.textContent = `${keywordCounter}`;

    let keywordValues = this.value.split('\n').filter(val => val !== '');
    let volumeValues = volumesInput.value.split('\n').filter(val => val !== '');

    let totalVolume = 0;
    for (let i = 0; i < keywordValues.length; i++) {
      if (volumeValues[i]) {
        totalVolume += parseInt(volumeValues[i], 10);
      }
    }
    volumeSum.textContent = totalVolume;
  });  

  volumesInput.addEventListener('input', function () {
    let volumeCounter = this.value.split('\n').length;
    if (volumeCounter === 1 && this.value === '') {
      volumeCounter = 0;
    }
    volumesCounter.textContent = `${volumeCounter}`;

    let keywordValues = keywordsInput.value.split('\n').filter(val => val !== '');
    let volumeValues = this.value.split('\n').filter(val => val !== '');

    let totalVolume = 0;
    for (let i = 0; i < keywordValues.length; i++) {
      if (volumeValues[i]) {
        totalVolume += parseInt(volumeValues[i], 10);
      }
    }
    volumeSum.textContent = totalVolume;
  });  

/* Without volume sum counter
  keywordsInput.addEventListener('input', function () {
    let keywordCounter = this.value.split('\n').length;
    if (keywordCounter === 1 && this.value === '') {
      keywordCounter = 0;
    }
    keywordsCounter.textContent = `${keywordCounter}`;
  });  

  volumesInput.addEventListener('input', function () {
    let volumeCounter = this.value.split('\n').length;
    if (volumeCounter === 1 && this.value === '') {
      volumeCounter = 0;
    }
    volumesCounter.textContent = `${volumeCounter}`;
  });  
*/

submitButton.addEventListener('click', () => {
  const keywords = keywordsInput.value.trim().split('\n');
  const volumes = volumesInput.value.trim().split('\n');

  if (!keywords || !keywords[0] || !volumes || !volumes[0]) {
    alert('Enter keywords and volumes.');
    return;
  }
  
  if (keywords.length !== volumes.length) {
    alert('Number of keywords and number of volumes do not match.');
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
