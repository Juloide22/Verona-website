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
}

export interface Typology {
  id: string;
  title: string;
  sub: string;
  coveredArea: number;
  terraceArea: number;
  rooms: number;
  bathrooms: number;
  garage: boolean;
  floor: string;
  available: number;
  description: string;
  // A clean SVG string or design representational path for the floorplan fallback
  svgPath: string;
}

export interface ProjectConfig {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    dataLine: string;
    description: string;
  };
  zoomBeats: Beat[];
  constructionBeats: Beat[];
  interiores: InteriorImage[];
  viewer360: {
    src: string;
    autoLoad: boolean;
    autoRotate: number;
    hfov: number;
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
    dataLine: "10 unidades · 3 y 4 ambientes · Entrega 2026",
    description: "Un edificio de escala humana en el corazón de Castelar Norte. Diez unidades de 3 y 4 ambientes con terrazas privadas, pensadas para quienes valoran el espacio, la luz y la calidad constructiva.",
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
      label: "Castelar Norte · 2026",
      headline: "Verona.",
      body: "Entrega estimada 2026. Unidades disponibles.",
      align: "center",
    },
  ],
  interiores: [
    {
      id: "01",
      src: "/images/interiores/pb-depto-tipo-01.jpg",
      title: "Planta baja - Comedor / Estar",
      description: "Espacios integrados y amplios con ventanales de piso a techo que priorizan el ingreso de luz natural y conectan con el exterior.",
      placeholderBg: "#1a1510",
    },
    {
      id: "02",
      src: "/images/interiores/pb-depto-tipo-02.jpg",
      title: "Planta Baja - Cocina integrada",
      description: "Mobiliario funcional de líneas depuradas con mesadas de cuarzo y grifería de alta gama integrados armónicamente al sector social.",
      placeholderBg: "#111318",
    },
    {
      id: "03",
      src: "/images/interiores/pb-depto-tipo-03.jpg",
      title: "Planta baja - Estar / Comedor",
      description: "Perspectiva amplia del área social que resalta la escala humana del proyecto y su flexibilidad de distribución.",
      placeholderBg: "#151210",
    },
    {
      id: "04",
      src: "/images/interiores/pb-depto-tipo-04.jpg",
      title: "Planta baja - Cocina",
      description: "Equipamiento de diseño contemporáneo, distribución funcional y revestimientos de primera calidad para una practicidad óptima.",
      placeholderBg: "#121515",
    },
    {
      id: "05",
      src: "/images/interiores/pb-depto-tipo-05.jpg",
      title: "Planta baja - Dormitorio tipo",
      description: "Ambiente diseñado para el descanso y confort, con aberturas seleccionadas para una acústica y luminosidad óptimas.",
      placeholderBg: "#161618",
    },
    {
      id: "06",
      src: "/images/interiores/pn1-depto-tipo-01.jpg",
      title: "Primer nivel - Living / Comedor",
      description: "Unidad en altura con visuales despejadas hacia el entorno arbolado de Castelar y gran fluidez espacial.",
      placeholderBg: "#12141a",
    },
    {
      id: "07",
      src: "/images/interiores/pn1-depto-tipo-02.jpg",
      title: "Primer piso - Cocina integrada",
      description: "Diseño moderno y compacto para el primer nivel, optimizando el espacio de preparado y la interacción cotidiana.",
      placeholderBg: "#141210",
    },
  ],
  viewer360: {
    src: "/images/360/panorama.jpg",
    autoLoad: true,
    autoRotate: -2,
    hfov: 100,
  },
  typologies: [
    {
      id: "tipo-a",
      title: "3 Ambientes Tipo A",
      sub: "Frente",
      coveredArea: 85,
      terraceArea: 12,
      rooms: 3,
      bathrooms: 1,
      garage: true,
      floor: "2° y 3° piso",
      available: 4,
      description: "Unidad orientada al frente, con living-comedor integrado, dos dormitorios en suite y terraza privada con parrilla.",
      // Custom minimal architectural blueprint SVG representation
      svgPath: "M20 20h260v160H20z M20 100h260 M100 20v160 M200 20v160 M100 80h100 M40 40h40v40H40z M220 40h40v120h-40z",
    },
    {
      id: "tipo-b",
      title: "3 Ambientes Tipo B — Contrafrente",
      sub: "Jardín Interior",
      coveredArea: 88,
      terraceArea: 14,
      rooms: 3,
      bathrooms: 2,
      garage: true,
      floor: "2° y 3° piso",
      available: 2,
      description: "Orientación al jardín interior. Doble baño, vestidor en dormitorio principal y gran terraza con vista verde.",
      svgPath: "M20 20h260v160H20z M20 70h260 M20 130h260 M120 20v160 M220 20v160 M40 30h60v30H40z M140 85h60v35h-60z",
    },
    {
      id: "tipo-c",
      title: "4 Ambientes Tipo C — Premium",
      sub: "Planta Exclusiva",
      coveredArea: 118,
      terraceArea: 30,
      rooms: 4,
      bathrooms: 2,
      garage: true,
      floor: "4° piso",
      available: 4,
      description: "Planta exclusiva de cuarto piso. Tres dormitorios, dos baños, estudio independiente y terraza de 30 m² con parrilla y lavadero propios.",
      svgPath: "M20 20h260v160H20z M20 60h260 M20 120h260 M80 20v160 M160 20v160 M240 20v160 M100 75h40v30h-40z M20 140h60 M180 35h40v40h-40z",
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
    address: "Castelar Norte / Partido de Morón / Buenos Aires",
    workProgress: 35,
  },
};
