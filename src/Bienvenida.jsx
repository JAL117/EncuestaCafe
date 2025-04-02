import React from 'react';
import { Link } from 'react-router-dom';
import logoUpch from '../src/img/Logo_HumanismoSimple.png';  

export default function Bienvenida() {
  const primaryColor = '#0B9785';
  const secondaryColor = '#BF1029';
  const tertiaryColor = '#D15078';
  const baseColor = '#E0E4E4';

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: baseColor }}>
      <div className="card text-center shadow-lg border-0" style={{ width: '100%', maxWidth: '90%' , }}>

        <div className="card-header" style={{
          background: primaryColor,
          color: 'white',
          padding: '15px',
          borderBottom: `3px solid ${secondaryColor}`
        }}>
          <h4 className="mb-0" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}>UNIVERSIDAD POLITÉCNICA DE CHIAPAS</h4>
        </div>

        <div className="card-body" style={{
          background: baseColor,
          padding: '30px 20px'
        }}>

          
          <div className="d-flex justify-content-center mb-3">
            <img
              src={logoUpch}
              alt="Logo UPCH"
              className="img-fluid"
              style={{ maxWidth: '200px', height: 'auto' }} 
            />
          </div>


          <h5 className="card-title" style={{ color: primaryColor, fontWeight: 'bold', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Dirección de Investigación y Posgrado
          </h5>

          <h6 className="card-subtitle mb-3" style={{ color: secondaryColor, fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
            Doctorado en Ingeniería
          </h6>

          <div className="coffee-divider my-3" style={{
            height: '2px',
            background: `linear-gradient(to right, transparent, ${tertiaryColor}, transparent)`,
            width: '70%',
            margin: '15px auto'
          }}></div>

          <p className="card-text mb-4" style={{ color: primaryColor, fontSize: 'clamp(1.8rem, 1.5vw, 1rem)' }}>
            <strong>Encuesta</strong>
            <br />
            Este instrumento de medición ha sido diseñado con la finalidad de obtener información
            para ser utilizada de manera responsable y anónima y sólo con objeto de la
            investigación que parte del proyecto de doctorado.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Link to="/identificacion" className="btn btn-lg px-4" style={{
              background: secondaryColor,
              color: 'white',
              borderRadius: '25px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
            }}>
              Encuesta de Actores
            </Link>

            <Link to="/productorinfo" className="btn btn-lg px-4" style={{
              background: tertiaryColor,
              color: 'white',
              borderRadius: '25px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
            }}>
              Encuesta Diagnóstico
            </Link>
          </div>
        </div>

        <div className="card-footer text-center py-3" style={{
          background: primaryColor,
          color: baseColor,
          borderTop: `2px solid ${secondaryColor}`,
          fontSize: '16px'
        }}>

          Gracias por su participación
        </div>
      </div>
    </div>
  );
}