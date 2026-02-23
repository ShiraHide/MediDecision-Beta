/* MediDecision SPA Router & App Shell */
const App = {
    currentScreen: null,
    init() {
        initMockData();
        Store.currentUser = Store.users[0];
        this.bindRoleSwitcher();
        this.bindNavLinks();
        window.addEventListener('hashchange', () => this.route());
        this.route();
    },
    route() {
        const hash = location.hash.slice(1) || 'landing';
        const [page, ...params] = hash.split('/');
        this.showScreen(page, params);
    },
    showScreen(name, params = []) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const el = document.getElementById('screen-' + name);
        if (el) { el.classList.add('active'); this.currentScreen = name; }
        this.updateNav();
        // Initialize page
        const inits = {
            landing: () => initLanding(),
            auth: () => initAuth(params[0]),
            plan: () => initPlan(),
            application: () => initApplication(),
            upload: () => initUpload(),
            confirm: () => initConfirm(),
            dashboard: () => initDashboard(params[0]),
            deliverable: () => initDeliverable(params[0]),
            messages: () => initMessages(params[0]),
            'admin-queue': () => initAdminQueue(),
            'admin-case': () => initAdminCase(params[0]),
            'admin-request': () => initAdminRequest(params[0]),
            'admin-editor': () => initAdminEditor(params[0]),
            'admin-compliance': () => initAdminCompliance(params[0]),
            'admin-delivery': () => initAdminDelivery(params[0]),
        };
        if (inits[name]) inits[name]();
        window.scrollTo({ top: 0, behavior: 'instant' });
    },
    updateNav() {
        const navbar = document.getElementById('main-navbar');
        const isAdmin = Store.currentRole !== 'user';
        const isLanding = this.currentScreen === 'landing';
        const isAuth = this.currentScreen === 'auth';
        if (isAuth) { navbar.classList.add('hidden'); return; }
        navbar.classList.remove('hidden');
        const links = document.getElementById('nav-links');
        const actions = document.getElementById('nav-actions');
        if (isLanding && Store.currentRole === 'user') {
            links.innerHTML = `<a href="#landing" onclick="scrollToSection('features')">特徴</a><a href="#landing" onclick="scrollToSection('deliverables')">成果物</a><a href="#landing" onclick="scrollToSection('pricing')">料金</a><a href="#landing" onclick="scrollToSection('faq')">FAQ</a>`;
            actions.innerHTML = `<a href="#auth/login" class="btn btn-ghost btn-sm">ログイン</a><a href="#auth/register" class="btn btn-primary btn-sm">無料会員登録</a>`;
        } else if (!isAdmin) {
            links.innerHTML = `<a href="#dashboard">マイケース</a><a href="#plan">新規申込</a>`;
            actions.innerHTML = `<div class="flex items-center gap-3"><span class="text-sm font-medium">${Store.currentUser?.name || ''}</span><div class="avatar avatar-sm">${Store.currentUser?.name?.[0] || 'U'}</div></div>`;
        } else {
            links.innerHTML = `<a href="#admin-queue">ケース一覧</a>`;
            actions.innerHTML = `<span class="badge badge-blue">${Store.currentRole === 'operator' ? '運営' : '医師'}</span><div class="flex items-center gap-2"><span class="text-sm">${Store.currentRole === 'doctor' ? '鈴木 一郎 先生' : '管理者'}</span></div>`;
        }
    },
    bindRoleSwitcher() {
        document.querySelectorAll('.role-switcher button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.role-switcher button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Store.currentRole = btn.dataset.role;
                if (Store.currentRole === 'user') location.hash = '#dashboard';
                else location.hash = '#admin-queue';
            });
        });
    },
    bindNavLinks() { }
};

/* Utility */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }
function html(el, content) { if (typeof el === 'string') el = $(el); if (el) el.innerHTML = content; }
function show(el) { if (typeof el === 'string') el = $(el); if (el) el.classList.remove('hidden'); }
function hide(el) { if (typeof el === 'string') el = $(el); if (el) el.classList.add('hidden'); }
function navigate(hash) { location.hash = hash; }
function formatPrice(n) { return '¥' + n.toLocaleString(); }
function scrollToSection(id) { setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }

const SVG = {
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>',
    chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    upload: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    file: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    clipboard: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
    brain: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z"/><path d="M9 21h6M10 17v4M14 17v4"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    sparkles: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>',
};

document.addEventListener('DOMContentLoaded', () => App.init());
