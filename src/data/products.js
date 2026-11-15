// El catálogo comienza vacío. Los productos se cargan desde el panel de administración
// y se guardan en el backend compartido de Mattu.
export const PRODUCT_CATEGORIES = [
  'Todos',
  'Anillos',
  'Collares',
  'Pulseras',
  'Aros',
  'Virolas',
  'Accesorios',
];

export const getProductById = (id, products = []) =>
  products.find((product) => product.id === id);

export const getRelatedProducts = (product, products = [], limit = 4) =>
  products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
