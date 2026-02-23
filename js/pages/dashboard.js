/* Dashboard */
function initDashboard(caseId) {
    const cases = Store.currentUser ? Store.getCasesByUser(Store.currentUser.id) : Store.cases;
    if (!cases.length) { html('#dashboard-content', '<div class="empty-state"><h3>まだケースがありません</h3><p>新しい相談を始めるには「新規申込」からお進みください。</p><a href="#plan" class="btn btn-primary mt-4">新規申込</a></div>'); return; }
    const c = caseId ? Store.getCaseById(caseId) : cases[0];
    if (!c) return;
    const doctor = c.doctorId ? Store.getDoctorById(c.doctorId) : null;
    const del = Store.getDeliverableByCaseId(c.id);
    const statusIdx = Store.getStatusIndex(c.status);

    html('#dashboard-content', `
    ${cases.length > 1 ? `<div class="flex gap-2 mb-4">${cases.map(cs => `<button class="btn ${cs.id === c.id ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="navigate('#dashboard/${cs.id}')">${cs.id}</button>`).join('')}</div>` : ''}
    <div class="card mb-6"><div class="card-body">
      <div class="flex-between mb-4"><div>
        <div class="text-xs text-secondary">${c.id}</div>
        <h2 class="text-xl font-bold">${c.condition.diagnosis}</h2>
        <div class="flex gap-3 mt-2"><span class="badge badge-blue">${Store.planLabels[c.plan]}</span><span class="badge ${c.redFlag ? 'badge-red' : 'badge-green'}">${c.redFlag ? 'Red Flag' : '通常'}</span></div>
      </div><div class="text-right">
        <div class="text-xs text-secondary">納期目安</div>
        <div class="font-semibold">${c.deadline}</div>
        ${doctor ? `<div class="text-xs text-secondary mt-2">担当: ${doctor.name}</div>` : ''}
      </div></div>
      <div class="status-tracker">
        ${Store.statusOrder.map((s, i) => `
          <div class="status-step ${i < statusIdx ? 'done' : ''} ${i === statusIdx ? 'current' : ''}">
            <div class="status-step-dot"></div>
            <span class="status-step-label">${Store.statusLabels[s]}</span>
          </div>
          ${i < Store.statusOrder.length - 1 ? '<span class="status-step-arrow">→</span>' : ''}
        `).join('')}
      </div>
    </div></div>
    ${c.status === 'review' ? `<div class="alert alert-warning">${SVG.warning}<div><strong>不足情報の依頼があります</strong><p class="mt-1">運営から追加情報の提出を依頼されています。</p><button class="btn btn-secondary btn-sm mt-2">回答フォームへ</button></div></div>` : ''}
    ${del ? `<div class="card mb-6"><div class="card-header"><h3 class="font-semibold">納品物</h3><span class="badge badge-green badge-dot">納品済</span></div><div class="card-body"><p class="text-sm text-secondary mb-4">${del.doctorComment}</p><div class="flex gap-3"><a href="#deliverable/${c.id}" class="btn btn-primary">納品物を見る</a><a href="#messages/${c.id}" class="btn btn-secondary">質問する</a></div></div></div>` : ''}
    <div class="card"><div class="card-header"><h3 class="font-semibold">申込内容</h3></div><div class="card-body">
      <div class="info-section"><h3>基本情報</h3>
        <div class="info-row"><span class="info-label">年齢</span><span class="info-value">${c.basic.age}歳</span></div>
        <div class="info-row"><span class="info-label">性別</span><span class="info-value">${c.basic.gender}</span></div>
        <div class="info-row"><span class="info-label">居住地</span><span class="info-value">${c.basic.region}</span></div>
        <div class="info-row"><span class="info-label">家族構成</span><span class="info-value">${c.basic.family}</span></div>
      </div>
      <div class="info-section"><h3>病状</h3>
        <div class="info-row"><span class="info-label">診断名</span><span class="info-value">${c.condition.diagnosis}</span></div>
      </div>
    </div></div>
  `);
}

/* Deliverable */
function initDeliverable(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    const del = Store.getDeliverableByCaseId(c?.id);
    if (!c || !del) return;
    html('#deliverable-content', `
    <div class="flex-between mb-6"><div><h1 class="text-2xl font-bold">判断パッケージ</h1><p class="text-sm text-secondary">${c.id} — ${c.condition.diagnosis}</p></div>
      <div class="flex gap-3"><button class="btn btn-primary">${SVG.download} PDFダウンロード</button><a href="#messages/${c.id}" class="btn btn-secondary">質問する</a></div></div>
    <div class="grid gap-6" style="grid-template-columns:1fr 340px">
      <div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">Case Brief</h3></div><div class="card-body"><p class="text-sm" style="white-space:pre-wrap">${del.sections.caseBrief}</p></div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">Decision Map</h3></div><div class="card-body"><pre class="text-sm" style="white-space:pre-wrap;font-family:inherit">${del.sections.decisionMap}</pre></div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">根拠となるエビデンス</h3></div><div class="card-body"><pre class="text-sm" style="white-space:pre-wrap;font-family:inherit">${del.sections.evidence}</pre></div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">医師の見解</h3></div><div class="card-body"><p class="text-sm" style="white-space:pre-wrap">${del.sections.doctorPerspective}</p></div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">主治医への質問リスト</h3></div><div class="card-body"><pre class="text-sm" style="white-space:pre-wrap;font-family:inherit">${del.sections.questionList}</pre></div></div>
        <div class="card mb-4"><div class="card-header"><h3 class="font-semibold">ご家族への説明用サマリー</h3></div><div class="card-body"><p class="text-sm" style="white-space:pre-wrap">${del.sections.familySummary}</p></div></div>
      </div>
      <div>
        <div class="doctor-guide mb-4"><h3>${SVG.clipboard} 主治医への見せ方ガイド</h3>
          <ul><li>${SVG.check} パッケージは「主治医との対話の準備資料」としてお渡しください</li>
          <li>${SVG.check} Decision Mapの中で気になった点を主治医に質問してみましょう</li>
          <li>${SVG.check} 質問リストをそのまま診察時にお持ちいただけます</li>
          <li>${SVG.check} セカンドオピニオンの際にも参考資料として活用できます</li></ul>
        </div>
        <div class="card"><div class="card-header"><h3 class="font-semibold">施設・専門医の選び方</h3></div><div class="card-body"><p class="text-sm" style="white-space:pre-wrap">${del.sections.facilityGuide}</p></div></div>
      </div>
    </div>
  `);
}

/* Messages */
function initMessages(caseId) {
    const c = Store.getCaseById(caseId || 'CASE-2026-001');
    if (!c) return;
    const msgs = Store.getMessagesByCaseId(c.id);
    const doctor = c.doctorId ? Store.getDoctorById(c.doctorId) : null;
    const remaining = c.plan === 'premium' ? '無制限' : (c.plan === 'standard' ? Math.max(0, 5 - msgs.filter(m => m.senderType === 'user').length) : Math.max(0, 2 - msgs.filter(m => m.senderType === 'user').length));

    html('#messages-content', `
    <div class="messages-container">
      <div class="messages-header"><div class="flex items-center gap-3">
        ${doctor ? `<div class="avatar">${doctor.avatar}</div>` : ''}
        <div><div class="font-semibold text-sm">${doctor ? doctor.name + ' 先生' : '担当医師未定'}</div><div class="text-xs text-secondary">${c.id} — ${c.condition.diagnosis}</div></div>
      </div><div class="remaining-count">残り質問回数: ${remaining}回</div></div>
      <div class="messages-body" id="msg-body"><div class="message-thread">
        ${msgs.map(m => `
          <div class="message-bubble ${m.senderType === 'user' ? 'sent' : 'received'}">
            ${m.body}<div class="message-meta">${m.createdAt}</div>
          </div>`).join('')}
      </div></div>
      <div class="message-input-bar">
        <input type="text" placeholder="メッセージを入力..." id="msg-input" onkeypress="if(event.key==='Enter')sendMessage('${c.id}')">
        <button class="btn btn-primary btn-sm" onclick="sendMessage('${c.id}')">${SVG.send}</button>
      </div>
    </div>
  `);
    const body = $('#msg-body');
    if (body) body.scrollTop = body.scrollHeight;
}
function sendMessage(caseId) {
    const input = $('#msg-input');
    if (!input || !input.value.trim()) return;
    Store.addMessage(caseId, 'user', Store.currentUser?.id || 'u1', input.value.trim());
    initMessages(caseId);
}
