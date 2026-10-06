const H = require('../lib/h');
const { ic, btn, field, banner, dlg, esc } = H;
const { logoMarca } = require('../lib/shell');

const google = `<svg class="g-logo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.1z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z"/></svg>`;

function form(v) {
  const busy = v === 'loading';
  const err = v === 'error';
  const email = field('E-mail', { value: 'rafael.moreira@exemplo.com.br', type: 'email', icon: 'mail', ac: 'username', invalid: err, cls: busy ? 'is-disabled' : '' });
  const pass = field('Senha', { value: 'senhaficticia12', type: 'password', icon: 'lock', iconEnd: 'eye', ac: 'current-password', invalid: err });
  return `<form class="login-form" data-nav="02-dashboard.html" data-login novalidate${busy ? ' aria-busy="true"' : ''}>
<div class="login-brand">${logoMarca(40)}<span>Painel Financeiro</span></div>
<h2 class="login-title">Entrar</h2>
<p class="login-sub">Acesso restrito ao titular.</p>
${err ? banner('error', 'E-mail ou senha incorretos.') : ''}
<fieldset class="login-fields"${busy ? ' disabled' : ''}>${email}${pass}</fieldset>
<p class="login-forgot"><button type="button" class="link-btn" data-open="dlg-recuperar"${busy ? ' disabled' : ''}>Esqueci minha senha</button></p>
<button type="submit" class="c-button c-button--primary c-button--lg c-button--block"${busy ? ' disabled' : ''}>${busy ? '<span class="c-spinner" aria-hidden="true"></span><span>Entrando...</span>' : '<span>Entrar</span>'}</button>
<div class="login-or"><span>ou</span></div>
<a class="c-button c-button--google c-button--lg c-button--block" href="02-dashboard.html"${busy ? ' aria-disabled="true" tabindex="-1"' : ''}>${google}<span>Entrar com Google</span></a>
<p class="login-note">${ic('shieldCheck', 16)}<span>Somente leitura. Nenhuma credencial bancária é armazenada por este app.</span></p>
</form>`;
}

const dialogs =
  dlg('dlg-2fa', {
    title: 'Verificação em duas etapas',
    sub: 'Digite o código de 6 dígitos do aplicativo autenticador.',
    body: `<div class="otp" role="group" aria-label="Código de 6 dígitos">${[1, 2, 3, 4, 5, 6].map((n) => `<input class="otp__box" inputmode="numeric" maxlength="1" aria-label="Dígito ${n}" value="${n % 2 ? n + 2 : n}">`).join('')}</div><p class="muted small"><button type="button" class="link-btn">Usar código de recuperação</button></p>`,
    footer: `${btn('Voltar', { v: 'ghost', attrs: 'data-close' })}${btn('Verificar', { v: 'primary', href: '02-dashboard.html' })}`,
  }) +
  dlg('dlg-recuperar', {
    title: 'Recuperar senha',
    sub: 'Informe o e-mail do titular para receber o link.',
    body: `${field('E-mail', { value: '', type: 'email', icon: 'mail', placeholder: 'seu@email.com.br' })}${banner('info', 'Se esse e-mail estiver cadastrado, enviaremos um link de recuperação. Reenviar em 0:59.')}`,
    footer: `${btn('Voltar ao login', { v: 'ghost', attrs: 'data-close' })}${btn('Enviar link de recuperação', { v: 'primary', attrs: 'data-close data-toast="Link de recuperação enviado."' })}`,
  });

module.exports = {
  id: '01',
  slug: '01-login',
  titulo: 'Login',
  login: true,
  build: () => ({ views: { data: form('data'), loading: form('loading'), empty: form('data'), error: form('error') }, dialogs }),
};
