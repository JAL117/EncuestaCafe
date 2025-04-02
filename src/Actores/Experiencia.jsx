import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = '/api/encuesta/respuestas'; // REEMPLAZA ESTA URL

const PREGUNTA_IDS = {
    pregunta1: 3,
    pregunta2: 4,
    pregunta3: 5,
    pregunta4: 6,
    pregunta5: 7,
    pregunta6: 8,
    pregunta7: 9,
    pregunta8Lavado: 10,
    pregunta8NaturalSeco: 11,
    pregunta8Honey: 12,
    pregunta9: 13,
    pregunta10: 14,
    pregunta11: 15,
};

function FormularioCalidadCafe() {
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

            navigate('/calificaciones'); 

        } catch (err) {
            console.error('Error al enviar los datos a la API:', err);
            setError(`Error al guardar las respuestas: ${err.message}. Por favor, inténtelo de nuevo.`);
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
            case 'pregunta8': return `${PREGUNTA_IDS['pregunta8Lavado']} al ${PREGUNTA_IDS['pregunta8Honey']}.- El impacto los tipos de postcosecha (Lavado, Seco/Natural, Honey), para lograr la calidad en taza de café:`;
            case 'pregunta8Lavado': return `Impacto del proceso Lavado:`;
            case 'pregunta8NaturalSeco': return `Impacto del proceso Natural/Seco:`;
            case 'pregunta8Honey': return `Impacto del proceso Honey:`;
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

                        {Object.keys(PREGUNTA_IDS)
                            .filter(key => key.startsWith('pregunta') && !key.startsWith('pregunta8') && parseInt(key.replace('pregunta','')) <= 7)
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

                       <div className="mb-4">
                           <label className="form-label d-block mb-2" style={{ fontWeight: 'bold', color: primaryColor, fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>
                              {renderPreguntaLabel('pregunta8')}
                           </label>
                           {['Lavado', 'NaturalSeco', 'Honey'].map(proceso => (
                             <div key={`pregunta8${proceso}`} className="mb-3 ms-3">
                               <label className="form-label d-block mb-2" style={{ fontWeight: 'normal', color: primaryColor }}>
                                 {renderPreguntaLabel(`pregunta8${proceso}`)}
                               </label>
                               <div className="d-flex flex-wrap justify-content-start gap-3">
                                 {renderRadioButtons(`pregunta8${proceso}`)}
                               </div>
                             </div>
                           ))}
                       </div>

                        {Object.keys(PREGUNTA_IDS)
                            .filter(key => key.startsWith('pregunta') && parseInt(key.replace('pregunta','')) >= 9)
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