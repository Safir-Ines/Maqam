import React from 'react';
// Passport Section — tracks child's progress across Algerian cities
function SectionPassport({ctx}) {
  const visitedCount = ctx.collected.length;
  
  return (
    <div style={{padding:'40px 6% 80px', maxWidth:1000, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{
        background:'#8B4513', borderRadius:30, padding:40, border:'10px solid #5D2E0A',
        boxShadow:'0 20px 40px rgba(0,0,0,0.3)', color:'#FFF', position:'relative',
        backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      }}>
        {/* Passport Cover */}
        <div style={{textAlign:'center', borderBottom:'2px solid rgba(255,255,255,0.2)', paddingBottom:30, marginBottom:30}}>
          <div style={{fontSize:14, fontWeight:800, letterSpacing:4, opacity:0.8}}>REPUBLIQUE ALGERIENNE</div>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:42, marginTop:10}}>جواز سفر المستكشف</h1>
          <div style={{fontSize:60, margin:'20px 0'}}>🇩🇿</div>
          <div style={{fontSize:18, fontWeight:700}}>الاسم: {ctx.profile?.name || 'مستكشف ماهر'}</div>
        </div>

        {/* Stamps Grid */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:20}}>
          {REGIONS.map(r => {
            const isVisited = ctx.collected.includes(r.id);
            return (
              <div key={r.id} style={{
                aspectRatio:'1/1', borderRadius:'50%', border:'4px dashed rgba(255,255,255,0.3)',
                display:'grid', placeItems:'center', position:'relative',
                background: isVisited ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition:'all 0.3s ease'
              }}>
                {!isVisited ? (
                  <div style={{opacity:0.3, fontSize:12, fontWeight:800}}>{r.name}</div>
                ) : (
                  <div style={{
                    width:'85%', height:'85%', borderRadius:'50%', background:'#FFF',
                    border:'4px double var(--c-clay)', display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', color:'var(--c-clay)',
                    transform:'rotate(-15deg)', boxShadow:'0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{fontSize:10, fontWeight:900, borderBottom:'1px solid var(--c-clay)'}}>VISITED</div>
                    <div style={{fontSize:18, fontWeight:900, margin:'2px 0'}}>{r.name}</div>
                    <div style={{fontSize:10, fontWeight:700}}>{new Date().toLocaleDateString('ar-DZ')}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{marginTop:40, textAlign:'center', background:'rgba(0,0,0,0.2)', padding:20, borderRadius:20}}>
          <div style={{fontSize:20, fontWeight:800}}>لقد زرت {visitedCount} ولايات حتى الآن!</div>
          <p style={{fontSize:14, marginTop:6, opacity:0.8}}>أكمل المهام في الخريطة لتحصل على أختام جديدة في جواز سفرك.</p>
        </div>
      </div>
    </div>
  );
}

window.SectionPassport = SectionPassport;
