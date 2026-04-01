import {
  Clinic,
  JobPosting,
  Application,
  EventMetric,
  AdminUser,
} from "./types";

// ============================================================
// Admin Users — Neco operators + clinic staff
// ============================================================

export const adminUsers: AdminUser[] = [
  // Neco platform operators
  {
    id: "user-neco-1",
    name: "Neco 管理者",
    email: "admin@necofindjob.com",
    role: "neco_admin",
    clinicIds: [],
    avatarEmoji: "🐱",
    isActive: true,
  },
  {
    id: "user-neco-2",
    name: "田村 結衣",
    email: "tamura@necofindjob.com",
    role: "neco_editor",
    clinicIds: ["clinic-1", "clinic-2", "clinic-3"],
    avatarEmoji: "✏️",
    isActive: true,
  },
  // Clinic-1 staff
  {
    id: "user-c1-admin",
    name: "佐藤 健太",
    email: "sato@medical-frontier.example.com",
    role: "clinic_admin",
    clinicIds: ["clinic-1"],
    avatarEmoji: "👨‍⚕️",
    isActive: true,
  },
  {
    id: "user-c1-editor",
    name: "鈴木 院長",
    email: "suzuki@medical-frontier.example.com",
    role: "clinic_editor",
    clinicIds: ["clinic-1"],
    avatarEmoji: "🩺",
    isActive: true,
  },
  // Clinic-2 staff
  {
    id: "user-c2-admin",
    name: "木村 直子",
    email: "kimura@sakura-home.example.com",
    role: "clinic_admin",
    clinicIds: ["clinic-2"],
    avatarEmoji: "🌸",
    isActive: true,
  },
  // Clinic-3 staff
  {
    id: "user-c3-admin",
    name: "渡辺 慎一",
    email: "watanabe@neuroscience-tokyo.example.com",
    role: "clinic_admin",
    clinicIds: ["clinic-3"],
    avatarEmoji: "🧠",
    isActive: true,
  },
];

// ============================================================
// Clinics — 3 distinct clinic archetypes
// ============================================================

export const clinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "メディカルフロンティア渋谷",
    slug: "medical-frontier-shibuya",
    description:
      "渋谷駅徒歩3分の都市型総合クリニック。内科・皮膚科・美容医療を中心に、忙しい都市生活者に寄り添った医療を提供しています。20〜40代の若い世代を中心に年間3万人以上の患者さんにご来院いただいています。",
    mission:
      "都市で働く人々の健康と美を、もっと身近に。テクノロジーと医療の力で、一人ひとりに最適なケアを届けます。",
    brand: {
      logoEmoji: "🏥",
      coverImageGradient: "from-blue-600 via-blue-500 to-cyan-400",
      brandColor: "#2563eb",
      brandColorLight: "#dbeafe",
      heroTagline: "最先端の医療と美容を、渋谷から。",
    },
    location: "東京都渋谷区",
    employeeCount: "45名",
    foundedYear: 2019,
    specialties: ["内科", "皮膚科", "美容医療", "健康診断"],
    benefits: [
      "完全週休2日制",
      "渋谷駅徒歩3分",
      "最新医療機器完備",
      "研修制度充実",
      "美容施術社員割引",
    ],
    culture: [
      "チーム医療を重視",
      "若手の挑戦を応援",
      "ワークライフバランス推進",
    ],
    website: "https://nexos.necofindjob.com/clinics/medical-frontier-shibuya",
    pageSections: [
      { id: "ps-1-1", type: "hero", title: "ヒーロー", content: "", order: 0, isVisible: true, lastEditedBy: "user-neco-2", lastEditedAt: "2026-03-20T10:00:00Z" },
      { id: "ps-1-2", type: "about", title: "クリニックについて", content: "", order: 1, isVisible: true, lastEditedBy: "user-c1-admin", lastEditedAt: "2026-03-18T15:00:00Z" },
      { id: "ps-1-3", type: "culture", title: "カルチャー", content: "", order: 2, isVisible: true },
      { id: "ps-1-4", type: "benefits", title: "福利厚生", content: "", order: 3, isVisible: true },
      { id: "ps-1-5", type: "jobs", title: "募集中のポジション", content: "", order: 4, isVisible: true },
    ],
  },
  {
    id: "clinic-2",
    name: "さくら在宅クリニック",
    slug: "sakura-home-care",
    description:
      "「最期まで自分らしく」を理念に、訪問診療・在宅医療に特化したクリニック。世田谷区・目黒区を中心に、24時間365日の在宅医療体制を構築しています。患者さんとご家族に寄り添い、住み慣れた場所での療養を支えます。",
    mission:
      "すべての人に、住み慣れた場所で安心して暮らし続ける権利を。在宅医療の力で、地域の「生きる」を支えます。",
    brand: {
      logoEmoji: "🌸",
      coverImageGradient: "from-pink-500 via-rose-400 to-orange-300",
      brandColor: "#e11d48",
      brandColorLight: "#ffe4e6",
      heroTagline: "住み慣れた場所で、安心を届ける。",
    },
    location: "東京都世田谷区",
    employeeCount: "28名",
    foundedYear: 2016,
    specialties: ["訪問診療", "緩和ケア", "在宅ターミナルケア", "訪問看護"],
    benefits: [
      "訪問用車両貸与",
      "24時間シフト手当",
      "オンコール手当充実",
      "メンタルヘルスサポート",
      "年間休日120日以上",
    ],
    culture: [
      "患者さん第一主義",
      "多職種チーム連携",
      "地域に根差した医療",
    ],
    website: "https://nexos.necofindjob.com/clinics/sakura-home-care",
    pageSections: [
      { id: "ps-2-1", type: "hero", title: "ヒーロー", content: "", order: 0, isVisible: true, lastEditedBy: "user-neco-2", lastEditedAt: "2026-03-15T09:00:00Z" },
      { id: "ps-2-2", type: "about", title: "クリニックについて", content: "", order: 1, isVisible: true },
      { id: "ps-2-3", type: "culture", title: "カルチャー", content: "", order: 2, isVisible: true },
      { id: "ps-2-4", type: "jobs", title: "募集中のポジション", content: "", order: 3, isVisible: true },
    ],
  },
  {
    id: "clinic-3",
    name: "ニューロサイエンス東京",
    slug: "neuroscience-tokyo",
    description:
      "脳神経内科に特化した専門クリニック。頭痛外来、もの忘れ外来、パーキンソン病外来など、脳神経領域の専門的な診療を提供しています。最新のMRI・脳波検査設備を備え、大学病院レベルの専門医療をクリニックで実現します。",
    mission:
      "脳と神経の専門医療を、大学病院よりもアクセスしやすく。最新の知見と温かいケアで、患者さんの不安を安心に変えます。",
    brand: {
      logoEmoji: "🧠",
      coverImageGradient: "from-violet-600 via-purple-500 to-indigo-400",
      brandColor: "#7c3aed",
      brandColorLight: "#ede9fe",
      heroTagline: "脳と神経の専門医療を、もっと身近に。",
    },
    location: "東京都千代田区",
    employeeCount: "32名",
    foundedYear: 2020,
    specialties: [
      "脳神経内科",
      "頭痛外来",
      "もの忘れ外来",
      "パーキンソン病",
    ],
    benefits: [
      "学会参加費全額補助",
      "論文執筆支援制度",
      "最新MRI完備",
      "完全予約制で残業少",
      "千代田区一等地",
    ],
    culture: [
      "学術的探究心",
      "エビデンスベース",
      "患者さんへの丁寧な説明",
    ],
    website: "https://nexos.necofindjob.com/clinics/neuroscience-tokyo",
    pageSections: [
      { id: "ps-3-1", type: "hero", title: "ヒーロー", content: "", order: 0, isVisible: true },
      { id: "ps-3-2", type: "about", title: "クリニックについて", content: "", order: 1, isVisible: true },
      { id: "ps-3-3", type: "jobs", title: "募集中のポジション", content: "", order: 2, isVisible: true },
    ],
  },
];

// ============================================================
// Job Postings
// ============================================================

export const jobPostings: JobPosting[] = [
  // Medical Frontier Shibuya
  {
    id: "job-1", clinicId: "clinic-1", title: "内科・皮膚科 常勤医師", type: "full-time", category: "医師", location: "東京都渋谷区", salaryMin: 15000000, salaryMax: 22000000,
    description: "渋谷駅徒歩3分の好立地で、内科・皮膚科の外来診療を担当いただきます。美容医療にも関心がある方歓迎です。最新の医療機器を導入しており、質の高い診療を提供できる環境が整っています。若い患者さんが多く、予防医療やアンチエイジングへの関心も高い地域です。",
    requirements: ["医師免許保有", "内科または皮膚科の臨床経験3年以上", "チーム医療への積極的な参画意欲"],
    niceToHave: ["美容医療の経験", "英語での診療対応可能", "産業医資格"],
    benefits: ["年収1,500万〜2,200万円", "完全週休2日制（日曜+平日1日）", "学会参加補助あり", "美容施術社員割引"],
    isActive: true, publishedAt: "2026-03-01", viewCount: 342, applyStartCount: 28, applyCompleteCount: 12,
    lastEditedBy: "user-c1-admin", lastEditedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "job-2", clinicId: "clinic-1", title: "看護師・准看護師", type: "full-time", category: "看護師", location: "東京都渋谷区", salaryMin: 4500000, salaryMax: 6000000,
    description: "外来診療のサポート、採血・点滴、美容施術の補助など幅広い業務をお任せします。患者さんとの距離が近く、一人ひとりに丁寧なケアを提供できる環境です。美容医療の知識も身につけることができます。",
    requirements: ["看護師または准看護師免許", "臨床経験1年以上", "コミュニケーション力がある方"],
    niceToHave: ["美容クリニック勤務経験", "皮膚科勤務経験"],
    benefits: ["年収450万〜600万円", "完全週休2日制", "渋谷駅徒歩3分", "社員割引制度"],
    isActive: true, publishedAt: "2026-03-10", viewCount: 567, applyStartCount: 45, applyCompleteCount: 23,
    lastEditedBy: "user-neco-2", lastEditedAt: "2026-03-10T11:00:00Z",
  },
  {
    id: "job-3", clinicId: "clinic-1", title: "医療事務・受付スタッフ", type: "part-time", category: "医療事務", location: "東京都渋谷区", salaryMin: 2800000, salaryMax: 3500000,
    description: "クリニックの顔としてフロント受付業務をお任せします。受付・会計・予約管理・レセプト業務をお任せします。おしゃれなクリニックで、ホスピタリティを活かしたい方に最適です。",
    requirements: ["医療事務資格保有者優遇", "PCの基本操作ができる方", "接客・サービス業の経験がある方歓迎"],
    niceToHave: ["医療事務経験", "レセプト経験"],
    benefits: ["年収280万〜350万円", "週3日〜勤務可", "シフト制", "社員割引あり"],
    isActive: true, publishedAt: "2026-03-15", viewCount: 892, applyStartCount: 67, applyCompleteCount: 31,
  },
  // Sakura Home Care
  {
    id: "job-4", clinicId: "clinic-2", title: "訪問診療医（常勤）", type: "full-time", category: "医師", location: "東京都世田谷区", salaryMin: 16000000, salaryMax: 24000000,
    description: "世田谷区・目黒区エリアの在宅患者さんへの訪問診療をお任せします。チーム制で訪問するため、一人で抱え込むことはありません。緩和ケアやターミナルケアに関心のある方に特にやりがいのある環境です。",
    requirements: ["医師免許保有", "臨床経験5年以上", "訪問診療・在宅医療への強い関心", "普通自動車免許（AT可）"],
    niceToHave: ["在宅医療の経験", "緩和ケアの研修修了", "総合内科専門医"],
    benefits: ["年収1,600万〜2,400万円", "訪問用車両貸与", "オンコール手当別途支給", "年間休日120日"],
    isActive: true, publishedAt: "2026-02-20", viewCount: 198, applyStartCount: 15, applyCompleteCount: 8,
    lastEditedBy: "user-neco-2", lastEditedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "job-5", clinicId: "clinic-2", title: "訪問看護師", type: "full-time", category: "看護師", location: "東京都世田谷区", salaryMin: 5000000, salaryMax: 6500000,
    description: "在宅で療養される患者さんのご自宅を訪問し、医療的なケア、健康管理、生活支援を行います。医師と密に連携し、患者さんとご家族の安心をつくる仕事です。一人ひとりに時間をかけたケアが可能です。",
    requirements: ["正看護師免許", "臨床経験3年以上", "普通自動車免許（AT可）"],
    niceToHave: ["訪問看護の経験", "緩和ケアの経験", "認定看護師資格"],
    benefits: ["年収500万〜650万円", "訪問用車両・スマホ貸与", "直行直帰OK", "オンコール手当充実"],
    isActive: true, publishedAt: "2026-03-05", viewCount: 423, applyStartCount: 34, applyCompleteCount: 18,
  },
  // Neuroscience Tokyo
  {
    id: "job-6", clinicId: "clinic-3", title: "脳神経内科専門医", type: "full-time", category: "医師", location: "東京都千代田区", salaryMin: 18000000, salaryMax: 28000000,
    description: "脳神経内科の専門外来を担当いただきます。頭痛、認知症、パーキンソン病、てんかんなど幅広い脳神経疾患の診療を行います。最新のMRI・脳波検査設備を活用した精密な診断が可能です。学術活動にも積極的に参加いただけます。",
    requirements: ["医師免許保有", "脳神経内科専門医または取得予定", "臨床経験5年以上"],
    niceToHave: ["頭痛専門医", "認知症専門医", "学会発表・論文執筆実績"],
    benefits: ["年収1,800万〜2,800万円", "学会参加費全額補助", "論文執筆支援制度", "完全予約制"],
    isActive: true, publishedAt: "2026-03-08", viewCount: 156, applyStartCount: 11, applyCompleteCount: 5,
  },
  {
    id: "job-7", clinicId: "clinic-3", title: "臨床検査技師（脳波・MRI）", type: "full-time", category: "臨床検査技師", location: "東京都千代田区", salaryMin: 4500000, salaryMax: 5500000,
    description: "脳波検査、MRI検査を中心とした神経生理検査を担当いただきます。最新のMRI装置での撮影技術を磨くことができ、脳神経領域のスペシャリストとしてキャリアアップが可能です。",
    requirements: ["臨床検査技師免許", "MRI撮影経験2年以上", "神経生理検査に関心のある方"],
    niceToHave: ["脳波検査の経験", "3T MRIの操作経験"],
    benefits: ["年収450万〜550万円", "最新MRI装置での勤務", "学会参加補助", "完全予約制で残業少"],
    isActive: true, publishedAt: "2026-03-12", viewCount: 234, applyStartCount: 19, applyCompleteCount: 9,
    lastEditedBy: "user-c3-admin", lastEditedAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "job-8", clinicId: "clinic-3", title: "医療事務（専門クリニック経験者）", type: "full-time", category: "医療事務", location: "東京都千代田区", salaryMin: 3500000, salaryMax: 4500000,
    description: "脳神経内科専門クリニックの医療事務全般をお任せします。受付・会計、レセプト請求、予約管理に加え、紹介状の管理や検査予約の調整もお任せします。専門クリニックならではの知識が身につきます。",
    requirements: ["医療事務経験2年以上", "レセプト業務の経験", "PC操作に慣れている方"],
    niceToHave: ["専門クリニック勤務経験", "医療秘書の経験"],
    benefits: ["年収350万〜450万円", "完全週休2日制", "千代田区一等地", "残業月10時間以下"],
    isActive: true, publishedAt: "2026-03-18", viewCount: 312, applyStartCount: 25, applyCompleteCount: 14,
  },
];

// ============================================================
// Applications (sample candidates)
// ============================================================

export const applications: Application[] = [
  {
    id: "app-1", jobId: "job-1", clinicId: "clinic-1",
    applicantName: "田中 美咲", applicantEmail: "tanaka.misaki@example.com", applicantPhone: "090-1234-5678",
    currentPosition: "総合病院 内科勤務医", yearsOfExperience: 5,
    motivation: "総合病院での5年間の勤務を経て、より患者さん一人ひとりに向き合える環境を求めています。美容医療にも関心があり、貴院の幅広い診療体制に魅力を感じました。",
    stage: "interview",
    notes: [
      { id: "note-1", content: "書類選考通過。経歴が非常に充実しており、面接を進めたい。", authorId: "user-c1-admin", authorName: "佐藤 健太", authorRole: "clinic_admin", createdAt: "2026-03-10T10:00:00Z" },
      { id: "note-2", content: "一次面接完了。コミュニケーション力が高く、チームにフィットしそう。二次面接を設定。", authorId: "user-c1-editor", authorName: "鈴木 院長", authorRole: "clinic_editor", createdAt: "2026-03-15T14:00:00Z" },
      { id: "note-3", content: "求人原稿を最適化しました。面接の進捗もフォロー中です。", authorId: "user-neco-2", authorName: "田村 結衣", authorRole: "neco_editor", createdAt: "2026-03-16T09:00:00Z" },
    ],
    appliedAt: "2026-03-05T09:00:00Z", updatedAt: "2026-03-16T09:00:00Z",
  },
  {
    id: "app-2", jobId: "job-2", clinicId: "clinic-1",
    applicantName: "佐々木 愛", applicantEmail: "sasaki.ai@example.com", applicantPhone: "080-2345-6789",
    currentPosition: "大学病院 看護師", yearsOfExperience: 3,
    motivation: "大学病院で3年間の看護経験を積み、よりアットホームな環境でスキルを活かしたいと考えています。美容医療にも興味があり、キャリアの幅を広げたいです。",
    stage: "screening",
    notes: [
      { id: "note-4", content: "書類受領。大学病院での経験があり、基礎力は高そう。", authorId: "user-c1-admin", authorName: "佐藤 健太", authorRole: "clinic_admin", createdAt: "2026-03-12T11:00:00Z" },
    ],
    appliedAt: "2026-03-11T15:30:00Z", updatedAt: "2026-03-12T11:00:00Z",
  },
  {
    id: "app-3", jobId: "job-2", clinicId: "clinic-1",
    applicantName: "山田 花子", applicantEmail: "yamada.hanako@example.com", applicantPhone: "070-3456-7890",
    currentPosition: "美容クリニック 看護師", yearsOfExperience: 4,
    motivation: "美容クリニックでの経験を活かしつつ、一般内科の知識も深めたいと考えています。渋谷というアクセスの良さも魅力です。",
    stage: "applied", notes: [],
    appliedAt: "2026-03-20T08:00:00Z", updatedAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "app-4", jobId: "job-4", clinicId: "clinic-2",
    applicantName: "伊藤 健一", applicantEmail: "ito.kenichi@example.com", applicantPhone: "090-4567-8901",
    currentPosition: "市立病院 総合内科医", yearsOfExperience: 8,
    motivation: "病院勤務を通じて、在宅での療養を望む患者さんの多さを実感してきました。訪問診療の世界で、より患者さんに寄り添った医療を実践したいです。",
    stage: "offer",
    notes: [
      { id: "note-5", content: "最終面接完了。在宅医療への情熱が非常に高く、即戦力として期待できる。内定を出したい。", authorId: "user-c2-admin", authorName: "木村 直子", authorRole: "clinic_admin", createdAt: "2026-03-18T16:00:00Z" },
    ],
    appliedAt: "2026-02-25T10:00:00Z", updatedAt: "2026-03-18T16:00:00Z",
  },
  {
    id: "app-5", jobId: "job-5", clinicId: "clinic-2",
    applicantName: "中村 さくら", applicantEmail: "nakamura.sakura@example.com", applicantPhone: "080-5678-9012",
    currentPosition: "訪問看護ステーション 看護師", yearsOfExperience: 6,
    motivation: "現在の訪問看護ステーションで6年間勤務し、より医師との連携が密な環境で看護をしたいと考えています。在宅ターミナルケアにも関心があります。",
    stage: "interview",
    notes: [
      { id: "note-6", content: "訪問看護の経験が豊富。在宅ターミナルケアへの関心も高い。面接を進めたい。", authorId: "user-c2-admin", authorName: "木村 直子", authorRole: "clinic_admin", createdAt: "2026-03-10T09:30:00Z" },
    ],
    appliedAt: "2026-03-08T14:00:00Z", updatedAt: "2026-03-10T09:30:00Z",
  },
  {
    id: "app-6", jobId: "job-6", clinicId: "clinic-3",
    applicantName: "小林 太郎", applicantEmail: "kobayashi.taro@example.com", applicantPhone: "090-6789-0123",
    currentPosition: "大学病院 脳神経内科 助教", yearsOfExperience: 10,
    motivation: "大学病院で10年間脳神経内科の臨床と研究に従事してきましたが、より多くの患者さんに専門的な診療を届けたいと考え、クリニックでの勤務を志望します。",
    stage: "screening",
    notes: [
      { id: "note-7", content: "脳神経内科専門医。学術実績も豊富で非常に有望。", authorId: "user-c3-admin", authorName: "渡辺 慎一", authorRole: "clinic_admin", createdAt: "2026-03-14T10:00:00Z" },
    ],
    appliedAt: "2026-03-12T11:00:00Z", updatedAt: "2026-03-14T10:00:00Z",
  },
  {
    id: "app-7", jobId: "job-7", clinicId: "clinic-3",
    applicantName: "加藤 裕子", applicantEmail: "kato.yuko@example.com", applicantPhone: "070-7890-1234",
    currentPosition: "総合病院 臨床検査技師", yearsOfExperience: 4,
    motivation: "MRI撮影を中心に4年間の経験があります。脳神経領域に特化した環境でスキルを磨き、専門性を高めたいです。",
    stage: "applied", notes: [],
    appliedAt: "2026-03-22T09:00:00Z", updatedAt: "2026-03-22T09:00:00Z",
  },
];

// ============================================================
// Analytics metrics (last 30 days)
// ============================================================

export const eventMetrics: EventMetric[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-03-01");
  date.setDate(date.getDate() + i);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const base = isWeekend ? 15 : 35;

  return {
    date: date.toISOString().split("T")[0],
    views: base + Math.floor(Math.random() * 25),
    applyStarts: Math.floor((base + Math.random() * 10) * 0.15),
    applyCompletes: Math.floor((base + Math.random() * 5) * 0.08),
  };
});

// ============================================================
// Helper functions (in-memory data store)
// ============================================================

let _applications = [...applications];

export function getClinic(id: string): Clinic | undefined {
  return clinics.find((c) => c.id === id);
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return clinics.find((c) => c.slug === slug);
}

export function getJobsForClinic(clinicId: string): JobPosting[] {
  return jobPostings.filter((j) => j.clinicId === clinicId && j.isActive);
}

export function getJob(id: string): JobPosting | undefined {
  return jobPostings.find((j) => j.id === id);
}

export function getApplicationsForClinic(clinicId: string): Application[] {
  return _applications.filter((a) => a.clinicId === clinicId);
}

export function getApplication(id: string): Application | undefined {
  return _applications.find((a) => a.id === id);
}

export function addApplication(app: Application): void {
  _applications.push(app);
}

export function updateApplicationStage(
  id: string,
  stage: Application["stage"]
): void {
  const app = _applications.find((a) => a.id === id);
  if (app) {
    app.stage = stage;
    app.updatedAt = new Date().toISOString();
  }
}

export function addNote(
  applicationId: string,
  note: Application["notes"][0]
): void {
  const app = _applications.find((a) => a.id === applicationId);
  if (app) {
    app.notes.push(note);
    app.updatedAt = new Date().toISOString();
  }
}

export function getAdminUser(id: string): AdminUser | undefined {
  return adminUsers.find((u) => u.id === id);
}

export function getAdminUsersForClinic(clinicId: string): AdminUser[] {
  return adminUsers.filter(
    (u) => u.role === "neco_admin" || u.clinicIds.includes(clinicId)
  );
}
