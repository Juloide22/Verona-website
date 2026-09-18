import viewer360Data from './viewer360.json';

export interface Beat {
  progressStart: number;
  progressEnd: number;
  label: string;
  headline: string;
  body?: string;
  align: 'center' | 'left' | 'right';
}

export interface InteriorImage {
  id: string;
  src: string;
  title: string;
  description: string;
  placeholderBg: string;
  typology?: 'tipo-a' | 'tipo-b' | 'tipo-c' | 'exteriores';
}

export interface Typology {
  id: string;
  title: string;
  sub: string;
  coveredArea: number;
  terraceArea: number;
  totalArea: number;
  rooms: number;
  bathrooms: number;
  garage: boolean;
  floor: string;
  available: number;
  price: string;
  description: string;
  // A clean SVG string or design representational path for the floorplan fallback
  svgPath: string;
}

export interface Hotspot360 {
  id?: string;
  pitch: number;
  yaw: number;
  category: 'social' | 'cocina' | 'dormitorios' | 'exteriores';
  label: string;
}

export interface Scene360 {
  id: string;
  label: string;
  src: string;
  category: 'social' | 'cocina' | 'dormitorios' | 'exteriores';
  typology?: string;
  pitch?: number;
  yaw?: number;
  hotspots?: Hotspot360[];
}

export interface ProjectConfig {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    dataLine: string;
    description: string;
    videoDesktop?: string;
    videoMobile?: string;
  };
  zoomBeats: Beat[];
  constructionBeats: Beat[];
  interiores: InteriorImage[];
  viewer360: {
    src: string;
    autoLoad: boolean;
    autoRotate: number;
    hfov: number;
    categories: Record<string, { label: string; icon: 'sofa' | 'utensils' | 'bed' | 'mappin' }>;
    typologies: Record<string, { label: string }>;
    scenes: Scene360[];
  };
  typologies: Typology[];
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  contacto: {
    phone: string;
    phoneFormatted: string;
    email: string;
    address: string;
    workProgress: number; // e.g. 35%
  };
}

export const veronaConfig: ProjectConfig = {
  hero: {
    eyebrow: "CASTELAR NORTE · BUENOS AIRES",
    title: "Verona",
    subtitle: "Vivir bien diseñado.",
    dataLine: "10 unidades · 3 y 4 ambientes",
    description: "Un edificio de escala humana en el corazón de Castelar Norte. Diez unidades de 3 y 4 ambientes con terrazas privadas, pensadas para quienes valoran el espacio, la luz y la calidad constructiva.",
    videoDesktop: "/videos/hero-desktop.mp4",
    videoMobile: "/videos/hero-mobile.mp4",
  },
  zoomBeats: [
    {
      progressStart: 0,
      progressEnd: 0.25,
      label: "Buenos Aires",
      headline: "Oeste del\nGran Buenos Aires.",
      align: "center",
    },
    {
      progressStart: 0.28,
      progressEnd: 0.55,
      label: "Partido de Morón",
      headline: "Castelar Norte.",
      body: "Una de las zonas residenciales\nmás consolidadas del oeste.",
      align: "left",
    },
    {
      progressStart: 0.58,
      progressEnd: 0.80,
      label: "El proyecto",
      headline: "Aquí nace\nVerona.",
      align: "right",
    },
    {
      progressStart: 0.83,
      progressEnd: 1.0,
      label: "Ubicación privilegiada",
      headline: "Todo cerca.\nNada que falte.",
      body: "Servicios, comercios y transporte\na distancia peatonal.",
      align: "center",
    },
  ],
  constructionBeats: [
    {
      progressStart: 0,
      progressEnd: 0.15,
      label: "El terreno",
      headline: "Todo comienza\naquí.",
      align: "center",
    },
    {
      progressStart: 0.17,
      progressEnd: 0.34,
      label: "Estructura",
      headline: "Base de\nhormigón armado.",
      body: "Cálculo estructural de última generación.\nLosa maciza en cada nivel.",
      align: "left",
    },
    {
      progressStart: 0.36,
      progressEnd: 0.52,
      label: "Unidades",
      headline: "10 unidades.\n3 y 4 ambientes.",
      body: "Superficies desde 85 m² hasta 130 m².\nCada unidad, única.",
      align: "right",
    },
    {
      progressStart: 0.54,
      progressEnd: 0.68,
      label: "Terrazas privadas",
      headline: "Tu terraza.\nTu cielo.",
      body: "Parrilla individual incluida.\nEspacio de estar al aire libre exclusivo.",
      align: "left",
    },
    {
      progressStart: 0.70,
      progressEnd: 0.84,
      label: "Terminaciones",
      headline: "Calidad en\ncada detalle.",
      body: "Pisos de madera. Carpinterías de piso a techo.\nMesadas de cuarzo.",
      align: "right",
    },
    {
      progressStart: 0.86,
      progressEnd: 1.0,
      label: "Castelar Norte · Italia 944 · 2026",
      headline: "Verona.",
      body: "Entrega estimada 2026. Unidades disponibles.",
      align: "center",
    },
  ],
  interiores: [
    // Exteriores
    {
      id: "ext-01",
      src: "/images/exteriores/01.jpg",
      title: "Fachada principal y acceso",
      description: "Diseño contemporáneo de escala humana y líneas depuradas en el entorno residencial de Castelar Norte.",
      placeholderBg: "#0d1117",
      typology: "exteriores",
    },
    {
      id: "ext-02",
      src: "/images/exteriores/02.jpg",
      title: "Integración urbana",
      description: "La solidez del hormigón y la calidez de los detalles exteriores se fusionan armónicamente con la arboleda.",
      placeholderBg: "#0a0c10",
      typology: "exteriores",
    },
    {
      id: "ext-03",
      src: "/images/exteriores/03.jpg",
      title: "Balcones y expansiones",
      description: "Amplias terrazas privadas pensadas para extender la vida interior hacia el aire libre y la luz natural.",
      placeholderBg: "#0f1216",
      typology: "exteriores",
    },
    {
      id: "ext-04",
      src: "/images/exteriores/04.jpg",
      title: "Estética y solidez",
      description: "Fachada moderna con materiales de alta categoría que garantizan bajo mantenimiento y gran durabilidad.",
      placeholderBg: "#0d0f12",
      typology: "exteriores",
    },
    {
      id: "ext-05",
      src: "/images/exteriores/05.jpg",
      title: "Perspectiva exterior",
      description: "Una arquitectura que prioriza la escala peatonal, el diseño de vanguardia y la espacialidad de sus unidades.",
      placeholderBg: "#0e1115",
      typology: "exteriores",
    },
    {
      id: "ext-06",
      src: "/images/exteriores/06.jpg",
      title: "Terrazas exclusivas",
      description: "Detalle de las expansiones superiores con visuales despejadas al barrio residencial.",
      placeholderBg: "#0c0e12",
      typology: "exteriores",
    },

    // Tipología A
    {
      id: "tipo-a-01",
      src: "/images/tipologia-a/01.jpg",
      title: "Tipología A — Render 01",
      description: "Espacios integrados y amplios con ventanales de piso a techo que priorizan el ingreso de luz natural.",
      placeholderBg: "#1a1510",
      typology: "tipo-a",
    },
    {
      id: "tipo-a-02",
      src: "/images/tipologia-a/02.jpg",
      title: "Tipología A — Render 02",
      description: "Mobiliario funcional de líneas depuradas con mesadas de cuarzo y grifería de alta gama.",
      placeholderBg: "#111318",
      typology: "tipo-a",
    },
    {
      id: "tipo-a-03",
      src: "/images/tipologia-a/03.jpg",
      title: "Tipología A — Render 03",
      description: "Perspectiva amplia del área social que resalta la escala humana del proyecto.",
      placeholderBg: "#151210",
      typology: "tipo-a",
    },
    {
      id: "tipo-a-04",
      src: "/images/tipologia-a/04.jpg",
      title: "Tipología A — Render 04",
      description: "Equipamiento de diseño contemporáneo, distribución funcional y revestimientos de primera calidad.",
      placeholderBg: "#121515",
      typology: "tipo-a",
    },
    {
      id: "tipo-a-05",
      src: "/images/tipologia-a/05.jpg",
      title: "Tipología A — Render 05",
      description: "Ambiente diseñado para el descanso y confort, con aberturas seleccionadas para óptima luminosidad.",
      placeholderBg: "#161618",
      typology: "tipo-a",
    },
    {
      id: "tipo-a-06",
      src: "/images/tipologia-a/06.jpg",
      title: "Tipología A — Render 06",
      description: "Detalle de expansiones y conexión fluida entre el interior y el parque privado.",
      placeholderBg: "#141210",
      typology: "tipo-a",
    },

    // Tipología B
    {
      id: "tipo-b-01",
      src: "/images/tipologia-b/01.jpg",
      title: "Tipología B — Render 01",
      description: "Unidad en altura con visuales despejadas hacia el entorno arbolado de Castelar Norte.",
      placeholderBg: "#12141a",
      typology: "tipo-b",
    },
    {
      id: "tipo-b-02",
      src: "/images/tipologia-b/02.jpg",
      title: "Tipología B — Render 02",
      description: "Mobiliario funcional de líneas contemporáneas integrado al sector social.",
      placeholderBg: "#141210",
      typology: "tipo-b",
    },
    {
      id: "tipo-b-03",
      src: "/images/tipologia-b/03.jpg",
      title: "Tipología B — Render 03",
      description: "Habitación luminosa con amplios placares y ventanales acústicos.",
      placeholderBg: "#151210",
      typology: "tipo-b",
    },
    {
      id: "tipo-b-04",
      src: "/images/tipologia-b/04.jpeg",
      title: "Tipología B — Render 04",
      description: "Perspectiva del balcón terraza y área social de 3 ambientes.",
      placeholderBg: "#131518",
      typology: "tipo-b",
    },
    {
      id: "tipo-b-05",
      src: "/images/tipologia-b/05.jpg",
      title: "Tipología B — Render 05",
      description: "Terminaciones de categoría en baños y cocina integrada.",
      placeholderBg: "#111316",
      typology: "tipo-b",
    },
    {
      id: "tipo-b-06",
      src: "/images/tipologia-b/06.jpg",
      title: "Tipología B — Render 06",
      description: "Vista panorámica y luminosidad natural en todos sus ambientes.",
      placeholderBg: "#101215",
      typology: "tipo-b",
    },

    // Tipología C
    {
      id: "tipo-c-01",
      src: "/images/tipologia-c/01.jpg",
      title: "Tipología C — Render 01",
      description: "Diseño moderno de 4 ambientes en nivel superior con gran terraza privada.",
      placeholderBg: "#141210",
      typology: "tipo-c",
    },
    {
      id: "tipo-c-02",
      src: "/images/tipologia-c/02.jpg",
      title: "Tipología C — Render 02",
      description: "Espacios sociales jerarquizados con salida a balcón terraza individual.",
      placeholderBg: "#12141a",
      typology: "tipo-c",
    },
    {
      id: "tipo-c-03",
      src: "/images/tipologia-c/03.jpg",
      title: "Tipología C — Render 03",
      description: "Dormitorio principal en suite con vestidor y finos detalles de terminación.",
      placeholderBg: "#161618",
      typology: "tipo-c",
    },
    {
      id: "tipo-c-04",
      src: "/images/tipologia-c/04.jpg",
      title: "Tipología C — Render 04",
      description: "Cocina integrada equipada con mesadas de cuarzo y mobiliario de primera marca.",
      placeholderBg: "#131517",
      typology: "tipo-c",
    },
  ],
  viewer360: viewer360Data as any,
  typologies: [
    {
      id: "tipo-a",
      title: "Tipología A",
      sub: "4 Ambientes — PB + Parque Privado",
      coveredArea: 110,
      terraceArea: 22,
      totalArea: 132,
      rooms: 4,
      bathrooms: 2,
      garage: true,
      floor: "Planta Baja",
      available: 2,
      price: "USD 310.000",
      description: "Exclusiva unidad en Planta Baja que destaca por su amplio parque privado de 22 m². Cuenta con 3 dormitorios (principal en suite), dependencias de gran categoría y cochera propia, combinando la amplitud de una casa con la seguridad de un edificio.",
      svgPath: "M20 20h260v160H20z M20 60h260 M20 120h260 M80 20v160 M160 20v160 M240 20v160 M100 75h40v30h-40z M20 140h60 M180 35h40v40h-40z",
    },
    {
      id: "tipo-b",
      title: "Tipología B",
      sub: "3 Ambientes — Con Balcón Terraza",
      coveredArea: 84,
      terraceArea: 15,
      totalArea: 99,
      rooms: 3,
      bathrooms: 1,
      garage: true,
      floor: "1° y 2° Piso",
      available: 4,
      price: "USD 240.000",
      description: "Funcionales y luminosas unidades de 3 ambientes distribuidas en primer y segundo nivel. Cuentan con 2 dormitorios, living-comedor integrado, amplio balcón terraza de 15 m² con parrilla propia y cochera privada.",
      svgPath: "M20 20h260v160H20z M20 100h260 M100 20v160 M200 20v160 M100 80h100 M40 40h40v40H40z M220 40h40v120h-40z",
    },
    {
      id: "tipo-c",
      title: "Tipología C",
      sub: "4 Ambientes — Con Balcón Terraza",
      coveredArea: 101,
      terraceArea: 18,
      totalArea: 119,
      rooms: 4,
      bathrooms: 2,
      garage: true,
      floor: "1° y 2° Piso",
      available: 4,
      price: "USD 280.000",
      description: "Espaciosas y distinguidas unidades de 4 ambientes ubicadas en primer y segundo nivel. Cuentan con 3 dormitorios, 2 baños completos, una gran terraza privada de 18 m² con parrilla individual y cochera incluida.",
      svgPath: "M20 20h260v160H20z M20 70h260 M20 130h260 M120 20v160 M220 20v160 M40 30h60v30H40z M140 85h60v35h-60z",
    },
  ],
  technicalSpecs: [
    { label: "Unidades", value: "10" },
    { label: "Pisos", value: "4" },
    { label: "Superficies", value: "desde 85 m²" },
    { label: "Entrega", value: "2026" },
  ],
  contacto: {
    phone: "+54 9 11 0000-0000",
    phoneFormatted: "+5491100000000", // for WhatsApp direct link
    email: "info@verona.com.ar",
    address: "Italia 944, Castelar Norte, Buenos Aires",
    workProgress: 35,
  },
};
