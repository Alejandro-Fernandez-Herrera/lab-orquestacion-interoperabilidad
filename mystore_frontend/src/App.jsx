// Agregamos useEffect a los imports existentes de React
import { useState, useEffect } from 'react'
import { Form, Button } from "react-bootstrap";
import './App.css'
import superstoreimg from './superstore.png';

export const App = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Nuevo estado: un array vacío que va a almacenar las categorías
  // que lleguen desde la API
  const [categories, setCategories] = useState([]);

  // Función separada para obtener categorías — la reutilizamos
  // tanto al cargar la página como después de crear una nueva
  const fetchCategories = () => {
    fetch("http://localhost:4000/categories/")
      .then((response) => response.json())
      .then((data) => setCategories(data)); // guardamos el array en el estado
  };

  // useEffect se ejecuta automáticamente cuando el componente
  // se monta por primera vez (el [] vacío significa "solo al inicio")
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/categories/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Después de crear la categoría, actualizamos la lista
        // para que aparezca inmediatamente sin recargar la página
        fetchCategories();
        // Limpiamos el formulario
        setName("");
        setDescription("");
      });
  };

  return (
    <div className="App">
      <img src={superstoreimg} alt="Super Store" className="imagen" />

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>

      {/* Sección nueva: lista de categorías debajo del formulario */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Categorías registradas</h3>
        {/* Si no hay categorías, mostramos un mensaje. 
            Si hay, las renderizamos como una lista */}
        {categories.length === 0 ? (
          <p>No hay categorías registradas.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categories.map((cat) => (
              // Cada elemento de la lista necesita un key único —
              // usamos el id que MySQL asigna automáticamente
              <li key={cat.id} style={{ 
                margin: "0.5rem 0", 
                padding: "0.5rem", 
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}>
                <strong>{cat.name}</strong>: {cat.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};