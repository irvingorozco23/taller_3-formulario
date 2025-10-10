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
    <form onSubmit={handleSubmit}>
        {/* Campo num_ine */}
        <div className="form-group">
            <label>Núm. Ine:</label>
            <input name="num_ine" onChange={handleInputChange} value={estudiante.num_ine} />
            {errores.num_ine && <p className="text-danger">{errores.num_ine}</p>}
        </div>

        {/* Campo nombre */}
        <div className="form-group">
            <label>Nombre:</label>
            <input name="nombre" onChange={handleInputChange} value={estudiante.nombre} />
            {errores.nombre && <p className="text-danger">{errores.nombre}</p>}
        </div>

        {/* Campo apellido_paterno */}
        <div className="form-group">
            <label>Apellido Paterno:</label>
            <input name="apellido_paterno" onChange={handleInputChange} value={estudiante.apellido_paterno} />
            {errores.apellido_paterno && <p className="text-danger">{errores.apellido_paterno}</p>}
        </div>

        {/* Campo telefono */}
        <div className="form-group">
            <label>Teléfono:</label>
            <input name="telefono" onChange={handleInputChange} value={estudiante.telefono} />
            {errores.telefono && <p className="text-danger">{errores.telefono}</p>}
        </div>

        {/* Campo correo */}
        <div className="form-group">
            <label>Correo:</label>
            <input name="correo" onChange={handleInputChange} value={estudiante.correo} />
            {errores.correo && <p className="text-danger">{errores.correo}</p>}
        </div>
        
        <button type="submit">Enviar</button>
    </form>
);
};

export default Formulario;