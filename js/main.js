(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded',function(){
    buildMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initActiveNav();
    initFadeIn();
    initTracking();
  });

  function buildMobileMenu(){
    var btn=document.getElementById('hamburger');
    var orig=document.getElementById('navMenu');
    if(!btn||!orig)return;
    var overlay=document.createElement('div');
    overlay.id='mmOverlay';
    overlay.setAttribute('aria-hidden','true');
    var style=document.createElement('style');
    style.textContent=[
      '#mmOverlay{display:none;position:fixed;inset:0;z-index:99999;background:rgba(6,15,28,.65);-webkit-tap-highlight-color:transparent;}',
      '#mmOverlay.open{display:block;}',
      '#mmPanel{position:absolute;top:0;right:0;bottom:0;width:min(320px,88vw);background:#0a1628;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);}',
      '#mmOverlay.open #mmPanel{transform:translateX(0);}',
      '#mmClose{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.08);}',
      '#mmClose span{font-family:"Playfair Display",serif;font-size:1rem;font-weight:700;color:#fff;}',
      '#mmClose button{width:40px;height:40px;border:none;background:rgba(255,255,255,.08);border-radius:50%;font-size:22px;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}',
      '#mmList{list-style:none;margin:0;padding:8px 0;flex:1;}',
      '#mmList li a{display:block;padding:14px 24px;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:600;color:rgba(255,255,255,.8);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.05);transition:all .15s;-webkit-tap-highlight-color:transparent;}',
      '#mmList li a:active,#mmList li a:hover{background:rgba(255,255,255,.06);color:#fff;}',
      '#mmList .mm-sub a{padding-left:40px;font-size:13px;font-weight:500;color:rgba(255,255,255,.55);}',
      '#mmCta{padding:20px 24px 36px;}',
      '#mmCta a{display:block;width:100%;padding:14px 20px;background:#c9a227;color:#111;text-align:center;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:9999px;-webkit-tap-highlight-color:transparent;}',
      '#mmCta a:active{background:#e8c547;}',
      '@media(max-width:768px){#navMenu{display:none!important;}#hamburger{display:flex!important;}}'
    ].join('');
    document.head.appendChild(style);
    var panel=document.createElement('div');
    panel.id='mmPanel';
    var cr=document.createElement('div');cr.id='mmClose';
    cr.innerHTML='<span>ChessWithRahul</span>';
    var cb=document.createElement('button');cb.type='button';cb.setAttribute('aria-label','Close');cb.innerHTML='&times;';
    cr.appendChild(cb);panel.appendChild(cr);
    var list=document.createElement('ul');list.id='mmList';
    orig.querySelectorAll('li.nav-item').forEach(function(item){
      if(item.classList.contains('nav-cta'))return;
      var lk=item.querySelector('a.nav-link');if(!lk)return;
      var li=document.createElement('li');
      var a=document.createElement('a');a.href=lk.getAttribute('href')||'#';
      a.textContent=lk.textContent.replace('▼','').trim();
      if(lk.classList.contains('active'))a.style.color='#c9a227';
      li.appendChild(a);list.appendChild(li);
      item.querySelectorAll('.dropdown-link').forEach(function(sub){
        var sli=document.createElement('li');sli.className='mm-sub';
        var sa=document.createElement('a');sa.href=sub.getAttribute('href')||'#';
        sa.textContent='↳ '+sub.textContent.trim();
        sli.appendChild(sa);list.appendChild(sli);
      });
    });
    panel.appendChild(list);
    var ctaBox=document.createElement('div');ctaBox.id='mmCta';
    var becomeA=document.createElement('a');
    becomeA.href='/become-a-trainer.html';
    becomeA.style.cssText='display:block;width:100%;padding:13px 20px;background:rgba(255,255,255,.08);color:#fff;text-align:center;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:9999px;margin-bottom:10px;';
    becomeA.textContent='🏫 Become a Trainer';
    ctaBox.appendChild(becomeA);
    var ctaA=document.createElement('a');
    ctaA.href='https://wa.me/918591028709?text=Hi%20ChessWithRahul%20Academy%2C%20I%20want%20to%20book%20a%20free%20trial%20session';
    ctaA.target='_blank';ctaA.rel='noopener noreferrer';ctaA.textContent='📱 Book Session';
    ctaBox.appendChild(ctaA);panel.appendChild(ctaBox);
    overlay.appendChild(panel);document.body.appendChild(overlay);
    function open(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');btn.setAttribute('aria-expanded','true');btn.classList.add('active');document.body.style.overflow='hidden';}
    function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');btn.classList.remove('active');document.body.style.overflow='';}
    var skip=false;
    btn.addEventListener('touchend',function(e){e.preventDefault();skip=true;overlay.classList.contains('open')?close():open();},{passive:false});
    btn.addEventListener('click',function(){if(skip){skip=false;return;}overlay.classList.contains('open')?close():open();});
    cb.addEventListener('touchend',function(e){e.preventDefault();close();},{passive:false});
    cb.addEventListener('click',close);
    overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    list.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
    ctaA.addEventListener('click',close);
  }

  function initStickyHeader(){
    var h=document.getElementById('header')||document.querySelector('.header');
    if(!h)return;
    var t=false;
    function u(){h.classList.toggle('scrolled',window.pageYOffset>20);t=false;}
    window.addEventListener('scroll',function(){if(!t){requestAnimationFrame(u);t=true;}},{passive:true});
    u();
  }

  function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(function(l){
      l.addEventListener('click',function(e){
        var id=this.getAttribute('href');if(id==='#')return;
        var el=document.querySelector(id);if(!el)return;
        e.preventDefault();
        window.scrollTo({top:el.getBoundingClientRect().top+window.pageYOffset-88,behavior:'smooth'});
      });
    });
  }

  function initActiveNav(){
    var path=window.location.pathname;
    document.querySelectorAll('.nav-link,.dropdown-link').forEach(function(l){
      var href=(l.getAttribute('href')||'').replace(/^https?:\/\/[^/]+/,'');
      if(href===path||(path==='/'&&href==='/')||(path!=='/'&&href.length>1&&path.startsWith(href)))
        l.classList.add('active');
    });
  }

  function initFadeIn(){
    if(!('IntersectionObserver'in window))return;
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
    },{threshold:.07});
    document.querySelectorAll('section').forEach(function(s){s.classList.add('fade-in');obs.observe(s);});
  }

  function initTracking(){
    document.querySelectorAll('a[href^="tel:"],a[href*="wa.me"]').forEach(function(l){
      l.addEventListener('click',function(){
        if(typeof gtag==='function')gtag('event',this.href.includes('tel:')?'phone_click':'whatsapp_click',{event_category:'Contact'});
      });
    });
  }
})();
