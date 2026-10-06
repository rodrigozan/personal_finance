const { esc } = require('./core');

const FONT = "Inter, 'Segoe UI', Arial, sans-serif";

const LOGOS = {
  itau: { nome: 'Itaú', bg: '#EC7000', corpo: () => `<text x="24" y="30" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="16" fill="#FFFFFF" letter-spacing="-0.5">itaú</text>` },
  nubank: { nome: 'Nubank', bg: '#820AD1', corpo: () => `<path d="M14.5 33V15l19 18V15" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` },
  bb: { nome: 'Banco do Brasil', bg: '#FAE128', corpo: () => `<text x="24" y="31" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="20" fill="#0B3C8F" letter-spacing="-0.5">BB</text>` },
  bradesco: { nome: 'Bradesco', bg: '#CC092F', corpo: () => `<path d="M17 12h8a6 6 0 0 1 0 12h-8zM17 24h9a6 6 0 0 1 0 12h-9z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>` },
  santander: { nome: 'Santander', bg: '#EC0000', corpo: () => `<path d="M30 15c-2-3-10-3-10 3 0 7 10 4 10 11 0 6-9 6-12 2" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>` },
  inter: { nome: 'Banco Inter', bg: '#FF7A00', corpo: () => `<text x="24" y="29" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="14" fill="#FFFFFF" letter-spacing="-0.3">inter</text>` },
  c6: { nome: 'C6 Bank', bg: '#1F1F1F', corpo: () => `<text x="24" y="31" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="20" fill="#FFFFFF" letter-spacing="-0.5">C6</text>` },
  xp: { nome: 'XP Investimentos', bg: '#111111', corpo: () => `<text x="24" y="31" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="21" fill="#FFD400" letter-spacing="-0.5">xp</text>` },
  caixa: { nome: 'Caixa', bg: '#005CA9', corpo: () => `<path d="M15 15l18 18M33 15 15 33" stroke="#F39200" stroke-width="5" stroke-linecap="round"/><path d="M24 12v24" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>` },
  mercadopago: { nome: 'Mercado Pago', bg: '#009EE3', corpo: () => `<text x="24" y="30" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="19" fill="#FFFFFF" letter-spacing="-0.5">mp</text>` },
  manual: { nome: 'Manual', bg: '#5A6B85', corpo: () => `<path d="M12 18h22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2zM14 18v-3a2 2 0 0 1 2-2h16" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linejoin="round"/><circle cx="30" cy="26" r="2" fill="#FFFFFF"/>` },
};

function logoInner(id) {
  const l = LOGOS[id];
  if (!l) throw new Error('logo ausente: ' + id);
  return `<rect width="48" height="48" rx="11" fill="${l.bg}"/>${l.corpo()}`;
}

function logo(id, x, y, size = 40) {
  const s = size / 48;
  return `<g transform="translate(${(+x).toFixed(2)} ${(+y).toFixed(2)}) scale(${s.toFixed(4)})">${logoInner(id)}</g>`;
}

function logoSvgArquivo(id) {
  const l = LOGOS[id];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${esc(l.nome)}">${logoInner(id)}</svg>\n`;
}

function googleG(x, y, size = 20) {
  const s = size / 24;
  return `<g transform="translate(${(+x).toFixed(2)} ${(+y).toFixed(2)}) scale(${s.toFixed(4)})"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.1z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z"/></g>`;
}

function googleSvgArquivo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="Google"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.1z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z"/></svg>\n`;
}

function logoMarca(x, y, size = 32) {
  const s = size / 32;
  return `<g transform="translate(${(+x).toFixed(2)} ${(+y).toFixed(2)}) scale(${s.toFixed(4)})"><rect width="32" height="32" rx="8" fill="#5B21B6"/><rect x="8" y="17" width="4" height="8" rx="1.5" fill="#FFFFFF"/><rect x="14" y="12" width="4" height="13" rx="1.5" fill="#FFFFFF"/><rect x="20" y="7" width="4" height="18" rx="1.5" fill="#FFFFFF"/></g>`;
}

module.exports = { LOGOS, logo, logoSvgArquivo, googleG, googleSvgArquivo, logoMarca };
