export const SERVICES = [
  {
    slug: 'nombres',
    category: 'Texto',
    title: 'Nombres y fechas',
    description: 'Un nombre, una fecha o unas palabras que quieras llevar cerca.',
    detail:
      'Grabamos nombres, fechas, coordenadas o frases cortas sobre joyas, virolas, cuero o madera. Podés elegir tipografía y disposición al confirmar la solicitud.',
    image: '/Img/Banner-1.jpeg',
    alt: 'Pulsera con el nombre Aranzazu grabado',
    pieces: ['Pulsera', 'Dije', 'Anillo', 'Virola', 'Pieza de madera'],
  },
  {
    slug: 'miradas',
    category: 'Imagen',
    title: 'Miradas y detalles',
    description: 'Esa mirada que reconocés entre todas, grabada en una pieza.',
    detail:
      'A partir de una fotografía grabamos miradas, sonrisas y detalles que quieras llevar con vos. La imagen se adapta al formato de la pieza.',
    image: '/Img/Banner-2.jpeg',
    alt: 'Pulsera con una mirada grabada',
    pieces: ['Pulsera', 'Dije', 'Anillo'],
  },
  {
    slug: 'retratos',
    category: 'Imagen',
    title: 'Retratos en metal',
    description: 'Transformá una fotografía en un recuerdo que puedas llevar con vos.',
    detail:
      'Convertimos retratos y fotos familiares en grabados sobre metal. El nivel de detalle depende del tamaño y material de la pieza.',
    image: '/Img/Banner-3.jpeg',
    alt: 'Dije circular con un retrato grabado',
    pieces: ['Dije', 'Pulsera', 'Anillo'],
  },
  {
    slug: 'simbolos',
    category: 'Diseño',
    title: 'Símbolos y diseños',
    description: 'Iniciales, símbolos y diseños pensados para una pieza especial.',
    detail:
      'Iniciales entrelazadas, símbolos personales, escudos o diseños a medida. Trabajamos sobre un boceto previo antes de grabar.',
    image: '/Img/Banner-4.jpeg',
    alt: 'Dos dijes con iniciales y un corazón',
    pieces: ['Dije', 'Pulsera', 'Anillo', 'Virola'],
  },
  {
    slug: 'madera',
    category: 'Madera',
    title: 'Grabado en madera',
    description: 'Nombres, logos y diseños sobre piezas de madera.',
    detail:
      'Tablas, llaveros, cuadros y piezas utilitarias. Ideal para regalos, eventos y marcas que buscan un detalle artesanal.',
    image: '/Img/tabla-madera.svg',
    alt: 'Tabla de madera grabada',
    pieces: ['Tabla', 'Llavero', 'Cuadro', 'Pieza utilitaria'],
  },
  {
    slug: 'cuero',
    category: 'Cuero',
    title: 'Grabado en cuero',
    description: 'Personalizá artículos de cuero con textos, iniciales o diseños.',
    detail:
      'Billeteras, cinturones, fundas de cuchillo y otros artículos de cuero. Grabado a fuego o por presión, según el material.',
    image: '/Img/cuchillo-cuero.svg',
    alt: 'Cuchillo y funda de cuero',
    pieces: ['Billetera', 'Cinturón', 'Funda', 'Otro'],
  },
  {
    slug: 'virola',
    category: 'Virola',
    title: 'Grabado en virola',
    description: 'Textos, iniciales y diseños personalizados en virolas de mates.',
    detail:
      'Grabamos virolas de mate en alpaca, plata y otros metales. Un regalo clásico que se personaliza con nombre, iniciales o símbolos.',
    image: '/Img/virola-nacho.svg',
    alt: 'Virola de mate grabada',
    pieces: ['Virola de alpaca', 'Virola de plata', 'Set matero'],
  },
];

export const CATEGORIES = ['Todos', 'Texto', 'Imagen', 'Diseño', 'Madera', 'Cuero', 'Virola'];

export const getServiceBySlug = (slug) =>
  SERVICES.find((s) => s.slug === slug);