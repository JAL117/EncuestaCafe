import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_ENDPOINT = '/api/respuestas'; 

const ID_PREGUNTA_USTED = 1;
const ID_PREGUNTA_PERTENECE = 2;

function Identificacion() {
    const [usted, setUsted] = useState(null);
    const [pertenece, setPertenece] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';

    const handleUstedChange = (event) => {
        setUsted(event.target.value);
        if (error) setError('');
    };

    const handlePerteneceChange = (event) => {
        setPertenece(event.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!usted || !pertenece) {
            setError('Por favor, responda ambas preguntas antes de continuar.');
            return;
        }

        const dataToSend = [
            {
                pregunta_id: ID_PREGUNTA_USTED,
                respuesta: usted
            },
            {
                pregunta_id: ID_PREGUNTA_PERTENECE,
                respuesta: pertenece
            }
        ];

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

            navigate('/experiencia'); 

        } catch (error) {
            console.error('Error al enviar los datos a la API:', error);
            setError(`Error al guardar las respuestas: ${error.message}. Por favor, inténtelo de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '60%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 20px' }}>
                    <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        <strong>Identificación del Encuestado</strong>
                        <br />
                        <i>Instrucciones: Marque lo que se le solicita de acuerdo al grado que usted considere.</i>
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
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                {`${ID_PREGUNTA_USTED}.- Es usted:`}
                            </h6>
                            <div className="list-group">
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="productor" onChange={handleUstedChange} checked={usted === 'productor'} /> Productor/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="comprador" onChange={handleUstedChange} checked={usted === 'comprador'} /> Comprador/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="tecnico" onChange={handleUstedChange} checked={usted === 'tecnico'} /> Técnico del Campo
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="barista" onChange={handleUstedChange} checked={usted === 'barista'}/> Barista
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="catador" onChange={handleUstedChange} checked={usted === 'catador'}/> Catador
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="especialista" onChange={handleUstedChange} checked={usted === 'especialista'}/> Especialista Practico o Conocedor/a de Café
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="investigador" onChange={handleUstedChange} checked={usted === 'investigador'}/> Investigador/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="usted" value="estudiante" onChange={handleUstedChange} checked={usted === 'estudiante'}/> Estudiante relacionado con cafeología
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                {`${ID_PREGUNTA_PERTENECE}.- Pertenece a:`}
                            </h6>
                            <div className="list-group">
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="pertenece" value="grupoSocial" onChange={handlePerteneceChange} checked={pertenece === 'grupoSocial'} /> Grupo Social
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="pertenece" value="sectorPrivado" onChange={handlePerteneceChange} checked={pertenece === 'sectorPrivado'} /> Sector Privado
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="pertenece" value="sectorPublico" onChange={handlePerteneceChange} checked={pertenece === 'sectorPublico'} /> Sector Publico (Dependencias)
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="pertenece" value="centrosInvestigacion" onChange={handlePerteneceChange} checked={pertenece === 'centrosInvestigacion'}/> Centros de Investigación/Universidades
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input className="form-check-input me-1" type="radio" name="pertenece" value="ningunGrupo" onChange={handlePerteneceChange} checked={pertenece === 'ningunGrupo'}/> No pertenece a ningún grupo
                                </label>
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
                                {isLoading ? 'Enviando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Identificacion;