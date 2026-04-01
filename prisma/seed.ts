import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "nexos2026";

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ============================================================
  // Users
  // ============================================================

  const necoAdmin = await prisma.user.upsert({
    where: { email: "admin@necofindjob.com" },
    update: {},
    create: {
      name: "Neco 管理者",
      email: "admin@necofindjob.com",
      passwordHash,
      role: "neco_admin",
      image: null,
    },
  });

  const necoEditor = await prisma.user.upsert({
    where: { email: "tamura@necofindjob.com" },
    update: {},
    create: {
      name: "田村 結衣",
      email: "tamura@necofindjob.com",
      passwordHash,
      role: "neco_editor",
    },
  });

  const c1Admin = await prisma.user.upsert({
    where: { email: "sato@medical-frontier.example.com" },
    update: {},
    create: {
      name: "佐藤 健太",
      email: "sato@medical-frontier.example.com",
      passwordHash,
      role: "clinic_admin",
    },
  });

  const c1Editor = await prisma.user.upsert({
    where: { email: "suzuki@medical-frontier.example.com" },
    update: {},
    create: {
      name: "鈴木 院長",
      email: "suzuki@medical-frontier.example.com",
      passwordHash,
      role: "clinic_editor",
    },
  });

  const c2Admin = await prisma.user.upsert({
    where: { email: "kimura@sakura-home.example.com" },
    update: {},
    create: {
      name: "木村 直子",
      email: "kimura@sakura-home.example.com",
      passwordHash,
      role: "clinic_admin",
    },
  });

  const c3Admin = await prisma.user.upsert({
    where: { email: "watanabe@neuroscience-tokyo.example.com" },
    update: {},
    create: {
      name: "渡辺 慎一",
      email: "watanabe@neuroscience-tokyo.example.com",
      passwordHash,
      role: "clinic_admin",
    },
  });

  console.log("✅ Users created");

  // ============================================================
  // Clinics
  // ============================================================

  const clinic1 = await prisma.clinic.upsert({
    where: { slug: "medical-frontier-shibuya" },
    update: {},
    create: {
      name: "メディカルフロンティア渋谷",
      slug: "medical-frontier-shibuya",
      description: "渋谷駅徒歩3分の都市型総合クリニック。内科・皮膚科・美容医療を中心に、忙しい都市生活者に寄り添った医療を提供しています。",
      mission: "都市で働く人々の健康と美を、もっと身近に。テクノロジーと医療の力で、一人ひとりに最適なケアを届けます。",
      logoEmoji: "🏥",
      coverImageGradient: "from-blue-600 via-blue-500 to-cyan-400",
      brandColor: "#2563eb",
      brandColorLight: "#dbeafe",
      heroTagline: "最先端の医療と美容を、渋谷から。",
      location: "東京都渋谷区",
      employeeCount: "45名",
      foundedYear: 2019,
      specialties: ["内科", "皮膚科", "美容医療", "健康診断"],
      benefits: ["完全週休2日制", "渋谷駅徒歩3分", "最新医療機器完備", "研修制度充実", "美容施術社員割引"],
      culture: ["チーム医療を重視", "若手の挑戦を応援", "ワークライフバランス推進"],
      website: "https://nexos.necofindjob.com/clinics/medical-frontier-shibuya",
    },
  });

  const clinic2 = await prisma.clinic.upsert({
    where: { slug: "sakura-home-care" },
    update: {},
    create: {
      name: "さくら在宅クリニック",
      slug: "sakura-home-care",
      description: "「最期まで自分らしく」を理念に、訪問診療・在宅医療に特化したクリニック。世田谷区・目黒区を中心に、24時間365日の在宅医療体制を構築しています。",
      mission: "すべての人に、住み慣れた場所で安心して暮らし続ける権利を。在宅医療の力で、地域の「生きる」を支えます。",
      logoEmoji: "🌸",
      coverImageGradient: "from-pink-500 via-rose-400 to-orange-300",
      brandColor: "#e11d48",
      brandColorLight: "#ffe4e6",
      heroTagline: "住み慣れた場所で、安心を届ける。",
      location: "東京都世田谷区",
      employeeCount: "28名",
      foundedYear: 2016,
      specialties: ["訪問診療", "緩和ケア", "在宅ターミナルケア", "訪問看護"],
      benefits: ["訪問用車両貸与", "24時間シフト手当", "オンコール手当充実", "メンタルヘルスサポート", "年間休日120日以上"],
      culture: ["患者さん第一主義", "多職種チーム連携", "地域に根差した医療"],
      website: "https://nexos.necofindjob.com/clinics/sakura-home-care",
    },
  });

  const clinic3 = await prisma.clinic.upsert({
    where: { slug: "neuroscience-tokyo" },
    update: {},
    create: {
      name: "ニューロサイエンス東京",
      slug: "neuroscience-tokyo",
      description: "脳神経内科に特化した専門クリニック。頭痛外来、もの忘れ外来、パーキンソン病外来など、脳神経領域の専門的な診療を提供しています。",
      mission: "脳と神経の専門医療を、大学病院よりもアクセスしやすく。最新の知見と温かいケアで、患者さんの不安を安心に変えます。",
      logoEmoji: "🧠",
      coverImageGradient: "from-violet-600 via-purple-500 to-indigo-400",
      brandColor: "#7c3aed",
      brandColorLight: "#ede9fe",
      heroTagline: "脳と神経の専門医療を、もっと身近に。",
      location: "東京都千代田区",
      employeeCount: "32名",
      foundedYear: 2020,
      specialties: ["脳神経内科", "頭痛外来", "もの忘れ外来", "パーキンソン病"],
      benefits: ["学会参加費全額補助", "論文執筆支援制度", "最新MRI完備", "完全予約制で残業少", "千代田区一等地"],
      culture: ["学術的探究心", "エビデンスベース", "患者さんへの丁寧な説明"],
      website: "https://nexos.necofindjob.com/clinics/neuroscience-tokyo",
    },
  });

  console.log("✅ Clinics created");

  // ============================================================
  // Clinic memberships
  // ============================================================

  await prisma.clinicMember.createMany({
    data: [
      // Neco editor assigned to all clinics
      { userId: necoEditor.id, clinicId: clinic1.id, role: "neco_editor" },
      { userId: necoEditor.id, clinicId: clinic2.id, role: "neco_editor" },
      { userId: necoEditor.id, clinicId: clinic3.id, role: "neco_editor" },
      // Clinic staff
      { userId: c1Admin.id, clinicId: clinic1.id, role: "clinic_admin" },
      { userId: c1Editor.id, clinicId: clinic1.id, role: "clinic_editor" },
      { userId: c2Admin.id, clinicId: clinic2.id, role: "clinic_admin" },
      { userId: c3Admin.id, clinicId: clinic3.id, role: "clinic_admin" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Clinic memberships created");

  // ============================================================
  // Page sections
  // ============================================================

  for (const clinic of [clinic1, clinic2, clinic3]) {
    await prisma.clinicPageSection.createMany({
      data: [
        { clinicId: clinic.id, type: "hero", title: "ヒーロー", order: 0, isVisible: true },
        { clinicId: clinic.id, type: "about", title: "クリニックについて", order: 1, isVisible: true },
        { clinicId: clinic.id, type: "culture", title: "カルチャー", order: 2, isVisible: true },
        { clinicId: clinic.id, type: "benefits", title: "福利厚生", order: 3, isVisible: true },
        { clinicId: clinic.id, type: "jobs", title: "募集中のポジション", order: 4, isVisible: true },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Page sections created");

  // ============================================================
  // Job Postings (abbreviated — just clinic 1 for brevity)
  // ============================================================

  await prisma.jobPosting.createMany({
    data: [
      {
        clinicId: clinic1.id, title: "内科・皮膚科 常勤医師", type: "full_time", category: "医師",
        location: "東京都渋谷区", salaryMin: 15000000, salaryMax: 22000000,
        description: "渋谷駅徒歩3分の好立地で、内科・皮膚科の外来診療を担当いただきます。美容医療にも関心がある方歓迎です。",
        requirements: ["医師免許保有", "臨床経験3年以上"], niceToHave: ["美容医療の経験"], benefits: ["年収1,500万〜2,200万円", "完全週休2日制"],
        isActive: true, viewCount: 342, applyStartCount: 28, applyCompleteCount: 12, lastEditedById: c1Admin.id,
      },
      {
        clinicId: clinic1.id, title: "看護師・准看護師", type: "full_time", category: "看護師",
        location: "東京都渋谷区", salaryMin: 4500000, salaryMax: 6000000,
        description: "外来診療のサポート、採血・点滴、美容施術の補助など幅広い業務をお任せします。",
        requirements: ["看護師免許", "臨床経験1年以上"], niceToHave: ["美容クリニック経験"], benefits: ["年収450万〜600万円", "完全週休2日制"],
        isActive: true, viewCount: 567, applyStartCount: 45, applyCompleteCount: 23, lastEditedById: necoEditor.id,
      },
      {
        clinicId: clinic2.id, title: "訪問診療医（常勤）", type: "full_time", category: "医師",
        location: "東京都世田谷区", salaryMin: 16000000, salaryMax: 24000000,
        description: "世田谷区・目黒区エリアの在宅患者さんへの訪問診療をお任せします。",
        requirements: ["医師免許保有", "臨床経験5年以上", "普通自動車免許"], niceToHave: ["在宅医療の経験"], benefits: ["年収1,600万〜2,400万円", "訪問用車両貸与"],
        isActive: true, viewCount: 198, applyStartCount: 15, applyCompleteCount: 8, lastEditedById: necoEditor.id,
      },
      {
        clinicId: clinic2.id, title: "訪問看護師", type: "full_time", category: "看護師",
        location: "東京都世田谷区", salaryMin: 5000000, salaryMax: 6500000,
        description: "在宅で療養される患者さんのご自宅を訪問し、医療的なケア、健康管理、生活支援を行います。",
        requirements: ["正看護師免許", "臨床経験3年以上"], niceToHave: ["訪問看護の経験"], benefits: ["年収500万〜650万円", "直行直帰OK"],
        isActive: true, viewCount: 423, applyStartCount: 34, applyCompleteCount: 18,
      },
      {
        clinicId: clinic3.id, title: "脳神経内科専門医", type: "full_time", category: "医師",
        location: "東京都千代田区", salaryMin: 18000000, salaryMax: 28000000,
        description: "脳神経内科の専門外来を担当いただきます。最新のMRI・脳波検査設備を活用した精密な診断が可能です。",
        requirements: ["医師免許保有", "脳神経内科専門医"], niceToHave: ["頭痛専門医"], benefits: ["年収1,800万〜2,800万円", "学会参加費全額補助"],
        isActive: true, viewCount: 156, applyStartCount: 11, applyCompleteCount: 5, lastEditedById: c3Admin.id,
      },
      {
        clinicId: clinic3.id, title: "臨床検査技師（脳波・MRI）", type: "full_time", category: "臨床検査技師",
        location: "東京都千代田区", salaryMin: 4500000, salaryMax: 5500000,
        description: "脳波検査、MRI検査を中心とした神経生理検査を担当いただきます。",
        requirements: ["臨床検査技師免許", "MRI撮影経験2年以上"], niceToHave: ["脳波検査の経験"], benefits: ["年収450万〜550万円", "最新MRI装置"],
        isActive: true, viewCount: 234, applyStartCount: 19, applyCompleteCount: 9,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Job postings created");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
