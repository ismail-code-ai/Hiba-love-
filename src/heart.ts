export const phrases = ['Hiba', 'I love you Hiba', 'Je t’aime', 'Te amo', 'Seni seviyorum', 'Ti amo', 'Ich liebe dich', 'Eu te amo', 'Я тебя люблю', '愛してる', '사랑해', 'Kocham cię', 'Ik hou van jou', 'Aku cinta kamu', 'Anh yêu em', 'Σ’ αγαπώ', 'Jag älskar dig'];
export const font = '"Noto Sans", "Noto Sans JP", "Noto Sans KR", sans-serif';
export type Word = {text:string; x:number; y:number; size:number; width:number; color:string; delay:number};
export function random(seed = 12) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
// The classic parametric heart, sampled as a closed polygon. Coordinate space: 1000².
export function heartPoint(t:number) {
  return {x:500 + 25 * 16 * Math.sin(t) ** 3, y:460 - 25 * (13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))};
}
export const outline = Array.from({length:720}, (_,i)=>heartPoint(i/720*Math.PI*2));
export function inside(x:number,y:number) {
  let hit=false;
  for(let i=0,j=outline.length-1;i<outline.length;j=i++) {
    const a=outline[i],b=outline[j];
    if((a.y>y)!==(b.y>y) && x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x) hit=!hit;
  }
  return hit;
}
export function makeWords(ctx:CanvasRenderingContext2D):Word[] {
  const rng=random(), words:Word[]=[];
  const colors=['#ff2455','#ff3b63','#e92146','#fc668d','#f28b91','#d51d3d','#ff587e','#eab0a0'];
  let index=0;
  // Greedy measured packing in rows. All four corners must fit inside the heart.
  for(let y=150;y<880;y+=15) {
    let x=92;
    while(x<910) {
      const text=phrases[index++%phrases.length];
      const size=8.2+rng()*4.2;
      ctx.font=`400 ${size}px ${font}`;
      const width=ctx.measureText(text).width;
      const center=x+width/2;
      const nameSpace = Math.abs(y-480)<75 && Math.abs(center-500)<160;
      if(!nameSpace && inside(x,y-7) && inside(x+width,y-7) && inside(x,y+7) && inside(x+width,y+7)) {
        words.push({text,x:center,y,size,width,color:colors[Math.floor(rng()*colors.length)],delay:rng()*2.8 + (y/1000)*1.2});
        x+=width+7+rng()*5;
      } else x+=8;
    }
  }
  return words;
}
