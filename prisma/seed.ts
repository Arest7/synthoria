import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminUsername = 'admin';
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created (username: admin, password: admin123).');
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Create Educational Software Programs
  const softwares = [
    {
      name: 'SeeMusic',
      slug: 'seemusic',
      iconColor: 'from-pink-500 to-rose-500',
      description: 'Vizual musiqa va 3D pianino klaviaturasi animatsiyalarini yaratish uchun eng ilg‘or dastur. Musiqa ijrosini ko‘rgazmali tarzda namoyish etishda yordam beradi.',
      purpose: 'Musiqa darslarida o‘quvchilarning badiiy-estetik his-tuyg‘ularini vizual shakllar orqali rivojlantirish.',
      eduValue: 'Musiqiy tovushlar va ranglarning o‘zaro bog‘liqligini tushuntiradi. O‘quvchilar klavishlarning bosilishini 3D yorug‘lik effektlari ko‘rinishida tomosha qilib, kuyni tezroq va qiziqroq o‘rganadilar.',
      advantages: [
        'Yuqori sifatli 3D renderlash va animatsiya imkoniyatlari.',
        'MIDI klaviatura va raqamli pianinolar bilan to‘g‘ridan-to‘g‘ri sinxronizatsiya.',
        'Musiqiy videolarni tezda yaratish va darslarda vizual qo‘llanma sifatida foydalanish.',
        'Estetik idrokni va ranglar uyg‘unligini rivojlantirish.'
      ],
      howToUse: 'O‘qituvchi MIDI fayllarni yuklaydi, musiqa asarining ritmi va dinamikasiga mos vizual effektlarni sozlaydi va proyektor orqali sinfda namoyish etadi. O‘quvchilar esa uyda o‘zlarining ijrolarini yozib, chiroyli video shaklida tayyorlashlari mumkin.',
      formats: ['MIDI', 'MP4', 'WAV'],
      websiteUrl: 'https://www.visualmusicdesign.com/',
    },
    {
      name: 'Synthesia',
      slug: 'synthesia',
      iconColor: 'from-blue-500 to-indigo-500',
      description: 'Klavishlarni bosish tartibini o‘rgatuvchi o‘yinlashtirilgan ommabop dastur. Notalarni bilmasdan ham sevimli asarlarni tezda chalishni o‘rganish imkonini beradi.',
      purpose: 'O‘quvchilarda pianino chalish ko‘nikmalarini o‘yin shaklida shakllantirish va mustahkamlash.',
      eduValue: 'Klavishlarni bosish ketma-ketligini va ritmni to‘g‘ri saqlashni osonlashtiradi. Dastur xatolarni avtomatik baholaydi va o‘quvchilarga o‘z ustida mustaqil ishlash imkonini beradi.',
      advantages: [
        'Notalarsiz, chiziqli tushuvchi yo‘llar orqali pianino chalishni oson o‘rganish.',
        'Ko‘p sonli tayyor MIDI kutubxonalari mavjudligi.',
        'O‘z-o‘zini tekshirish, ballar yig‘ish va tezlikni boshqarish rejimlarining mavjudligi.',
        'Chap va o‘ng qo‘l mashqlarini alohida bajarish imkoniyati.'
      ],
      howToUse: 'O‘quvchilar raqamli pianinoni kompyuterga ulab, tushayotgan rangli chiziqlar bo‘ylab to‘g‘ri klavishlarni bosadilar. Dastur ularning aniqligini va tezligini tahlil qilib, dars yakunida baholaydi.',
      formats: ['MIDI', 'MusicXML'],
      websiteUrl: 'https://www.synthesiagame.com/',
    },
    {
      name: 'Midiano',
      slug: 'midiano',
      iconColor: 'from-emerald-500 to-teal-500',
      description: 'Brauzerda ishlovchi interaktiv onlayn virtual pianino. Hech qanday qo‘shimcha dastur o‘rnatmasdan istalgan qurilmada ishga tushirish imkoniyati.',
      purpose: 'Dars jarayonida va uy sharoitida o‘quvchilar uchun qulay virtual cholg‘u asbobini taqdim etish.',
      eduValue: 'Kompyuter klaviaturasi orqali pianino chalish imkonini beradi. Ritm va ohang uyg‘unligini kompyuter texnologiyalari orqali his qilish darajasini oshiradi.',
      advantages: [
        'Brauzer orqali yuklanuvchi yengil interfeys (o‘rnatish shart emas).',
        'Kompyuter klaviaturasi va sichqoncha yordamida boshqarish qulayligi.',
        'MIDI fayllarni to‘g‘ridan-to‘g‘ri yuklab chalish yoki vizualizatsiya qilish.',
        'Mobil telefon va planshetlarda ham to‘liq ishlash imkoniyati.'
      ],
      howToUse: 'Sinfda pianino yetishmagan hollarda, o‘quvchilar smartfon yoki planshetlari orqali brauzerga kirib, virtual klaviatura orqali asosiy notalarni va oddiy kuylarni mashq qiladilar.',
      formats: ['MIDI'],
      websiteUrl: 'https://midiano.com/',
    },
    {
      name: 'Note Bounce',
      slug: 'note-bounce',
      iconColor: 'from-amber-500 to-orange-500',
      description: 'Musiqa ritmi va tezligini vizual to‘plar yordamida namoyish etuvchi interaktiv dastur. Har bir chalingan nota to‘plarning harakatlanishiga sabab bo‘ladi.',
      purpose: 'O‘quvchilarning ritmik sezgisini va dinamik idrokini rivojlantirish.',
      eduValue: 'Ritmik zarblarning vizual masofalar va to‘plarning sakrashi bilan aloqadorligini tushuntiradi. Murakkab ritmlarni tushunishni osonlashtiradi.',
      advantages: [
        'Ajoyib fizik harakatlarga asoslangan interaktiv vizualizatsiya.',
        'Ritm va dinamikani ko‘rgazmali tarzda tushunish.',
        'Boshlang‘ich sinf va o‘smirlar uchun yuqori jalb etuvchanlik darajasi.'
      ],
      howToUse: 'Darsda ritmik mashqlar o‘tilayotganda, Note Bounce animatsiyasi yoqiladi. O‘quvchilar to‘plarning to‘siqlardan sakrab o‘tishi orqali ritmik taktlarni his etib, birgalikda chapak chalib hamrohlik qiladilar.',
      formats: ['MIDI'],
      websiteUrl: 'https://notebounce.com/',
    },
    {
      name: 'vanBasco Karaoke Player',
      slug: 'vanbasco',
      iconColor: 'from-violet-500 to-purple-500',
      description: 'Karaoke va matnli MIDI fayllarini ijro etish uchun eng yengil va afsonaviy dastur. Ovoz balandligi, tonallik va tempni real vaqtda o‘zgartirish mumkin.',
      purpose: 'Musiqa darslarida jamoaviy va yakkaxon kuylash faoliyatini tashkil etish.',
      eduValue: 'O‘quvchilarning vokal-xor ijrochiligi ko‘nikmalarini rivojlantiradi. Tonallikni o‘zgartirish orqali o‘quvchilarning ovoz diapazoniga mos ravishda sozlash imkonini beradi.',
      advantages: [
        'Matnli MIDI (karaoke) fayllarini to‘liq qo‘llab-quvvatlash.',
        'Kuy tezligi (tempo) va kalitini (key) osongina o‘zgartirish.',
        'Cholg‘u asboblari kanallarini alohida-alohida yoqish va o‘chirish.',
        'Tizim talablarining o‘ta pastligi.'
      ],
      howToUse: 'Musiqa o‘qituvchisi darslikdagi qo‘shiqning MIDI variantini yuklaydi. O‘quvchilar sinf taxtasidagi matnga qarab, chiroyli fon musiqasi (minusovka) ostida qo‘shiq kuylaydilar.',
      formats: ['MIDI', 'KAR'],
      websiteUrl: 'http://www.vanbasco.com/',
    },
    {
      name: 'Kanto Player',
      slug: 'kanto-player',
      iconColor: 'from-cyan-500 to-sky-500',
      description: 'Professional multimedia va karaoke pleyeri. Nafaqat MIDI, balki MP3, CDG va video formatlarni ham yuqori sifatda qayta ishlaydi.',
      purpose: 'Darslar va maktab tadbirlarida yuqori sifatli musiqiy fon taqdim etish.',
      eduValue: 'Zamonaviy musiqiy texnologiyalarni amaliy qo‘llash ko‘nikmasini o‘rgatadi. Qo‘shiqlarni sifatli va estetik jihatdan chiroyli ijro etish imkonini beradi.',
      advantages: [
        'MIDI, KAR, MP3 va video formatlarini birlashtirgan universal pleyer.',
        'Kuy o‘tishlarining juda silliq va sifatli ekanligi.',
        'Musiqiy ro‘yxatlar (playlists) bilan ishlashning mukammal tizimi.'
      ],
      howToUse: 'Dars yakunida qo‘shiq kuylash musobaqalari o‘tkazilganda yoki maktab konsertlarida multimedia tizimini boshqarish uchun Kanto Player dasturidan foydalaniladi.',
      formats: ['MIDI', 'KAR', 'MP3', 'WAV', 'MP4'],
      websiteUrl: 'https://www.kantokaraoke.com/',
    },
    {
      name: 'ProfM-2DRUM',
      slug: 'profm-2drum',
      iconColor: 'from-amber-600 to-yellow-600',
      description: 'Ritm va zarbli cholg‘u asboblarini o‘rgatuvchi maxsus virtual barabanlar dasturi. Musiqadagi ritm hissiyotini eng yuqori darajada rivojlantiradi.',
      purpose: 'O‘quvchilarning ritmik intuitsiyasini va zarbli asboblarda chalish kompetensiyasini oshirish.',
      eduValue: 'Musiqa darslarida ritmik hamrohlik qilishni osonlashtiradi. Turli milliy va jahon ritmlarini o‘rganish orqali o‘quvchilarning badiiy tafakkurini kengaytiradi.',
      advantages: [
        'Zarbli asboblarning vizual klaviaturasi va tovush kutubxonasi.',
        'Ritmik asarlar uchun tayyor mashq andozalari.',
        'Ritm va tempni interaktiv nazorat qilish tizimi.'
      ],
      howToUse: 'O‘quvchilar ekran orqali turli ritm andozalarini (masalan, 2/4, 3/4, 4/4 o‘lchovlarini) virtual barabanlarda chertib takrorlaydilar. Ritmik tezlik va uyg‘unlikni sinovdan o‘tkazadilar.',
      formats: ['MIDI', 'WAV'],
      websiteUrl: '#',
    }
  ];

  for (const sw of softwares) {
    await prisma.softwareProgram.upsert({
      where: { slug: sw.slug },
      update: sw,
      create: sw,
    });
  }
  console.log('Educational Software entries seeded.');

  // 3. Create Sample MIDI Files
  const midis = [
    {
      title: 'Vatanim',
      composer: 'Shermat Yormatov',
      description: 'O‘zbekiston vatanparvarlik ruhidagi eng mashhur bolalar qo‘shiqlaridan biri. Kuy mayin, tantanavor va yorqin ohanglarga boy.',
      grade: 5,
      genre: 'Bolalar qo‘shig‘i / Vatanparvarlik',
      difficulty: 'EASY',
      fileUrl: '/uploads/vatanim.mid',
      fileSize: '15 KB',
      duration: '02:15',
      isFeatured: true,
      compatSoftware: ['SeeMusic', 'Synthesia', 'vanBasco'],
      educationalNote: 'Bu qo‘shiq o‘quvchilarda Vatan tuyg‘usini, jo‘r ovozda kuylash va ritmni to‘g‘ri saqlash ko‘nikmalarini rivojlantiradi. Asar lya minor tonalligida bo‘lib, boshlang‘ich pianino ijrochilariga mos keladi.'
    },
    {
      title: 'Chamanzor',
      composer: 'Folklor kuy',
      description: 'O‘zbek xalq musiqa merosiga mansub quvnoq va sho‘x ohangli xalq qo‘shig‘i. Ritmik harakatlari va milliy bezaklari bilan ajralib turadi.',
      grade: 5,
      genre: 'Xalq musiqasi / Milliy kuy',
      difficulty: 'MEDIUM',
      fileUrl: '/uploads/chamanzor.mid',
      fileSize: '22 KB',
      duration: '03:10',
      isFeatured: false,
      compatSoftware: ['Synthesia', 'Midiano', 'ProfM-2DRUM'],
      educationalNote: 'Xalq musiqasining milliy bezaklarini (nolalarni) IT dasturlari orqali ko‘rish va his etish uchun juda qulay asar. Ritmik asosi doira zarblari bilan boyitilgan.'
    },
    {
      title: 'Bahor keldi',
      composer: 'Soli Aliyev',
      description: 'Tabiat go‘zalligi va bahor faslining tarovatini madh etuvchi yengil va quvnoq bolalar qo‘shig‘i.',
      grade: 6,
      genre: 'Klassik bolalar musiqasi',
      difficulty: 'MEDIUM',
      fileUrl: '/uploads/bahor_keldi.mid',
      fileSize: '18 KB',
      duration: '02:45',
      isFeatured: true,
      compatSoftware: ['SeeMusic', 'Synthesia', 'Midiano'],
      educationalNote: 'Ushbu asar yordamida o‘quvchilar tempning o‘zgarishi (accelerando, ritardando) va lirik ohang tarovatini IT dasturlaridagi vizual to‘lqinlar orqali o‘rganadilar.'
    },
    {
      title: 'Tanovar',
      composer: 'Xalq kuyi',
      description: 'O‘zbek mumtoz musiqasining eng yuksak namunalaridan biri. Lirik va chuqur estetik ma’noga ega bo‘lgan asar.',
      grade: 7,
      genre: 'Mumtoz kuy / Maqom yo‘li',
      difficulty: 'HARD',
      fileUrl: '/uploads/tanovar.mid',
      fileSize: '35 KB',
      duration: '04:20',
      isFeatured: true,
      compatSoftware: ['SeeMusic', 'Synthesia', 'Midiano'],
      educationalNote: '7-sinf o‘quvchilarining oliy estetik didini rivojlantirishga xizmat qiladi. Murakkab ohanglar, yarim tonlar va chuqur hissiy ifodalarni tahlil qilish uchun eng to‘g‘ri namuna.'
    },
    {
      title: 'Ko‘cha bog‘lari',
      composer: 'Xalq musiqa merosi',
      description: 'Sho‘x, jozibador va murakkab ritmlarga ega bo‘lgan o‘zbek xalq kuyi.',
      grade: 6,
      genre: 'Xalq musiqasi / Ritmik kuy',
      difficulty: 'HARD',
      fileUrl: '/uploads/kocha_boglari.mid',
      fileSize: '28 KB',
      duration: '03:40',
      isFeatured: false,
      compatSoftware: ['Synthesia', 'ProfM-2DRUM', 'Kanto Player'],
      educationalNote: 'Bu asar o‘quvchilarga murakkab sinkopali ritmlarni va milliy zarblarni baraban va doira dasturlarida mashq qilishga yordam beradi.'
    },
    {
      title: 'O‘zbekiston',
      composer: 'Mutal Burhonov',
      description: 'O‘zbekiston kompozitorlik maktabining durdona asarlaridan biri. Kuchli dinamika va jo‘shqin akkordlarga ega.',
      grade: 7,
      genre: 'Akademik musiqa / Simfonik',
      difficulty: 'HARD',
      fileUrl: '/uploads/ozbekiston.mid',
      fileSize: '42 KB',
      duration: '05:05',
      isFeatured: true,
      compatSoftware: ['SeeMusic', 'Synthesia', 'Kanto Player'],
      educationalNote: 'Asarda polifoniya elementlari va uyg‘unlik darslariga oid materiallar mavjud. O‘quvchilar bir necha ovozlarning (partiyalarning) birgalikda chiroyli ijro etilishini tahlil qiladilar.'
    }
  ];

  for (const m of midis) {
    await prisma.midiFile.create({
      data: m
    });
  }
  console.log('Sample MIDI files seeded.');

  // 4. Create Sample PDF Documents
  const pdfs = [
    {
      title: 'Musiqa darslarida IT texnologiyalaridan foydalanish metodikasi',
      description: 'O‘qituvchilar uchun mo‘ljallangan, darslarni MIDI va vizualizatsiya dasturlari bilan o‘tish bo‘yicha batafsil qo‘llanma.',
      grade: 5,
      fileUrl: '/uploads/it_musiqa_metodika.pdf',
      fileSize: '1.8 MB',
    },
    {
      title: '5-sinf Musiqa kitobi uchun MIDI to‘plam notalari',
      description: '5-sinf dasturidagi barcha asosiy qo‘shiqlarning pianino va fortepiano uchun yozma notalari va akkordlar to‘plami.',
      grade: 5,
      fileUrl: '/uploads/notes_5_sinf.pdf',
      fileSize: '3.2 MB',
    },
    {
      title: 'Maktab o‘quvchilarining estetik kompetensiyalarini baholash mezonlari',
      description: 'Dissertatsiya doirasida ishlab chiqilgan, o‘quvchilarning badiiy-estetik bilimlarini baholash testlari va amaliy mezonlari.',
      grade: 7,
      fileUrl: '/uploads/competence_evaluation.pdf',
      fileSize: '1.2 MB',
    }
  ];

  for (const p of pdfs) {
    await prisma.pdfDocument.create({
      data: p
    });
  }
  console.log('Sample PDF documents seeded.');

  // 5. Create Sample Research Publications
  const publications = [
    {
      title: 'Musiqa ta’limida raqamli texnologiyalarning didaktik imkoniyatlari',
      content: 'Ushbu maqolada umumta’lim maktablarining 5-7 sinflarida musiqa darslarida SeeMusic va Synthesia dasturlaridan foydalanishning ilmiy-pedagogik asoslari va samaradorligi tahlil qilinadi. Eksperiment natijalari o‘quvchilarning musiqani idrok etish darajasi 24% ga oshganini ko‘rsatdi.',
      category: 'RESEARCH',
      fileUrl: '/uploads/didactic_opportunities.pdf',
    },
    {
      title: 'O‘quvchilarning badiiy-estetik kompetensiyasini rivojlantirish modeli',
      content: 'Tadqiqot doirasida ishlab chiqilgan model an’anaviy musiqa darslarini zamonaviy multimedia, interaktiv o‘yinlar va virtual pianino pleyerlari bilan integratsiya qilishga asoslangan. Model o‘quvchining ijodiy faolligi, ritm sezgisi va musiqiy eslash qobiliyatlarini o‘z ichiga oladi.',
      category: 'METHODICAL',
      fileUrl: '/uploads/aesthetic_model.pdf',
    },
    {
      title: 'Musiqa o‘qituvchilari uchun respublika seminari yakunlari',
      content: 'Toshkent shahrida "Musiqa ta’limida zamonaviy AKT vositalari" mavzusida bo‘lib o‘tgan ilmiy-amaliy seminarda dissertatsiya doirasida yaratilgan interaktiv platforma taqdimoti o‘tkazildi. Seminar ishtirokchilari tomonidan platformaga yuqori baho berildi.',
      category: 'NEWS',
    }
  ];

  for (const pub of publications) {
    await prisma.publication.create({
      data: pub
    });
  }
  console.log('Sample publications seeded.');

  // 6. Log some mock download/play actions
  const stats = [
    { type: 'DOWNLOAD_MIDI', itemId: '1', title: 'Vatanim (MIDI)' },
    { type: 'PLAY_MIDI', itemId: '1', title: 'Vatanim (MIDI)' },
    { type: 'PLAY_MIDI', itemId: '1', title: 'Vatanim (MIDI)' },
    { type: 'DOWNLOAD_PDF', itemId: '1', title: 'it_musiqa_metodika.pdf' },
    { type: 'DOWNLOAD_MIDI', itemId: '2', title: 'Tanovar (MIDI)' },
    { type: 'PLAY_MIDI', itemId: '2', title: 'Tanovar (MIDI)' }
  ];

  for (const st of stats) {
    await prisma.statLog.create({
      data: st
    });
  }
  console.log('Initial analytical stats seeded.');

  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
