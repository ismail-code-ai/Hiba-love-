import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import {font, makeWords, random} from './heart';
export type ArtworkHandle={replay:()=>void; pulse:()=>void; capture:()=>Promise<void>};
type Props={onReady:()=>void; onComplete:()=>void};
const Artwork=forwardRef<ArtworkHandle,Props>(function Artwork({onReady,onComplete},ref) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const api=useRef<ArtworkHandle>({replay:()=>{},pulse:()=>{},capture:async()=>{}});
  useImperativeHandle(ref,()=>({replay:()=>api.current.replay(),pulse:()=>api.current.pulse(),capture:()=>api.current.capture()}),[]);
  useEffect(()=>{
    let disposed=false;
    let cleanup=()=>{};
    void Promise.all([document.fonts.ready, document.fonts.load(`12px ${font}`, 'Hiba Я тебя люблю Σ’ αγαπώ Anh yêu em 愛してる 사랑해'), document.fonts.load('12px "Noto Sans JP"', '愛してる'), document.fonts.load('12px "Noto Sans KR"', '사랑해'), document.fonts.load('italic 102px "Cormorant Garamond"', 'Hiba')]).then(()=>{
      if(disposed) return;
      const el=canvas.current!,ctx=el.getContext('2d')!;
      const reduced=matchMedia('(prefers-reduced-motion: reduce)');
      const scratch=document.createElement('canvas').getContext('2d')!;
      const words=makeWords(scratch);
      // A high-resolution static layer makes the infinite loop one draw call per frame.
      const layer=document.createElement('canvas'); layer.width=2000;layer.height=2000;
      const lc=layer.getContext('2d')!;lc.scale(2,2);
      function word(c:CanvasRenderingContext2D,w:typeof words[number],alpha=1,scale=1) {
        c.save(); c.translate(w.x,w.y);c.scale(scale,scale);c.globalAlpha=alpha;
        c.font=`400 ${w.size}px ${font}`;c.textAlign='center';c.textBaseline='middle';
        c.fillStyle=w.color;c.shadowColor=w.color;c.shadowBlur=4+(1-alpha)*12;c.fillText(w.text,0,0);c.restore();
      }
      words.forEach(w=>word(lc,w));
      const rng=random(59);
      const particles=Array.from({length:65},(_,i)=>({x:75+rng()*850,y:115+rng()*800,r:.5+rng()*1.7,phase:rng()*6.28,heart:i%8===0}));
      const state={time:0,name:0,ambient:0,pulse:0,x:0,y:0};
      let timeline:gsap.core.Timeline, tickerTime=0, width=0,height=0,dpr=1,completed=false;
      const resize=()=>{const rect=el.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,2);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);draw();};
      function draw(exportCtx?:CanvasRenderingContext2D) {
        const c=exportCtx||ctx;const w=exportCtx?2000:width,h=exportCtx?2000:height;
        if(!w||!h)return;
        c.setTransform(exportCtx?2:dpr,0,0,exportCtx?2:dpr,0,0);
        const cw=exportCtx?1000:w,ch=exportCtx?1000:h;
        c.fillStyle='#000';c.fillRect(0,0,cw,ch);
        const fit=Math.min(cw/1000,ch/1000);
        c.translate(cw/2,ch/2);c.scale(fit,fit);c.translate(-500,-500);
        const finished=exportCtx||state.time>=6.4;
        const t=reduced.matches||exportCtx?0:tickerTime;
        const beat=reduced.matches?1:1+0.005*(Math.sin(t*1.65)**12)+state.pulse*.025;
        c.translate(500+state.x,480+state.y);c.scale(beat,beat);c.translate(-500,-480);
        const ambient=exportCtx?1:state.ambient;
        if(ambient>0){
          const glow=c.createRadialGradient(500,470,40,500,470,430);glow.addColorStop(0,'rgba(140,0,28,.085)');glow.addColorStop(.65,'rgba(95,0,20,.035)');glow.addColorStop(1,'transparent');c.globalAlpha=ambient;c.fillStyle=glow;c.fillRect(40,50,920,900);
        }
        c.globalAlpha=1;
        if(finished)c.drawImage(layer,0,0,1000,1000);
        else words.forEach(w=>{const p=Math.min(1,Math.max(0,(state.time-w.delay-1)/1.1));if(p>0)word(c,w,p*p, .65+.35*(1-(1-p)**3));});
        c.globalAlpha=ambient;
        particles.forEach(p=>{
          const y=p.y+Math.sin(t*.3+p.phase)*9;
          c.globalAlpha=ambient*(.25+.55*(.5+.5*Math.sin(t*.55+p.phase)));
          c.fillStyle='#ff5477';c.shadowColor='#fa1649';c.shadowBlur=8;
          if(p.heart){c.font='11px serif';c.fillText('♥',p.x,y);}else{c.beginPath();c.arc(p.x,y,p.r,0,Math.PI*2);c.fill();}
        });
        c.shadowBlur=0;c.globalAlpha=exportCtx?1:state.name;
        c.textAlign='center';c.textBaseline='middle';
        c.font='italic 400 102px "Cormorant Garamond", serif';c.fillStyle='#fff7f5';c.shadowColor='#ff264f';c.shadowBlur=23;c.fillText('Hiba',500,475);c.shadowBlur=0;
        c.font='400 8px "Noto Sans", sans-serif';c.fillStyle='#c4919c';c.letterSpacing='3px';c.fillText('EVERY WORD. ONLY YOU.',500,541);c.letterSpacing='0px';c.globalAlpha=1;
        if(state.pulse>.01){c.strokeStyle=`rgba(255,86,122,${state.pulse*.3})`;c.lineWidth=1;c.beginPath();c.arc(500,480,160+(1-state.pulse)*210,0,Math.PI*2);c.stroke();}
      }
      function play(){
        timeline?.kill();completed=false;
        gsap.killTweensOf(state);Object.assign(state,{time:0,name:0,ambient:0,pulse:0});
        timeline=gsap.timeline({onComplete:()=>{completed=true;onComplete();}});
        if(reduced.matches){Object.assign(state,{time:7,name:1,ambient:1});draw();completed=true;onComplete();return;}
        timeline.to(state,{ambient:1,duration:2,ease:'power2.inOut'},.4)
          .to(state,{time:6.4,duration:6.4,ease:'none'},0)
          .to(state,{name:1,duration:1.8,ease:'power2.out'},4.7);
      }
      const pulse=()=>{if(reduced.matches)return;gsap.fromTo(state,{pulse:1},{pulse:0,duration:1.5,ease:'power2.out',overwrite:'auto'});};
      const move=(e:PointerEvent)=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();gsap.to(state,{x:((e.clientX-r.left)/r.width-.5)*12,y:((e.clientY-r.top)/r.height-.5)*10,duration:1.5,overwrite:'auto'});};
      const leave=()=>gsap.to(state,{x:0,y:0,duration:1});
      const tick=(_:number,delta:number)=>{if(document.hidden)return;tickerTime+=Math.min(delta,50)/1000;if(!reduced.matches||!completed)draw();};
      const motionChange=()=>{play();draw();};
      api.current={replay:play,pulse,capture:async()=>{
        const output=document.createElement('canvas');output.width=2000;output.height=2000;draw(output.getContext('2d')!);
        const blob=await new Promise<Blob>((resolve,reject)=>output.toBlob(b=>b?resolve(b):reject(new Error('Unable to capture artwork')),'image/png'));
        const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Hiba-a-love-without-translation.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
      }};
      el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
      const observer=new ResizeObserver(resize);observer.observe(el);
      reduced.addEventListener('change',motionChange);gsap.ticker.add(tick);resize();play();onReady();
      cleanup=()=>{timeline?.kill();gsap.killTweensOf(state);gsap.ticker.remove(tick);observer.disconnect();reduced.removeEventListener('change',motionChange);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
    });
    return()=>{disposed=true;cleanup();};
  },[onReady,onComplete]);
  return <canvas ref={canvas} aria-hidden="true"/>;
});
export default Artwork;
