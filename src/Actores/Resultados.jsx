import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- Mapeos Consolidados para Legibilidad (Iguales que antes) ---

const PREGUNTA_LABELS = {
    id: 'ID Encuesta', timestamp: 'Fecha y Hora', // Meta Info
    respuesta_usted: '1. Rol', respuesta_pertenece: '2. Pertenece a', // Identificacion
    pregunta1: '3. Impacto Altura', pregunta2: '4. Impacto Temp.', pregunta3: '5. Impacto Lluvia',
    pregunta4: '6. Impacto Suelos', pregunta5: '7. Impacto Cuidados Agro.', pregunta6: '8. Impacto Corte',
    pregunta7: '9. Impacto Variedad', pregunta8Lavado: '10. Impacto Post. Lavado',
    pregunta8NaturalSeco: '11. Impacto Post. Natural', pregunta8Honey: '12. Impacto Post. Honey',
    pregunta9: '13. Impacto Fermentación', pregunta10: '14. Impacto Secado', pregunta11: '15. Impacto Tostado', // Formulario Impacto
    alturaParcela: '16. Calif. Altura', variedadCultivada: '17. Calif. Variedad', corteCereza: '18. Calif. Corte',
    procesoFermentacion: '19. Calif. Fermentación', tiemposFermentacion: '20. Calif. Tiempos Ferm.',
    temperaturaParcela: '21. Calif. Temp.', precipitacionPluvial1: '22. Calif. Lluvia (1)',
    precipitacionPluvial2: '23. Calif. Lluvia (2)', cuidadosAgroecologicos: '24. Calif. Cuidados Agro.',
    procesoTueste: '25. Calif. Tueste', // Calificaciones Procesos
};

const VALOR_LABELS = {
    productor: 'Productor/a', comprador: 'Comprador/a', tecnico: 'Técnico', barista: 'Barista',
    catador: 'Catador', especialista: 'Especialista', investigador: 'Investigador/a', estudiante: 'Estudiante',
    grupoSocial: 'Grupo Social', sectorPrivado: 'Sector Privado', sectorPublico: 'Sector Público',
    centrosInvestigacion: 'Centro Inv./Uni.', ningunGrupo: 'Ninguno',
    '2': 'Muy Débil (2)', '4': 'Débil (4)', '6': 'Regular (6)', '8': 'Fuerte (8)', '10': 'Muy Fuerte (10)',
};

const getReadableAnswer = (answerObject) => {
    if (!answerObject || typeof answerObject.respuesta === 'undefined' || answerObject.respuesta === null || answerObject.respuesta === '') {
        return <span className="text-muted fst-italic">- Sin respuesta -</span>; // Más descriptivo para respuestas faltantes
    }
    const value = String(answerObject.respuesta);
    if (VALOR_LABELS[value]) {
        return VALOR_LABELS[value];
    }
    return value; // Devuelve el valor numérico o texto si no hay etiqueta especial
};

// Define las claves para cada sección para iterar sobre ellas
const SECCION_KEYS = {
    identificacion: ['respuesta_usted', 'respuesta_pertenece'],
    formularioImpacto: [
        'pregunta1', 'pregunta2', 'pregunta3', 'pregunta4', 'pregunta5',
        'pregunta6', 'pregunta7', 'pregunta8Lavado', 'pregunta8NaturalSeco',
        'pregunta8Honey', 'pregunta9', 'pregunta10', 'pregunta11'
    ],
    calificacionesProcesos: [
        'alturaParcela', 'variedadCultivada', 'corteCereza', 'procesoFermentacion',
        'tiemposFermentacion', 'temperaturaParcela', 'precipitacionPluvial1',
        'precipitacionPluvial2', 'cuidadosAgroecologicos', 'procesoTueste'
    ]
};

function Resultados() {
    const [resultados, setResultados] = useState([]);

    // Colores consistentes
    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029'; // Usado para encabezados de sección? o mantener primario? Usemos primario.
    const baseColor = '#E0E4E4';

    // Cargar resultados del localStorage al montar (igual que antes)
    useEffect(() => {
        const storedResults = localStorage.getItem('surveyResults');
        if (storedResults) {
            try {
                const parsedResults = JSON.parse(storedResults);
                if (Array.isArray(parsedResults)) {
                    setResultados(parsedResults);
                } else {
                    localStorage.removeItem('surveyResults'); setResultados([]);
                }
            } catch (error) {
                localStorage.removeItem('surveyResults'); setResultados([]);
            }
        }
    }, []);

    // Función para borrar todos los resultados (igual que antes)
    const handleClearResults = () => {
        if (window.confirm("¿Estás seguro de que deseas borrar TODOS los resultados guardados permanentemente?")) {
            localStorage.removeItem('surveyResults');
            setResultados([]);
        }
    };

    return (
        <div className="container-fluid min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="container"> {/* Contenedor para centrar contenido */}
                <h2 className="text-center mb-4" style={{ color: primaryColor }}>Resultados Guardados</h2>

                {resultados.length === 0 ? (
                    // Mensaje si no hay resultados
                    <div className="alert alert-info text-center shadow-sm" role="alert">
                        Aún no hay resultados guardados. Completa una encuesta para verla aquí.
                    </div>
                ) : (
                    // Mostrar tarjetas si hay resultados
                    <div className="row row-cols-1 g-3"> {/* Una columna por defecto, gap entre tarjetas */}
                        {resultados.map((result) => (
                            <div className="col" key={result.id}>
                                <div className="card shadow-sm">
                                    {/* Encabezado de la Tarjeta */}
                                    <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                        <span className="fw-bold">Encuesta ID: {result.id}</span>
                                        <small className="text-white-50">{result.timestamp}</small>
                                    </div>

                                    {/* Cuerpo de la Tarjeta con las secciones */}
                                    <div className="card-body" style={{ fontSize: '0.9rem' }}>

                                        {/* Sección: Identificación */}
                                        <h5 className="card-subtitle mb-2 mt-2 text-decoration-underline" style={{ color: secondaryColor }}>Identificación</h5>
                                        {SECCION_KEYS.identificacion.map(key => (
                                            <p className="mb-1" key={key}>
                                                <strong className="me-2">{PREGUNTA_LABELS[key] || key}:</strong>
                                                {getReadableAnswer(result.identificacion?.[key])}
                                            </p>
                                        ))}

                                        {/* Sección: Evaluación de Impacto */}
                                        <h5 className="card-subtitle mb-2 mt-3 text-decoration-underline" style={{ color: secondaryColor }}>Evaluación de Impacto</h5>
                                         {SECCION_KEYS.formularioImpacto.map(key => (
                                            <p className="mb-1" key={key}>
                                                <strong className="me-2">{PREGUNTA_LABELS[key] || key}:</strong>
                                                {getReadableAnswer(result.formularioImpacto?.[key])}
                                            </p>
                                        ))}

                                        {/* Sección: Calificación de Procesos */}
                                        <h5 className="card-subtitle mb-2 mt-3 text-decoration-underline" style={{ color: secondaryColor }}>Calificación de Procesos (1-10)</h5>
                                        {SECCION_KEYS.calificacionesProcesos.map(key => (
                                            <p className="mb-1" key={key}>
                                                <strong className="me-2">{PREGUNTA_LABELS[key] || key}:</strong>
                                                {getReadableAnswer(result.calificacionesProcesos?.[key])}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botones de acción (igual que antes) */}
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4 pb-3">
                    <Link to="/" className="btn btn-lg px-4" style={{ background: primaryColor, color: 'white', borderRadius: '25px' }}>
                        + Realizar Nueva Encuesta
                    </Link>
                    {resultados.length > 0 && (
                        <button
                            onClick={handleClearResults}
                            className="btn btn-lg px-4 btn-danger"
                            style={{ borderRadius: '25px' }}
                        >
                            Borrar Todos los Resultados
                        </button>
                    )}
                </div>

            </div> {/* Fin del contenedor central */}
        </div>
    );
}

export default Resultados;