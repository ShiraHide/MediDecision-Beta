/* Admin Editor - Tabbed Package Editor */
let editorActiveTab = 'caseBrief';
const editorTabs = [
    { key: 'caseBrief', label: 'Case Brief' },
    { key: 'decisionMap', label: 'Decision Map' },
    { key: 'evidence', label: 'Evidence Summary' },
    { key: 'doctorPerspective', label: '医師の見解' },
    { key: 'questionList', label: '質問リスト' },
    { key: 'facilityGuide', label: '施設・専門医の選び方' },
    { key: 'familySummary', label: '家族説明サマリー' },
];
const defaultDrafts = {
    caseBrief: '【AIが生成した下書き】\nここにAIが生成したCase Briefの下書きが表示されます。\n医師が内容を確認・編集してください。',
    decisionMap: '【AIが生成した下書き】\n■ 選択肢A：\n  - メリット：\n  - デメリット：\n  - エビデンス：\n\n■ 選択肢B：\n  - メリット：\n  - デメリット：\n  - エビデンス：',
    evidence: '【AIが生成した下書き】\n関連するエビデンス・臨床試験を記載してください。',
    doctorPerspective: '※診断・断定的な治療推奨・特定病院への誘導は行わないでください。',
    questionList: '【主治医への質問リスト】\n1. \n2. \n3. ',
    facilityGuide: '※特定の医療機関名は記載せず、選び方のポイントを記載してください。',
    familySummary: '【ご家族への説明用サマリー】\n平易な言葉で、患者のご家族が理解できる内容を記載してください。',
};

function initAdminEditor(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    const del = Store.getDeliverableByCaseId(c.id);
    editorActiveTab = 'caseBrief';

    html('#admin-editor-content', `
    <div class="editor-header">
      <div class="flex items-center gap-4">
        <a href="#admin-case/${c.id}" class="btn btn-ghost btn-sm">← 戻る</a>
        <div><h2 class="text-lg font-bold">判断パッケージ編集</h2><span class="text-xs text-secondary">${c.id}</span></div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" onclick="alert('下書き保存しました')">下書き保存</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('#admin-compliance/${c.id}')">コンプラチェックへ →</button>
      </div>
    </div>
    <div class="tabs" id="editor-tabs">
      ${editorTabs.map(t => `<button class="tab-item ${t.key === editorActiveTab ? 'active' : ''}" onclick="switchEditorTab('${t.key}')">${t.label}</button>`).join('')}
    </div>
    <div class="editor-content" id="editor-body">
      ${editorTabs.map(t => `
        <div class="tab-panel ${t.key === editorActiveTab ? 'active' : ''}" id="editor-panel-${t.key}">
          <div class="flex-between mb-3">
            <h3 class="font-semibold">${t.label}</h3>
            <span class="ai-draft-badge">${SVG.sparkles} AI下書きあり</span>
          </div>
          <textarea class="editor-textarea" id="editor-${t.key}">${del?.sections?.[t.key] || defaultDrafts[t.key]}</textarea>
        </div>
      `).join('')}
    </div>
  `);
}
function switchEditorTab(key) {
    editorActiveTab = key;
    $$('#editor-tabs .tab-item').forEach(t => t.classList.toggle('active', t.textContent === editorTabs.find(et => et.key === key)?.label));
    $$('[id^="editor-panel-"]').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const panel = $(`#editor-panel-${key}`);
    if (panel) { panel.classList.add('active'); panel.style.display = 'block'; }
}

/* Compliance Check */
const complianceItems = [
    '断定的な診断（「〜です」「〜に間違いありません」）を含んでいないこと',
    '特定の治療法を明確に推奨する表現がないこと',
    '特定の医療機関名・医師名への誘導がないこと',
    '緊急性の判断や救急対応の指示を含んでいないこと',
    '処方や投薬に関する具体的な指示がないこと',
    '患者の価値観・希望を適切に反映した内容であること',
    'エビデンスの出典が明記されていること',
    '平易で理解しやすい表現が使われていること（家族向けサマリー）',
];
function initAdminCompliance(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    html('#admin-compliance-content', `
    <a href="#admin-editor/${c.id}" class="text-sm text-blue flex items-center gap-1 mb-4">← 編集画面に戻る</a>
    <h1 class="text-2xl font-bold mb-2">コンプライアンスチェック</h1>
    <p class="text-sm text-secondary mb-6">納品前に、以下の各項目をすべて確認してください。</p>
    <div class="alert alert-warning mb-6">${SVG.warning}<div>すべてのチェック項目を確認するまで、「承認して納品準備」ボタンは有効になりません。</div></div>
    <div class="card"><div class="card-body">
      <div class="compliance-list" id="compliance-list">
        ${complianceItems.map((item, i) => `
          <div class="compliance-item" id="comp-item-${i}">
            <input type="checkbox" id="comp-${i}" onchange="updateCompliance()">
            <label for="comp-${i}">${item}</label>
          </div>`).join('')}
      </div>
    </div></div>
    <div class="flex gap-3 justify-end mt-6">
      <a href="#admin-editor/${c.id}" class="btn btn-ghost">戻る</a>
      <button class="btn btn-success btn-lg" id="approve-btn" disabled onclick="navigate('#admin-delivery/${c.id}')">
        ${SVG.check} 承認して納品準備
      </button>
    </div>
  `);
}
function updateCompliance() {
    const checks = $$('.compliance-item input[type="checkbox"]');
    const all = checks.every(c => c.checked);
    checks.forEach((c, i) => {
        $(`#comp-item-${i}`).classList.toggle('checked', c.checked);
    });
    const btn = $('#approve-btn');
    if (btn) btn.disabled = !all;
}

/* Delivery Preview */
function initAdminDelivery(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    const user = Store.getUserById(c.userId);
    html('#admin-delivery-content', `
    <a href="#admin-compliance/${c.id}" class="text-sm text-blue flex items-center gap-1 mb-4">← コンプラチェックに戻る</a>
    <h1 class="text-2xl font-bold mb-2">納品プレビュー</h1>
    <p class="text-sm text-secondary mb-6">PDFの内容を最終確認し、納品してください。</p>
    <div class="card mb-6">
      <div class="pdf-preview">
        <div class="pdf-preview-content">
          ${SVG.file}
          <h3 class="text-lg font-semibold mb-2">判断パッケージ PDF</h3>
          <p class="text-sm text-secondary">${c.id}_judgment_package_v1.pdf</p>
          <p class="text-xs text-tertiary mt-1">全12ページ</p>
        </div>
      </div>
    </div>
    <div class="card mb-6"><div class="card-body">
      <h3 class="font-semibold mb-3">納品情報</h3>
      <div class="info-row"><span class="info-label">送付先</span><span class="info-value">${user?.name}（${user?.email}）</span></div>
      <div class="info-row"><span class="info-label">ケースID</span><span class="info-value">${c.id}</span></div>
      <div class="info-row"><span class="info-label">プラン</span><span class="info-value">${Store.planLabels[c.plan]}</span></div>
      <div class="info-row"><span class="info-label">フォロー期間</span><span class="info-value">2週間</span></div>
    </div></div>
    <div class="delivery-actions">
      <a href="#admin-compliance/${c.id}" class="btn btn-ghost">戻る</a>
      <button class="btn btn-success btn-lg" onclick="deliver('${c.id}')">
        ${SVG.check} 納品する
      </button>
    </div>
  `);
}
function deliver(caseId) {
    Store.updateCaseStatus(caseId, 'follow_up');
    alert('納品が完了しました。ユーザーにメール通知を送信しました。');
    navigate('#admin-queue');
}
