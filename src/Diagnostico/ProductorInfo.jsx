import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3000';

const municipiosChiapas = [
    "Otro","Acacoyagua", "Acala", "Acapetahua", "Aldama", "Altamirano", "Amatán", "Amatenango de la Frontera",
    "Amatenango del Valle", "Ángel Albino Corzo", "Arriaga", "Bejucal de Ocampo", "Bella Vista",
    "Benemérito de las Américas", "Berriozábal", "Bochil", "Cacahoatán", "Catazajá", "Cintalapa de Figueroa",
    "Coapilla", "Comitán de Domínguez", "Copainalá", "Chilón", "El Bosque", "El Porvenir", "Escuintla", "Francisco León",
    "Frontera Comalapa", "Frontera Hidalgo", "Huehuetán", "Huitiupán", "Huixtán", "Huixtla", "Ixhuatán",
    "Ixtacomitán", "Ixtapa", "Ixtapangajoya", "Jiquipilas", "Jitotol", "Juárez", "La Concordia",
    "La Grandeza", "La Independencia", "La Libertad", "La Trinitaria", "Larráinzar", "Las Margaritas",
    "Las Rosas", "Mapastepec", "Maravilla Tenejapa", "Marqués de Comillas", "Mazapa de Madero", "Mazatán",
    "Metapa", "Mitontic", "Motozintla", "Nicolás Ruíz", "Ocosingo", "Ocozocoautla de Espinosa", "Ostuacán",
    "Osumacinta", "Oxchuc", "Palenque", "Pantelhó", "Pichucalco", "Pijijiapan", "Pueblo Nuevo Solistahuacán",
    "Rayón", "Reforma", "Sabanilla", "Salto de Agua", "San Andrés Duraznal", "San Cristóbal de las Casas",
    "San Fernando", "San Juan Cancuc", "San Lucas", "Santiago el Pinar", "Siltepec", "Simojovel",
    "Sitalá", "Socoltenango", "Solosuchiapa", "Soyaló", "Suchiapa", "Suchiate", "Sunuapa", "Tapachula",
    "Tapalapa", "Tapilula", "Tecpatán", "Tenejapa", "Teopisca", "Tila", "Tonalá", "Totolapa", "Tumbalá",
    "Tuxtla Gutiérrez", "Tuxtla Chico", "Tuzantán", "Tzimol", "Unión Juárez", "Venustiano Carranza",
    "Villa Comaltitlán", "Villa Corzo", "Villaflores", "Yajalón", "Zinacantán"
];


function ProductorInfo() {
    const [formData, setFormData] = useState({
        nombreProductor: '',
        municipio: '',
        otroMunicipio: '',
        localidad: '',
        perteneceGrupo: null,
        nombreGrupo: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const baseColor = '#E0E4E4';
    const textColor = '#000000';
    const tertiaryColor = '#D15078';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value : value,
        }));
        if (name === 'perteneceGrupo' && value === 'no') {
            setFormData(prev => ({ ...prev, nombreGrupo: '' }));
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

        const currentProductorId = localStorage.getItem('currentProductorId');
        const dataToSend = {
            nombreProductor: formData.nombreProductor,
            municipio: formData.municipio === 'Otro' ? formData.otroMunicipio : formData.municipio,
            localidad: formData.localidad,
            perteneceGrupo: formData.perteneceGrupo,
            nombreGrupo: formData.nombreGrupo ? formData.nombreGrupo : null,
            productor_id: currentProductorId ? parseInt(currentProductorId, 10) : undefined,
        };

        console.log('Datos a enviar (ProductorInfo):', dataToSend);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_ENDPOINT}/productores`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Guarda el ID del productor en localStorage
            localStorage.setItem('currentProductorId', response.data.ProductorID);
            console.log('API Response (ProductorInfo):', response.data);
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
                            <label htmlFor="nombreProductor" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>Nombre del Productor/a:</label>
                            <input type="text" className="form-control" id="nombreProductor" name="nombreProductor" value={formData.nombreProductor} onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="municipio" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>Municipio al que pertenece:</label>
                            <select
                                className="form-control"
                                id="municipio"
                                name="municipio"
                                value={formData.municipio}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un municipio</option>
                                {municipiosChiapas.map((municipio) => (
                                    <option key={municipio} value={municipio}>
                                        {municipio}
                                    </option>
                                ))}
                            </select>

                            {formData.municipio === 'Otro' && (
                                <input
                                    type='text'
                                    className='form-control mt-2'
                                    placeholder='Especifique el municipio'
                                    name='otroMunicipio'
                                    value={formData.otroMunicipio}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="localidad" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>Localidad:</label>
                            <input type="text" className="form-control" id="localidad" name="localidad" value={formData.localidad} onChange={handleChange} disabled={isLoading} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label d-block" style={{ color: primaryColor, fontWeight: 'bold' }}>Pertenece algún grupo social:</label>
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
                                <label htmlFor="nombreGrupo" className="form-label" style={{ color: primaryColor, fontWeight: 'bold' }}>Si, la respuesta anterior fue positiva, ¿A qué grupo social pertenece?</label>
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