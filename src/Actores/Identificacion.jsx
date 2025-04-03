import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ID_PREGUNTA_USTED = 1;
const ID_PREGUNTA_PERTENECE = 2;

function Identificacion() {
    const [usted, setUsted] = useState(null);
    const [pertenece, setPertenece] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // --- Colores (sin cambios) ---
    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';

    // --- Handlers (sin cambios) ---
    const handleUstedChange = (event) => {
        setUsted(event.target.value);
        if (error) setError('');
    };

    const handlePerteneceChange = (event) => {
        setPertenece(event.target.value);
        if (error) setError('');
    };

    // --- handleSubmit MODIFICADO ---
    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!usted || !pertenece) {
            setError('Por favor, responda ambas preguntas antes de continuar.');
            return;
        }

        // ***** INICIO: CORRECCIÓN *****
        // Crear el objeto 'identificacionData' con la estructura consistente:
        // { clavePregunta: { respuesta: valor, pregunta_id: id } }
        const identificacionData = {
            respuesta_usted: { // Clave descriptiva (podría ser 'pregunta_1' también)
                respuesta: usted,
                pregunta_id: ID_PREGUNTA_USTED
            },
            respuesta_pertenece: { // Clave descriptiva
                respuesta: pertenece,
                pregunta_id: ID_PREGUNTA_PERTENECE
            }
        };
        // ***** FIN: CORRECCIÓN *****

        console.log('Datos de Identificación corregidos y listos para enviar:', identificacionData); // Verifica la estructura en consola

        // Navega al siguiente componente pasando los datos en el estado de la ruta
        navigate('/experiencia', { state: { identificacionData } }); // '/experiencia' debe mapear a FormularioCalidadCafe
    };

    // --- JSX (sin cambios en la estructura visual) ---
    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '60%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 20px' }}>
                    {/* ... (Título, instrucciones, mensaje de error igual) ... */}
                     <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        <strong>Identificación del Encuestado</strong>
                        <br />
                        <i>Instrucciones: Marque lo que se le solicita de acuerdo al grado que usted considere.</i>
                    </p>

                    {error && (
                        <div
                            className="alert"
                            style={{
                                backgroundColor: '#FFDEDE', borderColor: '#E57373', color: '#D32F2F',
                                borderRadius: '25px', padding: '10px', marginBottom: '15px', textAlign: 'center'
                            }}
                            role="alert" >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Pregunta 1: Es usted */}
                        <div className="mb-4">
                            <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                {`${ID_PREGUNTA_USTED}.- Es usted:`}
                            </h6>
                            <div className="list-group">
                                {[
                                    { value: 'productor', label: 'Productor/a' }, { value: 'comprador', label: 'Comprador/a' },
                                    { value: 'tecnico', label: 'Técnico del Campo' }, { value: 'barista', label: 'Barista' },
                                    { value: 'catador', label: 'Catador' }, { value: 'especialista', label: 'Especialista Práctico o Conocedor/a de Café' },
                                    { value: 'investigador', label: 'Investigador/a' }, { value: 'estudiante', label: 'Estudiante relacionado con cafeología' },
                                ].map(option => (
                                    <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }} key={option.value}>
                                        <input className="form-check-input me-1" type="radio" name="usted" value={option.value} onChange={handleUstedChange} checked={usted === option.value} required /> {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Pregunta 2: Pertenece a */}
                        <div className="mb-4">
                             <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                {`${ID_PREGUNTA_PERTENECE}.- Pertenece a:`}
                            </h6>
                             <div className="list-group">
                                {[
                                    { value: 'grupoSocial', label: 'Grupo Social' }, { value: 'sectorPrivado', label: 'Sector Privado' },
                                    { value: 'sectorPublico', label: 'Sector Público (Dependencias)' },
                                    { value: 'centrosInvestigacion', label: 'Centros de Investigación/Universidades' },
                                    { value: 'ningunGrupo', label: 'No pertenece a ningún grupo' },
                                ].map(option => (
                                    <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }} key={option.value}>
                                        <input className="form-check-input me-1" type="radio" name="pertenece" value={option.value} onChange={handlePerteneceChange} checked={pertenece === option.value} required /> {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Botón Siguiente */}
                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-lg px-4" style={{ background: secondaryColor, color: 'white', borderRadius: '25px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontWeight: 'bold', transition: 'all 0.3s ease', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                                Siguiente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Identificacion;