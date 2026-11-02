import { Lead } from '@/types';

export const leads: Lead[] = [
  {
    id: 'rina',
    name: 'Rina',
    age: 24,
    profile: 'Career switcher, gym admin',
    program: 'Digital Marketing',
    source: 'inbound',
    avatar: '👩',
    openingBM:
      'Halo Kak Rina, aku dari tim admission RevoU. Makasih ya udah daftar program Digital Marketing. Boleh tau, apa yang bikin kamu tertarik belajar digital marketing?',
    openingLead:
      'Halo kak. Aku sekarang admin di gym, tapi sering disuruh bantu bikin konten IG gym juga. Pengen banget pindah kerja ke marketing, cuma bingung mulainya dari mana. Ini programnya berapa lama ya?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Kelasnya jadwalnya kapan aja kak? Aku kerja shift di gym, kadang pagi kadang sore.',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Nanti belajarnya praktek langsung atau teori aja? Aku pengen punya portofolio buat ngelamar kerja.',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Ada ga alumni RevoU yang dari non-marketing kayak aku terus berhasil pindah kerja?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Biayanya berapa ya kak? Takutnya ga kejangkau.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Aku pikir-pikir dulu deh kak, kayaknya mau coba belajar sendiri dari YouTube dulu.',
      },
    ],
    bookingRequest:
      'Oke kak, makasih ya udah jelasin semuanya! Aku mau deh konsultasi lebih lanjut sama AC-nya. Kapan ya kak bisa jadwalnya?',
    bookingConfirm:
      'Siap kak, aku catat ya! Nanti AC RevoU yang hubungi aku ya. Makasih banyak kak! 🙏',
    timeLimitSec: 900,
  },
  {
    id: 'dimas',
    name: 'Dimas',
    age: 22,
    profile: 'Fresh graduate, International Relations',
    program: 'Data Analytics',
    source: 'brochure',
    avatar: '👨',
    openingBM:
      'Halo Kak Dimas, aku dari tim RevoU. Kemarin kamu download brosur Data Analytics ya, udah sempat dicek belum?',
    openingLead:
      'Udah kak sekilas. Aku baru lulus HI, ga ada background matematika atau coding sama sekali. Emang bisa ya ikut program ini?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Belajarnya pakai tools apa aja kak? Excel, SQL gitu?',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Programnya berapa lama kak? Aku sambil ngelamar kerja juga soalnya.',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Setelah lulus dibantu cari kerja ga kak? Ada penyaluran kerja?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Aku belum kerja kak, masih minta ortu. Harus izin dulu sama mereka.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Temen aku bilang mending ambil sertifikasi Google aja, lebih murah. Bedanya apa kak?',
      },
    ],
    bookingRequest:
      'Oke kak, lumayan jelas sih. Aku mau coba daftar konsultasi dulu deh. Kapan bisa kak?',
    bookingConfirm:
      'Oke kak, ditunggu ya. Makasih banyak kak! 🙏',
    timeLimitSec: 900,
  },
  {
    id: 'shania',
    name: 'Shania',
    age: 32,
    profile: 'Marketing manager, e-commerce',
    program: 'Data-Driven Decision Making with ITB',
    source: 'inbound',
    avatar: '👩‍💼',
    openingBM:
      'Halo Kak Shania, aku dari tim admission RevoU. Makasih ya udah daftar program Data-Driven Decision Making with ITB. Boleh tau, lagi ada kebutuhan apa di kerjaan yang bikin kamu tertarik ikut program ini?',
    openingLead:
      'Halo. Saya marketing manager di e-commerce. Tim saya makin banyak pakai dashboard. Programnya cocok untuk level manager ga atau banyak level junior yg ikut?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Sertifikatnya dari ITB atau dari RevoU?',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Kelasnya full online atau ada yang harus datang ke Bandung?',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Materinya lebih ke teknis atau ke pengambilan keputusan? Saya ga mau jadi data analyst, tapi pengen bisa baca data dan arahin tim.',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Jujur saya sibuk banget, meeting bisa sampai malam. Takut ga bisa ngikutin kelasnya.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Kantor saya mungkin bisa reimburse, tapi harus diajukan dulu. Bisa kirim detail biaya dan proposal aja dulu ga, sebelum konsultasi?',
      },
    ],
    bookingRequest:
      'Baik kak, terima kasih informasinya. Saya mau jadwalkan konsultasi dengan AC dulu. Kapan bisa ya kak?',
    bookingConfirm:
      'Baik kak, sudah saya catat. Ditunggu ya kak. Terima kasih 🙏',
    timeLimitSec: 900,
  },
];
