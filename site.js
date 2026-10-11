(function(){
var d=document,root=d.documentElement,paused=false;
var hv=d.getElementById('heroVid'),pay=d.querySelector('.payoff'),PAY=7.2;
function land(){pay.classList.add('on')}
hv.addEventListener('timeupdate',function(){if(hv.currentTime>=PAY)land()});
setTimeout(land,10000);
function tryPlay(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}
tryPlay(hv);
d.addEventListener('pointerdown',function(){if(!paused)tryPlay(hv)},{once:true});
// lazy play on screen
var lz=[].slice.call(d.querySelectorAll('video.lazyplay'));
var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting&&!paused){if(!v.src&&v.dataset.src){v.preload='auto';v.src=v.dataset.src}tryPlay(v)}else v.pause()})},{threshold:.15});
lz.forEach(function(v){io.observe(v)});
var hio=new IntersectionObserver(function(es){es.forEach(function(e){if(paused)return;e.isIntersecting?tryPlay(hv):hv.pause()})},{threshold:0});hio.observe(hv);
// reveals
var rvs=[].slice.call(d.querySelectorAll('.lede,.creed-body p,.proof-head>*,.proof-film,.stats li,.svc-head>*,.culture-type>*,.reel,.talk-type>*,.form,.foot>*'));
rvs.forEach(function(el){el.classList.add('rv')});
var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
rvs.forEach(function(el,i){el.style.transitionDelay=(el.parentNode.children.length>1?([].indexOf.call(el.parentNode.children,el)%4)*0.09:0)+'s';rio.observe(el)});
// count up
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,n=+el.dataset.count,pre=el.dataset.prefix||'',t0=null,D=1600;
 if(paused){return}
 function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D);k=1-Math.pow(1-k,4);el.textContent=pre+Math.round(n*k).toLocaleString('en-US');if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})},{threshold:.6});
d.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});
// failsafe: bottom shows all
window.addEventListener('scroll',function(){if(innerHeight+scrollY>=d.body.scrollHeight-40){rvs.forEach(function(el){el.classList.add('in')});land();if(window.__pulseAll)__pulseAll()}},{passive:true});

var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.1,wheelMultiplier:1,smoothWheel:true});}
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
 var mm=gsap.matchMedia();
 mm.add('(min-width:901px)',function(){
  // hero: words part, film steps forward
  var tl=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});
  tl.to('.hl .w1',{xPercent:-10,ease:'none'},0).to('.hl .w3',{xPercent:8,ease:'none'},0).fromTo('.hero-film video',{scale:1},{scale:1.08,ease:'none'},0);
 });
 // creed: words start apart, lock into the line
 var cws=gsap.utils.toArray('.cw');var small=matchMedia('(max-width:900px)').matches;
 var offs=[[-18,40],[22,-30],[-10,60],[16,-50]];
 if(small){gsap.fromTo(cws,{yPercent:40,opacity:0},{yPercent:0,opacity:1,stagger:.12,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.creed',start:'top 75%'}})}else gsap.fromTo(cws,{xPercent:function(i){return offs[i][0]},yPercent:function(i){return offs[i][1]},opacity:.15},{xPercent:0,yPercent:0,opacity:1,ease:'none',stagger:.05,scrollTrigger:{trigger:'.creed',start:'top 85%',end:'center 55%',scrub:.8}});

 // signature: the pulse draws with scroll, each beat lands a rep result
 var pl=d.querySelector('.pl'),bl=[].slice.call(d.querySelectorAll('.beats li')),L=pl.getTotalLength(),marks=[.2,.42,.62,.86];
 pl.style.strokeDasharray=L;pl.style.strokeDashoffset=L;
 function setP(p){pl.style.strokeDashoffset=L*(1-p);bl.forEach(function(li,i){li.classList.toggle('on',p>=marks[i])})}
 window.__pulseAll=function(){setP(1)};
 mm.add('(min-width:901px)',function(){ScrollTrigger.create({trigger:'.pulse',start:'top top',end:'+=140%',pin:'.pulse-pin',scrub:.5,onUpdate:function(s){if(!paused)setP(s.progress)},onLeave:function(){setP(1)}})});
 mm.add('(max-width:900px)',function(){ScrollTrigger.create({trigger:'.pulse-chart',start:'top 85%',end:'bottom 45%',scrub:.4,onUpdate:function(s){if(!paused)setP(s.progress)},onLeave:function(){setP(1)}})});
 // background + text colour blend between sections
 var bg=d.querySelector('.bg');
 d.querySelectorAll('[data-bg]').forEach(function(s){
  ScrollTrigger.create({trigger:s,start:'top 62%',end:'bottom 62%',onToggle:function(st){if(st.isActive){gsap.to(bg,{backgroundColor:s.dataset.bg,duration:1.1,ease:'power2.inOut',overwrite:true});gsap.to(d.body,{color:s.dataset.fg,duration:1.1,ease:'power2.inOut',overwrite:true});root.style.setProperty('--fg',s.dataset.fg);root.style.setProperty('--barbg',s.dataset.bg);d.body.classList.toggle('on-red',s.dataset.bg=='#cf2d20');d.body.classList.toggle('on-paper',s.dataset.bg=='#f3f1ec')}}});
 });
 ScrollTrigger.refresh();
} else {root.classList.add('no-anim')}
// phone: services light up as they cross the middle
if(matchMedia('(hover:none)').matches){var cio2=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('lit',e.isIntersecting)})},{rootMargin:'-42% 0px -42% 0px'});d.querySelectorAll('.card').forEach(function(c){cio2.observe(c)})}
// menu
var mb=d.getElementById('mbtn'),menu=d.getElementById('menu'),mt=d.querySelector('.mb-t');
function setMenu(o){if(o){menu.hidden=false;requestAnimationFrame(function(){menu.classList.add('on')});if(lenis)lenis.stop()}else{menu.classList.remove('on');setTimeout(function(){if(!menu.classList.contains('on'))menu.hidden=true},800);if(lenis&&!paused)lenis.start()}
 d.body.classList.toggle('menu-open',o);mb.setAttribute('aria-expanded',o);mt.textContent=o?'Close':'Menu';if(o)menu.querySelector('a').focus({preventScroll:true});}
mb.addEventListener('click',function(){setMenu(mb.getAttribute('aria-expanded')!=='true')});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&mb.getAttribute('aria-expanded')==='true'){setMenu(false);mb.focus()}});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

// header: hide on scroll down, return on scroll up
var bar=d.querySelector('.bar'),ly=0;
function onS(y){var dn=y>ly;if(y>innerHeight*.6){bar.classList.toggle('hide',dn&&y-ly>2||(dn&&bar.classList.contains('hide')));bar.classList.add('solid')}else{bar.classList.remove('hide','solid')}ly=y}
if(lenis)lenis.on('scroll',function(e){onS(e.scroll)});else addEventListener('scroll',function(){onS(scrollY)},{passive:true});
// back to top
d.querySelectorAll('a[href="#top"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(lenis)lenis.scrollTo(0,{duration:1.8,easing:function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}});else scrollTo({top:0,behavior:'smooth'})})});
d.querySelectorAll('a[href="#talk"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=d.getElementById('talk');if(lenis){lenis.start();lenis.scrollTo(t,{duration:1.6})}else t.scrollIntoView({behavior:'smooth'})})});

// pause
var pb=d.getElementById('pause');
pb.addEventListener('click',function(){paused=!paused;root.classList.toggle('paused',paused);pb.textContent=paused?'Play':'Pause';pb.setAttribute('aria-pressed',paused);
 var vs=d.querySelectorAll('video');
 if(paused){vs.forEach(function(v){v.pause()});land();d.querySelectorAll('[data-count]').forEach(function(el){el.textContent=(el.dataset.prefix||'')+(+el.dataset.count).toLocaleString('en-US')});if(lenis)lenis.stop();if(window.gsap)gsap.set('.cw',{xPercent:0,yPercent:0,opacity:1});if(window.__pulseAll)__pulseAll()}
 else{tryPlay(hv);lz.forEach(function(v){var r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)tryPlay(v)});if(lenis)lenis.start()}
});

// enquiry
var f=d.getElementById('enq');
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;['name','company','email'].forEach(function(n){var i=f.elements[n];var bad=!i.value.trim()||(n=='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad&&ok){i.focus();ok=false}});if(!ok)return;
 var b='Name: '+f.elements['name'].value+'\nCompany: '+f.elements.company.value+'\nWork Email: '+f.elements.email.value+'\nPhone: '+f.elements.phone.value+'\n\n'+f.elements.msg.value;
 location.href='mailto:careers@truheartconsultinginc.com?subject='+encodeURIComponent('Enquiry From '+f.elements.company.value)+'&body='+encodeURIComponent(b)});
})();
