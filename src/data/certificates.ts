export interface Certificate {
  title: string;
  issuer: string;
  year: number;
  month?: number; // 1-12, optional when the certificate only gives a year
  image: string; // path under /public
  verifyUrl?: string; // optional verification link (e.g. Credly)
}

export interface CertificateGroup {
  id: string;
  name: string;
  certificates: Certificate[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (c: Certificate): string =>
  c.month ? `${MONTHS[c.month - 1]} ${c.year}` : `${c.year}`;

export const sortValue = (c: Certificate): number => c.year * 12 + (c.month ?? 0);

export const certificateGroups: CertificateGroup[] = [
  {
    id: 'cisco',
    name: 'Cisco Networking Academy',
    certificates: [
      { title: 'CCNA 1', issuer: 'Cisco Networking Academy', year: 2022, month: 6, image: '/certificates/cisco/ccna-1.webp' },
      { title: 'CCNA 2', issuer: 'Cisco Networking Academy', year: 2022, month: 10, image: '/certificates/cisco/ccna-2.webp' },
      { title: 'CCNA 3', issuer: 'Cisco Networking Academy', year: 2022, month: 12, image: '/certificates/cisco/ccna-3.webp' },
      { title: 'Cybersecurity Essentials', issuer: 'Cisco Networking Academy', year: 2022, month: 12, image: '/certificates/cisco/cybersecurity-essentials.webp' },
      { title: 'Introduction to Packet Tracer', issuer: 'Cisco Networking Academy', year: 2021, month: 9, image: '/certificates/cisco/introduction-packet-tracer.webp' },
      { title: 'IT Essentials', issuer: 'Cisco Networking Academy', year: 2021, month: 11, image: '/certificates/cisco/it-essentials.webp' },
      { title: 'NDG Linux Essentials', issuer: 'Cisco Networking Academy', year: 2023, month: 6, image: '/certificates/cisco/linux-essentials.webp' },
      { title: 'PCAP: Programming Essentials in Python', issuer: 'Cisco Networking Academy', year: 2021, month: 12, image: '/certificates/cisco/python-essentials.webp' },
    ],
  },
  {
    id: 'k-lab',
    name: 'K-Lab',
    certificates: [
      { title: 'Desarrollo web: Crea tu propia red social [Backend]', issuer: 'K-Lab (Myongji College & TEC)', year: 2025, month: 12, image: '/certificates/k-lab/desarrollo-web.webp' },
      { title: 'El escondite de la ciberseguridad: esteganografía y estegoanálisis', issuer: 'K-Lab (Myongji College & TEC)', year: 2026, month: 1, image: '/certificates/k-lab/escondite-ciberseguridad.webp' },
      { title: 'La Inteligencia Artificial para Todos: Uso y Desarrollo de Modelos', issuer: 'K-Lab (Myongji College & TEC)', year: 2026, month: 1, image: '/certificates/k-lab/inteligencia-artificial-para-todos.webp' },
      { title: 'Introducción a la ciberseguridad', issuer: 'K-Lab (Myongji College & TEC)', year: 2026, month: 1, image: '/certificates/k-lab/introduccion-ciberseguridad.webp' },
      { title: 'Introducción al Emprendimiento Digital', issuer: 'K-Lab (Myongji College & TEC)', year: 2025, month: 9, image: '/certificates/k-lab/introduccion-emprendimiento-digital.webp' },
      { title: 'Manejo Básico de Sensores y Actuadores con Kits de Arduino', issuer: 'K-Lab (Myongji College & TEC)', year: 2025, month: 10, image: '/certificates/k-lab/manejo-basico-arduino.webp' },
      { title: 'Procesamiento de Imágenes Médicas con Deep Learning', issuer: 'K-Lab (Myongji College & TEC)', year: 2025, month: 10, image: '/certificates/k-lab/procesamiento-deep-learning.webp' },
      { title: 'Simulación Básica de Arduino con Tinkercad', issuer: 'K-Lab (Myongji College & TEC)', year: 2025, month: 10, image: '/certificates/k-lab/simulacion-tinkercad.webp' },
    ],
  },
  {
    id: 'compdes',
    name: 'COMPDES',
    certificates: [
      { title: 'Speaker participation, COMPDES 2025 (Guatemala)', issuer: 'Red COMPDES', year: 2025, image: '/certificates/compdes/compdes-2025.webp' },
      { title: 'Paper presentation on bird classification, COMPDES 2026 (El Salvador)', issuer: 'Red COMPDES', year: 2026, image: '/certificates/compdes/compdes-2026.webp' },
    ],
  },
  {
    id: 'english',
    name: 'English',
    certificates: [
      { title: 'Access English Scholarship Program (TEC)', issuer: 'Instituto Tecnológico de Costa Rica', year: 2026, month: 5, image: '/certificates/english/access-tec.webp' },
      { title: 'Access English Scholarship Program (U.S. Embassy)', issuer: 'U.S. Embassy', year: 2026, month: 5, image: '/certificates/english/access-us-embassy.webp' },
      { title: 'Duolingo English Test', issuer: 'Duolingo', year: 2026, month: 2, image: '/certificates/english/duolingo.webp' },
    ],
  },
  {
    id: 'soft-skills',
    name: 'Soft Skills',
    certificates: [
      { title: 'Habilidades Blandas y Liderazgo para la Transformación', issuer: 'Maxwell Leadership Fundación', year: 2025, month: 11, image: '/certificates/soft-skills/liderazgo.webp' },
    ],
  },
  {
    id: 'others',
    name: 'Others',
    certificates: [
      { title: 'Operador de tecnologías de información y comunicación', issuer: 'INA', year: 2021, month: 12, image: '/certificates/others/ina-tics.webp' },
    ],
  },
];
