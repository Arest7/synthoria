'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, ExternalLink, ShieldCheck, HelpCircle, Check, Info, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Software {
  name: string;
  slug: string;
  iconColor: string;
  description: string;
  purpose: string;
  eduValue: string;
  advantages: string[];
  howToUse: string;
  formats: string[];
  websiteUrl: string;
}

export default function ItProgramsPage() {
  const { t } = useLanguage();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // 12 educational programs from the user's document
  const programs: Software[] = [
    {
      name: 'VanBascoʻs Karaoke Player',
      slug: 'vanbasco',
      iconColor: 'from-violet-500 to-purple-500 bg-violet-500',
      description: 'Hozirgi zamon ta’lim jarayonida oʻquvchilarning musiqiy qobiliyatlarini rivojlantirishda axborot texnologiyalaridan foydalanish alohida ahamiyat kasb etmoqda. Xususan, kuylash malakalarini shakllantirishda zamonaviy dasturlardan foydalanish samaradorlikni oshiradi, oʻquvchilarning dars jarayoniga boʻlgan qiziqishini kuchaytiradi hamda ijodiy faolligini rivojlantiradi. Shu nuqtayi nazardan, VanBascoʻs Karaoke Player dasturidan foydalanish dolzarb masalalardan biridir.',
      purpose: 'Oʻquvchilarning kuylash malakalarini bosqichma-bosqich rivojlantirish, qoʻshiq soʻzlarini musiqa bilan uygʻunlikda toʻgʻri talaffuz qilish, intonatsiya va ritmik sezgilarini shakllantirish.',
      eduValue: 'Dasturdan foydalanish oʻquvchilarda nafaqat kuylash malakalarini shakllantirish, balki kompyuter dasturlari bilan ishlash kompetensiyasini rivojlantirishga ham xizmat qiladi. Oʻquvchilar musiqani tinglash, ijro etish va qayta ishlash jarayonida amaliy tajribaga ega boʻladilar, bu esa musiqiy savodxonlikni oshirishga, oʻz-oʻzini nazorat qilish va mustaqil mashq qilish koʻnikmalarini rivojlantirishga zamin yaratadi.',
      advantages: [
        'Qoʻshiqning tempi va oʻquvchilarning ovoz diapazoniga moslashtirish imkoniyati.',
        'Qoʻshiq soʻzlari, shrift, rang va fonni qulay koʻrinishda sozlash.',
        'Cholgʻu sozlar ovozini oʻchirib yoki solo rejimida ijro etib, vokal mashqlarini samarali tashkil etish.',
        'Pianino klaviaturasida notalarning real vaqt rejimida aks etishi.',
        'Kuylash mahorati – vokal mashqlarini amalga oshirish, soʻzlarni musiqaga moslashtirish va ritmni saqlash.',
        'Kompyuter dasturi bilan ishlash kompetensiyasi – MIDI va karaoke fayllarini yuklash va sozlash.',
        'Mustaqil oʻrganish koʻnikmasi – yordam oynasi va tavsiyalar orqali mustaqil mashq qilish.',
        'Jamoaviy ishlash qobiliyati – hamkorlik va ijroni muvofiqlashtirish orqali jamoaviy faoliyat.'
      ],
      howToUse: 'Oʻqituvchi darsda oʻtilayotgan xor qoʻshigʻining karaoke MIDI variantini yuklaydi. Oʻquvchilar doskadagi yuguruvchi matnga qarab, chiroyli fon musiqasi (minusovka) ostida joʻr ovozda kuylaydilar. Dastur interfeysi sodda va qulay boʻlib, 1–2 marotaba foydalangach, oʻquvchi uni mustaqil ravishda ishlata oladi.',
      formats: ['MIDI', 'KAR'],
      websiteUrl: 'http://www.vanbasco.com/',
    },
    {
      name: 'Kanto Player',
      slug: 'kanto-player',
      iconColor: 'from-cyan-500 to-sky-500 bg-cyan-500',
      description: 'Bugungi kunda musiqa ta’limida raqamli texnologiyalar oʻquvchilarning musiqiy qobiliyatlarini rivojlantirishda muhim omil sifatida qaralmoqda. 5–7-sinf oʻquvchilari uchun musiqiy idrokni shakllantirish, kuylash va ijro malakalarini takomillashtirish jarayonida Kanto Player dasturi interaktiv va qulay vositadir.',
      purpose: 'Musiqa madaniyati darslarida qoʻshiqni tinglash, matnni kuzatish va kuylashni interaktiv tarzda tashkil qilish.',
      eduValue: 'Oʻquvchilarda nafaqat vokal va ijro malakalarini rivojlantiradi, balki ularning kompyuter dasturlari bilan ishlash kompetensiyasini ham shakllantiradi. MuseScore va Kanto Player dasturlarining uygʻun qoʻllanishi oʻquvchilarning mustaqil ijodiy faoliyatini ragʻbatlantiradi.',
      advantages: [
        'Qoʻshiq matnini kuzatib kuylash, ritm va tovush ustida ishlash imkoniyati.',
        'Musiqiy asarlarning elektron bazasini yaratish va ularni raqamli muhitda qayta ishlash koʻnikmalarini shakllantirish.',
        'Oʻquvchilarni faol va qiziqarli mashgʻulotlarga jalb etish imkoniyati.',
        'Oʻquvchilarning musiqaga boʻlgan qiziqishini oshirish, sahnaga tayyorlash va mustaqil ijodga yoʻnaltirish.',
        'Universal formatlarni (MIDI, KAR, MP3, CDG, MP4) qoʻllab-quvvatlash.'
      ],
      howToUse: 'Oʻqituvchi dars boshida tanlangan musiqiy asarlarni MIDI fayl koʻrinishida tayyorlab beradi. Oʻquvchilar esa dars jarayonida Kanto Player orqali ularni tinglaydi, matnini kuzatib kuylashni mashq qiladi, intonatsiya va ritm ustida ishlaydi.',
      formats: ['MIDI', 'KAR', 'MP3', 'WAV', 'MP4'],
      websiteUrl: 'https://www.kantokaraoke.com/',
    },
    {
      name: 'Sweet MIDI Player 32',
      slug: 'sweet-midi-player',
      iconColor: 'from-fuchsia-500 to-pink-500 bg-fuchsia-500',
      description: 'Sweet MIDI Player 32 — bu MIDI fayllarni ijro etish va tahrirlash uchun moʻljallangan qulay kompyuter dasturi boʻlib, shved kompaniyasi “Roni Music” tomonidan ishlab chiqilgan. Dastur nafaqat pleer, balki editor sifatida ham ahamiyatli boʻlib, ovoz balandligi, tembr, temp, transpozitsiya va loop rejimlarini sozlash imkonini beradi.',
      purpose: 'Musiqiy asarlarni bosqichma-bosqich oʻzlashtirish, ansambl mashgʻulotlarida kerakli partiyani tinglab mashq qilish va xor darslarida oʻz ovozini ajratib mustahkamlash.',
      eduValue: 'Dasturdan foydalanish oʻquvchilarning musiqiy eshituvini rivojlantiradi, ijrochilik koʻnikmalarini mustahkamlaydi, ijodiy izlanish va musiqiy tafakkurni kengaytiradi, shuningdek zamonaviy axborot texnologiyalaridan foydalanish kompetensiyasini shakllantiradi.',
      advantages: [
        'MIDI treklarni alohida yoqish yoki oʻchirish (muting) va solo rejimida tinglash.',
        'Oktava, tonallik (transpose) va ijro tezligini (tempo) moslashtirish.',
        'MIDI standartiga koʻra 16 ta kanal bilan ishlash (10-kanal barabanlar uchun).',
        'Sodda va tushunarli interfeysga ega, murakkab professional sequencer emas.',
        'Musiqa oʻqituvchilar va oʻquvchilar uchun mashq jarayonini yengillashtirish.'
      ],
      howToUse: 'Dasturni ishga tushirib, kerakli MIDI faylni yuklaymiz. Oʻquvchilar murakkab kuylarni sekinlashtirib tinglaydilar, turli cholgʻu sozlari tembrlarini ajratib eshitadilar, kerakli partiyani oʻchirib qoʻyib mustaqil chalish yoki kuylash orqali mashq qiladilar.',
      formats: ['MIDI', 'KAR', 'RMI'],
      websiteUrl: 'https://www.ronimusic.com/',
    },
    {
      name: 'Notation Player',
      slug: 'notation-player',
      iconColor: 'from-rose-500 to-red-500 bg-rose-500',
      description: 'Notation Player dasturi MIDI yoki boshqa mos fayllarni nafaqat tinglash, balki ularning nota yozuvini ham ekranda kuzatish imkonini beruvchi qulay va bepul dasturdir. U musiqani vizual koʻrish, ritm va ohangni notalar yordamida chuqurroq his etish imkonini beradi.',
      purpose: 'Oʻquvchilarning musiqiy idrokini kengaytirish, notani tovush bilan bogʻlash malakasini shakllantirish va kuylash koʻnikmalarini rivojlantirish.',
      eduValue: 'Musiqiy savodxonlikni rivojlantirishga keng imkoniyat yaratadi. Notalar va vokal ovozining real vaqt rejimida aks etishi oʻquvchilarning musiqiy eshitish va idrok etish tuygʻularini oshiradi hamda ularning kompyuter dasturlari bilan ishlash kompetensiyasini shakllantiradi.',
      advantages: [
        'MIDI fayllarni nota koʻrinishida koʻrsatish va kuzatish.',
        'Sodda va intuitiv (oʻrganishga oson va tabiiy tushunarli) interfeys.',
        'Vizuallikning ustuvorligi tufayli darslarni faol ijrochi va tahlilchi sifatida tashkil etish.',
        'Jamoa boʻlib kuylash yoki birgalikda nota yozuvini tahlil qilish qulayligi.',
        'Oʻqituvchidan darsga tayyorgarlik uchun kamroq vaqt talab etilishi.'
      ],
      howToUse: 'Oʻquvchilar yoki oʻqituvchi dasturda MIDI faylni ochib, ijroni boshlaydi. Ekranda notalar avtomatik chiziladi va ijro davomida nota chiziqlari boʻylab harakatlanadi. Oʻquvchilar notalarga qarab kuylaydilar yoki cholgʻuda chaladilar.',
      formats: ['MIDI', 'KAR'],
      websiteUrl: 'https://www.notation.com/',
    },
    {
      name: 'Midis2jam2',
      slug: 'midis2jam2',
      iconColor: 'from-indigo-500 to-blue-500 bg-indigo-500',
      description: 'Midis2Jam2 — bu MIDI fayllarni avtomatik tarzda animatsiyaga aylantirib, ularni virtual ansambl shaklida ijro etuvchi ochiq kodli 3D vizualizator dasturidir. U musiqiy asarlarni rangli grafik koʻrinishda kuzatish imkonini beradi.',
      purpose: 'Oʻquvchilarni musiqa darsiga jalb etish, musiqiy idrokni kuchaytirish, ansambl va orkestr ijrosini vizual tarzda yaxshiroq tasavvur qilish.',
      eduValue: 'Nota, tovush va cholgʻu ijrosini bir vaqtning oʻzida eshitib va koʻrib, musiqiy bilimlarni samarali oʻzlashtirish. Rangli va harakatli animatsiyalar musiqani qabul qilishni osonlashtiradi, oʻquvchining poliritmik tafakkuri va tasavvurini kengaytiradi.',
      advantages: [
        'MIDI fayllarni avtomatik ravishda virtual 3D ansambl animatsiyasiga aylantirish.',
        'Nota, tovush va cholgʻu ijrosi oʻrtasidagi bogʻlanishni jonli tasvirlash.',
        'Oʻquvchilar oʻz yaratgan yoki tahrir qilgan asarlarini virtual ansamblda eshitib tahlil qilishi.',
        'Kompyuter dasturlari bilan ishlash jarayonida raqamli savodxonlikni oshirish.',
        'Ochiq kodli va erkin foydalanish imkoniyati.'
      ],
      howToUse: 'Oʻqituvchi darsda murakkab musiqiy asarlarning MIDI variantini Midis2Jam2 orqali ishga tushiradi. Oʻquvchilar ekrandagi virtual 3D orkestr cholgʻularining ijrosini, rangli animatsiyalarni tomosha qilib, ritm va garmoniyani anglab boradilar.',
      formats: ['MIDI'],
      websiteUrl: 'https://github.com/ScreamingMonsters/Midis2jam2',
    },
    {
      name: 'MIDI Clef',
      slug: 'midi-clef',
      iconColor: 'from-blue-600 to-sky-600 bg-blue-600',
      description: 'MIDI Clef — bu MIDI fayllarni nota yozuviga aylantirib, ularni tanlangan kalitlarda vizual namoyon etuvchi hamda karaoke rejimida sinxron ijro qiluvchi dasturiy-pedagogik vositadir. Mobil qurilmalar uchun “MIDI Clef Karaoke Player” nomi bilan ham chiqarilgan.',
      purpose: 'Oʻquvchilarning musiqiy idrokini rivojlantirish, nota savodxonligini shakllantirish, badiiy-estetik mahoratini takomillashtirish va kompyuter dasturlari bilan ishlash kompetensiyasini shakllantirish.',
      eduValue: 'Faqat eshitish emas, balki nota va vokal matnini bir vaqtda koʻrish orqali musiqiy perception (idrok) va musical thinking (tafakkur) rivojlanadi. Ilgari amaliyotda keng qoʻllanmagan ushbu dastur musiqa ta’limiga innovatsion pedagogik yondashuv kiritadi.',
      advantages: [
        'MIDI fayllarni ochib, avtomatik ravishda nota yozuviga aylantirish.',
        'Notalarni turli kalitlarda (Sol, Fa kalitlari va boshqalar) koʻrish.',
        'Lyrics (matn), akkord va karaoke funksiyalari orqali sinxron ijro etish.',
        'SoundFont (SF2, SF3, SFZ) yuklab ishlatish va ovoz effektlari (reverb, chorus, EQ).',
        'Temp, kalit (transpose) va kanallarni oʻchirish (muting) yoki solo qilish.',
        'Telefonda ham foydalanish qulayligi (ZeroMem Apps versiyasi).'
      ],
      howToUse: 'Darsning yangi mavzuni tushuntirish yoki amaliy kuylash bosqichida oʻqituvchi MIDI faylni ochib nota va lyricsni aks ettiradi. Oʻquvchilar "Show lyrics only" rejimini yoqib, boshqa chalgʻituvchi grafiklarsiz faqat matnga qarab toʻg‘ri ritmda kuylaydilar.',
      formats: ['MIDI', 'MOD', 'CDG'],
      websiteUrl: 'https://github.com/ZeroMemApps/MidiClef',
    },
    {
      name: 'Free MIDI Player',
      slug: 'free-midi-player',
      iconColor: 'from-teal-500 to-emerald-500 bg-teal-500',
      description: 'FreeMIDI Player — musiqiy asarlarni MIDI formatida ijro etuvchi, tempni (BPM), tonallikni (kalitni) va ovoz balandligini real vaqtda oʻzgartirish imkonini beruvchi sodda va bepul Windows dasturidir.',
      purpose: 'Musiqa madaniyati darslarini qiziqarli, interaktiv tashkil etish, oʻquvchilarda kompyuter dasturlari bilan ishlash kompetensiyasini va mustaqil mashq qilish malakasini oshirish.',
      eduValue: 'Oddiygina tinglash emas, balki musiqani vizual idrok etish, ya’ni nota yozuvi va virtual klaviatura yordamida eshitilayotgan tovushni kuzatish imkonini beradi. Bu musiqiy savodxonlikni va ritmik sezgini rivojlantiradi.',
      advantages: [
        'BPM (ijro tezligi), tonallik (kalit) va tovush balandligini bevosita sozlash.',
        'Virtual fortepiano klaviaturasi orqali chalnayotgan notalarni vizual kuzatish.',
        'Turli cholgʻu sozlarini tanlash va ijro variantlarini taqqoslash.',
        'Sodda interfeysi orqali oʻqituvchi va oʻquvchi oʻrtasida vaqtni tejash.',
        'Oʻquvchilarda ustoz-shogirdlik va jamoaviy hamkorlik koʻnikmalarini rivojlantirish.'
      ],
      howToUse: 'Dastur ishga tushirilgach, MIDI fayl yuklanadi. Oʻquvchi yoki oʻqituvchi asarning tempi yoki kalitini moslashtirib, virtual klaviaturada notalarning yonishini kuzatib vokal yoki cholgʻu ijrosini mashq qiladi.',
      formats: ['MIDI'],
      websiteUrl: 'https://sourceforge.net/projects/freemidiplayer/',
    },
    {
      name: 'Midiano',
      slug: 'midiano',
      iconColor: 'from-emerald-500 to-teal-500 bg-emerald-500',
      description: 'Midiano — bu hech qanday dasturni kompyuterga oʻrnatmasdan, toʻgʻridan-toʻgʻri brauzerda ishlovchi interaktiv virtual pianino, MIDI pleyer va Progressive Web App (PWA) ilovasi hisoblanadi.',
      purpose: 'Oʻquvchilarning mustaqil ijro mashqlarini rivojlantirish, musiqa nazariyasi bilan ijroni integratsiyalash va kompyuter texnologiyalari yordamida oʻquv jarayonini boyitish.',
      eduValue: 'Oʻquvchilarda vizual va eshitish orqali musiqani bir vaqtda qabul qilish, nota va ritm tushunchalarini mustahkamlash imkonini beradi. Kuylash kerak boʻlgan takt partiturada alohida rang bilan ajralib koʻrinishi kuylash mahoratini oshiradi.',
      advantages: [
        'Hech qanday oʻrnatishlarsiz toʻgʻridan-toʻgʻri brauzer orqali yuklanish.',
        'Notalarni “tomchilab tushuvchi” diagramma va avtomatik partitura shaklida taqdim etish.',
        'PWA funksiyasi yordamida lokal qurilmaga oʻrnatib, offline rejimda ishlatish.',
        'MIDI klaviaturani ulab, play-along (birga chalish) mashqlarini bajarish.',
        'Ijro paytida tonallik, tempo va instrumentlar ovozini sozlash.'
      ],
      howToUse: 'Foydalanuvchi midiano.com saytiga kirib, kerakli MIDI faylni yuklaydi. Oʻquvchi ekrandagi virtual klaviatura yoki kompyuter klaviaturasi orqali notalarni chaladi va animatsion diagrammalarga mos tarzda kuylashni mashq qiladi.',
      formats: ['MIDI'],
      websiteUrl: 'https://midiano.com/',
    },
    {
      name: 'SeeMusic',
      slug: 'seemusic',
      iconColor: 'from-pink-500 to-rose-500 bg-pink-500',
      description: 'SeeMusic — bu pianino ijrosini real vaqt rejimida yorqin rangli effektlar (falling notes), 3D animatsiyalar va zarrachalar yordamida vizual tarzda jonlantiruvchi ilg‘or multimedia dasturidir.',
      purpose: 'Musiqa madaniyati darslarida oʻquvchilarning pianino badiiy-estetik mahoratini rivojlantirish, oʻz ijrosini vizual tarzda koʻrib tahlil qilish va darsda multimedia yondashuvini qoʻllash.',
      eduValue: 'Notalarning rangli va dinamik tarzda pastga tushishi oʻquvchilarda musiqiy idrok va eshituv-motor koordinatsiyani tezroq shakllantiradi. An’anaviy notalarni qiyin qabul qiladigan oʻquvchilar uchun kuchli motivatsiya va vizual eslab qolish koʻnikmalarini beradi.',
      advantages: [
        'MIDI fayllarni yorqin chiroqli effektlar (falling notes) orqali vizual koʻrsatish.',
        'Real pianino ijrosini kamera va MIDI klaviatura orqali sinxronlashtirib video yozish.',
        'Vizual effektlarni (rang, fon, nur, zarracha animatsiyasi) sozlash imkoniyati.',
        'Oʻquvchining musiqiy va axborot-kompyuter savodxonligini bir vaqtda oshirish.',
        'Oʻz ijrolarini yozib olib videoni tahlil qilish va individual ishlash koʻnikmalarini shakllantirish.'
      ],
      howToUse: 'Oʻqituvchi darsda kuyning MIDI variantini yuklaydi. Oʻquvchi MIDI klaviaturada kuy ijro etadi va SeeMusic uning ijrosini rangli effektlarda aks ettiradi. Oʻquvchi oʻz ijro videosini tomosha qilib, kamchiliklarni mustaqil tahlil qiladi.',
      formats: ['MIDI', 'MP4', 'WAV'],
      websiteUrl: 'https://www.visualmusicdesign.com/',
    },
    {
      name: 'Synthesia',
      slug: 'synthesia',
      iconColor: 'from-blue-500 to-indigo-500 bg-blue-500',
      description: 'Synthesia — bu pianino chalish koʻnikmalarini oʻyinlashtirish (gamification) orqali oʻrgatuvchi jahondagi eng mashhur interaktiv piano dasturlaridan biridir. U notalarni “tushayotgan rangli chiziqlar” shaklida klaviaturada aks ettiradi.',
      purpose: 'Nota yozuvini toʻliq bilmagan oʻquvchilarni ham pianino chalishga qiziqtirish, tez va oson oʻrgatish, hamda dars jarayonini interaktiv oʻyinga aylantirish.',
      eduValue: 'Darslarni gamifikatsiya qilish orqali oʻquvchilarda barmoq harakatlari, ritmni ushlash, tezlikni nazorat qilish va ongli ravishda ijro etish koʻnikmalarini shakllantiradi. Hamkorlikda darsga tayyorlanish jamoaviy ishlashni kuchaytiradi.',
      advantages: [
        'Notalarsiz, tushuvchi rangli chiziqlar asosida tezkor pianino oʻrganish.',
        'Chap va o‘ng qo‘l partiyalarini alohida tempda (tezlikda) mashq qilish rejimining mavjudligi.',
        'Ijro aniqligini foizlarda koʻrsatuvchi avtomatik baholash tizimi.',
        'Darsdan tashqari vaqtda ham mustaqil va jamoaviy mashq qilish imkoniyati.'
      ],
      howToUse: 'Oʻquvchilar raqamli pianino yoki kompyuter klaviaturasini ulab, ekrandan tushayotgan rangli yoʻnalishlar boʻylab toʻgʻri tugmalarni bosadilar. Dastur ularning ritm va intonatsiyasini avtomatik foizlarda baholab boradi.',
      formats: ['MIDI', 'MusicXML'],
      websiteUrl: 'https://www.synthesiagame.com/',
    },
    {
      name: 'Note Bounce',
      slug: 'note-bounce',
      iconColor: 'from-amber-500 to-orange-500 bg-amber-500',
      description: 'Note Bounce — musiqiy ritm va partiturani interaktiv sakrovchi koptokchalar fizikasi hamda animatsiyalar yordamida tasvirlovchi dasturdir. U foydalanuvchiga musiqiy savodni oʻyin uslubida oʻrganish imkonini beradi.',
      purpose: 'Oʻquvchilarning badiiy-estetik mahoratini takomillashtirish, ritmni his qilish tuygʻusini rivojlantirish va notalarni vizual tahlil qilish.',
      eduValue: 'Dastur notalarni animatsiyalangan shaklda, ranglar va yorugʻlik effektlari yordamida koʻrsatadi. Turli SoundFont paketlari yordamida cholgʻu sozlari tembrlarini eshitish va farqlash koʻnikmalari rivojlanadi, darslar koʻrgazmali boʻladi.',
      advantages: [
        'Ritmik partiturani sakrovchi indikatorlar (koptokchalar) yordamida vizual kuzatish.',
        'Animatsiya sozlamalari (Ball Type, Energy, Bouncy, Stars, Hearts, Cats) orqali estetik rang-baranglik yaratish.',
        'Layout boʻlimi orqali notalarni kalitlar boʻyicha qulay moslashtirish.',
        'Video yozib olish funksiyasi orqali asarni mustaqil tahlil qilish.',
        'Raqamli vositalar bilan ishlash boʻyicha amaliy kompetensiyalarni shakllantirish.'
      ],
      howToUse: 'Dasturda musiqiy asar yuklanadi va Play tugmasi bosiladi. Ekranda partitura chapdan oʻngga harakatlanadi va koptokchalar notalarga mos sakraydi. Oʻquvchilar vokal partiyasini koptokchalar harakatiga qarab ritmda kuylashadi.',
      formats: ['MIDI'],
      websiteUrl: 'https://notebounce.com/',
    },
    {
      name: 'ProfM-2DRUM',
      slug: 'profm-2drum',
      iconColor: 'from-amber-600 to-yellow-600 bg-amber-600',
      description: 'ProfM-2DRUM — bu musiqa darslarida oʻquvchilarni va savollarni tasodifiy tanlash orqali dars jarayonini gamifikatsiyalash va halol baholash tizimini yaratish uchun moʻljallangan mualliflik interaktiv dasturi hisoblanadi.',
      purpose: 'Mavzuni mustahkamlash, bilimlarni tasodifiy aylanuvchi barabanlar orqali sinovdan oʻtkazish va darsda halol baholash muhitini yaratish.',
      eduValue: 'Nomdagi "Prof" professor (ilmiy maqom), "M" muallif ismi, "2" oʻquvchilar va savollar barabanlari, "DRUM" esa aylanuvchi gʻildirakni anglatadi. Dastur tasodifiy tanlov algoritmi tufayli oʻquvchilarda faol ishtirok, darsga qiziqish va motivatsiyani yuksaltiradi.',
      advantages: [
        'Ikki aylanuvchi baraban (oʻquvchilar va savollar gʻildiragi) tizimining mavjudligi.',
        'Darsda shaffof, adolatli va oʻyinbop baholash muhitini ta’minlash.',
        'Qisqa, xalqaro talaffuzga mos brend nomi va pedagogik-psixologik jihatdan maqsadlilik.',
        'Oʻquvchilarda dars davomida doimiy diqqat-e’tibor va tayyorgarlik darajasini oshirish.',
        'Veb-sayt formatida istalgan qurilmada oson ishga tushish qulayligi.'
      ],
      howToUse: 'Oʻqituvchi dars oxirida profm-2drum.github.io/baholash/ saytini ochadi. Baraban aylantirilib, tasodifiy tanlangan oʻquvchi oʻziga chiqqan savolga javob beradi. Bu tizim orqali oʻquvchilar qiziqib, halol baholanadilar.',
      formats: ['HTML', 'Web-App'],
      websiteUrl: 'https://profm-2drum.github.io/baholash/',
    }
  ];

  const toggleDetails = (slug: string) => {
    setActiveSlug(activeSlug === slug ? null : slug);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-3">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.itPrograms.title}
            </h1>
            <p className="text-xs text-slate-400">
              Musiqa madaniyati ta’limini raqamlashtirish vositalari
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t.itPrograms.subtitle}
        </p>
      </div>

      {/* Methodological Intro Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-white font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-secondary animate-pulse" />
          <span>Musiqa ta’limida badiiy-estetik mahoratni shakllantirish</span>
        </h2>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Musiqa ta’limi jarayonida oʻquvchilarning badiiy-estetik mahoratini toʻgʻri shakllantirish – bugungi raqamli davrda dolzarb va muhim metodik vazifalardan biri hisoblanadi.
          </p>
          <p>
            Badiiy-estetik mahorat — o‘quvchining musiqiy asarni emotsional idrok etishi, estetik baholashi, ijodiy talqin qilishi va ifodali ijro eta olishiga oid integrativ shaxsiy xususiyat sifatida namoyon bo‘ladi. Mazkur sifat o‘quvchining musiqiy-estetik tajribasi, badiiy tafakkuri, emotsional sezgirligi hamda ijodiy faolligi uyg‘unligida namoyon bo‘ladi. Ushbu sifatlarni rivojlantirishda zamonaviy IT vositalari bilan uygʻunlashgan ta’lim texnologiyalari samaradorlikni sezilarli oshiradi.
          </p>
          <p>
            Zamonaviy IT vositalari — xususan, SeeMusic, Synthesia, Midiano, Note Bounce, VanBascoʻs Karaoke Player, Kanto Player, Sweet MIDI Player 32, Notation Player, Midis2jam2, MIDI Clef, Free MIDI Player va mualliflik asosidagi ProfM-2DRUM kabi dasturlar oʻquvchilarning estetik idrokini, musiqiy didini va ifodaviy tafakkurini rivojlantirish uchun keng imkoniyat yaratadi. Bu vositalar yordamida musiqa darslarini koʻrgazmali, interfaol va emotsional jihatdan boy shaklda tashkil etish mumkin boʻlib, natijada oʻquvchilarda musiqiy eshitish, ritmni his etish, tembrni ajrata bilish, obrazni his etish kabi estetik koʻnikmalar mustahkamlanadi.
          </p>
          <p>
            Badiiy-estetik mahorat murakkab integrativ pedagogik hodisa bo‘lib, motivatsion, kognitiv, emotsional va ijodiy-faoliyat komponentlarining o‘zaro uyg‘unligi asosida shakllanadi. Bir tomondan, u musiqiy asarning badiiy mazmunini anglash va estetik baholashni ifodalasa, ikkinchi tomondan, o‘quvchining uni ijodiy talqin qilish va ifodali ijro etish qobiliyatini namoyon etadi.
          </p>
        </div>
      </div>

      {/* Software Program Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {programs.map((sw) => {
          const isOpen = activeSlug === sw.slug;
          
          return (
            <motion.div
              key={sw.slug}
              id={sw.slug}
              className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden transition-all duration-300 flex flex-col justify-between scroll-mt-24"
              whileHover={{ y: -3 }}
            >
              <div className="p-6 space-y-4">
                
                {/* Card Title & Icon block */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sw.iconColor} text-white flex items-center justify-center text-base font-bold shadow-md`}>
                    {sw.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-display">
                      {sw.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sw.formats.map((f) => (
                        <span key={f} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] font-bold rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sw.description}
                </p>

                {/* Purpose section */}
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    {t.itPrograms.purpose}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sw.purpose}
                  </p>
                </div>

                {/* Expand / Collapse triggers */}
                {isOpen ? (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 animate-fade-in">
                    
                    {/* Educational Value */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.eduValue}</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {sw.eduValue}
                      </p>
                    </div>

                    {/* How to use */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.howToUse}</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {sw.howToUse}
                      </p>
                    </div>

                    {/* Advantages */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.advantages}</span>
                      </span>
                      <ul className="space-y-1.5">
                        {sw.advantages.map((adv, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ) : null}

              </div>

              {/* Footer actions */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4 flex justify-between items-center">
                
                <button
                  onClick={() => toggleDetails(sw.slug)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5 text-secondary" />
                  <span>{isOpen ? 'Ma’lumotlarni yopish' : t.common.details}</span>
                </button>

                {sw.websiteUrl !== '#' ? (
                  <a
                    href={sw.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-primary dark:hover:text-sky-400 cursor-pointer"
                  >
                    <span>{t.itPrograms.visitWebsite}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400">Offline virtual asbob</span>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
