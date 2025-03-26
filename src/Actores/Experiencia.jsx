import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function FormularioCalidadCafe() {
    const [respuestas, setRespuestas] = useState({
        pregunta1: '',
        pregunta2: '',
        pregunta3: '',
        pregunta4: '',
        pregunta5: '',
        pregunta6: '',
        pregunta7: '',
        pregunta8Lavado: '',
        pregunta8NaturalSeco: '',
        pregunta8Honey: '',
        pregunta9: '',
        pregunta10: '',
        pregunta11: '',
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const primaryColor = '#0B9785';
    const secondaryColor = '#BF1029';
    const tertiaryColor = '#D15078';
    const baseColor = '#E0E4E4';

    const opcionesCalificacion = [
        { value: '2', label: 'Muy Débil (2)', color: 'green' },
        { value: '4', label: 'Débil (4)', color: 'yellow' },
        { value: '6', label: 'Regular (6)', color: 'orange' },
        { value: '8', label: 'Fuerte (8)', color: 'orangered' },
        { value: '10', label: 'Muy Fuerte (10)', color: 'red' },
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRespuestas(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const preguntasObligatorias = [
      'pregunta1', 'pregunta2', 'pregunta3', 'pregunta4', 'pregunta5', 'pregunta6', 'pregunta7',
      'pregunta8Lavado', 'pregunta8NaturalSeco', 'pregunta8Honey',
      'pregunta9', 'pregunta10', 'pregunta11'
    ];


    const handleSubmit = (event) => {
        event.preventDefault();

        const algunaSinResponder = preguntasObligatorias.some(pregunta => !respuestas[pregunta]);

        if (algunaSinResponder) {
            setError('Por favor, responde a todas las preguntas.');
            return;
        }

        console.log('Respuestas:', respuestas);
        navigate('/calificaciones');
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
                  />
                  <label className="form-check-label" htmlFor={`${nombrePregunta}_${opcion.value}`}>
                      {opcion.label}
                  </label>
              </div>
          ))
      );


    const renderPreguntaLabel = (numeroPregunta) => {
        switch (numeroPregunta) {
            case 1: return '1.- El impacta la altura de la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:';
            case 2: return '2.- El impacto de la temperatura en promedio, de la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:';
            case 3: return '3.- El impacto del promedio de lluvia anual en la zona en donde se ubica el cafetal, para lograr la calidad en taza de café:';
            case 4: return '4.- El impacto en la conservación de los suelos en donde se ubica el cafetal, para lograr la calidad en taza de café:';
            case 5: return '5.- El impacto de los cuidados agroecológicos (Fertilización orgánica, poda, desmonte, etc.) del cafetal, para lograr la calidad en taza de café:';
            case 6: return '6.- El impacto del corte de la cereza en un estado de maduración óptima para lograr la calidad en taza de café:';
            case 7: return '7.- El impacto de la variedad de café, respecto a otras, para lograr la calidad en taza de café:';
            case 9: return '9.- En un procesamiento de lavado, que tanto impacta la etapa de fermentación, para lograr la calidad en taza de café:';
            case 10: return '10.- El impacto del secado óptimo, para lograr la calidad en taza de café:';
            case 11: return '11.- El impacto del proceso de tostado, para lograr la calidad en taza de café:';
            default: return '';
        }
    };

    const tableHeaderStyle = (color) => ({
        backgroundColor: color,
        color: 'white', // Asegura que el texto sea legible
        fontWeight: 'bold',
    });



    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ backgroundColor: baseColor }}>
            <div className="card shadow-lg border-0 mt-4" style={{ width: '100%', maxWidth: '70%' }}>
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

                    <table className="table table-bordered mb-4">
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle(opcionesCalificacion[0].color)}>Muy débil (2)</th>
                                <th style={tableHeaderStyle(opcionesCalificacion[1].color)}>Débil (4)</th>
                                <th style={tableHeaderStyle(opcionesCalificacion[2].color)}>Regular (6)</th>
                                <th style={tableHeaderStyle(opcionesCalificacion[3].color)}>Fuerte (8)</th>
                                <th style={tableHeaderStyle(opcionesCalificacion[4].color)}>Muy Fuerte (10)</th>
                            </tr>
                        </thead>
                    </table>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {[1, 2, 3, 4, 5, 6, 7].map(numeroPregunta => (
                            <div className="mb-3" key={`pregunta${numeroPregunta}`}>
                                <label className="form-label" style={{ fontWeight: 'bold', color: primaryColor }}>
                                    {renderPreguntaLabel(numeroPregunta)}
                                </label>
                                <div>{renderRadioButtons(`pregunta${numeroPregunta}`)}</div>
                            </div>
                        ))}

                       {/* Pregunta 8 */}
                      <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 'bold', color: primaryColor }}>
                          8.- El impacto los tipos de postcosecha (Lavado, Seco/Natural, Honey), para lograr la calidad en taza de café:
                        </label>
                        {['Lavado', 'NaturalSeco', 'Honey'].map(proceso => (
                          <div key={`pregunta8${proceso}`} className="mb-3">
                            <label className="form-label" style={{ fontWeight: 'bold', color: primaryColor }}>
                              Impacto del proceso {proceso}:
                            </label>
                            <div>{renderRadioButtons(`pregunta8${proceso}`)}</div>
                          </div>
                        ))}
                      </div>

                        {[9, 10, 11].map(numeroPregunta => (
                            <div className="mb-3" key={`pregunta${numeroPregunta}`}>
                                <label className="form-label" style={{ fontWeight: 'bold', color: primaryColor }}>
                                    {renderPreguntaLabel(numeroPregunta)}
                                </label>
                                <div>{renderRadioButtons(`pregunta${numeroPregunta}`)}</div>
                            </div>
                        ))}

                        <div className="d-flex justify-content-center">
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

export default FormularioCalidadCafe;