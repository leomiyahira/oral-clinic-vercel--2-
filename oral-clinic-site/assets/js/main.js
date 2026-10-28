/* Oral Clinic — comportamento do site (JavaScript simples, sem bibliotecas). */
(function () {
  'use strict';
  var cfg = window.ORAL_CONFIG || {};
  var digits = function (v) { return String(v || '').replace(/\D/g, ''); };
  // Número para ligar: acrescenta +55 só se o código do país ainda não estiver no número
  var telHref = function (v) { var d = digits(v); if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2); return 'tel:+55' + d; };

  /* 1. Preenche os dados da clínica a partir do config.js */
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-cfg')];
    if (v) el.textContent = v;
    var kind = el.getAttribute('data-cfg-href');
    if (kind && v) {
      el.setAttribute('href', kind === 'tel' ? telHref(v) : 'mailto:' + v);
    }
  });
  var wa = digits(cfg.whatsapp);
  var hasTel = digits(cfg.telefone).length >= 10;
  var waUrl = wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Olá! Gostaria de agendar uma consulta na Oral Clinic.') : '';
  var ig = String(cfg.instagram || '').trim();
  var igUrl = ig ? (/^https?:\/\//i.test(ig) ? ig : 'https://instagram.com/' + ig.replace(/^@/, '').replace(/\/$/, '')) : '';

  var nomeClinica = cfg.nome || 'Oral Clinic';

  // Botões "Agendar avaliação": abrem o WhatsApp direto; sem número, levam ao formulário
  var avalUrl = wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Olá! Gostaria de agendar uma avaliação na ' + nomeClinica + '.') : '';
  document.querySelectorAll('[data-wa-agendar]').forEach(function (a) {
    if (avalUrl) { a.setAttribute('href', avalUrl); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
  });

  // Mapa: monta o Google Maps a partir do endereço do config.js
  var loc = document.getElementById('localizacao');
  if (loc) {
    if (!cfg.endereco) { loc.hidden = true; }
    else {
      var consulta = encodeURIComponent(nomeClinica + ' ' + cfg.endereco);
      document.getElementById('mapa').src = 'https://www.google.com/maps?q=' + consulta + '&output=embed';
      document.getElementById('loc-abrir').href = 'https://www.google.com/maps/search/?api=1&query=' + consulta;
      document.getElementById('loc-rota').href = 'https://www.google.com/maps/dir/?api=1&destination=' + consulta;
    }
  }

  // Campos opcionais sem dado: esconde a linha
  document.querySelectorAll('[data-hide-empty]').forEach(function (el) {
    if (!cfg[el.getAttribute('data-hide-empty')]) el.hidden = true;
  });
  // Link "Como chegar" (Google Maps) a partir do endereço
  var maps = document.getElementById('ft-maps');
  if (maps && cfg.endereco) {
    maps.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(nomeClinica + ' ' + cfg.endereco);
    maps.hidden = false;
  }
  // WhatsApp: com número configurado abre a conversa; sem número, os botões viram "Ligar" (se houver telefone)
  ['fab-wa', 'bar-wa', 'ft-wa'].forEach(function (id) {
    var a = document.getElementById(id);
    if (!a) return;
    if (waUrl) { a.setAttribute('href', waUrl); return; }
    if (hasTel) {
      a.setAttribute('href', telHref(cfg.telefone)); a.removeAttribute('target');
      if (id === 'ft-wa') a.parentNode.hidden = true;
      else if (a.lastChild && a.lastChild.nodeType === 3) a.lastChild.textContent = 'Ligar';
    } else a.removeAttribute('target');
  });
  // Instagram: só aparece quando o perfil estiver configurado
  ['fab-ig', 'bar-ig', 'ft-ig'].forEach(function (id) {
    var a = document.getElementById(id);
    if (!a) return;
    if (igUrl) a.setAttribute('href', igUrl);
    else if (id === 'ft-ig') a.parentNode.hidden = true;
    else a.hidden = true;
  });
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* 2. Menu no celular */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Cabeçalho vira sólido ao rolar a página */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 3. Formulário: pede só nome e telefone e abre o WhatsApp com a mensagem pronta */
  var form = document.getElementById('form-agendamento');
  if (!form) return;
  var ok = document.getElementById('agendamento-ok');
  var f = { nome: document.getElementById('nome'), tel: document.getElementById('tel') };

  // Botões "Agendar" de cada serviço abrem o WhatsApp já falando do serviço
  document.querySelectorAll('[data-servico]').forEach(function (a) {
    if (!wa) return;
    var msgServico = 'Olá! Gostaria de agendar uma avaliação de ' + a.getAttribute('data-servico') + ' na ' + nomeClinica + '.';
    a.setAttribute('href', 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msgServico));
    a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
  });

  function erro(campo, msg) {
    document.getElementById('e-' + campo).textContent = msg || '';
    var input = f[campo];
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var grupo = input.closest('.fg');
    if (grupo) grupo.classList.toggle('bad', !!msg);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var er = {};
    var nome = f.nome.value.trim().replace(/\s+/g, ' ');
    if (nome.length < 3) er.nome = 'Informe seu nome completo.';
    if (digits(f.tel.value).length < 10) er.tel = 'Informe um telefone com DDD.';
    ['nome', 'tel'].forEach(function (c) { erro(c, er[c]); });
    var primeiro = Object.keys(er)[0];
    if (primeiro) { f[primeiro].focus(); return; }

    var primeiroNome = nome.split(' ')[0];
    var msg = 'Olá! Meu nome é ' + nome + ' e meu telefone é ' + f.tel.value.trim() +
      '. Gostaria de agendar uma avaliação na ' + nomeClinica + '.';
    var resumo = document.getElementById('resumo');
    var btn = document.getElementById('btn-wa'), aviso = document.getElementById('aviso-wa'), call = document.getElementById('btn-call');
    btn.hidden = true; aviso.hidden = true; call.hidden = true;

    if (wa) {
      var url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
      resumo.textContent = 'Tudo pronto, ' + primeiroNome + '!\nO WhatsApp vai abrir com a mensagem pronta. Se não abrir, toque em "Abrir o WhatsApp" e envie a mensagem à clínica.';
      btn.href = url; btn.textContent = 'Abrir o WhatsApp'; btn.hidden = false;
      window.open(url, '_blank', 'noopener');
    } else if (hasTel) {
      resumo.textContent = 'Obrigado, ' + primeiroNome + '!\nPara agendar a sua avaliação, ligue para a clínica.';
      call.href = telHref(cfg.telefone); call.textContent = 'Ligar para ' + cfg.telefone; call.hidden = false;
    } else {
      resumo.textContent = 'Obrigado, ' + primeiroNome + '!';
      aviso.hidden = false;
    }
    form.hidden = true; ok.hidden = false;
    ok.scrollIntoView({ block: 'nearest' });
  });

  document.getElementById('novo').addEventListener('click', function () {
    ok.hidden = true; form.hidden = false; form.reset(); f.nome.focus();
  });
})();
