import { useState, useEffect } from 'react';
// ¡Asegúrate de que esta importación esté presente!
import './App.css';
function App() {
  const [estudiante, setEstudiante] = useState({
    num_ine: '',
    nombre: '',
    apellido_paterno: '',
    telefono: '',
    correo: ''
  });

  const [listaEstudiantes, setListaEstudiantes] = useState([]);
  const [erroresDeCampo, setErroresDeCampo] = useState({});
  const [errorDeApi, setErrorDeApi] = useState('');
  const [mensaje, setMensaje] = useState('');

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/estudiantes');
      const data = await response.json();
      setListaEstudiantes(data);
    } catch (err) {
      setErrorDeApi('No se pudo conectar con el servidor.');
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
    setEstudiante({ num_ine: '', nombre: '', apellido_paterno: '', telefono: '', correo: '' });
    setErroresDeCampo({});
    setErrorDeApi('');
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDeApi('');
    setMensaje('');

    const nuevosErrores = {};
    if (!estudiante.num_ine.trim()) nuevosErrores.num_ine = "El Núm. de INE es obligatorio.";
    if (!estudiante.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!estudiante.apellido_paterno.trim()) nuevosErrores.apellido_paterno = "El apellido es obligatorio.";
    if (estudiante.correo && !/\S+@\S+\.\S+/.test(estudiante.correo)) nuevosErrores.correo = "El correo no es válido.";
    if (estudiante.telefono && !/^\d{10}$/.test(estudiante.telefono)) nuevosErrores.telefono = "El teléfono debe tener 10 dígitos.";

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresDeCampo(nuevosErrores);
      return; 
    }
    setErroresDeCampo({});
    
    try {
      const response = await fetch('http://localhost:3001/api/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante),
      });

      if (response.ok) {
        setMensaje('¡Estudiante registrado exitosamente!');
        fetchEstudiantes();
        handleReset();
      } else {
        const errorData = await response.json();
        setErrorDeApi(errorData.error || 'No se pudo registrar el estudiante.');
      }
    } catch (err) {
      setErrorDeApi('Error de conexión al intentar registrar.');
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/estudiantes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMensaje('Estudiante eliminado exitosamente.');
        fetchEstudiantes();
      } else {
        setErrorDeApi('No se pudo eliminar el estudiante.');
      }
    } catch (err) {
      setErrorDeApi('Error de conexión al intentar eliminar.');
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="card">
          <div className="card-header">Formulario</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {errorDeApi && <p className="error-message">{errorDeApi}</p>}
              {mensaje && <p className="success-message">{mensaje}</p>}
              
              <div className="form-group">
                <label htmlFor="num_ine">Núm. Ine:</label>
                <input type="text" id="num_ine" name="num_ine" className="form-control" value={estudiante.num_ine} onChange={handleInputChange} />
                {erroresDeCampo.num_ine && <p className="error-message-field">{erroresDeCampo.num_ine}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" className="form-control" value={estudiante.nombre} onChange={handleInputChange} />
                {erroresDeCampo.nombre && <p className="error-message-field">{erroresDeCampo.nombre}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="apellido_paterno">Apellido Paterno:</label>
                <input type="text" id="apellido_paterno" name="apellido_paterno" className="form-control" value={estudiante.apellido_paterno} onChange={handleInputChange} />
                {erroresDeCampo.apellido_paterno && <p className="error-message-field">{erroresDeCampo.apellido_paterno}</p>}
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
    </>
  );
}

export default App;