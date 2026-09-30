export const courts = [
  {
    id: 'padel-1',
    name: { ar: 'ملعب بادل 1', en: 'Padel Court 1', fr: 'Terrain de padel 1' },
    type: 'Padel',
    typeLabel: { ar: 'بادل', en: 'Padel', fr: 'Padel' },
    icon: '🎾',
    accent: '#22c55e',
    price: 650,
    duration: 60,
    capacity: { ar: '4 لاعبين', en: '4 players', fr: '4 joueurs' },
    rating: 4.9,
    tag: { ar: 'الأكثر حجزًا', en: 'Most booked', fr: 'Le plus réservé' },
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1622279457486-62dcc4a4310c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      ar: 'ملعب بادل زجاجي بإضاءة ليلية وتجربة لعب احترافية.',
      en: 'Glass padel court with night lighting and a premium playing experience.',
      fr: 'Terrain de padel vitré avec éclairage nocturne et expérience premium.'
    },
    longDescription: {
      ar: 'ملعب مثالي للمباريات التنافسية واللعب مع الأصدقاء، مجهز بإضاءة قوية وأرضية مناسبة لحركة سريعة وآمنة.',
      en: 'Ideal for competitive matches and games with friends, with strong lighting and a surface built for fast and safe movement.',
      fr: 'Idéal pour les matchs compétitifs et les jeux entre amis, avec un éclairage puissant et une surface conçue pour un jeu rapide et sûr.'
    },
    features: {
      ar: ['إضاءة ليلية', 'أرضية احترافية', 'مناسب 4 لاعبين'],
      en: ['Night lighting', 'Professional surface', 'Suitable for 4 players'],
      fr: ['Éclairage nocturne', 'Surface professionnelle', 'Pour 4 joueurs'],
    },
    surface: { ar: 'عشب صناعي / بادل', en: 'Synthetic grass / padel', fr: 'Gazon synthétique / padel' },
    location: { ar: 'المنطقة الرئيسية - بجوار الكافيه', en: 'Main zone - next to the café', fr: 'Zone principale - à côté du café' },
    openHours: '08:00 - 23:00',
  },
  {
    id: 'basketball',
    name: { ar: 'ملعب باسكت', en: 'Basketball Court', fr: 'Terrain de basket' },
    type: 'Basketball',
    typeLabel: { ar: 'باسكت', en: 'Basketball', fr: 'Basket-ball' },
    icon: '🏀',
    accent: '#f97316',
    price: 500,
    duration: 60,
    capacity: { ar: '10 لاعبين', en: '10 players', fr: '10 joueurs' },
    rating: 4.7,
    tag: { ar: 'مجموعات', en: 'Groups', fr: 'Groupes' },
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: { ar: 'مساحة ممتازة للتمرين والماتشات السريعة مع أصحابك.', en: 'A great space for practice and fast matches with your friends.', fr: 'Un excellent espace pour l’entraînement et les matchs rapides avec vos amis.' },
    longDescription: { ar: 'الملعب مناسب للتدريبات الفردية والجماعية مع تجهيزات أساسية وإضاءة جيدة.', en: 'The court is suitable for individual and group training with basic equipment and good lighting.', fr: 'Le terrain convient aux entraînements individuels et en groupe avec des équipements de base et un bon éclairage.' },
    features: { ar: ['نصف ملعب', 'كرات متاحة', 'مناسب للمجموعات'], en: ['Half court', 'Balls available', 'Good for groups'], fr: ['Demi-terrain', 'Ballons disponibles', 'Adapté aux groupes'] },
    surface: { ar: 'أرضية مطاطية', en: 'Rubber court', fr: 'Sol en caoutchouc' },
    location: { ar: 'منطقة الألعاب الجماعية', en: 'Team games zone', fr: 'Zone des jeux collectifs' },
    openHours: '09:00 - 22:00',
  },
  {
    id: 'handball',
    name: { ar: 'ملعب هاند بول', en: 'Handball Court', fr: 'Terrain de handball' },
    type: 'Handball',
    typeLabel: { ar: 'هاند بول', en: 'Handball', fr: 'Handball' },
    icon: '🤾',
    accent: '#2563eb',
    price: 700,
    duration: 90,
    capacity: { ar: '14 لاعبًا', en: '14 players', fr: '14 joueurs' },
    rating: 4.8,
    tag: { ar: 'احترافي', en: 'Professional', fr: 'Professionnel' },
    image: 'https://images.pexels.com/photos/32681162/pexels-photo-32681162.jpeg?auto=compress&cs=tinysrgb&w=1400',
    gallery: [
      'https://images.pexels.com/photos/32681162/pexels-photo-32681162.jpeg?auto=compress&cs=tinysrgb&w=1400',
      'https://images.pexels.com/photos/32681162/pexels-photo-32681162.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/32681162/pexels-photo-32681162.jpeg?auto=compress&cs=tinysrgb&w=1000'
    ],
    description: {
      ar: 'ملعب هاند بول مجهز للتدريبات والمباريات الجماعية بأرضية آمنة ومساحة مناسبة للفرق.',
      en: 'A fully equipped handball court for training sessions and team matches, with a safe surface and suitable space for teams.',
      fr: 'Un terrain de handball entièrement équipé pour les entraînements et les matchs d’équipe, avec une surface sûre et un espace adapté.'
    },
    longDescription: {
      ar: 'ملعب هاند بول احترافي مناسب لتدريبات المبتدئين والمحترفين والمباريات الجماعية. يتميز بأرضية رياضية مقاومة للانزلاق، ومرميين مجهزين، وإضاءة قوية للتدريبات والمباريات المسائية.',
      en: 'A professional handball court suitable for beginner and advanced training sessions as well as team matches. It features a non-slip sports surface, two equipped goals, and strong lighting for evening sessions.',
      fr: 'Un terrain de handball professionnel adapté aux débutants, aux joueurs avancés et aux matchs d’équipe. Il dispose d’une surface antidérapante, de deux buts équipés et d’un éclairage puissant.'
    },
    features: {
      ar: ['مرميان احترافيان', 'أرضية مقاومة للانزلاق', 'إضاءة قوية', 'غرف تغيير ملابس'],
      en: ['Professional goals', 'Non-slip surface', 'Strong lighting', 'Changing rooms'],
      fr: ['Buts professionnels', 'Surface antidérapante', 'Éclairage puissant', 'Vestiaires']
    },
    surface: {
      ar: 'أرضية رياضية مطاطية مقاومة للانزلاق',
      en: 'Non-slip rubber sports surface',
      fr: 'Surface sportive en caoutchouc antidérapante'
    },
    location: {
      ar: 'منطقة الملاعب الجماعية',
      en: 'Team sports courts area',
      fr: 'Zone des terrains de sports collectifs'
    },
    openHours: '09:00 - 23:00',
  },
  {
    id: 'tennis',
    name: { ar: 'ملعب تنس', en: 'Tennis Court', fr: 'Terrain de tennis' },
    type: 'Tennis',
    typeLabel: { ar: 'تنس', en: 'Tennis', fr: 'Tennis' },
    icon: '🎾',
    accent: '#06b6d4',
    price: 550,
    duration: 60,
    capacity: { ar: '2 - 4 لاعبين', en: '2 - 4 players', fr: '2 - 4 joueurs' },
    rating: 4.7,
    tag: { ar: 'تدريب', en: 'Training', fr: 'Entraînement' },
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80'
    ],
    description: { ar: 'مناسب للتدريب أو مباراة سريعة مع إضاءة صباحية ومسائية.', en: 'Suitable for training or a quick match with day and night lighting.', fr: 'Adapté à l’entraînement ou à un match rapide avec éclairage jour et soir.' },
    longDescription: { ar: 'ملعب هادئ ومناسب للتدريب الفردي أو الثنائي مع تجهيزات مريحة.', en: 'A calm court for solo or doubles training with comfortable facilities.', fr: 'Un terrain calme pour l’entraînement individuel ou en double, avec des équipements confortables.' },
    features: { ar: ['تدريب أو مباراة', 'مضارب متاحة', 'إضاءة صباحية ومسائية'], en: ['Training or match', 'Rackets available', 'Day & night lighting'], fr: ['Entraînement ou match', 'Raquettes disponibles', 'Éclairage jour et soir'] },
    surface: { ar: 'هارد كورت', en: 'Hard court', fr: 'Court dur' },
    location: { ar: 'منطقة التنس', en: 'Tennis zone', fr: 'Zone tennis' },
    openHours: '08:00 - 22:00',
  }

];

export const paymentMethods = [
  {
    id: 'cash',
    short: '💵',
    accent: '#21c77c',
    requiresProof: false,
    name: { ar: 'الدفع عند الوصول', en: 'Pay on arrival', fr: 'Paiement à l’arrivée' },
    description: { ar: 'احجز الآن وادفع في النادي عند الوصول.', en: 'Book now and pay at the club on arrival.', fr: 'Réservez maintenant et payez au club à l’arrivée.' },
    instructions: { ar: 'سيتم تأكيد الحجز مباشرة، والدفع يتم في الاستقبال قبل بداية اللعب.', en: 'The booking is confirmed immediately. Payment is made at reception before play.', fr: 'La réservation est confirmée immédiatement. Le paiement se fait à la réception avant le jeu.' },
  },
  {
    id: 'instapay',
    short: 'IP',
    accent: '#5b8cff',
    requiresProof: true,
    receiverLabel: 'K-HUB InstaPay',
    receiverValue: 'khub@instapay',
    name: { ar: 'InstaPay', en: 'InstaPay', fr: 'InstaPay' },
    description: { ar: 'حوّل المبلغ وارفع اسكرين شوت التحويل لتأكيد الحجز من الإدارة.', en: 'Transfer the amount and upload a screenshot for admin confirmation.', fr: 'Transférez le montant et téléversez une capture pour validation.' },
    instructions: { ar: 'حوّل قيمة الحجز على khub@instapay ثم ارفع صورة إثبات الدفع. الحجز يظل قيد المراجعة حتى موافقة الإدارة.', en: 'Transfer to khub@instapay then upload payment proof. The booking remains under review until admin approval.', fr: 'Transférez vers khub@instapay puis téléversez la preuve. La réservation reste en attente de validation.' },
  },
  {
    id: 'vodafone-cash',
    short: 'VC',
    accent: '#ef4444',
    requiresProof: true,
    receiverLabel: 'Vodafone Cash',
    receiverValue: '01000000000',
    name: { ar: 'Vodafone Cash', en: 'Vodafone Cash', fr: 'Vodafone Cash' },
    description: { ar: 'حوّل على رقم المحفظة وارفع صورة الإيصال.', en: 'Transfer to the wallet number and upload the receipt screenshot.', fr: 'Transférez au numéro de portefeuille et téléversez le reçu.' },
    instructions: { ar: 'حوّل قيمة الحجز على رقم 01000000000 ثم ارفع اسكرين شوت الإيصال. الإدارة هتراجع الدفع وتأكد الحجز.', en: 'Transfer to 01000000000 then upload the receipt screenshot. Admin will review and confirm.', fr: 'Transférez vers 01000000000 puis téléversez le reçu. L’admin validera ensuite.' },
  },
  {
    id: 'paypal',
    short: 'PP',
    accent: '#0ea5e9',
    requiresProof: true,
    receiverLabel: 'PayPal',
    receiverValue: 'payments@khub.com',
    name: { ar: 'PayPal', en: 'PayPal', fr: 'PayPal' },
    description: { ar: 'ادفع عبر PayPal وارفع إثبات الدفع للمراجعة.', en: 'Pay with PayPal and upload the payment proof for review.', fr: 'Payez avec PayPal et téléversez la preuve pour validation.' },
    instructions: { ar: 'ادفع على payments@khub.com ثم ارفع صورة تأكيد الدفع. الحجز يصبح مؤكدًا بعد موافقة الإدارة.', en: 'Pay to payments@khub.com then upload the confirmation screenshot. Booking is confirmed after admin approval.', fr: 'Payez à payments@khub.com puis téléversez la confirmation. La réservation sera confirmée après validation.' },
  },
];

export function getSportTypes(language, t) {
  const types = courts.map((court) => court.typeLabel?.[language] ?? court.type);
  return [t('courts.all'), ...new Set(types)];
}

const courtTrainingSportMap = {
  padel: "padel",
  basketball: "basketball",
  handball: "handball",
  tennis: "tennis",
};

export function getCourt(courtId) {
  return courts.find((court) => court.id === courtId) ?? null;
}

export function getCourtTrainingSportId(courtOrType) {
  const raw = typeof courtOrType === "string" ? courtOrType : courtOrType?.type;
  const type = String(raw ?? "").trim().toLowerCase();
  return courtTrainingSportMap[type] ?? null;
}
