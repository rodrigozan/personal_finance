const sumArr = (a) => a.reduce((x, y) => x + y, 0);

const cat = {
  moradia: { id: 'moradia', nome: 'Moradia', icon: 'home', cor: 0 },
  alimentacao: { id: 'alimentacao', nome: 'Alimentação', icon: 'utensils', cor: 1 },
  transporte: { id: 'transporte', nome: 'Transporte', icon: 'car', cor: 2 },
  saude: { id: 'saude', nome: 'Saúde', icon: 'heart', cor: 3 },
  lazer: { id: 'lazer', nome: 'Lazer', icon: 'gamepad', cor: 4 },
  educacao: { id: 'educacao', nome: 'Educação', icon: 'grad', cor: 5 },
  assinaturas: { id: 'assinaturas', nome: 'Assinaturas', icon: 'play', cor: 6 },
  compras: { id: 'compras', nome: 'Compras', icon: 'bag', cor: 7 },
  outros: { id: 'outros', nome: 'Outros', icon: 'tag', cor: 11 },
  salario: { id: 'salario', nome: 'Salário', icon: 'briefcase', cor: 1 },
  freelance: { id: 'freelance', nome: 'Freelance', icon: 'briefcase', cor: 5 },
  interna: { id: 'interna', nome: 'Transferência interna', icon: 'swap', cor: 9 },
};

const gastosCat = [
  { c: cat.moradia, v: 2800.0, plan: 2800.0 },
  { c: cat.alimentacao, v: 1950.0, plan: 1800.0 },
  { c: cat.transporte, v: 842.6, plan: 900.0 },
  { c: cat.saude, v: 640.2, plan: 700.0 },
  { c: cat.lazer, v: 560.8, plan: 500.0 },
  { c: cat.educacao, v: 480.0, plan: 480.0 },
  { c: cat.assinaturas, v: 312.4, plan: 350.0 },
  { c: cat.compras, v: 689.4, plan: 600.0 },
  { c: cat.outros, v: 640.0, plan: 900.0 },
];

const despesas = sumArr(gastosCat.map((g) => g.v));
const receitas = 12400.0;
const resultado = receitas - despesas;
const planejadoTotal = sumArr(gastosCat.map((g) => g.plan));

const setembro = { receitas: 11250.0, despesas: 8377.4 };
setembro.resultado = setembro.receitas - setembro.despesas;

const fluxo = [
  { l: 'mai', a: 10900.0, b: 8210.0 },
  { l: 'jun', a: 11400.0, b: 9350.0 },
  { l: 'jul', a: 11250.0, b: 8870.0 },
  { l: 'ago', a: 11800.0, b: 9120.0 },
  { l: 'set', a: setembro.receitas, b: setembro.despesas },
  { l: 'out', a: receitas, b: despesas },
];

const contas = [
  { id: 'itau-cc', inst: 'itau', nome: 'Itaú Corrente (Principal)', tipo: 'Conta corrente', saldo: 12846.72, consolidado: true },
  { id: 'itau-pp', inst: 'itau', nome: 'Poupança Itaú', tipo: 'Poupança', saldo: 6150.0, consolidado: true },
  { id: 'nu-cc', inst: 'nubank', nome: 'NuConta', tipo: 'Conta de pagamento', saldo: 3185.9, consolidado: true },
  { id: 'inter-cc', inst: 'inter', nome: 'Inter Conta Digital', tipo: 'Conta corrente', saldo: 1742.15, consolidado: true, problema: true },
  { id: 'esp', inst: 'manual', nome: 'Dinheiro em espécie', tipo: 'Conta manual', saldo: 650.0, consolidado: false, manual: true },
];
const saldoTotal = sumArr(contas.filter((c) => c.consolidado).map((c) => c.saldo));

const cartoes = [
  {
    id: 'nubank',
    inst: 'nubank',
    nome: 'Nubank Ultravioleta',
    curto: 'Nubank',
    final: '4821',
    limite: 15000.0,
    fecha: 28,
    vence: 8,
    fechada: { valor: 2310.0, venc: '08/10/2026', dias: 3, periodo: '29/08 a 28/09' },
    aberta: { valor: 842.3, venc: '08/11/2026', fecha: '28/10/2026', periodo: '29/09 a 28/10', minimo: 126.35 },
    futuras: 2700.0,
    compras: [
      { d: '04/10', desc: 'Uber *Trip', cat: cat.transporte, v: 23.9 },
      { d: '03/10', desc: 'Netflix.com', cat: cat.assinaturas, v: 55.9 },
      { d: '02/10', desc: 'Restaurante Sabor da Terra', cat: cat.alimentacao, v: 96.5 },
      { d: '02/10', desc: 'Padaria Pão Quente', cat: cat.alimentacao, v: 31.2 },
      { d: '01/10', desc: 'Spotify', cat: cat.assinaturas, v: 21.9 },
      { d: '30/09', desc: 'iFood *Pizzaria Bella', cat: cat.alimentacao, v: 78.9 },
      { d: '30/09', desc: 'Livraria Cultura', cat: cat.lazer, v: 84.0 },
      { d: '29/09', desc: 'Magazine Luiza *Notebook', cat: cat.compras, v: 450.0, parcela: '4/10' },
    ],
  },
  {
    id: 'itau-mc',
    inst: 'itau',
    nome: 'Itaú Platinum Mastercard',
    curto: 'Itaú',
    final: '7305',
    limite: 12000.0,
    fecha: 1,
    vence: 10,
    fechada: { valor: 1874.52, venc: '10/10/2026', dias: 5, periodo: '02/09 a 01/10' },
    aberta: { valor: 318.88, venc: '10/11/2026', fecha: '01/11/2026', periodo: '02/10 a 01/11', minimo: 47.83 },
    futuras: 0,
    compras: [
      { d: '04/10', desc: 'Pão de Açúcar Supermercado', cat: cat.alimentacao, v: 187.43 },
      { d: '03/10', desc: 'Drogasil Farmácia', cat: cat.saude, v: 64.7 },
      { d: '02/10', desc: 'Cinemark Shopping', cat: cat.lazer, v: 66.75 },
    ],
  },
];
cartoes.forEach((c) => {
  c.usado = c.fechada.valor + c.aberta.valor + c.futuras;
  c.disponivel = c.limite - c.usado;
  c.pctUsado = c.usado / c.limite;
});
const faturasTotal = sumArr(cartoes.map((c) => c.fechada.valor + c.aberta.valor));

const inv = [
  { cls: 'Renda fixa', nome: 'Tesouro Selic 2029', inst: 'xp', instNome: 'XP Investimentos', aplicado: 18000.0, atual: 19846.32, venc: '01/03/2029' },
  { cls: 'Renda fixa', nome: 'Caixinha Reserva (CDB)', inst: 'nubank', instNome: 'Nubank', aplicado: 8000.0, atual: 8512.4, venc: null },
  { cls: 'Renda fixa', nome: 'LCI 2027 (95% do CDI)', inst: 'inter', instNome: 'Banco Inter', aplicado: 10000.0, atual: 10912.15, venc: '15/06/2027' },
  { cls: 'Renda variável', nome: 'ITUB4 (100 ações)', inst: 'xp', instNome: 'XP Investimentos', aplicado: 3400.0, atual: 3915.0, venc: null },
  { cls: 'Renda variável', nome: 'HGLG11 (30 cotas)', inst: 'xp', instNome: 'XP Investimentos', aplicado: 4800.0, atual: 4521.0, venc: null },
  { cls: 'Previdência', nome: 'PGBL Itaú Multimercado', inst: 'itau', instNome: 'Itaú', aplicado: 12000.0, atual: 13284.6, venc: null },
  { cls: 'Outros', nome: 'Reserva em dólar', inst: 'manual', instNome: 'Sem instituição', aplicado: 2500.0, atual: 2640.0, venc: null, manual: true },
];
const invAplicado = sumArr(inv.map((i) => i.aplicado));
const invAtual = sumArr(inv.map((i) => i.atual));
const invRent = invAtual - invAplicado;
const invClasses = ['Renda fixa', 'Renda variável', 'Previdência', 'Outros'].map((n) => {
  const it = inv.filter((i) => i.cls === n);
  return { nome: n, itens: it, aplicado: sumArr(it.map((i) => i.aplicado)), atual: sumArr(it.map((i) => i.atual)) };
});

const patrimonio = saldoTotal + invAtual - faturasTotal;
const patrimonioSerie = [
  { l: 'mai', v: 71240.18 },
  { l: 'jun', v: 73905.4 },
  { l: 'jul', v: 75120.75 },
  { l: 'ago', v: 77632.9 },
  { l: 'set', v: 79844.3 },
  { l: 'out', v: patrimonio },
];

const trx = [
  { d: '04/10/2026', desc: 'Pão de Açúcar Supermercado', cat: cat.alimentacao, conta: 'Itaú Mastercard •7305', v: -187.43, chips: ['pendente'] },
  { d: '04/10/2026', desc: 'Uber *Trip', cat: cat.transporte, conta: 'Nubank •4821', v: -23.9 },
  { d: '03/10/2026', desc: 'Netflix.com', cat: cat.assinaturas, conta: 'Nubank •4821', v: -55.9 },
  { d: '03/10/2026', desc: 'Drogasil Farmácia', cat: cat.saude, conta: 'Itaú Mastercard •7305', v: -64.7 },
  { d: '02/10/2026', desc: 'PIX Consultoria Beta Ltda', cat: cat.freelance, conta: 'Itaú Corrente', v: 1000.0 },
  { d: '02/10/2026', desc: 'Restaurante Sabor da Terra', cat: cat.alimentacao, conta: 'Nubank •4821', v: -96.5 },
  { d: '02/10/2026', desc: 'Cinemark Shopping', cat: cat.lazer, conta: 'Itaú Mastercard •7305', v: -66.75 },
  { d: '02/10/2026', desc: 'Padaria Pão Quente', cat: cat.alimentacao, conta: 'Nubank •4821', v: -31.2 },
  { d: '01/10/2026', desc: 'Transferência para Poupança Itaú', cat: cat.interna, conta: 'Itaú Corrente', v: -1000.0, chips: ['interna'] },
  { d: '01/10/2026', desc: 'Spotify', cat: cat.assinaturas, conta: 'Nubank •4821', v: -21.9 },
  { d: '01/10/2026', desc: 'Posto Shell BR-116', cat: cat.transporte, conta: 'Itaú Mastercard •7305', v: -212.3 },
  { d: '30/09/2026', desc: 'iFood *Pizzaria Bella', cat: cat.alimentacao, conta: 'Nubank •4821', v: -78.9 },
  { d: '30/09/2026', desc: 'Livraria Cultura', cat: cat.lazer, conta: 'Nubank •4821', v: -84.0 },
  { d: '30/09/2026', desc: 'Smart Fit Mensalidade', cat: cat.saude, conta: 'Itaú Corrente', v: -119.9 },
  { d: '29/09/2026', desc: 'Magazine Luiza *Notebook', cat: cat.compras, conta: 'Nubank •4821', v: -450.0, chips: ['parcela:4/10'] },
];

const conexoes = [
  { id: 'itau', inst: 'itau', nome: 'Itaú', status: 'ok', sync: '05/10/2026 14:22', rel: 'há 12 min', dados: ['Contas', 'Cartões', 'Transações', 'Investimentos'], consent: 'Consentimento válido até 12/03/2027' },
  { id: 'nubank', inst: 'nubank', nome: 'Nubank', status: 'ok', sync: '05/10/2026 14:22', rel: 'há 12 min', dados: ['Contas', 'Cartões', 'Transações', 'Investimentos'], consent: 'Consentimento válido até 28/02/2027' },
  { id: 'xp', inst: 'xp', nome: 'XP Investimentos', status: 'warning', sync: '05/10/2026 14:22', rel: 'há 12 min', dados: ['Investimentos'], consent: 'Consentimento expira em 14 dias (19/10/2026)', msg: 'Renove o consentimento para continuar sincronizando.' },
  { id: 'inter', inst: 'inter', nome: 'Banco Inter', status: 'error', sync: '03/10/2026 09:41', rel: 'há 2 dias', dados: ['Contas', 'Transações', 'Investimentos'], consent: 'Consentimento válido até 30/01/2027', msg: 'A autorização expirou. Reconecte para voltar a sincronizar.' },
];

const recorrencias = [
  { desc: 'Salário · Empresa Alfa Tecnologia', v: 9800.0, per: 'Mensal', prox: '05/11/2026', cat: cat.salario, origem: 'Detectada', receita: true },
  { desc: 'Aluguel · Imobiliária Central', v: -2100.0, per: 'Mensal', prox: '10/10/2026', cat: cat.moradia, origem: 'Manual' },
  { desc: 'Condomínio Edifício Aurora', v: -420.0, per: 'Mensal', prox: '10/10/2026', cat: cat.moradia, origem: 'Detectada' },
  { desc: 'Internet Vivo Fibra', v: -129.9, per: 'Mensal', prox: '12/10/2026', cat: cat.moradia, origem: 'Detectada' },
  { desc: 'Energia elétrica (estimada)', v: -150.1, per: 'Mensal', prox: '18/10/2026', cat: cat.moradia, origem: 'Manual' },
  { desc: 'Plano de saúde Unimed', v: -455.6, per: 'Mensal', prox: '20/10/2026', cat: cat.saude, origem: 'Detectada' },
  { desc: 'Smart Fit Mensalidade', v: -119.9, per: 'Mensal', prox: '30/10/2026', cat: cat.saude, origem: 'Detectada' },
  { desc: 'Curso de inglês', v: -480.0, per: 'Mensal', prox: '07/10/2026', cat: cat.educacao, origem: 'Manual' },
  { desc: 'Netflix', v: -55.9, per: 'Mensal', prox: '03/11/2026', cat: cat.assinaturas, origem: 'Detectada' },
  { desc: 'Spotify', v: -21.9, per: 'Mensal', prox: '01/11/2026', cat: cat.assinaturas, origem: 'Detectada' },
];
const recMensal = -sumArr(recorrencias.filter((r) => !r.receita).map((r) => r.v));
const recAnual = recMensal * 12;

const origemLabel = {};

module.exports = {
  cat,
  gastosCat,
  despesas,
  receitas,
  resultado,
  planejadoTotal,
  setembro,
  fluxo,
  contas,
  saldoTotal,
  cartoes,
  faturasTotal,
  inv,
  invAplicado,
  invAtual,
  invRent,
  invClasses,
  patrimonio,
  patrimonioSerie,
  trx,
  conexoes,
  recorrencias,
  recMensal,
  recAnual,
};
