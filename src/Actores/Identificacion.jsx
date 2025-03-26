import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Identificacion() {
    const [usted, setUsted] = useState(null);
    const [pertenece, setPertenece] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';
    const textColor = '#000000'; // Color negro para el texto de las opciones

    const handleUstedChange = (event) => {
        setUsted(event.target.value);
    };

    const handlePerteneceChange = (event) => {
        setPertenece(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!usted || !pertenece) {
            setError('Por favor, responda ambas preguntas antes de continuar.');
            return;
        }

        // Aquí enviarías los datos a tu backend
        const data = {
            usted: usted,
            pertenece: pertenece
        };
        console.log('Datos a enviar:', data);

        // Redirige a la siguiente vista
        navigate('/experiencia'); // Reemplaza '/siguiente-vista' con la ruta correcta
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '60%' }}>


                <div className="card-body" style={{
                    background: baseColor,
                    padding: '30px 20px'
                }}>



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
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                1.- Es usted:
                            </h6>
                            <div className="list-group">
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="productor"
                                        value="productor"
                                        onChange={handleUstedChange}
                                    />
                                    Productor/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="comprador"
                                        value="comprador"
                                        onChange={handleUstedChange}
                                    />
                                    Comprador/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="tecnico"
                                        value="tecnico"
                                        onChange={handleUstedChange}
                                    />
                                    Técnico del Campo
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="barista"
                                        value="barista"
                                        onChange={handleUstedChange}
                                    />
                                    Barista
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="catador"
                                        value="catador"
                                        onChange={handleUstedChange}
                                    />
                                    Catador
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="especialista"
                                        value="especialista"
                                        onChange={handleUstedChange}
                                    />
                                    Especialista Practico o Conocedor/a de Café
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="investigador"
                                        value="investigador"
                                        onChange={handleUstedChange}
                                    />
                                    Investigador/a
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="usted"
                                        id="estudiante"
                                        value="estudiante"
                                        onChange={handleUstedChange}
                                    />
                                    Estudiante relacionado con cafeología
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="card-subtitle mb-2" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                                2.- Pertenece a:
                            </h6>
                            <div className="list-group">
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="pertenece"
                                        id="grupoSocial"
                                        value="grupoSocial"
                                        onChange={handlePerteneceChange}
                                    />
                                    Grupo Social
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="pertenece"
                                        id="sectorPrivado"
                                        value="sectorPrivado"
                                        onChange={handlePerteneceChange}
                                    />
                                    Sector Privado
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="pertenece"
                                        id="sectorPublico"
                                        value="sectorPublico"
                                        onChange={handlePerteneceChange}
                                    />
                                    Sector Publico (Dependencias)
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="pertenece"
                                        id="centrosInvestigacion"
                                        value="centrosInvestigacion"
                                        onChange={handlePerteneceChange}
                                    />
                                    Centros de Investigación/Universidades
                                </label>
                                <label className="list-group-item" style={{ backgroundColor: baseColor, borderColor: tertiaryColor, color: textColor }}>
                                    <input
                                        className="form-check-input me-1"
                                        type="radio"
                                        name="pertenece"
                                        id="ningunGrupo"
                                        value="ningunGrupo"
                                        onChange={handlePerteneceChange}
                                    />
                                    No pertenece a ningún grupo
                                </label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button
                                type="submit"
                                className="btn btn-lg px-4 "
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