import { useState, useEffect } from 'react';
// ¡Asegúrate de que esta importación esté presente!
import './App.css';

function App() {
  const [estudiante, setEstudiante] = useState({
    ine: '',
    nombre: '',
    paterno: '',
    telefono: '',
    correo: ''
  });
  const [listaEstudiantes, setListaEstudiantes] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar estudiantes desde el backend al iniciar
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/estudiantes');
      const data = await response.json();
      setListaEstudiantes(data);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEstudiante({ ...estudiante, [name]: value });
  };

  const handleReset = () => {
    setEstudiante({ ine: '', nombre: '', paterno: '', telefono: '', correo: '' });
    setError('');
    setMensaje('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!estudiante.ine.trim() || !estudiante.nombre.trim() || !estudiante.paterno.trim()) {
      setError("Los campos INE, Nombre y Apellido son obligatorios.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/estudiantes', {
//...
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_ine: estudiante.ine,
          nombre: estudiante.nombre,
          apellido_paterno: estudiante.paterno,
          telefono: estudiante.telefono,
          correo: estudiante.correo
        }),
      });

      if (response.ok) {
        setMensaje('¡Estudiante registrado exitosamente!');
        fetchEstudiantes(); // Recargar la lista
        handleReset();
      } else {
        setError('No se pudo registrar el estudiante. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión al intentar registrar.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este estudiante?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/estudiantes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMensaje('Estudiante eliminado.');
        fetchEstudiantes(); // Recargar la lista
      } else {
        setError('No se pudo eliminar el estudiante.');
      }
    } catch (err) {
      setError('Error de conexión al intentar eliminar.');
    }
  };

  return (
    <div className="main-wrapper">
      <div className="card">
        <div className="card-header">Formulario</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            {mensaje && <p style={{color: 'green'}}>{mensaje}</p>}
            
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
      </div>

      <div className="card">
        <div className="card-header">Lista de Estudiantes</div>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaEstudiantes.map((est) => (
                  <tr key={est.num_ine}>
                    <td>{est.num_ine}</td>
                    <td>{est.nombre}</td>
                    <td>{est.apellido_paterno}</td>
                    <td>{est.telefono}</td>
                    <td>{est.correo}</td>
                    <td>
                      <button onClick={() => handleEliminar(est.num_ine)} className="btn btn-danger">Eliminar</button>
                    </td>
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

