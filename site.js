(function(){
var d=document,root=d.documentElement,paused=false;
var hv=d.getElementById('heroVid'),pay=d.querySelector('.payoff'),PAY=5.55;
function land(){if(!pay.classList.contains('on')&&window.__ekgBig)__ekgBig();pay.classList.add('on')}
hv.addEventListener('timeupdate',function(){if(hv.currentTime>=PAY)land()});
setTimeout(land,9000);
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
window.addEventListener('scroll',function(){if(innerHeight+scrollY>=d.body.scrollHeight-40){rvs.forEach(function(el){el.classList.add('in')});land();if(window.__pulseAll)__pulseAll();if(window.__divAll)__divAll();if(window.__introDone)__introDone()}},{passive:true});

var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.12,wheelMultiplier:.55,touchMultiplier:1,smoothWheel:true});}
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
 gsap.fromTo(cws,{yPercent:30,opacity:0},{yPercent:0,opacity:1,stagger:.14,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.creed',start:'top 72%'}});

 // signature: the pulse draws with scroll, each beat lands a rep result
 var pl=d.querySelector('.pl'),bl=[].slice.call(d.querySelectorAll('.beats li')),L=pl.getTotalLength(),marks=[270,612,944,1300].map(function(X){var lo=0,hi=L;for(var k=0;k<24;k++){var mid=(lo+hi)/2;pl.getPointAtLength(mid).x<X?lo=mid:hi=mid}return lo/L});
 pl.style.strokeDasharray=L;pl.style.strokeDashoffset=L;
 function setP(p){pl.style.strokeDashoffset=L*(1-p);bl.forEach(function(li,i){li.classList.toggle('on',p>=marks[i])})}
 window.__pulseAll=function(){setP(1)};
 mm.add('(min-width:901px)',function(){ScrollTrigger.create({trigger:'.pulse',start:'top top',end:'+=120%',pin:'.pulse-pin',scrub:.9,onUpdate:function(s){if(!paused)setP(s.progress)},onLeave:function(){setP(1)}})});
 mm.add('(max-width:900px)',function(){ScrollTrigger.create({trigger:'.pulse-chart',start:'top 85%',end:'bottom 45%',scrub:.4,onUpdate:function(s){if(!paused)setP(s.progress)},onLeave:function(){setP(1)}})});
 // hero: framed reel grows to full screen
 (function(){var hf=d.querySelector('.hero .hero-film'),small=matchMedia('(max-width:900px)').matches,A=small?[12,6,34,8]:[16,20,22,10];
  function setH(p){p=1;var k=Math.min(1,p/.62);k=1-Math.pow(1-k,3);hf.style.setProperty('--it',(A[0]*(1-k))+'%');hf.style.setProperty('--is',(A[1]*(1-k))+'%');hf.style.setProperty('--ib',(A[2]*(1-k))+'%');hf.style.setProperty('--ir',(A[3]*(1-k))+'px')}
  setH(0);ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom bottom',onUpdate:function(s){setH(paused?1:s.progress)}});window.__heroFull=function(){setH(1)};})();
 if(lenis)lenis.on('scroll',function(e){if(window.__ekgKick&&!paused)__ekgKick(e.velocity)});
 // background + text colour blend between sections
 var bg=d.querySelector('.bg');
 d.querySelectorAll('[data-bg]').forEach(function(s){
  ScrollTrigger.create({trigger:s,start:'top 62%',end:'bottom 62%',onToggle:function(st){if(st.isActive){gsap.to(bg,{backgroundColor:s.dataset.bg,duration:1.1,ease:'power2.inOut',overwrite:true});gsap.to(d.body,{color:s.dataset.fg,duration:1.1,ease:'power2.inOut',overwrite:true});root.style.setProperty('--fg',s.dataset.fg);root.style.setProperty('--barbg',s.dataset.bg);d.body.classList.toggle('on-red',s.dataset.bg=='#cf2d20');d.body.classList.toggle('on-paper',s.dataset.bg=='#f3f1ec')}}});
 });
 ScrollTrigger.refresh();
} else {root.classList.add('no-anim')}
// phone: services light up as they cross the middle
if(matchMedia('(hover:none)').matches){var cio2=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('lit',e.isIntersecting)})},{rootMargin:'-42% 0px -42% 0px'});d.querySelectorAll('.card').forEach(function(c){cio2.observe(c)})}

// ===== r6 hero: the heartbeat draws on black, its trace opens into the film, words light on the beats =====
(function(){
 var cv=d.getElementById('ekg');if(!cv)return;var cx=cv.getContext('2d'),W,H,Y,dpr=Math.min(2,devicePixelRatio||1),px=-1e4,pv=0,lastX=null,big=0,on=true;
 var hf=d.querySelector('.hero .hero-film'),words=[].slice.call(d.querySelectorAll('.hero .hl .w')),hero=d.querySelector('.hero');
 var T0=performance.now(),DRAW=1.25,OPEN=.95,BEAT0=DRAW+OPEN,per=2.5,opened=false,lit=0,acc=0,lastB=0,bpmEl=d.getElementById('bpm');
 hero.classList.add('intro-on');
 function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);var hr=d.querySelector('.hero .hero-type').getBoundingClientRect();Y=Math.max(H*.28,hr.top-r.top-46);if(innerWidth<=900){Y=Math.max(104,Math.min(124,H*.14))}}
 size();addEventListener('resize',size);
 function qrs(u){if(u<-1||u>1)return 0;return u<-.55?-.12*Math.sin((u+1)/.45*Math.PI):u<-.15?0:u<-.05?.25*((u+.15)/.1):u<.05?-1*(1-Math.abs(u)/.05):u<.13?.55*(1-(u-.05)/.08):u<.4?0:-.22*Math.sin((u-.4)/.6*Math.PI)}
 var hs=d.querySelector('.hero-stage');
 hs.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),x=e.clientX-r.left;if(lastX!=null)pv=Math.min(1,pv+Math.abs(x-lastX)/120);lastX=x;px=x});
 hs.addEventListener('pointerleave',function(){lastX=null});
 hs.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect();px=e.clientX-r.left;pv=1});
 window.__ekgBig=function(){big=1};
 window.__ekgKick=function(v){pv=Math.min(1.4,Math.max(pv,Math.abs(v)/40));if(px<0||px>W)px=W*.5};
 function clip(k){hf.style.clipPath=k>=1?'none':'inset('+(50*(1-k))+'% 0 '+(50*(1-k))+'% 0)'}
 function finish(){if(opened)return;opened=true;clip(1);hero.classList.remove('intro-on');words.forEach(function(w){if(!w.classList.contains('payoff'))w.classList.add('lit')});try{hv.currentTime=0;tryPlay(hv)}catch(e){}}
 window.__introDone=function(){finish();words.forEach(function(w){w.classList.add('lit')})};
 clip(0);setTimeout(finish,6000);
 var io=new IntersectionObserver(function(es){on=es[0].isIntersecting});io.observe(hs);
 function ease(k){return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2}
 function frame(now){requestAnimationFrame(frame);if(!on){window.__lt=now;return}
  var Wl=innerWidth>900?Math.round(W*.5):W,t=(now-T0)/1000,amp=innerWidth<=900?40:Math.min(120,H*.14),bw=Math.min(180,W*.13),yl,head,drawTo=Wl,introAmp=0;
  if(paused&&!opened)finish();
  if(t<DRAW&&!opened){var k=t/DRAW;drawTo=Wl*ease(k);head=Wl*.56;yl=H/2;introAmp=1.6;clip(0)}
  else if(t<BEAT0&&!opened){var k2=ease((t-DRAW)/OPEN);clip(k2);yl=H/2+(Y-H/2)*k2;head=Wl*.56;introAmp=1.6*(1-k2)}
  else{if(!opened){finish();T0=now-BEAT0*1000;t=BEAT0}
   yl=Y;var dt=Math.min(.05,(now-(window.__lt||now))/1000),rate=1+Math.min(.35,pv*.35);acc+=dt*rate;var bt=acc,ph=(bt%per)/per;var bpm=Math.round(24*rate);if(bpmEl&&bpm!==lastB){bpmEl.textContent=bpm;lastB=bpm}head=paused?Wl*.6:ph*(Wl+400)-200;
   var n=Math.floor(bt/per);if(!paused&&lit<2&&n>=lit&&ph>.35){words[lit]&&words[lit].classList.add('lit');lit++}}
  pv*=.94;big*=.97;cx.clearRect(0,0,W,H);cx.lineWidth=3;cx.lineJoin='round';cx.lineCap='round';cx.beginPath();
  for(var x=0;x<=Math.min(drawTo,Wl);x+=2){var a=introAmp?introAmp:(1+big*1.4);var y=qrs((x-head)/bw)*amp*a+qrs((x-px)/(bw*.7))*amp*1.3*pv;x?cx.lineTo(x,yl+y):cx.moveTo(x,yl+y)}
  if(introAmp||paused){cx.strokeStyle='#cf2d20'}else{cx.strokeStyle='#cf2d20'}
  cx.stroke();window.__lt=now;
 }
 requestAnimationFrame(frame);
})();
// spine: the heartbeat carries down the page as you scroll, beating at each section
(function(){var sv=d.getElementById('spine');if(!sv)return;var pb=sv.querySelector('.spine-b'),pp=sv.querySelector('.spine-p'),L=1;
 function addB(p){var o='',last=0;p.replace(/^M12 0/,'').split(/(?=V)/).forEach(function(seg){var m=seg.match(/^V(\d+)(.*)$/);if(!m){o+=seg;return}var v=+m[1];for(var y=last+46;y<v-30;y+=46)o+='V'+y+'L12 '+(y+3)+' 8 '+(y+6)+' 16 '+(y+10)+' 12 '+(y+13);o+='V'+v+m[2];var t=m[2].match(/(\d+)$/);last=t?+t[1]:v});return 'M12 0'+o}
 function build(){var Hd=d.documentElement.scrollHeight,pts='M12 0';d.querySelectorAll('main>section,main>.ekg-div').forEach(function(s){if(!s.matches('section'))return;var f=Math.round(s.offsetTop/Hd*1000);if(f<20)return;pts+='V'+(f-24)+'L12 '+(f-18)+' 4 '+(f-12)+' 22 '+(f-4)+' 2 '+(f+6)+' 16 '+(f+12)+' 12 '+(f+18)});pts=pts.replace(/V(\d+)/g,function(m,v){return m});pts=addB(pts);var lt=+(pts.match(/(\d+)$/)||[0,0])[1];for(var y=lt+46;y<970;y+=46)pts+='V'+y+'L12 '+(y+3)+' 8 '+(y+6)+' 16 '+(y+10)+' 12 '+(y+13);pts+='V1000';pb.setAttribute('d',pts);pp.setAttribute('d',pts);L=pp.getTotalLength();pp.style.strokeDasharray=L;upd()}
 function upd(){var y=scrollY,max=d.documentElement.scrollHeight-innerHeight,p=max>0?(y+innerHeight*.5)/(max+innerHeight):0;pp.style.strokeDashoffset=L*(1-Math.min(1,p));sv.classList.toggle('on',y>innerHeight*.6);var k=sv.querySelector('.spine-k');if(k)k.setAttribute('transform','translate(0 '+Math.max(0,Math.min(966,1000*Math.min(1,p)-34))+')')}
 addEventListener('scroll',upd,{passive:true});addEventListener('resize',build);addEventListener('load',function(){setTimeout(build,300)});setTimeout(build,1500);build();
})();
// close: headline lights on beats; fields draw a heartbeat when focused
(function(){var bws=[].slice.call(d.querySelectorAll('.talk-hl .bw, .talk-hl span:last-child'));var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();bws.forEach(function(w,i){setTimeout(function(){w.classList.add('lit')},paused?0:i*520)})},{threshold:.4});var th=d.querySelector('.talk-hl');if(th)io.observe(th);
 d.querySelectorAll('.talk-card label').forEach(function(l){l.insertAdjacentHTML('beforeend','<svg class="f-ecg" viewBox="0 0 400 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 28H150L160 28 168 10 178 30 188 2 198 26 206 28H400"/></svg>')});})();
// dividers draw as they enter
(function(){var ps=[].slice.call(d.querySelectorAll('.ekg-div path'));ps.forEach(function(p){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.transition='stroke-dashoffset 3.2s cubic-bezier(.45,0,.25,1)'});
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.strokeDashoffset=0;io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});ps.forEach(function(p){io.observe(p)});
 window.__divAll=function(){ps.forEach(function(p){p.style.strokeDashoffset=0})};})();
// accordion
d.querySelectorAll('.acc-b').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode,o=!li.classList.contains('open');d.querySelectorAll('.acc-i').forEach(function(x){x.classList.remove('open');x.firstChild.setAttribute('aria-expanded','false')});if(o){li.classList.add('open');b.setAttribute('aria-expanded','true')}setTimeout(function(){if(window.ScrollTrigger)ScrollTrigger.refresh()},750)})});
// results strip: mouse drag (touch keeps native swipe)
(function(){var tr=d.querySelector('.cases-track');if(!tr)return;var down=false,sx=0,sl=0,moved=0,vx=0,lx=0,raf;
 tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;sx=lx=e.clientX;sl=tr.scrollLeft;tr.classList.add('dragging');cancelAnimationFrame(raf);tr.setPointerCapture(e.pointerId);e.preventDefault()});
 tr.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));vx=e.clientX-lx;lx=e.clientX;tr.scrollLeft=sl-dx});
 function up(){if(!down)return;down=false;tr.classList.remove('dragging');(function glide(){vx*=.92;tr.scrollLeft-=vx;if(Math.abs(vx)>.5)raf=requestAnimationFrame(glide)})()}
 tr.addEventListener('pointerup',up);tr.addEventListener('pointercancel',up);
 tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
 tr.addEventListener('dragstart',function(e){e.preventDefault()});
})();
// section links in the menu
d.querySelectorAll('a[data-sec]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=d.querySelector(a.getAttribute('href'));setTimeout(function(){if(lenis){lenis.start();lenis.scrollTo(t,{duration:1.4,offset:-70})}else t.scrollIntoView({behavior:'smooth'})},60)})});
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
 if(paused){vs.forEach(function(v){v.pause()});land();d.querySelectorAll('[data-count]').forEach(function(el){el.textContent=(el.dataset.prefix||'')+(+el.dataset.count).toLocaleString('en-US')});if(lenis)lenis.stop();if(window.gsap)gsap.set('.cw',{xPercent:0,yPercent:0,opacity:1});if(window.__pulseAll)__pulseAll();if(window.__divAll)__divAll();if(window.__heroFull)__heroFull();if(window.__introDone)__introDone();d.querySelectorAll('.talk-hl .bw,.talk-hl span:last-child').forEach(function(w){w.classList.add('lit')})}
 else{tryPlay(hv);lz.forEach(function(v){var r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)tryPlay(v)});if(lenis)lenis.start()}
});

// enquiry
var f=d.getElementById('enq');
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;['name','company','email'].forEach(function(n){var i=f.elements[n];var bad=!i.value.trim()||(n=='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad&&ok){i.focus();ok=false}});if(!ok)return;
 var b='Name: '+f.elements['name'].value+'\nCompany: '+f.elements.company.value+'\nWork Email: '+f.elements.email.value+'\nPhone: '+f.elements.phone.value+'\n\n'+f.elements.msg.value;
 location.href='mailto:careers@truheartconsultinginc.com?subject='+encodeURIComponent('Enquiry From '+f.elements.company.value)+'&body='+encodeURIComponent(b)});
})();

(function(){var p=document.getElementById('wpath'),ol=document.querySelector('.wpts');if(!p||!ol)return;
var li=[].slice.call(ol.children),n=li.length,dd='';li.forEach(function(l,i){var v=parseFloat(l.style.getPropertyValue('--v'));var x=n>1?i/(n-1)*1000:0,y=380-v*340;dd+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});p.setAttribute('d',dd);
var sv=p.parentNode;
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){sv.classList.add('on');ol.classList.add('on');io.disconnect()}})},{threshold:.35});io.observe(ol)})();
