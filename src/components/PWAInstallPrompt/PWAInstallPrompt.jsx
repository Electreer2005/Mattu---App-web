import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import './PWAInstallPrompt.css';

const DISMISS_KEY = 'mattu:pwa-install-dismissed';

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (standalone || localStorage.getItem(DISMISS_KEY) === '1') return;

    setIos(isIOS());

    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShow(true);
    };

    const onInstalled = () => {
      setShow(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    if (isIOS()) setShow(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setHelpOpen(true);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  if (!show) return null;

  return (
    <>
      <aside className="pwa-install" aria-label="Instalar aplicación Mattu">
        <div className="pwa-install__icon"><img src="/icons/mattu-icon.svg" alt="" /></div>
        <div className="pwa-install__copy">
          <strong>Mattu en tu dispositivo</strong>
          <span>Instalá la tienda para tenerla siempre a mano.</span>
        </div>
        <button type="button" className="pwa-install__action" onClick={install}>
          <Download size={16} /> {ios ? 'Cómo instalar' : 'Instalar'}
        </button>
        <button type="button" className="pwa-install__close" onClick={dismiss} aria-label="Cerrar aviso"><X size={17} /></button>
      </aside>

      {helpOpen && (
        <div className="pwa-help__backdrop" role="presentation" onClick={() => setHelpOpen(false)}>
          <section className="pwa-help" role="dialog" aria-modal="true" aria-labelledby="pwa-help-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="pwa-install__close" onClick={() => setHelpOpen(false)} aria-label="Cerrar"><X size={18} /></button>
            <div className="pwa-install__icon"><img src="/icons/mattu-icon.svg" alt="" /></div>
            <h2 id="pwa-help-title">Instalá Mattu</h2>
            {ios ? (
              <ol>
                <li>Tocá el botón <Share size={15} /> <strong>Compartir</strong> de Safari.</li>
                <li>Elegí <strong>Agregar a pantalla de inicio</strong>.</li>
                <li>Confirmá con <strong>Agregar</strong>.</li>
              </ol>
            ) : (
              <p>Buscá la opción <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla de inicio</strong> en el menú de tu navegador.</p>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;