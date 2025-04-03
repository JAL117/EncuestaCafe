import React, { useState, useEffect } from 'react'; // Añadir useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// IDs de pregunta para esta sección
const PREGUNTA_IDS = {
    alturaParcela: 16, variedadCultivada: 17, corteCereza: 18,
    procesoFermentacion: 19, tiemposFermentacion: 20, temperaturaParcela: 21,
    precipitacionPluvial1: 22, precipitacionPluvial2: 23, // Separadas como en el original
    cuidadosAgroecologicos: 24, procesoTueste: 25,
};

function Calificaciones() {
    const [respuestas, setRespuestas] = useState({
        alturaParcela: '', variedadCultivada: '', corteCereza: '',
        procesoFermentacion: '', tiemposFermentacion: '', temperaturaParcela: '',
        precipitacionPluvial1: '', precipitacionPluvial2: '', cuidadosAgroecologicos: '',
        procesoTueste: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Para recibir datos acumulados

    // Colores y opciones (igual que antes)
    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const opcionesCalificacion = Array.from({ length: 10 }, (_, i) => i + 1); // 1 a 10

    // Extraer datos acumulados de los pasos anteriores
    const previousData = location.state; // Contiene identificacionData y formularioData

     // Verificar si llegaron los datos (opcional pero recomendado)
    useEffect(() => {
        if (!previousData || !previousData.identificacionData || !previousData.formularioData) {
            console.warn("No se recibieron datos completos de pasos anteriores. Volviendo al inicio.");
            // Podrías redirigir o mostrar un error más permanente
            // navigate('/'); // Descomenta si quieres forzar volver al inicio
             setError("Error: Faltan datos de pasos anteriores. Por favor, comienza la encuesta de nuevo.");
        }
    }, [previousData, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRespuestas(prevState => ({
            ...prevState,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // 1. Validar que todas las preguntas de ESTA sección estén respondidas
        const todasRespondidas = Object.values(respuestas).every(respuesta => respuesta !== '');
        if (!todasRespondidas) {
            setError('Por favor, asigna una calificación a todos los elementos.');
            return;
        }

        // 2. Validar que no se repitan calificaciones
        const calificaciones = Object.values(respuestas);
        const calificacionesUnicas = new Set(calificaciones);
        if (calificaciones.length !== calificacionesUnicas.size) {
            setError('Por favor, no repitas las calificaciones. Cada valor del 1 al 10 debe usarse una sola vez.');
            return;
        }

        // 3. Validar que tengamos los datos de los pasos anteriores
         if (!previousData || !previousData.identificacionData || !previousData.formularioData) {
             setError("Error: Faltan datos de pasos anteriores. Por favor, comienza la encuesta de nuevo.");
             return; // Detener si faltan datos cruciales
        }

        // --- Inicio: Lógica de LocalStorage ---
        try {
            // 4. Preparar los datos de esta sección (calificaciones)
            const calificacionesData = {};
             for (const key in respuestas) {
                if (respuestas.hasOwnProperty(key)) {
                     calificacionesData[key] = { // Guardamos valor e ID
                       respuesta: respuestas[key],
                       pregunta_id: PREGUNTA_IDS[key]
                    }
                }
            }

            // 5. Combinar TODOS los datos de la encuesta actual
            const encuestaCompleta = {
                id: Date.now(), // ID único simple basado en timestamp
                timestamp: new Date().toLocaleString('es-MX'), // Fecha y hora legible
                identificacion: previousData.identificacionData,
                formularioImpacto: previousData.formularioData,
                calificacionesProcesos: calificacionesData,
            };

            console.log('Encuesta Completa a guardar:', encuestaCompleta);

            // 6. Obtener resultados existentes de localStorage
            let todosLosResultados = [];
            const storedResults = localStorage.getItem('surveyResults');
            if (storedResults) {
                try {
                    todosLosResultados = JSON.parse(storedResults);
                    // Asegurarse que sea un array
                    if (!Array.isArray(todosLosResultados)) {
                        console.warn("El dato en localStorage 'surveyResults' no era un array. Se reiniciará.");
                        todosLosResultados = [];
                    }
                } catch (parseError) {
                    console.error("Error al parsear datos de localStorage, se reiniciará.", parseError);
                    todosLosResultados = []; // Reiniciar si hay error de parseo
                }
            }

            // 7. Añadir el nuevo resultado al array
            todosLosResultados.push(encuestaCompleta);

            // 8. Guardar el array actualizado en localStorage
            localStorage.setItem('surveyResults', JSON.stringify(todosLosResultados));

            console.log('Resultados guardados exitosamente en localStorage.');

            // 9. Navegar a la página de resultados
            navigate('/resultados');

        } catch (err) {
            console.error('Error al procesar o guardar en localStorage:', err);
            setError(`Error al guardar la encuesta localmente: ${err.message}. Inténtelo de nuevo.`);
        }
        // --- Fin: Lógica de LocalStorage ---
    };

    // Función para renderizar los selectores (sin cambios lógicos)
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
                    style={{ cursor: 'pointer' }} // Cursor normal
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

                    {/* Mensaje de error */}
                     {error && (
                         <div
                            className="alert"
                            style={{
                                backgroundColor: '#FFDEDE', borderColor: '#E57373', color: '#D32F2F',
                                borderRadius: '25px', padding: '10px', marginBottom: '20px', textAlign: 'center'
                            }}
                            role="alert">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna Izquierda */}
                            <div className="col-md-6">
                                {renderSelector('alturaParcela', 'La Altura de la parcela:')}
                                {renderSelector('variedadCultivada', 'Identificar la Variedad cultivada:')}
                                {renderSelector('corteCereza', 'Controlar el proceso de corte de la cereza (Estado óptimo de Maduración):')}
                                {renderSelector('procesoFermentacion', 'Controlar el proceso de fermentación:')}
                                {renderSelector('tiemposFermentacion', 'Controlar los tiempos de fermentación:')}
                            </div>
                            {/* Columna Derecha */}
                            <div className="col-md-6">
                                {renderSelector('temperaturaParcela', 'Temperatura de la localidad de la parcela:')}
                                {renderSelector('precipitacionPluvial1', 'La precipitación Pluvial promedio de la zona (1):')}
                                {renderSelector('precipitacionPluvial2', 'La precipitación Pluvial promedio de la zona (2):')}
                                {renderSelector('cuidadosAgroecologicos', 'Cuidados agroecológicos (Fertilización orgánica, poda, desmonte, etc.) del cafetal:')}
                                {renderSelector('procesoTueste', 'Controlar el proceso de Tueste:')}
                            </div>
                        </div>

                        {/* Botón Enviar */}
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                type="submit"
                                className="btn btn-lg px-4"
                                style={{
                                    background: secondaryColor, color: 'white', borderRadius: '25px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontWeight: 'bold',
                                    transition: 'all 0.3s ease', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
                                }}
                            >
                                Enviar y Ver Resultados
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Calificaciones;