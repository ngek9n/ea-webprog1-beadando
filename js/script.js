var selectedRow = null;

var restrictions = [];
var megnevezesMap = {};
var mertekMap = {};

window.onload = async function () {
  await loadAllData();
  renderInitialData();
};

async function loadAllData() {
  await loadMegnevezes();
  await loadMertek();
  await loadKorlatozas();
}

async function loadMegnevezes() {
  const response = await fetch('database/megnevezes.txt');
  const text = await response.text();

  const lines = text.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].trim().split('\t');
    const id = parts[0];
    const nev = parts[1];

    if (id && nev) {
      megnevezesMap[id] = nev;
    }
  }
}

async function loadMertek() {
  const response = await fetch('database/mertek.txt');
  const text = await response.text();

  const lines = text.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].trim().split('\t');
    const id = parts[0];
    const nev = parts[1];

    if (id && nev) {
      mertekMap[id] = nev;
    }
  }
}

async function loadKorlatozas() {
  const response = await fetch('database/korlatozas.txt');
  const text = await response.text();

  const lines = text.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].trim().split('\t');

    if (cols.length < 8) continue;

    var item = {
      utszam: cols[0] || '',
      kezdet: formatDistance(cols[1] || ''),
      veg: formatDistance(cols[2] || ''),
      telepules: cols[3] || '',
      mettol: formatDate(cols[4] || ''),
      meddig: formatDate(cols[5] || ''),
      megnevezes: megnevezesMap[cols[6]] || '',
      mertek: mertekMap[cols[7]] || '',
      sebesseg: cols[8] ? cols[8].trim() : '',
    };

    restrictions.push(item);
  }
}

function formatDate(dateStr) {
  return dateStr.replace(/\./g, '-');
}

function formatDistance(distanceStr) {
  return distanceStr.replace(',', '.');
}

function renderInitialData() {
  clearTable();

  for (var i = 0; i < restrictions.length; i++) {
    insertNewRecord(restrictions[i]);
  }
}

function clearTable() {
  var tbody = document
    .getElementById('restrictionList')
    .getElementsByTagName('tbody')[0];

  tbody.innerHTML = '';
}

function onFormSubmit() {
  if (validate()) {
    var formData = readFormData();

    if (selectedRow == null) {
      insertNewRecord(formData);
      restrictions.push(formData);
    } else {
      updateRecord(formData);
      updateArrayRecord(formData);
    }

    resetForm();
  }
}

function readFormData() {
  var formData = {};

  formData['utszam'] = document.getElementById('utszam').value.trim();
  formData['telepules'] = document.getElementById('telepules').value.trim();
  formData['kezdet'] = document.getElementById('kezdet').value.trim();
  formData['veg'] = document.getElementById('veg').value.trim();
  formData['mettol'] = document.getElementById('mettol').value;
  formData['meddig'] = document.getElementById('meddig').value;
  formData['megnevezes'] =
    document.getElementById('megnevezes').options[
      document.getElementById('megnevezes').selectedIndex
    ].text;
  formData['mertek'] =
    document.getElementById('mertek').options[
      document.getElementById('mertek').selectedIndex
    ].text;
  formData['sebesseg'] = document.getElementById('sebesseg').value.trim();

  return formData;
}

function insertNewRecord(data) {
  var table = document
    .getElementById('restrictionList')
    .getElementsByTagName('tbody')[0];

  var newRow = table.insertRow(table.length);

  newRow.insertCell(0).innerHTML = data.utszam;
  newRow.insertCell(1).innerHTML = data.telepules;
  newRow.insertCell(2).innerHTML = data.kezdet;
  newRow.insertCell(3).innerHTML = data.veg;
  newRow.insertCell(4).innerHTML = data.mettol;
  newRow.insertCell(5).innerHTML = data.meddig;
  newRow.insertCell(6).innerHTML = data.megnevezes;
  newRow.insertCell(7).innerHTML = data.mertek;
  newRow.insertCell(8).innerHTML = data.sebesseg;
  newRow.insertCell(9).innerHTML =
    '<a onClick="onEdit(this)">Szerkesztés</a> ' +
    '<a onClick="onDelete(this)">Törlés</a>';
}

function resetForm() {
  document.getElementById('utszam').value = '';
  document.getElementById('telepules').value = '';
  document.getElementById('kezdet').value = '';
  document.getElementById('veg').value = '';
  document.getElementById('mettol').value = '';
  document.getElementById('meddig').value = '';
  document.getElementById('megnevezes').value = '';
  document.getElementById('mertek').value = '';
  document.getElementById('sebesseg').value = '';

  selectedRow = null;
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;

  document.getElementById('utszam').value = selectedRow.cells[0].innerHTML;
  document.getElementById('telepules').value = selectedRow.cells[1].innerHTML;
  document.getElementById('kezdet').value = selectedRow.cells[2].innerHTML;
  document.getElementById('veg').value = selectedRow.cells[3].innerHTML;
  document.getElementById('mettol').value = selectedRow.cells[4].innerHTML;
  document.getElementById('meddig').value = selectedRow.cells[5].innerHTML;

  setSelectByText('megnevezes', selectedRow.cells[6].innerHTML);
  setSelectByText('mertek', selectedRow.cells[7].innerHTML);

  document.getElementById('sebesseg').value = selectedRow.cells[8].innerHTML;
}

function updateRecord(formData) {
  selectedRow.cells[0].innerHTML = formData.utszam;
  selectedRow.cells[1].innerHTML = formData.telepules;
  selectedRow.cells[2].innerHTML = formData.kezdet;
  selectedRow.cells[3].innerHTML = formData.veg;
  selectedRow.cells[4].innerHTML = formData.mettol;
  selectedRow.cells[5].innerHTML = formData.meddig;
  selectedRow.cells[6].innerHTML = formData.megnevezes;
  selectedRow.cells[7].innerHTML = formData.mertek;
  selectedRow.cells[8].innerHTML = formData.sebesseg;
}

function onDelete(td) {
  if (confirm('Biztosan törölni szeretnéd ezt a rekordot?')) {
    var row = td.parentElement.parentElement;
    document.getElementById('restrictionList').deleteRow(row.rowIndex);
    deleteArrayRecord(row);
    resetForm();
  }
}

function validate() {
  var isValid = true;

  if (document.getElementById('utszam').value == '') {
    isValid = false;
    document.getElementById('utszamValidationError').classList.remove('hide');
  } else {
    if (
      !document
        .getElementById('utszamValidationError')
        .classList.contains('hide')
    ) {
      document.getElementById('utszamValidationError').classList.add('hide');
    }
  }

  if (document.getElementById('telepules').value == '') {
    isValid = false;
    document
      .getElementById('telepulesValidationError')
      .classList.remove('hide');
  } else {
    if (
      !document
        .getElementById('telepulesValidationError')
        .classList.contains('hide')
    ) {
      document.getElementById('telepulesValidationError').classList.add('hide');
    }
  }

  return isValid;
}

function setSelectByText(selectId, text) {
  var select = document.getElementById(selectId);

  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].text === text) {
      select.selectedIndex = i;
      break;
    }
  }
}

function updateArrayRecord(formData) {
  var rowIndex = selectedRow.rowIndex - 1;
  restrictions[rowIndex] = formData;
}

function deleteArrayRecord(row) {
  var rowIndex = row.rowIndex - 1;
  restrictions.splice(rowIndex, 1);
}
