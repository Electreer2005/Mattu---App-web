// Los servicios se crean desde el panel de administración.
export const SERVICES = [];
export const CATEGORIES = ['Todos', 'Texto', 'Imagen', 'Diseño', 'Madera', 'Cuero', 'Virola'];

export const getServiceBySlug = (slug, services = SERVICES) =>
  services.find((service) => service.slug === slug);
