// All visible copy, English and Indonesian. Lists line up by index with the data in App.tsx / SkillsSection.tsx.
export type Lang = 'en' | 'id';

const en = {
  nav: { about: 'About', education: 'Education', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
  replay: 'Replay build',
  stop: 'Stop',
  replayAria: 'Replay the build animation',
  stopAria: 'Stop the build animation',
  menuAria: 'Toggle navigation menu',
  siteLangAria: 'Site language',
  role: 'Computer Science Graduate · Full Stack Developer',
  tagline: ['I build ', 'offline-first mobile apps', ' and ', 'full-stack platforms', '.'],
  download: 'Download résumé',
  resumeLangAria: 'Résumé language',
  emailMe: 'Email me',
  highlights: [
    { value: '1st', label: 'DEVMatch Hackathon 2024' },
    { value: '5', label: 'Projects built' },
    { value: '3.03', label: 'CGPA, dual degree UK × MY' },
    { value: '4', label: 'Spoken languages' },
  ],
  education: {
    title: 'Education.',
    lede: 'A dual degree between Malaysia and the United Kingdom.',
    when: 'Mar 2023 – Feb 2026',
    where: 'Kuala Lumpur, Malaysia',
    degree: 'BSc (Hons) Computer Science · Dual degree with De Montfort University, Leicester, UK',
    gpa: 'CGPA',
    classification: 'Classification',
  },
  experience: {
    title: 'Experience.',
    lede: 'Where the offline-first work started.',
    when: 'Dec 2024 – May 2025',
    where: 'Internship',
    role: 'Web Developer Intern',
    points: ['Trip Monitoring app for plantation vehicle logs', 'Works offline, syncs automatically', 'Backend for master data, tariffs and reports'],
  },
  awards: {
    title: 'Awards',
    first: '1st Place, DEVMatch Hackathon',
    firstText: 'Built the UI for DocTour, a blockchain medical tourism app.',
    second: '2nd Place, APU Entrepreneurship',
    secondText: 'Pitched a walking app that rewards distance travelled.',
    caption: 'Awards night, MasChain Tourism Track · tap a photo to enlarge',
    alts: [
      'The DocTour team on stage under the “MasChain Tourism 1st – 1000 USD DocTour” winners screen',
      'Team photo beside the APUBCC banner after winning the MasChain Tourism track',
      'Selfie with the team in front of the DocTour winners screen',
    ],
  },
  projects: {
    title: 'Projects.',
    lede: "Things I've built and shipped, from client platforms to experiments.",
    github: 'View on GitHub',
    items: [
      {
        date: '2026 – Present',
        subtitle: 'WhatsApp chatbot that answers from each business’s own catalogue and prices.',
        points: ['Multi-tenant, isolated with PostgreSQL row-level security', 'Encrypted credentials (AES-256-GCM), HMAC-verified messages'],
      },
      { date: '2026 – Present', subtitle: 'Screens IDX stocks, forex and gold against your own criteria.', points: ['Historical market data with integrity checks'] },
      {
        date: 'Oct 2025',
        subtitle: 'Property management platform with four role-based dashboards.',
        points: ['Stripe Connect rent payments and payouts', 'JWT + 2FA, deployed on AWS'],
      },
      {
        date: 'Jan 2026',
        subtitle: 'Final Year Project: a GPS app that proves guards walked their route.',
        points: ['Hash-verified, tamper-proof patrol reports', 'Offline-first with live monitoring'],
      },
      { date: '2026', subtitle: 'A 3D globe you steer with hand gestures.', points: ['Webcam, Ultraleap or mouse, with automatic fallback'] },
    ],
  },
  skills: {
    title: 'Skills.',
    lede: 'The tools behind the projects above.',
    categories: ['Languages', 'Frameworks', 'Data & Cloud', 'Systems & Practice'],
    spoken: [
      { name: 'Indonesian', level: 'Native' },
      { name: 'English', level: 'Fluent · IELTS 6.5' },
      { name: 'Malay', level: 'Fluent' },
      { name: 'German', level: 'B2' },
    ],
  },
  contact: {
    title: "Let's talk.",
    lede: 'Open to graduate and junior developer roles across frontend, backend, cloud and AI-powered systems.',
    email: 'Email',
    phone: 'Phone',
  },
  footer: '© 2026 Alfeus Xiesi Delroy. Built with React, TypeScript and Motion.',
  // The build movie's progress pill (read by swarmBuild.ts)
  building: 'Building',
  done: 'Done',
  skipHint: 'Scroll or tap anywhere to skip',
};

const id: typeof en = {
  nav: { about: 'Tentang', education: 'Pendidikan', experience: 'Pengalaman', projects: 'Proyek', skills: 'Keahlian', contact: 'Kontak' },
  replay: 'Putar ulang',
  stop: 'Berhenti',
  replayAria: 'Putar ulang animasi build',
  stopAria: 'Hentikan animasi build',
  menuAria: 'Buka/tutup menu navigasi',
  siteLangAria: 'Bahasa situs',
  role: 'Lulusan Ilmu Komputer · Full Stack Developer',
  tagline: ['Saya membangun ', 'aplikasi mobile offline-first', ' dan ', 'platform full-stack', '.'],
  download: 'Unduh CV',
  resumeLangAria: 'Bahasa CV',
  emailMe: 'Kirim email',
  highlights: [
    { value: 'Juara 1', label: 'DEVMatch Hackathon 2024' },
    { value: '5', label: 'Proyek dibangun' },
    { value: '3.03', label: 'IPK, gelar ganda UK × MY' },
    { value: '4', label: 'Bahasa dikuasai' },
  ],
  education: {
    title: 'Pendidikan.',
    lede: 'Gelar ganda antara Malaysia dan Inggris.',
    when: 'Mar 2023 – Feb 2026',
    where: 'Kuala Lumpur, Malaysia',
    degree: 'BSc (Hons) Ilmu Komputer · Gelar ganda dengan De Montfort University, Leicester, Inggris',
    gpa: 'IPK',
    classification: 'Predikat',
  },
  experience: {
    title: 'Pengalaman.',
    lede: 'Tempat pekerjaan offline-first saya dimulai.',
    when: 'Des 2024 – Mei 2025',
    where: 'Magang',
    role: 'Web Developer (Magang)',
    points: ['Aplikasi Trip Monitoring untuk log kendaraan perkebunan', 'Bisa offline, sinkron otomatis', 'Backend untuk master data, tarif, dan laporan'],
  },
  awards: {
    title: 'Penghargaan',
    first: 'Juara 1, DEVMatch Hackathon',
    firstText: 'Membangun UI untuk DocTour, aplikasi wisata medis berbasis blockchain.',
    second: 'Juara 2, APU Entrepreneurship',
    secondText: 'Mempresentasikan aplikasi jalan kaki yang memberi hadiah sesuai jarak tempuh.',
    caption: 'Malam penganugerahan, MasChain Tourism Track · ketuk foto untuk memperbesar',
    alts: [
      'Tim DocTour di panggung di bawah layar pemenang “MasChain Tourism 1st – 1000 USD DocTour”',
      'Foto tim di samping banner APUBCC setelah menjuarai MasChain Tourism track',
      'Swafoto bersama tim di depan layar pemenang DocTour',
    ],
  },
  projects: {
    title: 'Proyek.',
    lede: 'Hal-hal yang saya bangun dan rilis, dari platform klien hingga eksperimen.',
    github: 'Lihat di GitHub',
    items: [
      {
        date: '2026 – Sekarang',
        subtitle: 'Chatbot WhatsApp yang menjawab dari katalog dan harga milik tiap bisnis.',
        points: ['Multi-tenant, terisolasi dengan row-level security PostgreSQL', 'Kredensial terenkripsi (AES-256-GCM), pesan terverifikasi HMAC'],
      },
      { date: '2026 – Sekarang', subtitle: 'Menyaring saham IDX, forex, dan emas sesuai kriteria Anda sendiri.', points: ['Data pasar historis dengan pengecekan integritas'] },
      {
        date: 'Okt 2025',
        subtitle: 'Platform manajemen properti dengan empat dashboard berbasis peran.',
        points: ['Pembayaran sewa dan pencairan dana via Stripe Connect', 'JWT + 2FA, di-deploy di AWS'],
      },
      {
        date: 'Jan 2026',
        subtitle: 'Tugas Akhir: aplikasi GPS yang membuktikan petugas patroli benar-benar menyusuri rutenya.',
        points: ['Laporan patroli anti-manipulasi, terverifikasi hash', 'Offline-first dengan pemantauan langsung'],
      },
      { date: '2026', subtitle: 'Globe 3D yang dikendalikan dengan gerakan tangan.', points: ['Webcam, Ultraleap, atau mouse, dengan fallback otomatis'] },
    ],
  },
  skills: {
    title: 'Keahlian.',
    lede: 'Teknologi di balik proyek-proyek di atas.',
    categories: ['Bahasa Pemrograman', 'Framework', 'Data & Cloud', 'Sistem & Praktik'],
    spoken: [
      { name: 'Indonesia', level: 'Bahasa ibu' },
      { name: 'Inggris', level: 'Fasih · IELTS 6.5' },
      { name: 'Melayu', level: 'Fasih' },
      { name: 'Jerman', level: 'B2' },
    ],
  },
  contact: {
    title: 'Mari bicara.',
    lede: 'Terbuka untuk posisi graduate dan junior developer di bidang frontend, backend, cloud, dan sistem berbasis AI.',
    email: 'Email',
    phone: 'Telepon',
  },
  footer: '© 2026 Alfeus Xiesi Delroy. Dibuat dengan React, TypeScript, dan Motion.',
  building: 'Membangun',
  done: 'Selesai',
  skipHint: 'Scroll atau ketuk di mana saja untuk melewati',
};

export const COPY = { en, id };
export type Copy = typeof en;

/** ?lang=id|en wins (shareable links), then the browser's language. */
export function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'id' || q === 'en') return q;
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en';
}
