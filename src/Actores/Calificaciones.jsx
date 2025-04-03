import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const API_ENDPOINT = '/api/encuesta/respuestas'; 

const PREGUNTA_IDS = {
    alturaParcela: 14,
    variedadCultivada: 15,
    corteCereza: 16,
    procesoFermentacion: 17,
    tiemposFermentacion: 18,
    temperaturaParcela: 19,
    precipitacionPluvial1: 20,
    precipitacionPluvial2: 21,
    cuidadosAgroecologicos: 22,
    procesoTueste: 23,
};



function Calificaciones() {
    const [respuestas, setRespuestas] = useState({
        alturaParcela: '', variedadCultivada: '', corteCereza: '',
        procesoFermentacion: '', tiemposFermentacion: '', temperaturaParcela: '',
        precipitacionPluvial1: '', precipitacionPluvial2: '', cuidadosAgroecologicos: '',
        procesoTueste: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 
    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';

    const opcionesCalificacion = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRespuestas(prevState => ({
            ...prevState,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const todasRespondidas = Object.values(respuestas).every(respuesta => respuesta !== '');
        if (!todasRespondidas) {
            setError('Por favor, responde a todas las preguntas.');
            return;
        }

        const calificaciones = Object.values(respuestas);
        const calificacionesUnicas = new Set(calificaciones);
        if (calificaciones.length !== calificacionesUnicas.size) {
            setError('Por favor, no repita las calificaciones. Cada valor del 1 al 10 debe usarse una sola vez.');
            return;
        }

        const dataToSend = Object.entries(respuestas)
            .map(([key, value]) => ({
                pregunta_id: PREGUNTA_IDS[key],
                respuesta: value 
            }));

        console.log('Datos a enviar a la API:', dataToSend);
        setIsLoading(true);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                let errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || JSON.stringify(errorData);
                } catch (jsonError) {
                    console.error("No se pudo parsear la respuesta de error como JSON:", jsonError);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Respuesta exitosa de la API:', result);

          
            alert('Respuestas enviadas correctamente!');
            
            navigate('/'); 

        } catch (err) {
            console.error('Error al enviar los datos a la API:', err);
            setError(`Error al guardar las respuestas: ${err.message}. Por favor, inténtelo de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSelector = (nombrePregunta, label) => {
        const idNumerico = PREGUNTA_IDS[nombrePregunta];
        const labelCompleto = `${idNumerico}.- ${label}`;
        return (
            <div className="mb-4"> 
                <label htmlFor={nombrePregunta} className="form-label" style={{ fontWeight: 'bold', color: primaryColor, fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
                    {labelCompleto}
                </label>
                <select
                    className="form-select"
                    id={nombrePregunta}
                    name={nombrePregunta}
                    value={respuestas[nombrePregunta] || ''}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    <option value="" disabled>Selecciona (1-10)</option>
                    {opcionesCalificacion.map(opcion => (
                        <option key={opcion} value={opcion}>{opcion}</option>
                    ))}
                </select>
            </div>
        );
    }


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '75%' }}> 
                <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}> 
                    <h2 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Calificación de Procesos de Café Lavado (1-10)
                    </h2>
                    <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        De acuerdo a su experiencia en los procesos del café lavado, distribuya calificaciones del 1 al 10,
                        entendiendo que 1 es la mínima y 10 es la máxima para alcanzar la calidad en taza de café. <strong>(No repita calificaciones)</strong>
                    </p>

                    {error && (
                         <div
                            className="alert"
                            style={{
                                backgroundColor: '#FFDEDE',
                                borderColor: '#E57373',
                                color: '#D32F2F',
                                borderRadius: '25px',
                                padding: '10px',
                                marginBottom: '20px', 
                                textAlign: 'center'
                            }}
                            role="alert"
                        >
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
                                {renderSelector('precipitacionPluvial1', 'La precipitación Pluvial promedio de la zona (1):')}
                                {renderSelector('precipitacionPluvial2', 'La precipitación Pluvial promedio de la zona (2):')}
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
                                    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'wait' : 'pointer'
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Calificaciones'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Calificaciones;