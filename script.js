(function () {
  'use strict';

  // Ano do rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Borda da nav ao rolar
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Horário: destaca o dia de hoje e mostra "Aberto/Fechado agora" (fuso de São Paulo)
  var box = document.querySelector('.hours');
  if (box && window.Intl) {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
      var t = +p.hour + +p.minute / 60;
      var abre = dia === 0 ? null : (dia === 1 ? 16.5 : 13);
      var aberto = abre !== null && t >= abre && t < 22;
      var li = box.querySelector('li[data-d="' + dia + '"]');
      if (li) li.classList.add('hoje');
      var st = document.getElementById('status');
      st.textContent = aberto ? 'Aberto agora · fecha às 22:00' : 'Fechado agora';
      st.className = 'status ' + (aberto ? 'aberto' : 'fechado');
      st.hidden = false;
    } catch (e) {}
  }

  // Entrada ao rolar (fade + 12px). Sem IntersectionObserver, mostra tudo.
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
