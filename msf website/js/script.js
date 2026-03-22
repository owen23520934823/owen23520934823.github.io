// Smooth scrolling, nav toggle, fade-in on scroll, and animated counters
document.addEventListener('DOMContentLoaded',function(){
  // Year in footer
  const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();

  // Nav toggle for small screens
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('main-menu');
  if(toggle && menu){
    toggle.addEventListener('click',()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('show');
    });
  }

  // Smooth scroll for links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close nav on small screens
        if(menu && menu.classList.contains('show')){menu.classList.remove('show');toggle.setAttribute('aria-expanded','false')}
      }
    });
  });

  // IntersectionObserver for fade-up elements
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));

  // Timeline animations
  const timelineObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry, index)=>{
      if(entry.isIntersecting){
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, index * 200); // Stagger the animations
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.timeline-item').forEach(item=>timelineObserver.observe(item));

  // Animated counters
  const counters = document.querySelectorAll('.stat-number');
  function animateCount(el, target){
    let start = 0; const duration = 1500; const startTime = performance.now();
    function step(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const val = Math.floor(progress * target);
      el.textContent = val + (val===0 && target!==0?'%':'%');
      if(progress < 1){requestAnimationFrame(step)} else {
        // ensure final value
        el.textContent = (target) + '%';
      }
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target; const t = parseInt(el.dataset.target,10) || 0; animateCount(el,t); obs.unobserve(el);
      }
    });
  },{threshold:0.4});
  counters.forEach(c=>counterObserver.observe(c));

  // CTA buttons
  const shareBtn = document.getElementById('share-campaign');
  if(shareBtn){
    shareBtn.addEventListener('click', async ()=>{
      const shareData = {title:document.title,text:'Join this campaign to support community-based healthcare for women in Afghanistan.',url:window.location.href};
      if(navigator.share){
        try{await navigator.share(shareData);}catch(e){alert('Unable to share: '+e.message)}
      } else {
        // fallback: copy url
        try{await navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard.');}catch(e){prompt('Copy this link to share:',window.location.href)}
      }
    });
  }

  const supportBtn = document.getElementById('support-awareness');
  if(supportBtn){
    supportBtn.addEventListener('click',()=>{
      window.location.hash = '#cta';
      alert('Thank you — please share the campaign and follow our updates to help raise awareness.');
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  const contactCopy = document.getElementById('contact-copy');
  if(contactCopy){
    contactCopy.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(window.location.href + '#contact'); contactFeedback.textContent = 'Contact link copied to clipboard.'; }
      catch(e){ contactFeedback.textContent = 'Copy failed. You can share: ' + (window.location.href + '#contact'); }
    });
  }
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){ contactFeedback.textContent = 'Please complete all fields.'; return; }
      // Simple client-side success action - in a real site you'd POST to an endpoint
      contactFeedback.textContent = 'Thanks, ' + (name.split(' ')[0] || '') + '! Your message has been noted.';
      contactForm.reset();
    });
  }
});