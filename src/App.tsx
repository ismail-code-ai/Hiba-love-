import {useRef,useState,useCallback,useEffect} from 'react';
import Artwork from './Artwork';
import type {ArtworkHandle} from './Artwork';
function Icon({type}:{type:'replay'|'capture'|'fullscreen'|'sound'}) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type==='replay'?<><path d="M3 10a9 9 0 1 1 2 8"/><path d="M3 4v6h6"/></>:type==='capture'?<><path d="M8 5l1.5-2h5L16 5h4v15H4V5z"/><circle cx="12" cy="12" r="4"/></>:type==='fullscreen'?<><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></>:null}</svg>;
}
export default function App(){
  const artwork=useRef<ArtworkHandle>(null),root=useRef<HTMLElement>(null);
  const [ready,setReady]=useState(false),[complete,setComplete]=useState(false),[message,setMessage]=useState(''),[full,setFull]=useState(false);
  const onReady=useCallback(()=>setReady(true),[]),onComplete=useCallback(()=>setComplete(true),[]);
  useEffect(()=>{const change=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change);},[]);
  useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),4000);return()=>clearTimeout(timer);},[message]);
  const replay=()=>{setComplete(false);artwork.current?.replay();};
  const capture=async()=>{try{await artwork.current?.capture();setMessage('Your love letter is saved as a PNG.');}catch{setMessage('Could not save the image. Please try again.');}};
  const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await root.current?.requestFullscreen();}catch{setMessage('Fullscreen is unavailable in this browser.');}};
  return <main ref={root} className={ready?'experience ready':'experience'}>
    <header className="masthead"><a className="wordmark" href="#" aria-label="Hiba, a love letter"><span className="little-heart">♡</span> A LOVE LETTER</a><span className="edition">A MOMENT, MADE ETERNAL <i/> 01 / ∞</span></header>
    <section className="art-section" aria-label="An illuminated multilingual heart dedicated to Hiba">
      <div className="intro"><p className="eyebrow">IN EVERY LANGUAGE. IN EVERY LIFETIME.</p><h1>A love without <em>translation.</em></h1><p className="description">A thousand ways to say it. All of them, for you.</p></div>
      <button className="heart-stage" onClick={()=>artwork.current?.pulse()} aria-label="Send Hiba a glowing heartbeat" disabled={!ready}><Artwork ref={artwork} onReady={onReady} onComplete={onComplete}/><span className="sr-only">A heart made of romantic phrases in seventeen forms, with Hiba at its center.</span></button>
      <div className="dedication"><span className="tiny-star">✧</span><p>Some things are felt in every language.</p><span className="touch-hint">TOUCH THE HEART. FEEL IT ANSWER.</span></div>
    </section>
    <footer><div className="signature"><span className="status-dot"/><span>FOR HIBA, ALWAYS.</span></div><div className="controls"><button onClick={replay} disabled={!ready} title="Replay animation"><Icon type="replay"/><span>Replay</span></button><span className="divider"/><button onClick={capture} disabled={!ready} title="Save the finished artwork as a PNG"><Icon type="capture"/><span>Save a moment</span></button>{typeof document!=='undefined'&&document.fullscreenEnabled&&<><span className="divider"/><button onClick={fullscreen} aria-label={full?'Exit fullscreen':'Enter fullscreen'} title={full?'Exit fullscreen':'Enter fullscreen'}><Icon type="fullscreen"/></button></>}</div><div className="footer-note">SEVENTEEN WAYS. ONE FEELING.</div></footer>
    <div className="sr-only" role="status">{complete?'The heart is complete. Hiba, every word, only you.':''}</div><div className={`toast ${message?'visible':''}`} role="status">{message}</div>
  </main>;
}
