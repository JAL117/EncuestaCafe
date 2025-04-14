import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const IDS_ENVIO_1 = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13]; 
const IDS_ENVIO_2 = [8, 9, 10];


const API_ENDPOINT_ENVIO_1 = 'http://localhost:3000/respuestasEscala';
const API_ENDPOINT_ENVIO_2 = 'http://localhost:3000/respuestasPostcosecha'; 

const PREGUNTA_IDS = {
    pregunta1: 1,
    pregunta2: 2,
    pregunta3: 3,
    pregunta4: 4,
    pregunta5: 5,
    pregunta6: 6,
    pregunta7: 7,
    pregunta8Lavado: 8,
    pregunta8NaturalSeco: 9,
    pregunta8Honey: 10,
    pregunta9: 11, 
    pregunta10: 12, 
    pregunta11: 13, 
};


function FormularioCalidadCafe() {
    const EncuestadoID = localStorage.getItem('encuestadoId');
    const [respuestas, setRespuestas] = useState({
        pregunta1: '', pregunta2: '', pregunta3: '', pregunta4: '',
        pregunta5: '', pregunta6: '', pregunta7: '',
        pregunta8Lavado: '', pregunta8NaturalSeco: '', pregunta8Honey: '',
        pregunta9: '', pregunta10: '', pregunta11: '',
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';

    const opcionesCalificacion = [
        { value: '2', label: 'Muy Débil (2)', color: '#28a745' },
        { value: '4', label: 'Débil (4)', color: '#ffc107' },
        { value: '6', label: 'Regular (6)', color: '#fd7e14' },
        { value: '8', label: 'Fuerte (8)', color: '#dc3545' },
        { value: '10', label: 'Muy Fuerte (10)', color: '#BF1029' },
    ];

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
            setError('Por favor, responde a todas las preguntas antes de continuar.');
            return;
        }

        setIsLoading(true);

        const dataToSend1 = [];
        const dataToSend2 = [];

        for (const [key, value] of Object.entries(respuestas)) {
            const preguntaId = PREGUNTA_IDS[key];
            if (!preguntaId) continue;

            const formattedData = {
                pregunta_id: preguntaId,
                respuesta: value,
                encuestado_id: EncuestadoID
            };

            if (IDS_ENVIO_1.includes(preguntaId)) {
                dataToSend1.push(formattedData);
            } else if (IDS_ENVIO_2.includes(preguntaId)) {
                dataToSend2.push(formattedData);
            }
        }

        console.log('Datos a enviar (Envío 1):', dataToSend1);
        console.log('Datos a enviar (Envío 2):', dataToSend2);

        try {
            console.log(`Enviando primer lote a ${API_ENDPOINT_ENVIO_1}`);
            const response1 = await axios.post(API_ENDPOINT_ENVIO_1, dataToSend1, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Respuesta exitosa (Envío 1):', response1.data);

            console.log(`Enviando segundo lote a ${API_ENDPOINT_ENVIO_2}`);
            const response2 = await axios.post(API_ENDPOINT_ENVIO_2, dataToSend2, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Respuesta exitosa (Envío 2):', response2.data);

            console.log("Ambos envíos exitosos. Navegando...");
            navigate('/calificaciones');

        } catch (err) {
            console.error('Error durante el envío de datos:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
            setError(`Error al guardar las respuestas: ${errorMessage}. Por favor, inténtelo de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderRadioButtons = (nombrePregunta) => (
        opcionesCalificacion.map(opcion => (
            <div className="form-check form-check-inline" key={`${nombrePregunta}_${opcion.value}`}>
                <input
                    className="form-check-input"
                    type="radio"
                    name={nombrePregunta}
                    id={`${nombrePregunta}_${opcion.value}`}
                    value={opcion.value}
                    checked={respuestas[nombrePregunta] === opcion.value}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <label className="form-check-label" htmlFor={`${nombrePregunta}_${opcion.value}`}>
                    {opcion.label}
                </label>
            </div>
        ))
    );

     const renderPreguntaLabel = (numeroPreguntaONombre) => {
        const idNumerico = PREGUNTA_IDS[numeroPreguntaONombre] || '';
        const prefijo = idNumerico ? `${idNumerico}.- ` : '';

        switch (numeroPreguntaONombre) {
            case 'pregunta1': return `${prefijo}El impacto la altura de la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:`;
            case 'pregunta2': return `${prefijo}El impacto de la temperatura en promedio, de la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:`;
            case 'pregunta3': return `${prefijo}El impacto del promedio de lluvia anual en la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:`;
            case 'pregunta4': return `${prefijo}El impacto en la conservación de los suelos en donde se ubica el cafetal, para lograr la calidad en taza de café:`;
            case 'pregunta5': return `${prefijo}El impacto de los cuidados agroecológicos (Fertilización orgánica, poda, desmonte, etc.) del cafetal, para lograr la calidad en taza de café:`;
            case 'pregunta6': return `${prefijo}El impacto del corte de la cereza en un estado de maduración óptima para lograr la calidad en taza de café:`;
            case 'pregunta7': return `${prefijo}El impacto de la variedad de café, respecto a otras, para lograr la calidad en taza de café:`;
            case 'pregunta8': return `${PREGUNTA_IDS['pregunta8Lavado']} al ${PREGUNTA_IDS['pregunta8Honey']}.- El impacto los tipos de postcosecha (Lavado, Seco/Natural, Honey), para lograr la calidad en taza de café:`; // Muestra rango 8 al 10
            case 'pregunta8Lavado': return `${PREGUNTA_IDS['pregunta8Lavado']}.- Impacto del proceso Lavado:`; // Muestra ID 8
            case 'pregunta8NaturalSeco': return `${PREGUNTA_IDS['pregunta8NaturalSeco']}.- Impacto del proceso Natural/Seco:`; // Muestra ID 9
            case 'pregunta8Honey': return `${PREGUNTA_IDS['pregunta8Honey']}.- Impacto del proceso Honey:`; // Muestra ID 10
            case 'pregunta9': return `${prefijo}En un procesamiento de lavado, que tanto impacta la etapa de fermentación, para lograr la calidad en taza de café:`;
            case 'pregunta10': return `${prefijo}El impacto del secado óptimo, para lograr la calidad en taza de café:`;
            case 'pregunta11': return `${prefijo}El impacto del proceso de tostado, para lograr la calidad en taza de café:`;
            default: return '';
        }
    };

    const tableHeaderStyle = (color) => ({
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '0.5rem',
        fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)'
    });

     return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '85%', overflowX: 'hidden' }}>
                <div className="card-body" style={{
                    background: baseColor,
                    padding: '30px 20px'
                }}>

                    <h2 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Evaluación de Impacto en Calidad de Taza de Café
                    </h2>
                    <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        Con base a su experiencia califique cada una de las interrogantes que se presenta a continuación y
                        que se encuentran relacionadas con variables que impactan en el logro de la calidad en taza de café,
                        de acuerdo a la siguiente calificación:
                    </p>

                    <div className="table-responsive mb-4">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {opcionesCalificacion.map(opcion => (
                                        <th key={opcion.value} style={tableHeaderStyle(opcion.color)}>{opcion.label}</th>
                                    ))}
                                </tr>
                            </thead>
                        </table>
                    </div>

                    {error && (
                         <div
                            className="alert"
                            style={{
                                backgroundColor: '#FFDEDE',
                                borderColor: '#E57373',
                                color: '#D32F2F',
                                borderRadius: '25px',
                                padding: '10px',
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Renderiza preguntas 1 a 7 */}
                        {Object.keys(PREGUNTA_IDS)
                            .filter(key => IDS_ENVIO_1.includes(PREGUNTA_IDS[key]) && PREGUNTA_IDS[key] <= 7) // Filtra por IDs del grupo 1 y hasta 7
                            .sort((a, b) => PREGUNTA_IDS[a] - PREGUNTA_IDS[b])
                            .map(nombrePregunta => (
                            <div className="mb-4" key={nombrePregunta}>
                                <label className="form-label d-block mb-2" style={{ fontWeight: 'bold', color: primaryColor, fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>
                                    {renderPreguntaLabel(nombrePregunta)}
                                </label>
                                <div className="d-flex flex-wrap justify-content-start gap-3">
                                    {renderRadioButtons(nombrePregunta)}
                                </div>
                            </div>
                        ))}

                       {/* Renderiza preguntas 8 (grupo) */}
                       <div className="mb-4">
                           <label className="form-label d-block mb-2" style={{ fontWeight: 'bold', color: primaryColor, fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>
                              {renderPreguntaLabel('pregunta8')}
                           </label>
                           {/* Filtra por IDs del grupo 2 */}
                           {Object.keys(PREGUNTA_IDS)
                             .filter(key => IDS_ENVIO_2.includes(PREGUNTA_IDS[key]))
                             .sort((a, b) => PREGUNTA_IDS[a] - PREGUNTA_IDS[b])
                             .map(nombrePregunta => (
                             <div key={nombrePregunta} className="mb-3 ms-3">
                               <label className="form-label d-block mb-2" style={{ fontWeight: 'normal', color: primaryColor }}>
                                 {renderPreguntaLabel(nombrePregunta)}
                               </label>
                               <div className="d-flex flex-wrap justify-content-start gap-3">
                                 {renderRadioButtons(nombrePregunta)}
                               </div>
                             </div>
                           ))}
                       </div>

                        {/* Renderiza preguntas 9, 10, 11 (IDs 11, 12, 13) */}
                        {Object.keys(PREGUNTA_IDS)
                            .filter(key => IDS_ENVIO_1.includes(PREGUNTA_IDS[key]) && PREGUNTA_IDS[key] >= 11) // Filtra por IDs del grupo 1 y desde 11
                            .sort((a, b) => PREGUNTA_IDS[a] - PREGUNTA_IDS[b])
                            .map(nombrePregunta => (
                             <div className="mb-4" key={nombrePregunta}>
                                <label className="form-label d-block mb-2" style={{ fontWeight: 'bold', color: primaryColor, fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>
                                    {renderPreguntaLabel(nombrePregunta)}
                                </label>
                                <div className="d-flex flex-wrap justify-content-start gap-3">
                                    {renderRadioButtons(nombrePregunta)}
                                </div>
                            </div>
                        ))}

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
                                {isLoading ? 'Enviando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormularioCalidadCafe;