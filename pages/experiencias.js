import { useEffect, useState } from 'react';
import ExperienciaList from '../components/ExperienciaList';
import ExperienciaForm from '../components/ExperienciaForm';

export default function Experiencias() {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const URL = "http://localhost:3000/api/experiencias"
  useEffect(() => {
    setLoading(true);
    const fetchExperiencias = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setExperiencias(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExperiencias();
  }, []);

  const handleExperienciaSubmit = async (newExperiencia) => {
    try {
      const method = newExperiencia._id ? 'PUT' : 'POST';
      const endpoint = newExperiencia._id ? `${URL}/${newExperiencia._id}` : URL;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExperiencia),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la experiencia');
      }

      const data = await response.json();
      if (newExperiencia._id) {
        setExperiencias((prev) =>
          prev.map((exp) => (exp._id === data._id ? data : exp))
        );
      } else {
        setExperiencias([...experiencias, data]);
      }

      setEditingExperience(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditExperience = (newExperiencia) => {
    setEditingExperience(newExperiencia); // Cargar los datos de la experiencia seleccionada en el formulario
  };

  const handleDeleteExperience = async (expId) => {
    // Eliminar experiencia
    try {
      const response = await fetch(`${URL}/${expId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Error al eliminar la experiencia');
      }

      setExperiencias((prev) => prev.filter((exp) => exp._id !== expId)); // Actualiza la lista
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2-form>Gestión de Experiencias</h2-form>
      {loading && <p>Cargando experiencias...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          <ExperienciaList
            experiencias={experiencias}
            onDeleteExperience={handleDeleteExperience}
            onEditExperience={handleEditExperience} // Pasar la función de edición a la lista
          />
          <ExperienciaForm
            onSubmit={handleExperienciaSubmit}
            initialData={editingExperience} // Pasar los datos de edición al formulario
          />
        </>
      )}
    </div>
  );
}
