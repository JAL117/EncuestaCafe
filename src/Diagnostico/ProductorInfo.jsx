import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = 'TU_API_ENDPOINT'; // <-- REEMPLAZA ESTO

const PREGUNTA_IDS = {
    nombreProductor: 26,
    municipio: 27,
    localidad: 28,
    perteneceGrupo: 29,
    nombreGrupo: 30,
};

function ProductorInfo() {
    const [formData, setFormData] = useState({
        nombreProductor: '',
        municipio: '',
        localidad: '',
        perteneceGrupo: null, // 'si' o 'no'
        nombreGrupo: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';
    const tertiaryColor = '#D15078'; // Para bordes si es necesario

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value : value,
        }));
        if (name === 'perteneceGrupo' && value === 'no') {
             setFormData(prev => ({ ...prev, nombreGrupo: '' })); // Limpiar nombre si selecciona 'no'
        }
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación básica
        if (!formData.nombreProductor || !formData.municipio || !formData.localidad || formData.perteneceGrupo === null) {
            setError('Por favor, complete los campos obligatorios (Nombre, Municipio, Localidad, Pertenece a grupo).');
            return;
        }
        if (formData.perteneceGrupo === 'si' && !formData.nombreGrupo) {
            setError('Si pertenece a un grupo, por favor indique el nombre.');
            return;
        }

        const dataToSend = Object.entries(formData)
            .filter(([key, value]) => value !== null && value !== '' && PREGUNTA_IDS[key] !== undefined) // Enviar solo respondidas y con ID
            .map(([key, value]) => ({
                pregunta_id: PREGUNTA_IDS[key],
                respuesta: String(value), // Asegurar que sea string
            }));

        console.log('Datos a enviar (ProductorInfo):', dataToSend);
        setIsLoading(true);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log('API Response (ProductorInfo):', result);
            navigate('/variedadcafe'); 

        } catch (err) {
            console.error('API Error (ProductorInfo):', err);
            setError(`Error al guardar: ${err.message}. Intente de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '70%' }}>
                <div className="card-body" style={{ background: baseColor, padding: '30px 25px' }}>
                    <h4 className="card-title text-center mb-4" style={{ color: primaryColor }}>
                        Identificación del Productor/a
                    </h4>

                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ borderRadius: '15px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombreProductor" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.nombreProductor}.- Nombre del Productor/a:</label>
                            <input type="text" className="form-control" id="nombreProductor" name="nombreProductor" value={formData.nombreProductor} onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="municipio" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.municipio}.- Municipio al que pertenece:</label>
                            <input type="text" className="form-control" id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="localidad" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.localidad}.- Localidad:</label>
                            <input type="text" className="form-control" id="localidad" name="localidad" value={formData.localidad} onChange={handleChange} disabled={isLoading} />
                        </div>

                        <div className="mb-3">
                             <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.perteneceGrupo}.- Pertenece algún grupo social:</label>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="perteneceGrupo" id="grupoSi" value="si" checked={formData.perteneceGrupo === 'si'} onChange={handleChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="grupoSi">Si</label>
                             </div>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="perteneceGrupo" id="grupoNo" value="no" checked={formData.perteneceGrupo === 'no'} onChange={handleChange} disabled={isLoading} />
                                 <label className="form-check-label" htmlFor="grupoNo">No</label>
                             </div>
                        </div>

                        {formData.perteneceGrupo === 'si' && (
                             <div className="mb-3">
                                 <label htmlFor="nombreGrupo" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>{PREGUNTA_IDS.nombreGrupo}.- Si, la respuesta anterior fue positiva, ¿A qué grupo social pertenece?</label>
                                 <input type="text" className="form-control" id="nombreGrupo" name="nombreGrupo" value={formData.nombreGrupo} onChange={handleChange} disabled={isLoading} />
                             </div>
                        )}

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

export default ProductorInfo;