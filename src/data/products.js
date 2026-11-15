// Catálogo vacío por defecto: los productos reales se cargan desde el backend.
export const PRODUCTS = [];

export const PRODUCT_CATEGORIES = [
  'Todos',
  'Anillos',
  'Collares',
  'Pulseras',
  'Aros',
  'Virolas',
  'Accesorios',
];

export const getProductById = (id, products = PRODUCTS) =>
  products.find((product) => product.id === id);

export const getRelatedProducts = (product, limit = 4, products = PRODUCTS) =>
  products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
