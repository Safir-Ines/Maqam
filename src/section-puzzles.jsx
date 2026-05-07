import React from 'react';
// Puzzle Game — interactive jigsaw-style game
function SectionPuzzles({ctx}) {
  const [activePuzzle, setActivePuzzle] = React.useState(null);

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1120, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      {!activePuzzle ? (
        <>
          <div style={{textAlign:'center', marginBottom:40}}>
            <h1 style={{fontFamily:'var(--font-display)', fontSize:54, color:'var(--c-clay)', fontWeight:800}}>كنوز الجزائر</h1>
            <p style={{fontSize:18, color:'#7a5538', marginTop:10}}>ركّب الصور واكتشف معالم وطننا الجميلة</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24}}>
            {PUZZLES.map(p => (
              <button key={p.id} onClick={()=>setActivePuzzle(p)} className="squish" style={{
                background:'#FFF6E5', borderRadius:32, padding:0, overflow:'hidden',
                border:'3px solid var(--c-amber)', boxShadow:'0 8px 0 rgba(60,30,10,.1)', textAlign:'right'
              }}>
                <img src={p.img} alt={p.title} style={{width:'100%', height:200, objectFit:'cover'}}/>
                <div style={{padding:20}}>
                  <div style={{fontSize:12, fontWeight:800, color:'var(--c-amber)'}}>{p.difficulty} · {p.pieces} قطع</div>
                  <h3 style={{fontFamily:'var(--font-display)', fontSize:24, marginTop:4}}>{p.title}</h3>
                  <p style={{fontSize:14, color:'#7a5538', marginTop:8}}>{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <PuzzleBoard 
          puzzle={activePuzzle} 
          ageBand={ctx.profile?.ageBand} 
          onBack={()=>setActivePuzzle(null)} 
          onComplete={()=>{
            alert('أحسنت! لقد أكملت اللغز بنجاح!');
            setActivePuzzle(null);
          }}
        />
      )}
    </div>
  );
}

function PuzzleBoard({puzzle, ageBand='7-10', onBack, onComplete}) {
  const isJunior = ageBand === '3-6';
  const isMaster = ageBand === '11+';
  
  const size = isJunior ? 2 : isMaster ? 6 : Math.sqrt(puzzle.pieces);
  const totalPieces = size * size;
  
  const [tiles, setTiles] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    const initial = [];
    for (let i = 0; i < totalPieces; i++) {
      initial.push(i);
    }
    // Shuffle
    for (let i = initial.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initial[i], initial[j]] = [initial[j], initial[i]];
    }
    setTiles(initial);
  }, [puzzle]);

  const handleTileClick = (index) => {
    if (selected === null) {
      setSelected(index);
    } else {
      // Swap
      const newTiles = [...tiles];
      [newTiles[selected], newTiles[index]] = [newTiles[index], newTiles[selected]];
      setTiles(newTiles);
      setSelected(null);

      // Check win
      if (newTiles.every((val, i) => val === i)) {
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div style={{maxWidth:600, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h2 style={{fontFamily:'var(--font-display)', fontSize:32}}>{puzzle.title}</h2>
        <button onClick={onBack} style={{padding:'8px 16px', background:'var(--c-soft)', borderRadius:12, fontWeight:700}}>تغيير الصورة</button>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:`repeat(${size}, 1fr)`, gap:4,
        background:'#FFF6E5', padding:6, borderRadius:16, border:'4px solid var(--c-amber)',
        boxShadow:'0 12px 30px rgba(0,0,0,.15)', aspectRatio:'1/1', overflow:'hidden'
      }}>
        {tiles.map((tileIdx, i) => {
          const x = tileIdx % size;
          const y = Math.floor(tileIdx / size);
          return (
            <button
              key={i}
              onClick={()=>handleTileClick(i)}
              style={{
                background:`url(${puzzle.img})`,
                backgroundSize:`${size*100}% ${size*100}%`,
                backgroundPosition:`${(x / (size-1)) * 100}% ${(y / (size-1)) * 100}%`,
                border: selected === i ? '4px solid #FFF' : '1px solid rgba(0,0,0,.1)',
                borderRadius:8, cursor:'pointer', position:'relative',
                transform: selected === i ? 'scale(0.95)' : 'none',
                transition:'transform 0.2s'
              }}
            >
              {selected === i && <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,.3)'}}/>}
            </button>
          );
        })}
      </div>

      <div style={{marginTop:30, textAlign:'center', color:'#7a5538', fontSize:16}}>
        {isJunior ? 'المس قطعتين لتبديلهما!' : 'انقر على قطعة ثم على أخرى لتبديل أماكنهما حتى تكتمل الصورة!'}
      </div>
      
      {isMaster && (
        <div style={{marginTop:20, background:'#E3F2FD', padding:15, borderRadius:15, border:'2px solid #2196F3', fontSize:13}}>
          <strong>تحدي المحترفين:</strong> الصورة مقسمة لـ 36 قطعة. ركز على التفاصيل المعمارية للمعلم!
        </div>
      )}
    </div>
  );
}

window.SectionPuzzles = SectionPuzzles;
