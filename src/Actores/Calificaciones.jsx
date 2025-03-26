import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Calificaciones() {
    const [respuestas, setRespuestas] = useState({
        alturaParcela: '',
        variedadCultivada: '',
        corteCereza: '',
        procesoFermentacion: '',
        tiemposFermentacion: '',
        temperaturaParcela: '',
        precipitacionPluvial1: '',
        precipitacionPluvial2: '',
        cuidadosAgroecologicos: '',
        procesoTueste: '',
    });

    const [error, setError] = useState('');

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';

    const opcionesCalificacion = Array.from({ length: 10 }, (_, i) => i + 1); // Crea un array del 1 al 10

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRespuestas(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validación: Verifica que todas las preguntas tengan respuesta
        const algunaSinResponder = Object.values(respuestas).some(respuesta => !respuesta);
        if (algunaSinResponder) {
            setError('Por favor, responde a todas las preguntas.');
            return;
        }

        // Aquí puedes enviar las respuestas al backend o hacer lo que necesites
        console.log('Respuestas:', respuestas);
        alert('Respuestas enviadas! (Ver consola para detalles)');
    };

    const renderSelector = (nombrePregunta, label) => (
        <div className="mb-3">
            <label htmlFor={nombrePregunta} className="form-label" style={{ fontWeight: 'bold', color: primaryColor }}>
                {label}
            </label>
            <select
                className="form-select"
                id={nombrePregunta}
                name={nombrePregunta}
                value={respuestas[nombrePregunta] || ''}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Selecciona una calificación</option>
                {opcionesCalificacion.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0 mt-4" style={{ width: '100%', maxWidth: '70%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 20px' }}>
                    <h2 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Calificación de Procesos de Café Lavado (1-10)
                    </h2>
                    <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        De acuerdo a su experiencia en los procesos del café lavado, distribuya calificaciones del 1 al 10,
                        entendiendo que 1 es la mínima y 10 es la máxima para alcanzar la calidad en taza de café. (No repita calificaciones)
                    </p>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                {renderSelector('alturaParcela', 'La Altura de la parcela:')}
                                {renderSelector('variedadCultivada', 'Identificar la Variedad cultivada:')}
                                {renderSelector('corteCereza', 'Controlar el proceso de corte de la cereza (Estado óptimo de Maduración):')}
                                {renderSelector('procesoFermentacion', 'Controlar el proceso de fermentación:')}
                                {renderSelector('tiemposFermentacion', 'Controlar los tiempos de fermentación:')}
                            </div>
                            <div className="col-md-6">
                                {renderSelector('temperaturaParcela', 'Temperatura de la localidad de la parcela:')}
                                {renderSelector('precipitacionPluvial1', 'La precipitación Pluvial promedio de la zona en donde se ubica la parcela (1):')}
                                {renderSelector('precipitacionPluvial2', 'La precipitación Pluvial promedio de la zona en donde se ubica la parcela (2):')}
                                {renderSelector('cuidadosAgroecologicos', 'Cuidados agroecológicos (Fertilización orgánica, poda, desmonte, etc.) del cafetal:')}
                                {renderSelector('procesoTueste', 'Controlar el proceso de Tueste:')}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mt-4">
                            <button
                                type="submit"
                                className="btn btn-lg px-4"
                                style={{
                                    background: secondaryColor,
                                    color: 'white',
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
                                }}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Calificaciones;