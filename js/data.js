/* MediDecision Mock Data Store */
const Store = {
  currentUser: null,
  currentRole: 'user',
  users: [
    { id: 'u1', name: '田中 太郎', email: 'tanaka@example.com', password: 'demo', stripeCustomerId: 'cus_demo1' },
    { id: 'u2', name: '佐藤 花子', email: 'sato@example.com', password: 'demo', stripeCustomerId: 'cus_demo2' },
  ],
  doctors: [
    { id: 'd1', name: '鈴木 一郎', specialty: '腫瘍内科', available: true, avatar: '鈴' },
    { id: 'd2', name: '高橋 美咲', specialty: '循環器内科', available: true, avatar: '高' },
    { id: 'd3', name: '渡辺 健太', specialty: '脳神経外科', available: false, avatar: '渡' },
  ],
  cases: [],
  documents: [],
  deliverables: [],
  messages: [],
  payments: [],
  draft: {
    plan: null,
    basic: { age: '', gender: '', region: '', family: '' },
    condition: { diagnosis: '', history: '', doctorExplanation: '', options: '', uncertainties: '' },
    values: { workImpact: '', qol: '', riskTolerance: '' },
    questions: '',
    files: [],
  },
  statusLabels: { received: '受付', review: '確認中', creating: '作成中', preparing: '納品準備', delivered: '納品済', follow_up: 'フォロー中', closed: '完了' },
  statusOrder: ['received', 'review', 'creating', 'preparing', 'delivered', 'follow_up'],
  planLabels: { light: 'ライト', standard: 'スタンダード', premium: 'プレミアム' },
  planPrices: { light: 29800, standard: 49800, premium: 98000 },
  planDeadlines: { light: '10営業日', standard: '7営業日', premium: '5営業日' },
  planFollowCounts: { light: 2, standard: 5, premium: '無制限' },

  getCasesByUser(userId) { return this.cases.filter(c => c.userId === userId); },
  getCaseById(caseId) { return this.cases.find(c => c.id === caseId); },
  getDocsByCaseId(caseId) { return this.documents.filter(d => d.caseId === caseId); },
  getDeliverableByCaseId(caseId) { return this.deliverables.find(d => d.caseId === caseId); },
  getMessagesByCaseId(caseId) { return this.messages.filter(m => m.caseId === caseId); },
  getDoctorById(id) { return this.doctors.find(d => d.id === id); },
  getUserById(id) { return this.users.find(u => u.id === id); },
  getStatusIndex(status) { return this.statusOrder.indexOf(status); },
  addMessage(caseId, senderType, senderId, body) {
    const msg = { id: 'm' + (this.messages.length + 1), caseId, senderType, senderId, body, attachmentUrl: null, createdAt: new Date().toLocaleString('ja-JP') };
    this.messages.push(msg);
    return msg;
  },
  updateCaseStatus(caseId, newStatus) { const c = this.getCaseById(caseId); if (c) c.status = newStatus; },
  assignDoctor(caseId, doctorId) { const c = this.getCaseById(caseId); if (c) { c.doctorId = doctorId; c.status = 'creating'; } },
};

function initMockData() {
  Store.cases = [
    {
      id: 'CASE-2026-001', userId: 'u1', doctorId: 'd1', status: 'follow_up',
      plan: 'standard', deadline: '2026-02-28',
      basic: { age: 58, gender: '男性', region: '東京都', family: '妻、子供2人' },
      condition: { diagnosis: '肺腺癌 ステージIIIA', history: '2025年12月にCT検査で右肺上葉に3cm大の腫瘤を指摘。2026年1月に気管支鏡検査にて確定診断。', doctorExplanation: '手術と化学放射線療法の2選択肢を提示。', options: '①手術（右上葉切除＋リンパ節郭清）②化学放射線療法', uncertainties: 'リンパ節転移の範囲が画像では判定しきれない' },
      values: { workImpact: '自営業のため長期入院は困難', qol: '呼吸機能温存を最優先。登山を続けたい', riskTolerance: '根治可能性が高いならリスク許容' },
      questions: '手術と化学放射線の5年生存率の差は？', redFlag: false, createdAt: '2026-02-10',
    },
    {
      id: 'CASE-2026-002', userId: 'u2', doctorId: null, status: 'review',
      plan: 'premium', deadline: '2026-03-05',
      basic: { age: 42, gender: '女性', region: '大阪府', family: '夫、子供1人（5歳）' },
      condition: { diagnosis: '乳癌（トリプルネガティブ）ステージIIB', history: '2026年1月健診で右乳房に異常所見。精密検査で確定診断。', doctorExplanation: '術前化学療法後手術、または先行手術の2パターン。', options: '①術前化学療法→手術 ②先行手術→術後化学療法', uncertainties: '術前化学療法の奏効率が不明瞭' },
      values: { workImpact: '休職可能だがキャリアへの影響を懸念', qol: '育児への影響を最小限に', riskTolerance: 'エビデンス重視だがQOLバランスも' },
      questions: '術前化学療法の奏効率は？遺伝子検査は必要？', redFlag: true, createdAt: '2026-02-15',
    },
    {
      id: 'CASE-2026-003', userId: 'u1', doctorId: 'd2', status: 'creating',
      plan: 'light', deadline: '2026-03-10',
      basic: { age: 72, gender: '男性', region: '福岡県', family: '妻' },
      condition: { diagnosis: '大動脈弁狭窄症（重症）', history: '労作時息切れ増悪。心エコーで確定診断。', doctorExplanation: 'SAVRまたはTAVIを提案。', options: '①SAVR ②TAVI', uncertainties: '高齢のため手術リスク評価が必要' },
      values: { workImpact: '退職済。穏やかな日常希望', qol: '入院期間短い方を希望', riskTolerance: 'リスク低い方法を希望' },
      questions: 'TAVIの長期成績は？生体弁と機械弁の選択は？', redFlag: false, createdAt: '2026-02-18',
    },
  ];
  Store.documents = [
    { id: 'doc1', caseId: 'CASE-2026-001', name: '診療情報提供書.pdf', size: '2.4 MB', uploadedAt: '2026-02-10' },
    { id: 'doc2', caseId: 'CASE-2026-001', name: 'CT画像.jpg', size: '8.1 MB', uploadedAt: '2026-02-10' },
    { id: 'doc3', caseId: 'CASE-2026-002', name: '病理レポート.pdf', size: '1.8 MB', uploadedAt: '2026-02-15' },
  ];
  Store.deliverables = [{
    id: 'del1', caseId: 'CASE-2026-001', version: 1, createdAt: '2026-02-22',
    doctorComment: '判断パッケージを作成しました。',
    sections: {
      caseBrief: '【症例概要】58歳男性。肺腺癌ステージIIIA。右肺上葉に3cm大の腫瘤。自営業、呼吸機能温存最優先。',
      decisionMap: '■ 選択肢A：手術\n  5年生存率: 約40-50%　入院2-3週間\n■ 選択肢B：化学放射線療法\n  5年生存率: 約30-40%　外来治療可能',
      evidence: '・JCOG0905試験\n・INT 0139試験\n・PACIFIC試験',
      doctorPerspective: 'N2リンパ節転移が示唆されるが、単一ステーションであれば手術の適応あり。',
      questionList: '1. 縦隔鏡検査でN2評価は可能か？\n2. 術後の予測肺活量は？\n3. PACIFICレジメンは適応か？',
      facilityGuide: '呼吸器外科専門医常勤・年間手術100例以上の施設が望ましい。',
      familySummary: 'お父様の肺がんには手術と放射線療法の2つの選択肢があります。',
    },
  }];
  Store.messages = [
    { id: 'm1', caseId: 'CASE-2026-001', senderType: 'user', senderId: 'u1', body: '判断パッケージありがとうございました。術後の肺活量低下で登山は可能でしょうか？', attachmentUrl: null, createdAt: '2026-02-22 14:30' },
    { id: 'm2', caseId: 'CASE-2026-001', senderType: 'doctor', senderId: 'd1', body: '上葉切除後6ヶ月程度でリハビリを経れば、2000m程度の登山は多くの場合可能です。', attachmentUrl: null, createdAt: '2026-02-22 16:45' },
  ];
  Store.payments = [
    { id: 'pay1', caseId: 'CASE-2026-001', amount: 49800, status: 'succeeded', createdAt: '2026-02-10' },
    { id: 'pay2', caseId: 'CASE-2026-002', amount: 98000, status: 'succeeded', createdAt: '2026-02-15' },
  ];
}
