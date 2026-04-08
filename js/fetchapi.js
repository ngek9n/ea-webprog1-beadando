const apiUrl = 'php/api_mertek.php';

async function loadItems() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach((item) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nev}</td>
        <td>
          <button class="edit-btn">Szerkesztés</button>
          <button class="delete-btn">Törlés</button>
        </td>
      `;

      row.querySelector('.edit-btn').addEventListener('click', () => {
        editItem(item.id, item.nev);
      });

      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteItem(item.id);
      });

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Hiba a betöltés során:', error);
    alert('Hiba történt az adatok betöltése közben.');
  }
}

async function saveItem() {
  const id = document.getElementById('itemId').value;
  const nev = document.getElementById('nev').value.trim();

  if (nev === '') {
    alert('A név mező kitöltése kötelező.');
    return;
  }

  try {
    if (id) {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: Number(id), nev }),
      });
    } else {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nev }),
      });
    }

    clearForm();
    loadItems();
  } catch (error) {
    console.error('Hiba mentés közben:', error);
    alert('Hiba történt mentés közben.');
  }
}

function editItem(id, nev) {
  document.getElementById('itemId').value = id;
  document.getElementById('nev').value = nev;
}

async function deleteItem(id) {
  const biztos = confirm('Biztosan törölni szeretnéd ezt a rekordot?');
  if (!biztos) return;

  try {
    await fetch(`${apiUrl}?id=${id}`, {
      method: 'DELETE',
    });

    loadItems();
  } catch (error) {
    console.error('Hiba törlés közben:', error);
    alert('Hiba történt törlés közben.');
  }
}

function clearForm() {
  document.getElementById('itemId').value = '';
  document.getElementById('nev').value = '';
}

loadItems();
