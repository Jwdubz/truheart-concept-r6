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
var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting&&!paused){v.preload='auto';tryPlay(v)}else v.pause()})},{threshold:.15});
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
window.addEventListener('scroll',function(){if(innerHeight+scrollY>=d.body.scrollHeight-40){rvs.forEach(function(el){el.classList.add('in')});land()}},{passive:true});

var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.1,wheelMultiplier:1,smoothWheel:true});}
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
 // background + text colour blend between sections
 var bg=d.querySelector('.bg');
 d.querySelectorAll('[data-bg]').forEach(function(s){
  ScrollTrigger.create({trigger:s,start:'top 62%',end:'bottom 62%',onToggle:function(st){if(st.isActive){gsap.to(bg,{backgroundColor:s.dataset.bg,duration:1.1,ease:'power2.inOut',overwrite:true});gsap.to(d.body,{color:s.dataset.fg,duration:1.1,ease:'power2.inOut',overwrite:true});root.style.setProperty('--fg',s.dataset.fg);root.style.setProperty('--barbg',s.dataset.bg);d.body.classList.toggle('on-red',s.dataset.bg=='#cf2d20');d.body.classList.toggle('on-paper',s.dataset.bg=='#f3f1ec')}}});
 });
 var mm=gsap.matchMedia();
 mm.add('(min-width:901px)',function(){
  // hero: words part, film steps forward
  var tl=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});
  tl.to('.hl .w1',{xPercent:-14,ease:'none'},0).to('.hl .w2',{xPercent:-4,ease:'none'},0).to('.hl .w3',{xPercent:10,ease:'none'},0).to('.hero-film',{scale:1.06,yPercent:-6,ease:'none'},0);
 });
 // creed: words start apart, lock into the line
 var cws=gsap.utils.toArray('.cw');
 var offs=[[-18,40],[22,-30],[-10,60],[16,-50]];
 gsap.fromTo(cws,{xPercent:function(i){return offs[i][0]},yPercent:function(i){return offs[i][1]},opacity:.15},{xPercent:0,yPercent:0,opacity:1,ease:'none',stagger:.05,scrollTrigger:{trigger:'.creed',start:'top 85%',end:'center 55%',scrub:.8}});
} else {root.classList.add('no-anim')}

// header: hide on scroll down, return on scroll up
var bar=d.querySelector('.bar'),ly=0;
function onS(y){var dn=y>ly;if(y>innerHeight*.6){bar.classList.toggle('hide',dn&&y-ly>2||(dn&&bar.classList.contains('hide')));bar.classList.add('solid')}else{bar.classList.remove('hide','solid')}ly=y}
if(lenis)lenis.on('scroll',function(e){onS(e.scroll)});else addEventListener('scroll',function(){onS(scrollY)},{passive:true});
// back to top
d.querySelectorAll('a[href="#top"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(lenis)lenis.scrollTo(0,{duration:1.8,easing:function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}});else scrollTo({top:0,behavior:'smooth'})})});
d.querySelectorAll('a[href="#talk"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=d.getElementById('talk');if(lenis)lenis.scrollTo(t,{duration:1.6});else t.scrollIntoView({behavior:'smooth'})})});

// pause
var pb=d.getElementById('pause');
pb.addEventListener('click',function(){paused=!paused;root.classList.toggle('paused',paused);pb.textContent=paused?'Play':'Pause';pb.setAttribute('aria-pressed',paused);
 var vs=d.querySelectorAll('video');
 if(paused){vs.forEach(function(v){v.pause()});land();d.querySelectorAll('[data-count]').forEach(function(el){el.textContent=(el.dataset.prefix||'')+(+el.dataset.count).toLocaleString('en-US')});if(lenis)lenis.stop();if(window.gsap)gsap.set('.cw',{xPercent:0,yPercent:0,opacity:1})}
 else{tryPlay(hv);lz.forEach(function(v){var r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)tryPlay(v)});if(lenis)lenis.start()}
});

// enquiry
var f=d.getElementById('enq');
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;['name','company','email'].forEach(function(n){var i=f.elements[n];var bad=!i.value.trim()||(n=='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad&&ok){i.focus();ok=false}});if(!ok)return;
 var b='Name: '+f.elements['name'].value+'\nCompany: '+f.elements.company.value+'\nWork Email: '+f.elements.email.value+'\nPhone: '+f.elements.phone.value+'\n\n'+f.elements.msg.value;
 location.href='mailto:careers@truheartconsultinginc.com?subject='+encodeURIComponent('Enquiry From '+f.elements.company.value)+'&body='+encodeURIComponent(b)});
})();
