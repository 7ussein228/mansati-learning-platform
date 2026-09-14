export type YearSlug = "3rd-prep" | "1bac-integrated" | "2bac-integrated" | "3sec";

export interface Year {
  id: YearSlug;
  title: string;
  titleShort: string;
  color: string;
  icon: string;
  description: string;
}

export interface Chapter {
  id: string;
  yearId: YearSlug;
  title: string;
  index: number;
  description: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  yearId: YearSlug;
  index: number;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  task?: {
    id: string;
    title: string;
    description: string;
    type: "quiz" | "upload" | "pdf" | "essay";
    points: number;
    deadline?: string;
    questions?: { q: string; options: string[]; answer: number }[];
  };
}

export const years: Year[] = [
  {
    id: "3rd-prep",
    title: "تالتة إعدادي",
    titleShort: "ت. إعدادي",
    color: "from-green-500 to-emerald-600",
    icon: "🧪",
    description: "أساسيات العلوم للمرحلة الإعدادية",
  },
  {
    id: "1bac-integrated",
    title: "أولى علوم متكاملة",
    titleShort: "أولى متكاملة",
    color: "from-blue-500 to-cyan-600",
    icon: "⚗️",
    description: "العلوم المتكاملة - كيمياء + فيزياء + أحياء",
  },
  {
    id: "2bac-integrated",
    title: "تانية علوم متكاملة",
    titleShort: "تانية متكاملة",
    color: "from-violet-500 to-purple-600",
    icon: "🔬",
    description: "العلوم المتكاملة - تعميق وتوسيع",
  },
  {
    id: "3sec",
    title: "تالتة ثانوي",
    titleShort: "ت. ثانوي",
    color: "from-[#00235b] to-blue-800",
    icon: "🧬",
    description: "منهج الأحياء الكامل - تمهيد للجامعة",
  },
];

export const chapters: Chapter[] = [
  // تالتة إعدادي
  { id: "3prep-ch1", yearId: "3rd-prep", title: "الowers والوظائف الحيوية", index: 1, description: "الأعضاء والوظائف الحيوية في جسم الإنسان" },
  { id: "3prep-ch2", yearId: "3rd-prep", title: "التنفس وال循环", index: 2, description: "الجهاز التنفسي وال循环 في الإنسان" },
  { id: "3prep-ch3", yearId: "3rd-prep", title: "التغذية والهضم", index: 3, description: "الجهاز الهضمي وعملية الهضم" },
  { id: "3prep-ch4", yearId: "3rd-prep", title: "الإرشاد والốciological", index: 4, description: "الجهاز العصبي والحواس" },

  // أولى علوم متكاملة
  { id: "1bac-ch1", yearId: "1bac-integrated", title: "تركيب الذرة والجدول الدوري", index: 1, description: "الذرة والجدول الدوري والعناصر" },
  { id: "1bac-ch2", yearId: "1bac-integrated", title: "الروابط الكيميائية", index: 2, description: "الروابط الأيونية والتساهمية والفلزية" },
  { id: "1bac-ch3", yearId: "1bac-integrated", title: "التفاعلات الكيميائية", index: 3, description: "أنواع التفاعلات الكيميائية وحساباتها" },
  { id: "1bac-ch4", yearId: "1bac-integrated", title: "الخلية ووظائفها", index: 4, description: "تركيب الخلية ووظائفها الحيوية" },
  { id: "1bac-ch5", yearId: "1bac-integrated", title: "الطاقة والتحولات", index: 5, description: "الطاقة والتحولات الفيزيائية والكيميائية" },

  // تانية علوم متكاملة
  { id: "2bac-ch1", yearId: "2bac-integrated", title: "التغذية والهضم في الإنسان", index: 1, description: "الجهاز الهضمي والإنزيمات" },
  { id: "2bac-ch2", yearId: "2bac-integrated", title: "التنفس الخلوي والرئوي", index: 2, description: "عملية التنفس وأنواعها" },
  { id: "2bac-ch3", yearId: "2bac-integrated", title: "النقل في الإنسان", index: 3, description: "الدم والقلب والأوعية الدموية" },
  { id: "2bac-ch4", yearId: "2bac-integrated", title: "الإخراج والtz", index: 4, description: "الكلى والجلد ووظائف الإخراج" },

  // تالتة ثانوي
  { id: "3sec-ch1", yearId: "3sec", title: "الدعامة في النبات والإنسان", index: 1, description: "الجدار الخلوي والجهاز الهيكلي" },
  { id: "3sec-ch2", yearId: "3sec", title: "الحركة في النبات والإنسان", index: 2, description: "المفاصل والعضلات وأنواع الحركة" },
  { id: "3sec-ch3", yearId: "3sec", title: "التنسيق الهرموني", index: 3, description: "الهرمونات النباتية والغدد الصماء" },
  { id: "3sec-ch4", yearId: "3sec", title: "التكاثر اللاجنسي", index: 4, description: "التكاثر في النبات والكائنات الدقيقة" },
  { id: "3sec-ch5", yearId: "3sec", title: "التكاثر الجنسي", index: 5, description: "الأمشاج والإخصاب والتناسل" },
  { id: "3sec-ch6", yearId: "3sec", title: "المناعة", index: 6, description: "خطوط الدفاع والمناعة المكتسبة" },
];

export const lessons: Lesson[] = [
  // === تالتة إعدادي ===
  // شابتر 1
  { id: "3prep-ch1-l1", chapterId: "3prep-ch1", yearId: "3rd-prep", index: 1, title: "مقدمة عن الأعضاء والوظائف", duration: "32:15", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تعريف الأعضاء والأنسجة والوظائف الحيوية", task: { id: "3prep-ch1-l1-task", title: "واجب المحاضرة الأولى", description: "حل الأسئلة التدريبية على الأعضاء والوظائف", type: "quiz", points: 10, questions: [{ q: "أي مما يلي يمثل عضو؟", options: ["ال心脏", "العضلة", "الجلد", "العظام"], answer: 0 }, { q: "عدد الأعضاء الرئيسية في جسم الإنسان؟", options: ["5", "7", "10", "12"], answer: 1 }] } },
  { id: "3prep-ch1-l2", chapterId: "3prep-ch1", yearId: "3rd-prep", index: 2, title: "الجهاز الهيكلي - العظام", duration: "38:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تركيب العظام وأنواعها ووظائفها", task: { id: "3prep-ch1-l2-task", title: "واجب المحاضرة الثانية", description: "صورة ل.ERROR العظام وحل الأسئلة", type: "upload", points: 10 } },
  { id: "3prep-ch1-l3", chapterId: "3prep-ch1", yearId: "3rd-prep", index: 3, title: "الجهاز العضلي", duration: "35:45", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "العضلات الهيكلية وال Issa والقلبية" },

  // شابتر 2
  { id: "3prep-ch2-l1", chapterId: "3prep-ch2", yearId: "3rd-prep", index: 1, title: "الجهاز التنفسي - المقدمة", duration: "30:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الأنف والحنجرة والقصبة الهوائية" },
  { id: "3prep-ch2-l2", chapterId: "3prep-ch2", yearId: "3rd-prep", index: 2, title: "الرئتان وعملية التنفس", duration: "40:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تركيب الرئتين وآلية التنفس" },

  // شابتر 3
  { id: "3prep-ch3-l1", chapterId: "3prep-ch3", yearId: "3rd-prep", index: 1, title: "الجهاز الهضمي - الفم والمريء", duration: "28:50", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "عملية المضغ والبلع" },
  { id: "3prep-ch3-l2", chapterId: "3prep-ch3", yearId: "3rd-prep", index: 2, title: "المعدة والأمعاء الدقيقة", duration: "42:15", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الهضم الكيميائي والفيزيائي" },

  // شابتر 4
  { id: "3prep-ch4-l1", chapterId: "3prep-ch4", yearId: "3rd-prep", index: 1, title: "الجهاز العصبي - المقدمة", duration: "34:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الخلايا العصبية والنواقل العصبية" },
  { id: "3prep-ch4-l2", chapterId: "3prep-ch4", yearId: "3rd-prep", index: 2, title: "الحواس الخمس", duration: "36:40", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "العين والأذن والأنف واللسان والجلد" },

  // === أولى علوم متكاملة ===
  // شابتر 1
  { id: "1bac-ch1-l1", chapterId: "1bac-ch1", yearId: "1bac-integrated", index: 1, title: "نموذج طومسون للذرة", duration: "35:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تجارب طومسون واكتشاف الإلكترون", task: { id: "1bac-ch1-l1-task", title: "واجب تركيب الذرة", description: "حل 10 أسئلة على نماذج الذرة", type: "quiz", points: 10, questions: [{ q: "من اكتشف الإلكترون؟", options: ["atz", "طومسون", "رذرفورد", "بول"], answer: 1 }] } },
  { id: "1bac-ch1-l2", chapterId: "1bac-ch1", yearId: "1bac-integrated", index: 2, title: "نموذج رذرفورد", duration: "38:25", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تجربة حبيبات الذهب ونواة الذرة" },
  { id: "1bac-ch1-l3", chapterId: "1bac-ch1", yearId: "1bac-integrated", index: 3, title: "الجدول الدوري", duration: "42:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تنظيم العناصر في الدورات والمجموعات" },

  // شابتر 2
  { id: "1bac-ch2-l1", chapterId: "1bac-ch2", yearId: "1bac-integrated", index: 1, title: "الروابط الأيونية", duration: "33:15", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "transfer electrons and ionic bond formation" },
  { id: "1bac-ch2-l2", chapterId: "1bac-ch2", yearId: "1bac-integrated", index: 2, title: "الروابط التساهمية", duration: "40:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "sharing electrons and covalent bonds" },

  // شابتر 3
  { id: "1bac-ch3-l1", chapterId: "1bac-ch3", yearId: "1bac-integrated", index: 1, title: "أنواع التفاعلات الكيميائية", duration: "36:45", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تفاعل إضافية و-tearing and replacement" },

  // شابتر 4
  { id: "1bac-ch4-l1", chapterId: "1bac-ch4", yearId: "1bac-integrated", index: 1, title: "تركيب الخلية", duration: "41:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الغشاء البلازمي والنواة وال-organelles" },
  { id: "1bac-ch4-l2", chapterId: "1bac-ch4", yearId: "1bac-integrated", index: 2, title: "وظائف الخلية", duration: "37:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "التنفس والبناء الضوئي والتكاثر" },

  // شابتر 5
  { id: "1bac-ch5-l1", chapterId: "1bac-ch5", yearId: "1bac-integrated", index: 1, title: "الطاقة والتحولات", duration: "39:25", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الطاقة الحركية والوضع والتحولات" },

  // === تانية علوم متكاملة ===
  // شابتر 1
  { id: "2bac-ch1-l1", chapterId: "2bac-ch1", yearId: "2bac-integrated", index: 1, title: "الجهاز الهضمي - المقدمة", duration: "34:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "القناة الهضمية وأجزائها", task: { id: "2bac-ch1-l1-task", title: "واجب التغذية", description: "حل الأسئلة على الجهاز الهضمي", type: "quiz", points: 10, questions: [{ q: "أين يبدأ الهضم؟", options: ["المعدة", "الفم", "الأمعاء", "المرارة"], answer: 1 }] } },
  { id: "2bac-ch1-l2", chapterId: "2bac-ch1", yearId: "2bac-integrated", index: 2, title: "الإنزيمات", duration: "40:15", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تعريف الإنزيمات وآلية العمل" },

  // شابتر 2
  { id: "2bac-ch2-l1", chapterId: "2bac-ch2", yearId: "2bac-integrated", index: 1, title: "التنفس الخلوي", duration: "38:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "المجهرMitochondria and ATP" },
  { id: "2bac-ch2-l2", chapterId: "2bac-ch2", yearId: "2bac-integrated", index: 2, title: "التنفس الرئوي", duration: "35:45", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "عملية التنفس والتهوية الرئوية" },

  // شابتر 3
  { id: "2bac-ch3-l1", chapterId: "2bac-ch3", yearId: "2bac-integrated", index: 1, title: "الدم والقلب", duration: "42:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تركيب الدم ووظائف القلب" },

  // شابتر 4
  { id: "2bac-ch4-l1", chapterId: "2bac-ch4", yearId: "2bac-integrated", index: 1, title: "الكلى وظائف الإخراج", duration: "36:25", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الترشيح وال reabsorption" },

  // === تالتة ثانوي ===
  // شابتر 1: الدعامة
  { id: "3sec-ch1-l1", chapterId: "3sec-ch1", yearId: "3sec", index: 1, title: "الدعامة في النبات - الجدار الخلوي", duration: "38:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تركيب الجدار الخلوي والcelandulose", task: { id: "3sec-ch1-l1-task", title: "واجب الدعامة", description: "حل الأسئلة على الجدار الخلوي", type: "quiz", points: 10, questions: [{ q: "المادة الأساسية في الجدار الخلوي النباتي؟", options: ["البروتين", "السليلوز", "الدهون", "النشا"], answer: 1 }] } },
  { id: "3sec-ch1-l2", chapterId: "3sec-ch1", yearId: "3sec", index: 2, title: "الدعامة في الإنسان - الجهاز الهيكلي", duration: "42:35", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "العظام والمفاصل وأنواعها" },
  { id: "3sec-ch1-l3", chapterId: "3sec-ch1", yearId: "3sec", index: 3, title: "الغضاريف والأربطة", duration: "30:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "وظائف الغضاريف والأربطة في المفاصل" },

  // شابتر 2: الحركة
  { id: "3sec-ch2-l1", chapterId: "3sec-ch2", yearId: "3sec", index: 1, title: "الحركة في النبات", duration: "33:45", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الحركة الاحتكاكية والضوئية" },
  { id: "3sec-ch2-l2", chapterId: "3sec-ch2", yearId: "3sec", index: 2, title: "الحركة في الإنسان - العضلات", duration: "40:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "العضلات الهيكلية وآلية الانقباض" },

  // شابتر 3: التنسيق الهرموني
  { id: "3sec-ch3-l1", chapterId: "3sec-ch3", yearId: "3sec", index: 1, title: "الهرمونات النباتية", duration: "36:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الجبرلين والسيتوكينين وال utilis" },
  { id: "3sec-ch3-l2", chapterId: "3sec-ch3", yearId: "3sec", index: 2, title: "الغدد الصماء - النخامية والدرقية", duration: "44:15", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "هرمونات النخامية والغدة الدرقية" },
  { id: "3sec-ch3-l3", chapterId: "3sec-ch3", yearId: "3sec", index: 3, title: "الغدد الصماء - البنكرياس والكظرية", duration: "41:40", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الأنسولين والأدرينالين" },

  // شابتر 4: التكاثر اللاجنسي
  { id: "3sec-ch4-l1", chapterId: "3sec-ch4", yearId: "3sec", index: 1, title: "التكاثر اللاجنسي في النبات", duration: "35:25", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "التكاثر بالتقسيم والتطاير" },
  { id: "3sec-ch4-l2", chapterId: "3sec-ch4", yearId: "3sec", index: 2, title: "التكاثر اللاجنسي في الكائنات الدقيقة", duration: "32:10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "البكتيريا والفطريات" },

  // شابتر 5: التكاثر الجنسي
  { id: "3sec-ch5-l1", chapterId: "3sec-ch5", yearId: "3sec", index: 1, title: "الأمشاج والإخصاب", duration: "43:30", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "تكوينGametes وعملية الإخصاب" },
  { id: "3sec-ch5-l2", chapterId: "3sec-ch5", yearId: "3sec", index: 2, title: "التناسل في الإنسان", duration: "39:45", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الجهاز التناسلي الذكري والأنثوي" },

  // شابتر 6: المناعة
  { id: "3sec-ch6-l1", chapterId: "3sec-ch6", yearId: "3sec", index: 1, title: "خطوط الدفاع - المناعة الطبيعية", duration: "37:20", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الجلد والأغشية المخاطية والبلعمات" },
  { id: "3sec-ch6-l2", chapterId: "3sec-ch6", yearId: "3sec", index: 2, title: "المناعة المكتسبة", duration: "41:50", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "الخلايا اللمفاوية والأجسام المضادة" },
];

export function getYear(yearId: YearSlug): Year | undefined {
  return years.find((y) => y.id === yearId);
}

export function getChaptersByYear(yearId: YearSlug): Chapter[] {
  return chapters.filter((c) => c.yearId === yearId).sort((a, b) => a.index - b.index);
}

export function getLessonsByChapter(chapterId: string): Lesson[] {
  return lessons.filter((l) => l.chapterId === chapterId).sort((a, b) => a.index - b.index);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return chapters.find((c) => c.id === chapterId);
}
