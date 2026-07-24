export const trainingSports = [
  {
    id: "basketball",
    value: "Basketball",
    name: "باسكت بول",
    englishName: "Basketball",
    image:
      "https://images.pexels.com/photos/6777247/pexels-photo-6777247.jpeg?auto=compress&cs=tinysrgb&w=1400",
    accent: "#f97316",
    shortDescription:
      "تدريب مهارات فردية وجماعية: تحكم في الكرة، تصويب، لياقة وتحركات الملعب.",
    fullDescription:
      "برنامج باسكت بول متدرج يناسب المبتدئين والمتوسطين، مع تقسيم اللاعبين حسب السن والمستوى. التدريب يجمع بين الإحماء، المهارات الأساسية، التمرينات الخططية ومباريات تطبيقية قصيرة.",
    duration: 90,
    ageRange: "من 8 سنوات",
    price: 450,
    level: "مبتدئ – متقدم",
    features: [
      "تقييم مستوى قبل البداية",
      "تدريب فردي وجماعي",
      "متابعة تطور اللاعب",
      "مباريات تطبيقية",
    ],
    availableSlots: [
      { id: "basket-sun-1700", day: "الأحد", time: "5:00 مساءً", label: "الأحد • 5:00 مساءً", seats: 6 },
      { id: "basket-tue-1900", day: "الثلاثاء", time: "7:00 مساءً", label: "الثلاثاء • 7:00 مساءً", seats: 4 },
      { id: "basket-thu-1800", day: "الخميس", time: "6:00 مساءً", label: "الخميس • 6:00 مساءً", seats: 8 },
      { id: "basket-sat-1200", day: "السبت", time: "12:00 ظهرًا", label: "السبت • 12:00 ظهرًا", seats: 5 },
    ],
  },
  {
    id: "handball",
    value: "Handball",
    name: "هاند بول",
    englishName: "Handball",
    image:
      "https://images.pexels.com/photos/32681162/pexels-photo-32681162.jpeg?auto=compress&cs=tinysrgb&w=1400",
    accent: "#2563eb",
    shortDescription:
      "تطوير الرميات، التمرير، التحرك الدفاعي والهجومي والعمل الجماعي.",
    fullDescription:
      "حصص هاند بول منظمة لبناء اللياقة والتوافق الحركي وفهم مراكز اللعب. يتدرج البرنامج من أساسيات مسك وتمرير الكرة إلى الرميات، الدفاع، الهجوم والتحولات السريعة.",
    duration: 90,
    ageRange: "من 9 سنوات",
    price: 420,
    level: "مبتدئ – متوسط",
    features: [
      "أساسيات الرمي والتمرير",
      "تدريب المراكز",
      "خطط دفاع وهجوم",
      "لياقة وسرعة استجابة",
    ],
    availableSlots: [
      { id: "hand-mon-1700", day: "الاثنين", time: "5:00 مساءً", label: "الاثنين • 5:00 مساءً", seats: 7 },
      { id: "hand-wed-1900", day: "الأربعاء", time: "7:00 مساءً", label: "الأربعاء • 7:00 مساءً", seats: 5 },
      { id: "hand-fri-1600", day: "الجمعة", time: "4:00 مساءً", label: "الجمعة • 4:00 مساءً", seats: 9 },
    ],
  },
  {
    id: "tennis",
    value: "Tennis",
    name: "تنس",
    englishName: "Tennis",
    image:
      "https://images.pexels.com/photos/10612276/pexels-photo-10612276.jpeg?auto=compress&cs=tinysrgb&w=1400",
    accent: "#84cc16",
    shortDescription:
      "تدريب الإرسال والضربات الأمامية والخلفية والتحرك الصحيح داخل الملعب.",
    fullDescription:
      "برنامج تنس فردي أو مجموعات صغيرة يركز على الأسلوب الصحيح، التحكم في الكرة، تحسين الإرسال والتكتيك. يمكن اختيار مدرب متخصص للمبتدئين أو للاعبين الراغبين في المنافسات.",
    duration: 60,
    ageRange: "من 7 سنوات",
    price: 550,
    level: "كل المستويات",
    features: [
      "مجموعات صغيرة",
      "تحليل الأداء الفني",
      "تدريب إرسال واستقبال",
      "إعداد للمنافسات",
    ],
    availableSlots: [
      { id: "tennis-sun-1000", day: "الأحد", time: "10:00 صباحًا", label: "الأحد • 10:00 صباحًا", seats: 3 },
      { id: "tennis-tue-1800", day: "الثلاثاء", time: "6:00 مساءً", label: "الثلاثاء • 6:00 مساءً", seats: 2 },
      { id: "tennis-thu-2000", day: "الخميس", time: "8:00 مساءً", label: "الخميس • 8:00 مساءً", seats: 4 },
      { id: "tennis-sat-0900", day: "السبت", time: "9:00 صباحًا", label: "السبت • 9:00 صباحًا", seats: 3 },
    ],
  },
  {
    id: "padel",
    value: "Padel",
    name: "بادل",
    englishName: "Padel",
    image:
      "https://images.pexels.com/photos/4536850/pexels-photo-4536850.jpeg?auto=compress&cs=tinysrgb&w=1400",
    accent: "#14b8a6",
    shortDescription:
      "تعلم قواعد البادل، التحكم في الحائط، الإرسال واللعب الثنائي باحتراف.",
    fullDescription:
      "تدريب بادل عملي يجمع بين المهارات الفنية وفهم تمركز اللاعب والتواصل مع الشريك. مناسب للمبتدئين وللاعبين الراغبين في تحسين مستواهم والمشاركة في بطولات النادي.",
    duration: 60,
    ageRange: "من 10 سنوات",
    price: 600,
    level: "مبتدئ – محترف",
    features: [
      "تدريب فردي أو ثنائي",
      "استراتيجيات اللعب على الحائط",
      "تحسين الإرسال والتمركز",
      "إعداد للبطولات",
    ],
    availableSlots: [
      { id: "padel-mon-1800", day: "الاثنين", time: "6:00 مساءً", label: "الاثنين • 6:00 مساءً", seats: 4 },
      { id: "padel-wed-2000", day: "الأربعاء", time: "8:00 مساءً", label: "الأربعاء • 8:00 مساءً", seats: 2 },
      { id: "padel-fri-1100", day: "الجمعة", time: "11:00 صباحًا", label: "الجمعة • 11:00 صباحًا", seats: 4 },
      { id: "padel-sat-1900", day: "السبت", time: "7:00 مساءً", label: "السبت • 7:00 مساءً", seats: 3 },
    ],
  },
  {
    id: "football",
    value: "Football",
    name: "كرة القدم",
    englishName: "Football",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=85",
    accent: "#16a34a",
    shortDescription:
      "تدريب مهارات الكرة، التمرير، التسديد، اللياقة واللعب الجماعي.",
    fullDescription:
      "برنامج كرة قدم مناسب للناشئين والكبار، يركز على المهارات الأساسية واللياقة وفهم مراكز اللعب، مع تدريبات جماعية ومواقف تطبيقية داخل الملعب.",
    duration: 90,
    ageRange: "من 8 سنوات",
    price: 500,
    level: "مبتدئ – متقدم",
    features: [
      "تقييم مستوى اللاعب",
      "مهارات تمرير وتسديد",
      "تدريب مراكز اللعب",
      "لياقة ومباريات تطبيقية",
    ],
    availableSlots: [
      { id: "football-sun-1800", day: "الأحد", time: "6:00 مساءً", label: "الأحد • 6:00 مساءً", seats: 10 },
      { id: "football-tue-2000", day: "الثلاثاء", time: "8:00 مساءً", label: "الثلاثاء • 8:00 مساءً", seats: 8 },
      { id: "football-fri-1700", day: "الجمعة", time: "5:00 مساءً", label: "الجمعة • 5:00 مساءً", seats: 12 },
    ],
  },
  {
    id: "volta",
    value: "Volta",
    name: "فولتا",
    englishName: "Volta Football",
    image:
      "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=1400&q=85",
    accent: "#eab308",
    shortDescription:
      "تدريب كرة سريع في مساحة صغيرة لتحسين التحكم والسرعة واتخاذ القرار.",
    fullDescription:
      "تدريب فولتا يعتمد على اللعب السريع والمهارات الفردية والضغط في المساحات الضيقة. مناسب للشباب الراغبين في تطوير التحكم والمراوغة والتصرف تحت الضغط.",
    duration: 60,
    ageRange: "من 10 سنوات",
    price: 450,
    level: "مبتدئ – متوسط",
    features: [
      "تحكم ومراوغة",
      "سرعة اتخاذ القرار",
      "مباريات قصيرة",
      "لياقة ورشاقة",
    ],
    availableSlots: [
      { id: "volta-mon-1900", day: "الاثنين", time: "7:00 مساءً", label: "الاثنين • 7:00 مساءً", seats: 6 },
      { id: "volta-wed-1800", day: "الأربعاء", time: "6:00 مساءً", label: "الأربعاء • 6:00 مساءً", seats: 6 },
      { id: "volta-sat-1600", day: "السبت", time: "4:00 مساءً", label: "السبت • 4:00 مساءً", seats: 5 },
    ],
  },
  {
    id: "bad-ball",
    value: "Bad Ball",
    name: "باد بول",
    englishName: "Bad Ball",
    image:
      "https://images.unsplash.com/photo-1618073193718-23a66109f4e6?auto=format&fit=crop&w=1400&q=85",
    accent: "#8b5cf6",
    shortDescription:
      "تدريب جماعي ممتع لتعلم القواعد، التحكم في الكرة والتعاون داخل الملعب.",
    fullDescription:
      "برنامج باد بول تفاعلي يناسب المبتدئين والمجموعات، ويجمع بين المهارة واللياقة والعمل الجماعي في بيئة تدريب ممتعة ومنظمة.",
    duration: 60,
    ageRange: "من 10 سنوات",
    price: 430,
    level: "مبتدئ – متوسط",
    features: [
      "شرح القواعد الأساسية",
      "تدريب تحكم وتمرير",
      "تنمية العمل الجماعي",
      "مباريات تطبيقية",
    ],
    availableSlots: [
      { id: "badball-sun-1600", day: "الأحد", time: "4:00 مساءً", label: "الأحد • 4:00 مساءً", seats: 8 },
      { id: "badball-thu-1800", day: "الخميس", time: "6:00 مساءً", label: "الخميس • 6:00 مساءً", seats: 8 },
      { id: "badball-sat-1300", day: "السبت", time: "1:00 ظهرًا", label: "السبت • 1:00 ظهرًا", seats: 7 },
    ],
  },
];

export const coaches = [
  {
    id: "coach-omar-basketball",
    sportId: "basketball",
    name: "كابتن عمر حمدي",
    title: "مدرب باسكت بول وناشئين",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85",
    experienceYears: 9,
    rating: 4.9,
    sessions: 340,
    price: 500,
    phoneMasked: "010 •••• 4821",
    bio: "مدرب باسكت بول متخصص في تأسيس الناشئين وتطوير المهارات الفردية. يعتمد على خطط تدريب واضحة وقياسات دورية لمستوى اللاعب.",
    specialties: ["تأسيس الناشئين", "التصويب", "التحكم في الكرة", "إعداد البطولات"],
    championships: [
      "المركز الأول في بطولة القاهرة للناشئين 2024",
      "وصيف دوري مناطق تحت 18 سنة 2023",
      "أفضل مدرب ناشئين في بطولة K-HUB الداخلية",
    ],
    certificates: [
      "شهادة تدريب كرة السلة – المستوى الثاني",
      "إسعافات أولية وإصابات الملاعب",
      "إعداد بدني للناشئين",
    ],
    experience: [
      { place: "أكاديمية K-HUB", role: "المدرب الرئيسي للناشئين", period: "2022 – الآن" },
      { place: "أكاديمية المدينة", role: "مدرب مهارات فردية", period: "2018 – 2022" },
    ],
  },
  {
    id: "coach-salma-basketball",
    sportId: "basketball",
    name: "كابتن سلمى عادل",
    title: "مدربة باسكت بول ولياقة",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85",
    experienceYears: 7,
    rating: 4.8,
    sessions: 270,
    price: 480,
    phoneMasked: "011 •••• 7392",
    bio: "مدربة باسكت بول ولياقة بدنية، تقدم تدريبات مناسبة للفتيات والمبتدئين وتركز على الثقة والتحكم في الكرة واللياقة.",
    specialties: ["تدريب المبتدئين", "لياقة بدنية", "تطوير الرميات", "تدريب الفتيات"],
    championships: [
      "بطلة دوري الجامعات لكرة السلة 2019",
      "المركز الثاني في بطولة الأندية للسيدات 2021",
    ],
    certificates: ["دبلومة تدريب باسكت بول", "إعداد بدني رياضي", "تغذية رياضية أساسية"],
    experience: [
      { place: "K-HUB", role: "مدربة باسكت ولياقة", period: "2023 – الآن" },
      { place: "نادي الجامعة", role: "مدربة فريق السيدات", period: "2019 – 2023" },
    ],
  },
  {
    id: "coach-youssef-handball",
    sportId: "handball",
    name: "كابتن يوسف شريف",
    title: "مدرب هاند بول ومراكز لعب",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    experienceYears: 10,
    rating: 4.9,
    sessions: 390,
    price: 470,
    phoneMasked: "012 •••• 1846",
    bio: "مدرب هاند بول بخبرة في فرق الناشئين، متخصص في تطوير الرميات، التحولات السريعة وفهم مراكز اللعب.",
    specialties: ["تدريب المراكز", "الرميات", "الدفاع والهجوم", "إعداد الناشئين"],
    championships: [
      "بطل منطقة الجيزة تحت 16 سنة 2023",
      "المركز الثالث في بطولة الجمهورية للناشئين 2022",
    ],
    certificates: ["رخصة تدريب هاند بول B", "تحليل أداء الفرق", "إصابات الملاعب"],
    experience: [
      { place: "K-HUB", role: "مدرب الهاند بول", period: "2021 – الآن" },
      { place: "نادي النخبة", role: "مدرب ناشئين", period: "2016 – 2021" },
    ],
  },
  {
    id: "coach-mariam-handball",
    sportId: "handball",
    name: "كابتن مريم خالد",
    title: "مدربة هاند بول ولياقة حركية",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    experienceYears: 6,
    rating: 4.7,
    sessions: 210,
    price: 440,
    phoneMasked: "010 •••• 6507",
    bio: "مدربة هاند بول تركز على المبتدئين والأطفال، وتستخدم تدريبات تفاعلية لبناء التوافق الحركي والعمل الجماعي.",
    specialties: ["الأطفال", "المبتدئون", "التوافق الحركي", "العمل الجماعي"],
    championships: ["بطلة دوري الجامعات 2020", "أفضل لاعبة جناح في بطولة جامعات 2019"],
    certificates: ["أساسيات تدريب الهاند بول", "تدريب الأطفال", "إسعافات أولية"],
    experience: [
      { place: "K-HUB", role: "مدربة أطفال وهاند بول", period: "2022 – الآن" },
      { place: "مدرسة الرياضة", role: "مدربة نشاط رياضي", period: "2019 – 2022" },
    ],
  },
  {
    id: "coach-karim-tennis",
    sportId: "tennis",
    name: "كابتن كريم منصور",
    title: "مدرب تنس ومنافسات",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    experienceYears: 12,
    rating: 5,
    sessions: 520,
    price: 650,
    phoneMasked: "010 •••• 9114",
    bio: "مدرب تنس للمستويات المتوسطة والمتقدمة، يركز على التحليل الفني، التكتيك والاستعداد للمباريات والبطولات.",
    specialties: ["الإرسال", "التحليل الفني", "التكتيك", "إعداد المنافسات"],
    championships: [
      "مدرب بطل الجمهورية تحت 18 سنة 2024",
      "بطل بطولة الأندية المفتوحة 2017",
      "المركز الثاني في بطولة القاهرة 2018",
    ],
    certificates: ["ITF Coaching Level 2", "تحليل فيديو للتنس", "إعداد نفسي للمنافسات"],
    experience: [
      { place: "K-HUB", role: "المدرب الفني للتنس", period: "2020 – الآن" },
      { place: "أكاديمية Ace", role: "مدرب منافسات", period: "2013 – 2020" },
    ],
  },
  {
    id: "coach-nour-tennis",
    sportId: "tennis",
    name: "كابتن نور سامح",
    title: "مدربة تنس للمبتدئين",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    experienceYears: 8,
    rating: 4.8,
    sessions: 310,
    price: 560,
    phoneMasked: "011 •••• 3275",
    bio: "مدربة تنس متخصصة في تأسيس الأطفال والمبتدئين بأسلوب بسيط، مع متابعة تطور الضربات والتحرك أسبوعيًا.",
    specialties: ["تأسيس الأطفال", "المبتدئون", "الضربات الأساسية", "اللياقة"],
    championships: ["بطلة بطولة الجامعات 2018", "المركز الثالث في بطولة الجمهورية للفرق 2019"],
    certificates: ["ITF Play and Stay", "تدريب أطفال", "لياقة للتنس"],
    experience: [
      { place: "K-HUB", role: "مدربة تنس للمبتدئين", period: "2021 – الآن" },
      { place: "أكاديمية Junior Tennis", role: "مدربة أطفال", period: "2016 – 2021" },
    ],
  },
  {
    id: "coach-ahmed-padel",
    sportId: "padel",
    name: "كابتن أحمد فؤاد",
    title: "مدرب بادل معتمد",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
    experienceYears: 8,
    rating: 4.9,
    sessions: 430,
    price: 700,
    phoneMasked: "010 •••• 5540",
    bio: "مدرب بادل معتمد، متخصص في اللعب الثنائي والتحكم في الحائط وتحسين التمركز والتواصل بين الشريكين.",
    specialties: ["اللعب الثنائي", "الحائط", "التمركز", "إعداد البطولات"],
    championships: [
      "بطل بطولة K-HUB المفتوحة 2024",
      "وصيف بطولة القاهرة للبادل 2023",
      "المركز الثالث في بطولة الأندية 2022",
    ],
    certificates: ["Padel Coach Level 2", "تحليل أداء البادل", "إسعافات أولية"],
    experience: [
      { place: "K-HUB", role: "مدرب البادل الرئيسي", period: "2021 – الآن" },
      { place: "Padel Point", role: "مدرب مجموعات", period: "2017 – 2021" },
    ],
  },
  {
    id: "coach-laila-padel",
    sportId: "padel",
    name: "كابتن ليلى طارق",
    title: "مدربة بادل ومهارات فردية",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85",
    experienceYears: 5,
    rating: 4.7,
    sessions: 190,
    price: 620,
    phoneMasked: "012 •••• 8073",
    bio: "مدربة بادل للمبتدئين والمتوسطين، تركز على بناء الأساس الصحيح والثقة في الملعب وتحسين دقة الضربات.",
    specialties: ["المبتدئون", "المهارات الفردية", "دقة الضربات", "اللياقة"],
    championships: ["المركز الأول في بطولة السيدات الداخلية 2023", "وصيفة بطولة الجامعات للبادل 2022"],
    certificates: ["أساسيات تدريب البادل", "لياقة وإعداد بدني", "تدريب مجموعات صغيرة"],
    experience: [
      { place: "K-HUB", role: "مدربة بادل", period: "2022 – الآن" },
      { place: "Padel Academy", role: "مساعدة مدرب", period: "2019 – 2022" },
    ],
  },
  {
    id: "coach-mahmoud-football",
    sportId: "football",
    name: "كابتن محمود سامي",
    title: "مدرب كرة قدم وناشئين",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=900&q=85",
    experienceYears: 11,
    rating: 4.9,
    sessions: 480,
    price: 580,
    phoneMasked: "010 •••• 2147",
    bio: "مدرب كرة قدم متخصص في تأسيس الناشئين وتطوير المهارات الفردية وفهم مراكز اللعب.",
    specialties: ["تأسيس الناشئين", "مراكز اللعب", "التسديد", "اللياقة"],
    championships: [
      "بطل دوري الأكاديميات 2024",
      "وصيف بطولة القاهرة للناشئين 2023",
    ],
    certificates: ["رخصة تدريب كرة قدم C", "إعداد بدني للناشئين", "إسعافات أولية"],
    experience: [
      { place: "K-HUB", role: "مدرب كرة القدم الرئيسي", period: "2021 – الآن" },
      { place: "أكاديمية النجوم", role: "مدرب ناشئين", period: "2015 – 2021" },
    ],
  },
  {
    id: "coach-hassan-football",
    sportId: "football",
    name: "كابتن حسن عادل",
    title: "مدرب مهارات كرة قدم",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    experienceYears: 8,
    rating: 4.8,
    sessions: 315,
    price: 540,
    phoneMasked: "011 •••• 6308",
    bio: "مدرب مهارات فردية يركز على المراوغة والتمرير والسرعة واتخاذ القرار داخل الملعب.",
    specialties: ["المراوغة", "التمرير", "السرعة", "المهارات الفردية"],
    championships: ["المركز الأول في بطولة الأكاديميات 2022", "أفضل مدرب مهارات في K-HUB 2023"],
    certificates: ["رخصة تدريب كرة قدم D", "تحليل أداء", "إعداد بدني"],
    experience: [
      { place: "K-HUB", role: "مدرب مهارات", period: "2022 – الآن" },
      { place: "Future Academy", role: "مدرب مساعد", period: "2018 – 2022" },
    ],
  },
  {
    id: "coach-ziad-volta",
    sportId: "volta",
    name: "كابتن زياد رامي",
    title: "مدرب فولتا ومهارات شارع",
    image:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=85",
    experienceYears: 7,
    rating: 4.8,
    sessions: 260,
    price: 500,
    phoneMasked: "012 •••• 4419",
    bio: "مدرب فولتا متخصص في اللعب السريع والمراوغة والتحكم في المساحات الضيقة.",
    specialties: ["المراوغة", "اللعب السريع", "الضغط", "الرشاقة"],
    championships: ["بطل بطولة Street Football 2023", "وصيف بطولة K-HUB Volta 2024"],
    certificates: ["تدريب كرة قدم مصغرة", "لياقة ورشاقة", "إسعافات أولية"],
    experience: [
      { place: "K-HUB", role: "مدرب فولتا", period: "2022 – الآن" },
      { place: "Street Skills", role: "مدرب مهارات", period: "2019 – 2022" },
    ],
  },
  {
    id: "coach-nadine-volta",
    sportId: "volta",
    name: "كابتن نادين أشرف",
    title: "مدربة فولتا ولياقة",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
    experienceYears: 5,
    rating: 4.7,
    sessions: 180,
    price: 470,
    phoneMasked: "010 •••• 7724",
    bio: "مدربة فولتا للمبتدئين تركز على اللياقة والثقة بالكرة والعمل الجماعي.",
    specialties: ["المبتدئون", "اللياقة", "التحكم في الكرة", "العمل الجماعي"],
    championships: ["بطلة بطولة الجامعات للكرة المصغرة 2022"],
    certificates: ["أساسيات تدريب كرة القدم", "لياقة بدنية", "تدريب مجموعات"],
    experience: [
      { place: "K-HUB", role: "مدربة فولتا", period: "2023 – الآن" },
      { place: "Youth Sports", role: "مدربة نشاط رياضي", period: "2020 – 2023" },
    ],
  },
  {
    id: "coach-ramy-badball",
    sportId: "bad-ball",
    name: "كابتن رامي السيد",
    title: "مدرب باد بول ومجموعات",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    experienceYears: 6,
    rating: 4.7,
    sessions: 205,
    price: 480,
    phoneMasked: "011 •••• 3951",
    bio: "مدرب باد بول يقدم تدريبات جماعية منظمة تركز على القواعد والتمرير والتعاون.",
    specialties: ["القواعد", "التمرير", "المجموعات", "اللياقة"],
    championships: ["بطل بطولة النادي الداخلية 2024"],
    certificates: ["تدريب ألعاب جماعية", "إدارة مجموعات", "إسعافات أولية"],
    experience: [
      { place: "K-HUB", role: "مدرب باد بول", period: "2022 – الآن" },
      { place: "Fun Sports Club", role: "مدرب ألعاب جماعية", period: "2019 – 2022" },
    ],
  },
  {
    id: "coach-dina-badball",
    sportId: "bad-ball",
    name: "كابتن دينا وائل",
    title: "مدربة باد بول للمبتدئين",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    experienceYears: 5,
    rating: 4.6,
    sessions: 170,
    price: 450,
    phoneMasked: "012 •••• 8256",
    bio: "مدربة متخصصة في تأسيس المبتدئين والأطفال بأسلوب بسيط وتفاعلي.",
    specialties: ["المبتدئون", "الأطفال", "التحكم", "العمل الجماعي"],
    championships: ["أفضل مدربة نشاط رياضي في بطولة المدارس 2023"],
    certificates: ["تدريب أطفال", "ألعاب جماعية", "لياقة حركية"],
    experience: [
      { place: "K-HUB", role: "مدربة باد بول", period: "2023 – الآن" },
      { place: "مدرسة الرياضة", role: "مدربة أطفال", period: "2020 – 2023" },
    ],
  },
];

export function getTrainingSport(sportId) {
  return trainingSports.find((sport) => sport.id === sportId) ?? null;
}

export function getSportCoaches(sportId) {
  return coaches.filter((coach) => coach.sportId === sportId);
}

export function getCoach(coachId) {
  return coaches.find((coach) => coach.id === coachId) ?? null;
}

