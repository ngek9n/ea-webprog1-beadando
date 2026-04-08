import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/php/api_mertek.php";

function App() {
  const [items, setItems] = useState([]);
  const [nev, setNev] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Hiba a betöltés során:", error);
      alert("Nem sikerült betölteni az adatokat.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (nev.trim() === "") {
      alert("A név mező kitöltése kötelező.");
      return;
    }

    try {
      if (editingId) {
        await fetch(API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(editingId),
            nev: nev.trim(),
          }),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nev: nev.trim(),
          }),
        });
      }

      clearForm();
      loadItems();
    } catch (error) {
      console.error("Hiba mentés közben:", error);
      alert("Nem sikerült menteni az adatot.");
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setNev(item.nev);
  }

  async function handleDelete(id) {
    const biztos = confirm("Biztosan törölni szeretnéd ezt a rekordot?");
    if (!biztos) return;

    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });
      loadItems();
    } catch (error) {
      console.error("Hiba törlés közben:", error);
      alert("Nem sikerült törölni az adatot.");
    }
  }

  function clearForm() {
    setEditingId("");
    setNev("");
  }

  return (
    <div className="container">
      <h1>React CRUD - Mértékek</h1>

      <form className="form-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mérték megnevezése"
          value={nev}
          onChange={(e) => setNev(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Módosítás mentése" : "Hozzáadás"}
        </button>

        <button type="button" onClick={clearForm}>
          Űrlap törlése
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nev}</td>
              <td className="actions">
                <button onClick={() => handleEdit(item)}>Szerkesztés</button>
                <button onClick={() => handleDelete(item.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;