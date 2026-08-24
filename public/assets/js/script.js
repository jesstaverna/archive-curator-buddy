// IPMCONT — small enhancements
(function () {
  // Header scrolled state
  var header = document.querySelector('.site-header');
  function onScroll(){
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    var bt = document.querySelector('.back-top');
    if (bt) bt.classList.toggle('is-visible', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Mobile menu toggle
  var btn = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  // Back to top
  var bt = document.querySelector('.back-top');
  if (bt) bt.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  // Contact form — envia por e-mail (sem backend)
  document.querySelectorAll('form[data-static]').forEach(function(f){
    var status = f.querySelector('.cf-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'cf-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.hidden = true;
      f.appendChild(status);
    }

    f.addEventListener('submit', function(e){
      e.preventDefault();

      if (!f.checkValidity()) {
        f.reportValidity();
        status.hidden = false;
        status.textContent = 'Preencha nome e e-mail válidos para enviar sua mensagem.';
        return;
      }

      var data = new FormData(f);
      var to = f.getAttribute('data-mailto') || 'presidente@ipmcont.com.br';
      var subject = (data.get('assunto') || 'Contato pelo site IPMCONT').toString();
      var body = [
        'Nome: ' + (data.get('nome') || ''),
        'E-mail: ' + (data.get('email') || ''),
        'Telefone/WhatsApp: ' + (data.get('telefone') || ''),
        '',
        'Mensagem:',
        (data.get('mensagem') || '')
      ].join('\n');

      var href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      status.hidden = false;
      status.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. Confirme o envio para ' + to + '.';
    });
  });
})();

/* ---------- Associates carousel arrows ---------- */
(function(){
  var carousel = document.getElementById('assoc-carousel');
  if(!carousel) return;
  document.querySelectorAll('.ca-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var dir = parseInt(btn.getAttribute('data-dir')||'1',10);
      var step = carousel.querySelector('.member');
      var styles = window.getComputedStyle(carousel);
      var gap = parseFloat(styles.columnGap || styles.gap || '12') || 12;
      var w = step ? step.getBoundingClientRect().width + gap : 320;
      carousel.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
    });
  });
})();

/* ---------- Blog: tab filter + search ---------- */
(function(){
  var tabs = document.querySelectorAll('.blog-tab');
  var search = document.getElementById('blog-search');
  var cards = document.querySelectorAll('.article-card[data-category]');
  if(!tabs.length || !cards.length) return;
  var activeCat = 'all', q = '';
  function apply(){
    cards.forEach(function(c){
      var cat = c.getAttribute('data-category');
      var txt = (c.textContent||'').toLowerCase();
      var matchCat = activeCat === 'all' || cat === activeCat;
      var matchQ = !q || txt.indexOf(q) !== -1;
      c.style.display = (matchCat && matchQ) ? '' : 'none';
    });
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){ x.classList.remove('is-active'); });
      t.classList.add('is-active');
      activeCat = t.getAttribute('data-cat') || 'all';
      apply();
    });
  });
  if(search){
    search.addEventListener('input', function(e){
      q = (e.target.value||'').toLowerCase().trim();
      apply();
    });
  }
})();

/* Premium subtle animations: scroll reveal + scroll-to-top */
(function(){
  if (typeof window === 'undefined') return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-tag common blocks for reveal
  var selectors = 'section, .card, .benefit-card, .initiative-card, .value-card, .mv-card, .associada-card, .article-card, .event-card, .contact-card, .tl-card, .role-card, .stat-card, h1, h2, h3, .eyebrow';
  document.querySelectorAll(selectors).forEach(function(el){
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  if (reduce || !('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');});
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  }

  // Scroll-to-top button
  var btn = document.getElementById('to-top');
  if (!btn){
    btn = document.createElement('button');
    btn.id = 'to-top';
    btn.setAttribute('aria-label','Voltar ao topo');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    document.body.appendChild(btn);
  }
  btn.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });
  var onScroll = function(){
    if (window.scrollY > 480) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id && id.length > 1){
        var t = document.querySelector(id);
        if (t){ e.preventDefault(); t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'}); }
      }
    });
  });
})();
