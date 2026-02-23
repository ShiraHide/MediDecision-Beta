/* Landing Page */
function initLanding() {
    $$('.faq-question').forEach(q => {
        q.onclick = () => q.closest('.faq-item').classList.toggle('open');
    });
}
/* Auth Page */
function initAuth(mode) {
    const isLogin = mode === 'login';
    const card = $('#auth-card');
    if (!card) return;
    html(card, `
    <div class="navbar-logo justify-center mb-6" style="justify-content:center">${SVG.shield}<span>MediDecision</span></div>
    <h2>${isLogin ? 'ログイン' : '会員登録'}</h2>
    <p class="subtitle">${isLogin ? 'アカウントにログインしてください' : '無料でアカウントを作成'}</p>
    ${!isLogin ? `<div class="form-group"><label class="form-label">お名前<span class="required">*</span></label><input class="form-input" placeholder="山田 太郎" id="reg-name"></div>` : ''}
    <div class="form-group"><label class="form-label">メールアドレス<span class="required">*</span></label><input class="form-input" type="email" placeholder="you@example.com" id="auth-email" value="tanaka@example.com"></div>
    <div class="form-group"><label class="form-label">パスワード<span class="required">*</span></label><input class="form-input" type="password" placeholder="8文字以上" id="auth-pass" value="demo"></div>
    ${!isLogin ? `
    <div class="form-group">
      <label class="form-checkbox"><input type="checkbox" id="agree-terms"><span class="text-sm">
        <a href="#" class="text-blue">利用規約</a>と<a href="#" class="text-blue">免責事項</a>に同意する<span class="required">*</span><br>
        <span class="text-xs text-tertiary">※本サービスは診断・治療行為ではなく、緊急対応は行いません</span>
      </span></label>
    </div>` : ''}
    <button class="btn btn-primary btn-full btn-lg" onclick="handleAuth('${mode}')">${isLogin ? 'ログイン' : '無料で始める'}</button>
    <div class="auth-footer">${isLogin ? 'アカウントをお持ちでない方は <a href="#auth/register">会員登録</a>' : 'すでにアカウントをお持ちの方は <a href="#auth/login">ログイン</a>'}</div>
  `);
}
function handleAuth(mode) {
    Store.currentUser = Store.users[0];
    navigate('#dashboard');
}
