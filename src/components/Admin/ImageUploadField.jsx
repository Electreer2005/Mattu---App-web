import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from 'lucide-react';

const ImageUploadField = ({ images = [], onChange, multiple = true, maxFiles = 6 }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    const remaining = multiple ? Math.max(0, maxFiles - images.length) : 1;
    const selected = files.slice(0, remaining);
    if (!selected.length) { setError(`Podés cargar hasta ${maxFiles} imágenes.`); return; }
    setError('');
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of selected) {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/customer/media/upload', { method: 'POST', credentials: 'include', body });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'No se pudo subir la imagen.');
        uploaded.push(result.url);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
    } catch (err) {
      setError(err.message || 'Error subiendo la imagen.');
    } finally { setUploading(false); }
  };

  const removeImage = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="image-upload-field">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} onChange={handleFiles} hidden />
      <div className="image-upload-field__toolbar">
        <div>
          <strong>{multiple ? 'Galería de imágenes' : 'Imagen del servicio'}</strong>
          <span>JPG, PNG, WEBP o AVIF · máximo 5 MB por imagen</span>
        </div>
        <button type="button" className="btn btn--secondary" onClick={() => inputRef.current?.click()} disabled={uploading || (multiple && images.length >= maxFiles)}>
          {uploading ? <LoaderCircle className="image-upload-spin" size={16} /> : <UploadCloud size={16} />}
          {uploading ? 'Subiendo…' : 'Elegir imagen'}
        </button>
      </div>
      {images.length > 0 ? (
        <div className="image-upload-field__grid">
          {images.map((src, index) => (
            <div className="image-upload-field__item" key={src}>
              <img src={src} alt={`Imagen ${index + 1}`} />
              {index === 0 && <span className="image-upload-field__cover">Principal</span>}
              <button type="button" onClick={() => removeImage(index)} aria-label={`Quitar imagen ${index + 1}`}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      ) : (
        <button type="button" className="image-upload-field__empty" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <ImagePlus size={26} />
          <strong>Subí las fotos de tu {multiple ? 'producto' : 'servicio'}</strong>
          <span>Seleccioná desde tu dispositivo. La primera será la portada.</span>
        </button>
      )}
      {error && <span className="admin-field__error" role="alert">{error}</span>}
    </div>
  );
};

export default ImageUploadField;
