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

  // Simple form (no backend)
  document.querySelectorAll('form[data-static]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Obrigado! Em uma implementação final, este envio seria processado pelo servidor.');
      f.reset();
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
      var w = step ? step.getBoundingClientRect().width + 24 : 320;
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
