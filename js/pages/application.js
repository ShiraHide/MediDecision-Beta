/* Plan Selection */
function initPlan() {
    $$('.plan-card').forEach(card => {
        card.onclick = () => {
            $$('.plan-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        };
    });
}
function selectPlan(plan) {
    Store.draft.plan = plan;
    navigate('#application');
}

/* Application Form - 4 Step Wizard */
let currentStep = 1;
function initApplication() {
    currentStep = 1;
    renderStep();
}
function renderStep() {
    // Update stepper
    $$('.stepper-step').forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i + 1 < currentStep) s.classList.add('done');
        if (i + 1 === currentStep) s.classList.add('active');
    });
    $$('.stepper-line').forEach((l, i) => {
        l.classList.toggle('done', i + 1 < currentStep);
    });
    // Show step content
    $$('.step-panel').forEach((p, i) => {
        p.classList.toggle('active', i + 1 === currentStep);
        p.style.display = i + 1 === currentStep ? 'block' : 'none';
    });
}
function nextStep() {
    saveStepData();
    if (currentStep < 4) { currentStep++; renderStep(); window.scrollTo({ top: 200, behavior: 'smooth' }); }
    else navigate('#upload');
}
function prevStep() {
    if (currentStep > 1) { currentStep--; renderStep(); }
}
function saveStepData() {
    const d = Store.draft;
    if (currentStep === 1) {
        d.basic.age = $('#f-age')?.value || '';
        d.basic.gender = $('#f-gender')?.value || '';
        d.basic.region = $('#f-region')?.value || '';
        d.basic.family = $('#f-family')?.value || '';
    } else if (currentStep === 2) {
        d.condition.diagnosis = $('#f-diagnosis')?.value || '';
        d.condition.history = $('#f-history')?.value || '';
        d.condition.doctorExplanation = $('#f-doctor-exp')?.value || '';
        d.condition.options = $('#f-options')?.value || '';
        d.condition.uncertainties = $('#f-uncertainties')?.value || '';
    } else if (currentStep === 3) {
        d.values.workImpact = $('#f-work')?.value || '';
        d.values.qol = $('#f-qol')?.value || '';
        d.values.riskTolerance = $('#f-risk')?.value || '';
    } else if (currentStep === 4) {
        d.questions = $('#f-questions')?.value || '';
    }
}

/* Upload */
function initUpload() {
    const zone = $('#upload-zone');
    const input = $('#file-input');
    if (!zone || !input) return;
    zone.onclick = () => input.click();
    zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('dragover'); };
    zone.ondragleave = () => zone.classList.remove('dragover');
    zone.ondrop = (e) => { e.preventDefault(); zone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); };
    input.onchange = () => handleFiles(input.files);
    renderFileList();
}
function handleFiles(files) {
    for (const f of files) {
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) continue;
        Store.draft.files.push({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB', type: f.type });
    }
    renderFileList();
}
function renderFileList() {
    const list = $('#file-list');
    if (!list) return;
    list.innerHTML = Store.draft.files.map((f, i) => `
    <div class="file-item">
      <div class="file-item-info"><span class="file-item-icon">${SVG.file}</span>
        <div><div class="file-item-name">${f.name}</div><div class="file-item-size">${f.size}</div></div>
      </div>
      <button class="file-item-remove" onclick="removeFile(${i})">${SVG.x}</button>
    </div>`).join('');
}
function removeFile(i) { Store.draft.files.splice(i, 1); renderFileList(); }

/* Confirm */
function initConfirm() {
    const d = Store.draft;
    const plan = d.plan || 'standard';
    html('#confirm-content', `
    <div class="confirm-section"><h4>選択プラン</h4>
      <div class="confirm-row"><span class="label">プラン</span><span class="value">${Store.planLabels[plan]}</span></div>
      <div class="confirm-row"><span class="label">料金</span><span class="value font-bold text-blue">${formatPrice(Store.planPrices[plan])}<span class="text-xs text-secondary">（税込）</span></span></div>
      <div class="confirm-row"><span class="label">納期目安</span><span class="value">${Store.planDeadlines[plan]}</span></div>
    </div>
    <div class="confirm-section"><h4>基本情報</h4>
      <div class="confirm-row"><span class="label">年齢</span><span class="value">${d.basic.age || '58'}歳</span></div>
      <div class="confirm-row"><span class="label">性別</span><span class="value">${d.basic.gender || '男性'}</span></div>
      <div class="confirm-row"><span class="label">居住地</span><span class="value">${d.basic.region || '東京都'}</span></div>
    </div>
    <div class="confirm-section"><h4>病状</h4>
      <div class="confirm-row"><span class="label">診断名</span><span class="value">${d.condition.diagnosis || '肺腺癌 ステージIIIA'}</span></div>
    </div>
    <div class="confirm-section"><h4>アップロード資料</h4>
      <div class="confirm-row"><span class="label">ファイル数</span><span class="value">${d.files.length || 2}件</span></div>
    </div>
  `);
}
function handlePayment() {
    // Simulate payment
    const overlay = $('#payment-modal');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
        navigate('#dashboard/CASE-2026-001');
    }, 2000);
}
