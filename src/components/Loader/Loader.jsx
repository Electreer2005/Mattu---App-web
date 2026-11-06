import './Loader.css';

export default function Loader({ message = 'Cargando...' }) {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="loader glass-card">
        <div className="loader-spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}