import { useState } from 'react';

// El prop onAgregarEstudiante ya no se usará para guardar en la BD.
// Lo podemos quitar o dejar si tiene otro uso, como actualizar la UI.
const Formulario = ({ onAgregarEstudiante, onCancelar }) => {
  
  // 1. Estado ajustado para coincidir con la base de datos
  const [formData, setFormData] = useState({
    num_ine: '',
    nombre: '',
    apellido_paterno: '',
    correo: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. handleSubmit modificado para enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👇 AÑADE ESTA LÍNEA AQUÍ
    console.log("Datos que se están enviando:", formData);

    try {
      const response = await fetch('http://localhost:3001/api/estudiantes',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Estudiante añadido exitosamente!');
        // Opcional: Llama a la función del padre para actualizar la lista en la UI
        if(onAgregarEstudiante) onAgregarEstudiante(); 
        // Limpia el formulario
        setFormData({ num_ine: '', nombre: '', apellido_paterno: '', correo: '', telefono: '' });
      } else {
        alert('Error al guardar el estudiante.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">Formulario</div>
      <div className="card-body">
        {/* 3. Actualizar los 'name' en los inputs */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="num_ine" className="form-label">Núm. Ine:</label>
            <input type="text" id="num_ine" name="num_ine" className="form-control" value={formData.num_ine} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno:</label>
            <input type="text" id="apellido_paterno" name="apellido_paterno" className="form-control" value={formData.apellido_paterno} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo:</label>
            <input type="email" id="correo" name="correo" className="form-control" value={formData.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">Teléfono:</label>
            <input type="tel" id="telefono" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-success">Enviar</button>
            <button type="button" className="btn btn-info" onClick={onCancelar}>Restablecer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;