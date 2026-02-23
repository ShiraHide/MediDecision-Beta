/* Admin Queue */
function initAdminQueue() {
    const cases = Store.cases;
    html('#admin-queue-content', `
    <div class="admin-header"><h1>ケース一覧</h1><span class="badge badge-gray">${cases.length}件</span></div>
    <div class="filter-bar">
      <select class="form-select" onchange="filterQueue(this.value)" id="filter-status">
        <option value="">すべてのステータス</option>
        ${Object.entries(Store.statusLabels).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
      </select>
      <select class="form-select" id="filter-plan">
        <option value="">すべてのプラン</option>
        ${Object.entries(Store.planLabels).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
      </select>
      <input class="form-input" placeholder="ケースIDまたは患者名で検索..." id="filter-search">
    </div>
    <div class="card"><table class="data-table" id="queue-table">
      <thead><tr><th>ケースID</th><th>患者</th><th>診断名</th><th>ステータス</th><th>プラン</th><th>納期</th><th>フラグ</th><th>担当医</th></tr></thead>
      <tbody>${cases.map(c => {
        const user = Store.getUserById(c.userId);
        const doctor = c.doctorId ? Store.getDoctorById(c.doctorId) : null;
        const deadlineClass = new Date(c.deadline) < new Date('2026-03-01') ? 'urgent' : '';
        return `<tr onclick="navigate('#admin-case/${c.id}')">
          <td><span class="case-row-id">${c.id}</span></td>
          <td class="case-row-name">${user?.name || '—'}</td>
          <td class="text-sm">${c.condition.diagnosis}</td>
          <td><span class="badge ${getBadgeClass(c.status)} badge-dot">${Store.statusLabels[c.status]}</span></td>
          <td><span class="badge badge-gray">${Store.planLabels[c.plan]}</span></td>
          <td class="case-row-deadline ${deadlineClass}">${c.deadline}</td>
          <td>${c.redFlag ? '<span class="badge badge-red">Red Flag</span>' : '<span class="text-tertiary text-xs">—</span>'}</td>
          <td class="text-sm">${doctor ? doctor.name : '<span class="text-warning font-semibold">未アサイン</span>'}</td>
        </tr>`;
    }).join('')}</tbody>
    </table></div>
  `);
}
function getBadgeClass(status) {
    const map = { received: 'badge-gray', review: 'badge-yellow', creating: 'badge-blue', preparing: 'badge-teal', delivered: 'badge-green', follow_up: 'badge-green', closed: 'badge-gray' };
    return map[status] || 'badge-gray';
}

/* Admin Case Detail */
function initAdminCase(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    const user = Store.getUserById(c.userId);
    const doctor = c.doctorId ? Store.getDoctorById(c.doctorId) : null;
    const docs = Store.getDocsByCaseId(c.id);

    html('#admin-case-content', `
    <div class="admin-header"><div>
      <a href="#admin-queue" class="text-sm text-blue flex items-center gap-1 mb-2">← ケース一覧に戻る</a>
      <h1>${c.id}</h1>
    </div><div class="flex gap-2">
      <span class="badge ${getBadgeClass(c.status)} badge-dot">${Store.statusLabels[c.status]}</span>
      ${c.redFlag ? '<span class="badge badge-red">Red Flag</span>' : ''}
    </div></div>
    <div class="case-detail-grid">
      <div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">患者情報</h3></div><div class="card-body">
          <div class="info-section"><h3>基本情報</h3>
            <div class="info-row"><span class="info-label">氏名</span><span class="info-value">${user?.name}</span></div>
            <div class="info-row"><span class="info-label">年齢</span><span class="info-value">${c.basic.age}歳</span></div>
            <div class="info-row"><span class="info-label">性別</span><span class="info-value">${c.basic.gender}</span></div>
            <div class="info-row"><span class="info-label">居住地</span><span class="info-value">${c.basic.region}</span></div>
            <div class="info-row"><span class="info-label">家族構成</span><span class="info-value">${c.basic.family}</span></div>
          </div>
          <div class="info-section"><h3>病状</h3>
            <div class="info-row"><span class="info-label">診断名</span><span class="info-value">${c.condition.diagnosis}</span></div>
            <div class="info-row"><span class="info-label">経緯</span><span class="info-value">${c.condition.history}</span></div>
            <div class="info-row"><span class="info-label">主治医の説明</span><span class="info-value">${c.condition.doctorExplanation}</span></div>
            <div class="info-row"><span class="info-label">治療選択肢</span><span class="info-value">${c.condition.options}</span></div>
            <div class="info-row"><span class="info-label">未確定事項</span><span class="info-value">${c.condition.uncertainties}</span></div>
          </div>
          <div class="info-section"><h3>価値観</h3>
            <div class="info-row"><span class="info-label">仕事への影響</span><span class="info-value">${c.values.workImpact}</span></div>
            <div class="info-row"><span class="info-label">QOL重要点</span><span class="info-value">${c.values.qol}</span></div>
            <div class="info-row"><span class="info-label">リスク許容度</span><span class="info-value">${c.values.riskTolerance}</span></div>
          </div>
          <div class="info-section"><h3>質問事項</h3><p class="text-sm" style="white-space:pre-wrap">${c.questions}</p></div>
        </div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">アップロード資料</h3></div><div class="card-body">
          ${docs.length ? docs.map(d => `<div class="file-item"><div class="file-item-info"><span class="file-item-icon">${SVG.file}</span><div><div class="file-item-name">${d.name}</div><div class="file-item-size">${d.size}</div></div></div></div>`).join('') : '<p class="text-sm text-tertiary">資料なし</p>'}
        </div></div>
      </div>
      <div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">アクション</h3></div><div class="card-body flex-col gap-3">
          <button class="btn btn-secondary btn-full" onclick="navigate('#admin-request/${c.id}')">不足情報を依頼する</button>
          ${!c.doctorId ? `<button class="btn btn-primary btn-full" onclick="showAssignModal('${c.id}')">医師をアサインする</button>` : `<div class="text-sm text-center text-secondary">担当: ${doctor.name} 先生</div>`}
          <hr style="border:none;border-top:1px solid var(--border-color)">
          ${Store.currentRole === 'doctor' || c.doctorId ? `
            <button class="btn btn-secondary btn-full" style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);color:#4338ca;border-color:#c7d2fe" onclick="alert('AI下書きを生成中...')">${SVG.sparkles} AI下書き生成</button>
            <button class="btn btn-primary btn-full" onclick="navigate('#admin-editor/${c.id}')">編集を開始する</button>
          ` : ''}
        </div></div>
        <div class="card"><div class="card-header"><h3 class="font-semibold">ケース情報</h3></div><div class="card-body">
          <div class="info-row"><span class="info-label">プラン</span><span class="info-value">${Store.planLabels[c.plan]}</span></div>
          <div class="info-row"><span class="info-label">納期</span><span class="info-value">${c.deadline}</span></div>
          <div class="info-row"><span class="info-label">申込日</span><span class="info-value">${c.createdAt}</span></div>
        </div></div>
      </div>
    </div>
  `);
}
function showAssignModal(caseId) {
    const overlay = $('#assign-modal');
    if (!overlay) return;
    html('#assign-doctor-list', Store.doctors.filter(d => d.available).map(d => `
    <div class="checklist-item" onclick="assignDoctor('${caseId}','${d.id}')">
      <div class="avatar avatar-sm">${d.avatar}</div>
      <div><div class="font-semibold text-sm">${d.name}</div><div class="text-xs text-secondary">${d.specialty}</div></div>
    </div>`).join(''));
    overlay.classList.add('active');
}
function assignDoctor(caseId, doctorId) {
    Store.assignDoctor(caseId, doctorId);
    $('#assign-modal')?.classList.remove('active');
    initAdminCase(caseId);
}

/* Admin Request Missing Info */
function initAdminRequest(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    html('#admin-request-content', `
    <a href="#admin-case/${c.id}" class="text-sm text-blue flex items-center gap-1 mb-4">← ケース詳細に戻る</a>
    <h1 class="text-2xl font-bold mb-6">不足情報の依頼</h1>
    <div class="card"><div class="card-body">
      <div class="form-group"><label class="form-label">テンプレート選択</label>
        <select class="form-select" onchange="applyTemplate(this.value)">
          <option value="">テンプレートを選択...</option>
          <option value="1">検査結果の追加提出</option>
          <option value="2">紹介状（診療情報提供書）の提出</option>
          <option value="3">治療経過の補足情報</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">依頼内容<span class="required">*</span></label>
        <textarea class="form-textarea" rows="8" id="request-body" placeholder="ユーザーに依頼する内容を入力してください..."></textarea>
      </div>
      <div class="flex gap-3 justify-end">
        <a href="#admin-case/${c.id}" class="btn btn-ghost">キャンセル</a>
        <button class="btn btn-primary" onclick="sendRequest('${c.id}')">依頼を送信する</button>
      </div>
    </div></div>
  `);
}
function applyTemplate(val) {
    const templates = {
        '1': '以下の検査結果について、追加でご提出をお願いいたします。\n\n・\n・\n\n※個人情報（住所・電話番号等）が写り込まないようご注意ください。',
        '2': '主治医からの紹介状（診療情報提供書）のご提出をお願いいたします。',
        '3': 'これまでの治療経過について、以下の点を補足いただけますでしょうか。\n\n・治療開始時期\n・使用した薬剤名\n・副作用の有無',
    };
    if (templates[val]) $('#request-body').value = templates[val];
}
function sendRequest(caseId) {
    alert('不足情報の依頼を送信しました');
    navigate('#admin-case/' + caseId);
}
