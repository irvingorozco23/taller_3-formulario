// 1. Importamos 'useState' y 'useEffect'.
import { useState, useEffect } from 'react';
// Mantenemos la importación de tu archivo CSS local.
import './App.css';

function App() {
  // Estado para guardar los datos del formulario actual
  const [estudiante, setEstudiante] = useState({
    ine: '',
    nombre: '',
    paterno: '',
    telefono: '',
    correo: ''
  });

  // Estado para el mensaje de error
  const [error, setError] = useState('');

  // 2. LEER DATOS DE LOCAL STORAGE AL INICIAR
  const [listaEstudiantes, setListaEstudiantes] = useState(() => {
    try {
      const estudiantesGuardados = localStorage.getItem('listaEstudiantes');
      return estudiantesGuardados ? JSON.parse(estudiantesGuardados) : [];
    } catch (error) {
      console.error("Error al leer de Local Storage", error);
      return [];
    }
  });

  // 3. GUARDAR DATOS EN LOCAL STORAGE CUANDO HAY CAMBIOS
  useEffect(() => {
    try {
      localStorage.setItem('listaEstudiantes', JSON.stringify(listaEstudiantes));
    } catch (error) {
      console.error("Error al guardar en Local Storage", error);
    }
  }, [listaEstudiantes]);

  // Función que se ejecuta cada vez que escribes en un campo del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEstudiante({ ...estudiante, [name]: value });
    if (error) {
      setError('');
    }
  };

  // Función que se ejecuta al presionar el botón "Enviar"
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!estudiante.ine.trim() || !estudiante.nombre.trim()) {
      setError("Debes completar al menos el Número de INE y el Nombre.");
      return;
    }

    setListaEstudiantes([...listaEstudiantes, estudiante]);
    handleReset();
    setError('');
  };

  // Función para limpiar los campos del formulario
  const handleReset = () => {
    setEstudiante({
      ine: '',
      nombre: '',
      paterno: '',
      telefono: '',
      correo: ''
    });
  };

  return (
    <div className="main-wrapper">
      <div className="card">
        <div className="card-header">
          Formulario
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <label htmlFor="ine">Núm. Ine:</label>
              <input type="text" id="ine" name="ine" className="form-control" value={estudiante.ine} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" className="form-control" value={estudiante.nombre} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="paterno">Apellido Paterno:</label>
              <input type="text" id="paterno" name="paterno" className="form-control" value={estudiante.paterno} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input type="tel" id="telefono" name="telefono" className="form-control" value={estudiante.telefono} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo:</label>
              <input type="email" id="correo" name="correo" className="form-control" value={estudiante.correo} onChange={handleInputChange} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-success">Enviar</button>
              <button type="button" onClick={handleReset} className="btn btn-info">Restablecer</button>
            </div>
          </form>
        </div>
        <div className="card-header">
          Lista de Estudiantes
        </div>
        <div className="card-body">
          {listaEstudiantes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Núm. Ine</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {listaEstudiantes.map((est, index) => (
                  <tr key={index}>
                    <td>{est.ine}</td>
                    <td>{est.nombre}</td>
                    <td>{est.paterno}</td>
                    <td>{est.telefono}</td>
                    <td>{est.correo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-students-message">No hay estudiantes registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

