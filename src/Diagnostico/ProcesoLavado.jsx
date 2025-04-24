import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'TU_API_ENDPOINT'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    numeroLavados: 27,
};

function ProcesoLavado() {
    const [numeroLavados, setNumeroLavados] = useState(''); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';

    const handleChange = (e) => {
        setNumeroLavados(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!numeroLavados) {
            setError('Por favor, seleccione el número de lavados que realiza.');
            return;
        }

        const dataToSend = [{
            pregunta_id: PREGUNTA_IDS.numeroLavados,
            respuesta: numeroLavados,
        }];

        console.log('Datos a enviar (Proceso Lavado):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINT, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('API Response (Proceso Lavado):', response.data);
            navigate('/procesosecado');
        } catch (err) {
            console.error('API Error (Proceso Lavado):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    const lavadoOptions = ['Realiza sólo un lavado', 'Realiza dos lavados', 'Realiza tres lavados', 'Realiza más tres lavados'];

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '70%' }}>
                 <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                    <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Caracterización del Proceso de Lavado
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                     <form onSubmit={handleSubmit}>
                         <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.numeroLavados}.- Describa como realiza el lavado:</label>
                             {lavadoOptions.map((opt, index) => (
                                 <div className="form-check" key={index}>
                                     <input className="form-check-input" type="radio" name="numeroLavados" id={`lavado_${index}`} value={opt} checked={numeroLavados === opt} onChange={handleChange} disabled={isLoading} />
                                     <label className="form-check-label" htmlFor={`lavado_${index}`}>{opt}</label>
                                 </div>
                             ))}
                         </div>

                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-lg px-4" style={{ background: secondaryColor, color: 'white', borderRadius: '25px', fontWeight: 'bold' }} disabled={isLoading}>
                                {isLoading ? 'Guardando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
}

export default ProcesoLavado;