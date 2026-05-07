import React from 'react';
// Landing — desert hero screen
function Landing({onEnter}) {
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(180deg, #F5C842 0%, #E8A020 70%, #C87820 100%)',
      overflow:'hidden', position:'relative',
      display:'flex', flexDirection:'column'
    }}>

      {/* Top bar */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'16px 5%', position:'relative', zIndex:10
      }}>
        <button onClick={onEnter} className="squish" style={{
          background:'#C0392B', color:'#FFF6E5',
          padding:'10px 22px', borderRadius:999,
          fontSize:15, fontWeight:800,
          display:'flex', gap:8, alignItems:'center',
          boxShadow:'0 4px 0 #8B2616', border:'none', cursor:'pointer'
        }}>
          <Icon.Play size={16} color="#FFF6E5"/>
          ادخل العب
        </button>
        <img src="/assets/logo-maqam-transparent.png" alt="مقام" style={{height:40}}/>
      </div>

      {/* Hero grid */}
      <div style={{
        flex:1, display:'grid',
        gridTemplateColumns:'1fr 1.5fr',
        gap:0, padding:'0 5% 0',
        alignItems:'center',
        maxWidth:1200, margin:'0 auto', width:'100%',
        position:'relative', zIndex:5
      }}>

        {/* Left — sun illustration */}
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Deco.Sun size={260} color="#F9C74F"/>
        </div>

        {/* Right — headline + CTA */}
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:15, fontWeight:700, color:'rgba(42,24,16,.55)', marginBottom:12, letterSpacing:2}}>
            · مرحبًا بك ·
          </div>

          <h1 style={{
            fontFamily:'var(--font-display)',
            fontSize:'clamp(48px, 6.5vw, 84px)',
            fontWeight:900, lineHeight:1.15,
            color:'#2A1810', marginBottom:20
          }}>
            بلادي الجزائر،<br/>
            <span style={{color:'#2C7A51'}}>اتعلم</span>،{' '}
            <span style={{color:'var(--c-clay)'}}>العب</span>،<br/>
            <span style={{color:'#1B5E3B'}}>واكتشف</span>.
          </h1>

          <p style={{
            fontSize:'clamp(14px, 1.7vw, 18px)',
            color:'#5a3a1f', lineHeight:1.75,
            maxWidth:400, marginBottom:36, marginInlineStart:'auto'
          }}>
            موقع تعليمي ممتع للأطفال من 5 إلى 10 سنوات، يحكي الجزائر بأحلى صورة.
          </p>

          <button onClick={onEnter} className="squish" style={{
            background:'var(--c-mint)', color:'#FFF6E5',
            padding:'18px 48px', borderRadius:999,
            fontSize:22, fontWeight:900,
            boxShadow:'0 8px 0 #1d5439', border:'none', cursor:'pointer',
            display:'inline-flex', gap:12, alignItems:'center'
          }}>
            <Icon.Play size={22} color="#FFF6E5"/>
            هيّا نبدأ!
          </button>
        </div>
      </div>

      {/* Layered mountains at bottom */}
      <div style={{position:'relative', zIndex:6, marginTop:16}}>
        <div style={{position:'absolute', bottom:0, left:0, right:0}}>
          <Deco.Mountains color="#8B4513"/>
        </div>
        <Deco.Mountains color="#C87020"/>
      </div>

    </div>
  );
}

// Stub exports kept for compatibility
function TreasureCard() { return null; }
function MiniMap() { return null; }

window.Landing = Landing;
window.TreasureCard = TreasureCard;
window.MiniMap = MiniMap;
