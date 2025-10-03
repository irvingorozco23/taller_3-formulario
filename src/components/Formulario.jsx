// src/components/Formulario.jsx
import { useState } from 'react';

// Recibimos las funciones onAgregarEstudiante y onCancelar como props
const Formulario = ({ onAgregarEstudiante, onCancelar }) => {
  
  // Estado para manejar los datos de los inputs del formulario
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  });

  // Función que se ejecuta cada vez que escribes en un input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    onAgregarEstudiante(formData); // Llama a la función del padre (App.jsx)
    // Limpia el formulario
    setFormData({ documento: '', nombre: '', apellido: '', correo: '', telefono: '' });
  };

  return (
    <div className="card">
      <div className="card-header">Formulario</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="documento" className="form-label">Documento:</label>
            <input type="text" id="documento" name="documento" className="form-control" value={formData.documento} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="apellido" className="form-label">Apellido:</label>
            <input type="text" id="apellido" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo:</label>
            <input type="email" id="correo" name="correo" className="form-control" value={formData.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">Teléfono:</label>
            <input type="tel" id="telefono" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} required />
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