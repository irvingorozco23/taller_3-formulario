// src/components/ListaEstudiantes.jsx

// Recibimos la lista y la función para eliminar como props
const ListaEstudiantes = ({ estudiantes, onEliminar }) => {
  return (
    <div className="card">
      <div className="card-header">Lista de Estudiantes</div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.num_ine}>
                <td>{estudiante.num_ine}</td>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.apellido_paterno}</td>
                <td>{estudiante.correo}</td>
                <td>{estudiante.telefono}</td>
                <td>
                  {/* Botón de eliminar que llama a la función onEliminar con el ID */}
                  <button 
                    className="btn btn-danger" 
                    onClick={() => onEliminar(estudiante.num_ine)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaEstudiantes;