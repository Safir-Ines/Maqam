import React from 'react';
// Math + Spell sections share a similar grid + lock pattern
const { useState: useS_m } = React;

function SectionMath({ctx}) {
  const ageBand = ctx?.profile?.ageBand || '7-10';
  const subtitleByBand = {
    '3-6': '6 ألعاب لتعلّم الأرقام والعمليات البسيطة',
    '7-10': '6 ألعاب لعمليات أسرع وتحديات أذكى',
    '11+': '6 ألعاب لمسائل منطق ورياضيات متقدمة',
  };
  return <LockedGameGrid title="الحساب الممتع" subtitle={subtitleByBand[ageBand] || subtitleByBand['7-10']}
    accent="#2C7A51" bg="#E8F4ED" games={MATH_GAMES} ctx={ctx} sample={<CountTamr/>}/>;
}

function CountTamr() {
  const [count, setCount] = useS_m(3);
  const [picked, setPicked] = useS_m(null);
  const correct = 3;
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:14, fontWeight:700, color:'var(--c-mint)', letterSpacing:1}}>· جرب لعبة ·</div>
      <h3 style={{fontFamily:'var(--font-display)', fontSize:28, marginTop:6}}>كم تمرة تشاهد؟</h3>
      <div style={{fontSize:80, margin:'24px 0', letterSpacing:8}}>
        {Array.from({length:count}).map((_,i)=><span key={i}>🌴</span>)}
      </div>
      <div style={{display:'flex', gap:12, justifyContent:'center'}}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={()=>setPicked(n)} className="squish" style={{
            width:60, height:60, borderRadius:18, fontSize:24, fontWeight:800,
            background: picked === n ? (n===correct?'var(--c-mint)':'var(--c-clay)') : '#FFF6E5',
            color: picked === n ? '#FFF6E5' : '#2A1810',
            border:`3px solid ${picked === n ? (n===correct?'var(--c-mint)':'var(--c-clay)') : 'var(--c-soft)'}`,
            boxShadow:'0 4px 0 rgba(0,0,0,.08)'
          }}>{n}</button>
        ))}
      </div>
      {picked === correct && <div style={{marginTop:16, fontSize:18, color:'var(--c-mint)', fontWeight:700}}>أحسنت! ⭐</div>}
      {picked && picked !== correct && <div style={{marginTop:16, fontSize:18, color:'var(--c-clay)', fontWeight:700}}>حاول مرة أخرى 💪</div>}
    </div>
  );
}

function SectionSpell({ctx}) {
  const ageBand = ctx?.profile?.ageBand || '7-10';
  const isYoung = ageBand === '3-6';
  const isOlder = ageBand === '11+';
  const title = isYoung ? 'الحروف والإملاء' : 'تعلم الإنجليزية';
  const subtitle = isYoung
    ? '4 ألعاب لتعلّم أبجد هوّز'
    : isOlder
      ? '4 ألعاب لمهارات لغة إنجليزية متقدمة'
      : '4 ألعاب لمفردات الإنجليزية الأساسية';
  return <LockedGameGrid title={title} subtitle={subtitle}
    accent="#C0392B" bg="#FBE3DF" games={SPELL_GAMES} ctx={ctx} sample={<AlphaSample/>}/>;
}

function AlphaSample() {
  const letters = ['أ','ب','ت','ث','ج','ح','خ'];
  const [picked, setPicked] = useS_m('أ');
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:14, fontWeight:700, color:'var(--c-clay)', letterSpacing:1}}>· جرب لعبة ·</div>
      <h3 style={{fontFamily:'var(--font-display)', fontSize:28, marginTop:6}}>اختر حرفًا لتسمعه</h3>
      <div style={{
        margin:'24px auto', width:200, height:200, borderRadius:24,
        background:'var(--c-clay)', color:'#FFF6E5', display:'grid', placeItems:'center',
        fontSize:140, fontFamily:'var(--font-display)', fontWeight:700,
        boxShadow:'0 8px 0 #8B2616'
      }}>{picked}</div>
      <div style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
        {letters.map(l => (
          <button key={l} onClick={()=>setPicked(l)} className="squish" style={{
            width:50, height:50, borderRadius:14, fontSize:22, fontWeight:800,
            background: picked === l ? 'var(--c-clay)' : '#FFF6E5',
            color: picked === l ? '#FFF6E5' : '#2A1810',
            border:'3px solid var(--c-clay)'
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

function LockedGameGrid({title, subtitle, accent, bg, games, ctx, sample}) {
  const [showPaywall, setShowPaywall] = useS_m(false);
  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1280, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:accent, marginBottom:16}}>
        <Icon.Back size={18} color={accent}/> الرئيسية
      </button>

      <div style={{textAlign:'center', marginBottom:32}}>
        <h1 style={{fontFamily:'var(--font-display)', fontSize:48, fontWeight:700}}>{title}</h1>
        <p style={{fontSize:17, color:'#7a5538', marginTop:8}}>{subtitle}</p>
      </div>

      {/* Sample game */}
      <div style={{
        background:bg, borderRadius:32, padding:'30px', border:`3px solid ${accent}`,
        marginBottom:32
      }}>
        {sample}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:18}}>
        {games.map((g, i) => {
          const locked = g.premium && !ctx.premium;
          return (
            <button key={g.id} onClick={()=>locked ? setShowPaywall(true) : null} className="squish" style={{
              background: locked ? '#F0E5D0' : '#FFF6E5',
              borderRadius:24, padding:'24px 20px', textAlign:'center',
              border:`3px solid ${locked ? '#C7B89A' : accent}`,
              boxShadow:'0 6px 0 rgba(60,30,10,.08)',
              position:'relative', cursor:'pointer',
              opacity: locked ? .85 : 1
            }}>
              {locked && (
                <div style={{position:'absolute', top:12, insetInlineEnd:12,
                  background:'linear-gradient(135deg, #F9C74F, #E67E22)',
                  width:36, height:36, borderRadius:'50%', display:'grid', placeItems:'center',
                  boxShadow:'0 3px 0 rgba(0,0,0,.15)'
                }}>
                  <Icon.Lock size={18} color="#FFF6E5"/>
                </div>
              )}
              <div style={{fontSize:64, marginBottom:10, filter: locked?'grayscale(.4)':'none'}}>{g.icon}</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:700}}>{g.title}</div>
              <div style={{fontSize:13, color:'#7a5538', marginTop:4}}>{g.desc}</div>
              <div style={{display:'inline-block', marginTop:12, background:'#FFF6E5',
                padding:'4px 12px', borderRadius:999, fontSize:11, fontWeight:700, color:accent,
                border:`2px solid ${accent}`}}>{g.level}</div>
            </button>
          );
        })}
      </div>

      {showPaywall && <Paywall onClose={()=>setShowPaywall(false)} onUnlock={()=>{ctx.setPremium(true); setShowPaywall(false);}}/>}
    </div>
  );
}

function Paywall({onClose, onUnlock}) {
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(42,24,16,.7)', backdropFilter:'blur(4px)',
      display:'grid', placeItems:'center', zIndex:100, padding:20
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#FFF6E5', borderRadius:32, maxWidth:480, width:'100%',
        border:'4px solid var(--c-amber)', overflow:'hidden',
        boxShadow:'0 20px 60px rgba(0,0,0,.3)'
      }}>
        <div style={{
          background:'linear-gradient(135deg, var(--c-clay), var(--c-amber))',
          padding:'30px 24px', textAlign:'center', color:'#FFF6E5', position:'relative'
        }}>
          <button onClick={onClose} style={{position:'absolute', top:14, insetInlineStart:14, width:36, height:36,
            borderRadius:'50%', background:'rgba(255,255,255,.25)', display:'grid', placeItems:'center'}}>
            <Icon.Close size={18} color="#FFF6E5"/>
          </button>
          <Icon.Crown size={64} color="#F9C74F"/>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, marginTop:10}}>افتح الكنز!</h2>
          <p style={{fontSize:14, marginTop:6, opacity:.95}}>اشترك في مقام مميّز واستمتع بكلّ الألعاب</p>
        </div>
        <div style={{padding:'24px'}}>
          {[
            'كلّ ألعاب الحساب 🔢',
            'كلّ ألعاب الحروف 📝',
            'القارئ الذكي بدون حدود 🎙',
            'كلّ مناطق الخريطة 🗺',
            'بطاقات نادرة حصرية ⭐',
          ].map((t,i) => (
            <div key={i} style={{display:'flex', gap:10, alignItems:'center', padding:'10px 0', fontSize:15}}>
              <Icon.Check size={20} color="var(--c-mint)"/>{t}
            </div>
          ))}
          <div style={{marginTop:20, padding:'16px', borderRadius:18, background:'#FFE9C4',
            border:'2px solid var(--c-amber)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:13, color:'#7a5538'}}>سنويًا</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:30, fontWeight:700, color:'var(--c-clay)'}}>7999 <span style={{fontSize:14, color:'#7a5538'}}>دج</span></div>
            </div>
            <div style={{background:'var(--c-mint)', color:'#FFF6E5', padding:'4px 10px', borderRadius:999,
              fontSize:11, fontWeight:800}}>وفّر 25٪</div>
          </div>
          <button onClick={onUnlock} className="squish" style={{
            width:'100%', marginTop:18, background:'var(--c-clay)', color:'#FFF6E5',
            padding:'18px', borderRadius:999, fontSize:18, fontWeight:800,
            boxShadow:'0 6px 0 #8B2616'
          }}>اشترك الآن 👑</button>
          <button onClick={onClose} style={{
            width:'100%', marginTop:10, padding:'12px', fontSize:14,
            color:'#7a5538', fontWeight:600
          }}>ربما لاحقًا</button>
        </div>
      </div>
    </div>
  );
}

window.SectionMath = SectionMath;
window.SectionSpell = SectionSpell;
