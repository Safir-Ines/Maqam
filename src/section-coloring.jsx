import React from 'react';
// Coloring game — pick image → paint bucket canvas
const { useState: useS_col, useEffect: useE_col, useRef: useR_col } = React;

const COLORING_IMAGES = [
  {id:'fox',     src:'assets/coloring/fox_colring.jpeg',      name:'الثعلب'},
  {id:'camel',   src:'assets/coloring/camel_coloring.jpeg',   name:'الجمل'},
  {id:'alg',     src:'assets/coloring/alg_coloring.jpeg',     name:'الجزائر'},
  {id:'sout',    src:'assets/coloring/sout_coloring.jpeg',    name:'الجنوب'},
  {id:'working', src:'assets/coloring/working_coloring.webp', name:'الحرفي'},
];

const PALETTE = [
  '#E74C3C','#E67E22','#F1C40F','#27AE60',
  '#2980B9','#8E44AD','#16A085','#F06292',
  '#FF7043','#8D6E63','#F9C74F','#2C7A51',
  '#FFFFFF','#2A1810',
];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1,3),16),
    parseInt(hex.slice(3,5),16),
    parseInt(hex.slice(5,7),16)
  ];
}

function floodFill(canvas, sx, sy, fillRgb, tolerance=40) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  let imageData;
  try { imageData = ctx.getImageData(0, 0, w, h); }
  catch(e) { return false; }
  const data = imageData.data;

  const i0 = (sx + sy * w) * 4;
  const tr = data[i0], tg = data[i0+1], tb = data[i0+2];

  // skip outline (dark) pixels
  if (tr + tg + tb < 120) return true;
  // skip if already same color
  if (tr===fillRgb[0] && tg===fillRgb[1] && tb===fillRgb[2]) return true;

  const t3 = tolerance * 3;
  const matches = (i) =>
    Math.abs(data[i]-tr) + Math.abs(data[i+1]-tg) + Math.abs(data[i+2]-tb) <= t3;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  const start = sx + sy * w;
  queue[tail++] = start;
  visited[start] = 1;

  while (head < tail) {
    const pos = queue[head++];
    const x = pos % w, y = (pos / w) | 0;
    const pi = pos * 4;
    data[pi] = fillRgb[0]; data[pi+1] = fillRgb[1];
    data[pi+2] = fillRgb[2]; data[pi+3] = 255;

    if (x > 0)   { const n=pos-1; if(!visited[n]&&matches(n*4)){visited[n]=1;queue[tail++]=n;} }
    if (x < w-1) { const n=pos+1; if(!visited[n]&&matches(n*4)){visited[n]=1;queue[tail++]=n;} }
    if (y > 0)   { const n=pos-w; if(!visited[n]&&matches(n*4)){visited[n]=1;queue[tail++]=n;} }
    if (y < h-1) { const n=pos+w; if(!visited[n]&&matches(n*4)){visited[n]=1;queue[tail++]=n;} }
  }

  ctx.putImageData(imageData, 0, 0);
  return true;
}

function SectionColoring({ctx}) {
  const [picked, setPicked] = useS_col(null);
  return picked
    ? <ColoringCanvas img={picked} onBack={() => setPicked(null)}/>
    : <ColoringPicker onPick={setPicked} onBack={() => ctx.setSection('home')}/>;
}

function ColoringPicker({onPick, onBack}) {
  const [, forceUpdate] = useS_col(0);
  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1280, margin:'0 auto'}}>
      <button onClick={onBack} style={{
        display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24
      }}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{display:'flex', alignItems:'center', gap:20, marginBottom:32}}>
        <img src="assets/storyteller.png" alt="" style={{width:80, height:80, objectFit:'contain'}}/>
        <div>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:44, fontWeight:700}}>التلوين</h1>
          <p style={{fontSize:15, color:'#7a5538', marginTop:4}}>اختر صورة وابدأ التلوين بالألوان التي تحبها</p>
        </div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:20
      }}>
        {COLORING_IMAGES.map(img => {
          const hasSaved = !!localStorage.getItem('maqam_coloring_' + img.id);
          return (
            <button key={img.id} onClick={() => { forceUpdate(n=>n+1); onPick(img); }}
              className="squish" style={{
                background:'#FFF6E5', borderRadius:24, overflow:'hidden',
                border:'3px solid #9B51E0', boxShadow:'0 6px 0 rgba(60,30,10,.1)',
                cursor:'pointer', textAlign:'center', position:'relative', padding:0
              }}>
              {hasSaved && (
                <div style={{
                  position:'absolute', top:10, insetInlineEnd:10, zIndex:2,
                  background:'var(--c-mint)', color:'#FFF6E5',
                  fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:999
                }}>ملوّن</div>
              )}
              <div style={{aspectRatio:'1/1', overflow:'hidden'}}>
                <img src={img.src} alt={img.name} style={{
                  width:'100%', height:'100%', objectFit:'cover', display:'block'
                }}/>
              </div>
              <div style={{
                padding:'10px 12px',
                fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'#3a2614'
              }}>
                {img.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColoringCanvas({img, onBack}) {
  const canvasRef = useR_col(null);
  const [color, setColor] = useS_col('#E74C3C');
  const [loaded, setLoaded] = useS_col(false);
  const [filling, setFilling] = useS_col(false);
  const [saved, setSaved] = useS_col(false);

  useE_col(() => {
    setLoaded(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');

    const drawSrc = (src) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => {
        canvas.width = im.naturalWidth;
        canvas.height = im.naturalHeight;
        ctx2d.drawImage(im, 0, 0);
        setLoaded(true);
      };
      im.src = src;
    };

    const savedData = localStorage.getItem('maqam_coloring_' + img.id);
    drawSrc(savedData || img.src);
  }, [img.id]);

  const handleClick = (e) => {
    if (!loaded || filling) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    setFilling(true);
    setTimeout(() => {
      const ok = floodFill(canvas, x, y, hexToRgb(color));
      if (ok) {
        try {
          localStorage.setItem('maqam_coloring_' + img.id, canvas.toDataURL('image/jpeg', 0.85));
          setSaved(true);
          setTimeout(() => setSaved(false), 1200);
        } catch(e) {}
      }
      setFilling(false);
    }, 0);
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext('2d');
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.drawImage(im, 0, 0);
      localStorage.removeItem('maqam_coloring_' + img.id);
    };
    im.src = img.src;
  };

  return (
    <div style={{display:'flex', flexDirection:'column', height:'calc(100vh - 90px)', overflow:'hidden'}}>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'10px 4%',
        background:'#FFF6E5', borderBottom:'3px solid var(--c-soft)', flexShrink:0
      }}>
        <button onClick={onBack} className="squish" style={{
          width:40, height:40, borderRadius:12, background:'var(--c-soft)',
          display:'grid', placeItems:'center', flexShrink:0
        }}>
          <Icon.Back size={20} color="var(--c-clay)"/>
        </button>
        <div style={{
          fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, flex:1
        }}>{img.name}</div>

        {saved && (
          <div style={{
            background:'var(--c-mint)', color:'#FFF6E5',
            padding:'5px 14px', borderRadius:999, fontSize:12, fontWeight:700
          }}>تم الحفظ</div>
        )}

        <button onClick={clearAll} style={{
          background:'#FBE3DF', color:'var(--c-clay)',
          padding:'7px 14px', borderRadius:999, fontSize:13, fontWeight:700,
          border:'2px solid var(--c-clay)', flexShrink:0
        }}>مسح الكل</button>
      </div>

      {/* Canvas area */}
      <div style={{
        flex:1, overflow:'auto', display:'flex',
        alignItems:'center', justifyContent:'center',
        background:'#F0E5D0', padding:12,
        cursor: filling ? 'wait' : 'crosshair'
      }}>
        {!loaded && (
          <div style={{fontSize:16, color:'#7a5538', fontWeight:700}}>جاري التحميل...</div>
        )}
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          style={{
            maxWidth:'100%',
            maxHeight:'calc(100vh - 230px)',
            objectFit:'contain',
            borderRadius:12,
            boxShadow:'0 8px 32px rgba(0,0,0,.2)',
            display: loaded ? 'block' : 'none',
            cursor: filling ? 'wait' : 'crosshair'
          }}
        />
      </div>

      {/* Color palette */}
      <div style={{
        flexShrink:0,
        background:'#FFF6E5',
        borderTop:'3px solid var(--c-soft)',
        padding:'10px 4%',
        display:'flex', gap:8, alignItems:'center',
        justifyContent:'center', flexWrap:'wrap'
      }}>
        <img src="assets/happy.png" alt="" style={{
          width:40, height:40, objectFit:'contain', flexShrink:0,
          display: color ? 'block' : 'none'
        }}/>
        {PALETTE.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: color===c ? 40 : 32,
            height: color===c ? 40 : 32,
            borderRadius:'50%', background:c, flexShrink:0,
            border: color===c
              ? '4px solid #2A1810'
              : c==='#FFFFFF' ? '3px solid #ccc' : '3px solid rgba(0,0,0,.12)',
            boxShadow: color===c ? `0 0 0 3px ${c === '#FFFFFF' ? '#ccc' : c}66` : 'none',
            transition:'all .15s'
          }}/>
        ))}
      </div>
    </div>
  );
}

window.SectionColoring = SectionColoring;
