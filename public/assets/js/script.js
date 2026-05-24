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
