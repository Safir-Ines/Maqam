import React from 'react';
// Section National History — interactive timeline and heroes hub
function SectionNationalHistory({ctx}) {
  const [activeTab, setActiveTab] = React.useState('timeline');

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1120, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{textAlign:'center', marginBottom:40}}>
        <h1 style={{fontFamily:'var(--font-display)', fontSize:54, color:'var(--c-clay)', fontWeight:800}}>التاريخ الوطني</h1>
        <p style={{fontSize:18, color:'#7a5538', marginTop:10}}>رحلة عبر الزمن لنكتشف أبطالنا ومحطاتنا العظيمة</p>
      </div>

      <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:40}}>
        <TabButton active={activeTab === 'timeline'} onClick={()=>setActiveTab('timeline')} icon={<Icon.Book size={20}/>} label="شريط الزمن"/>
        <TabButton active={activeTab === 'heroes'} onClick={()=>setActiveTab('heroes')} icon={<Icon.Star size={20}/>} label="أبطالنا"/>
        <TabButton active={activeTab === 'symbols'} onClick={()=>setActiveTab('symbols')} icon={<Icon.Crown size={20}/>} label="رموزنا"/>
      </div>

      {activeTab === 'timeline' && <TimelineView events={TIMELINE_EVENTS}/>}
      {activeTab === 'heroes' && <HeroesView regions={REGIONS}/>}
      {activeTab === 'symbols' && <SymbolsView/>}
    </div>
  );
}

function TabButton({active, onClick, icon, label}) {
  return (
    <button onClick={onClick} className="squish" style={{
      padding:'14px 28px', borderRadius:999, border:'3px solid',
      borderColor: active ? 'var(--c-amber)' : 'var(--c-soft)',
      background: active ? 'var(--c-amber)' : '#FFF',
      color: active ? '#FFF' : '#7a5538',
      fontSize:17, fontWeight:800, display:'flex', alignItems:'center', gap:10,
      transition:'all .25s ease'
    }}>
      {icon} {label}
    </button>
  );
}

function TimelineView({events}) {
  return (
    <div style={{position:'relative', padding:'20px 0'}}>
      <div style={{position:'absolute', insetInlineStart:34, top:0, bottom:0, width:6, background:'var(--c-soft)', borderRadius:10}}></div>
      <div style={{display:'grid', gap:32}}>
        {events.map((ev, i) => (
          <div key={i} style={{display:'grid', gridTemplateColumns:'80px 1fr', gap:20, alignItems:'start', position:'relative'}}>
            <div style={{
              width:68, height:68, borderRadius:'50%', background:'var(--c-paper)',
              border:'6px solid var(--c-amber)', display:'grid', placeItems:'center',
              fontSize:18, fontWeight:900, color:'var(--c-clay)', zIndex:2, position:'relative'
            }}>
              {ev.year}
            </div>
            <div style={{
              background:'#FFF', padding:'24px', borderRadius:24, border:'2px solid var(--c-soft)',
              boxShadow:'0 6px 16px rgba(60,30,10,.06)'
            }}>
              <h3 style={{fontFamily:'var(--font-display)', fontSize:24, color:'var(--c-clay)'}}>{ev.title}</h3>
              <p style={{fontSize:16, color:'#5a3a1f', marginTop:8, lineHeight:1.7}}>{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroesView({regions}) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:24}}>
      {regions.map(r => (
        <div key={r.id} style={{
          background:'#FFF', borderRadius:28, overflow:'hidden', border:'3px solid var(--c-soft)',
          display:'flex', flexDirection:'column'
        }}>
          <div style={{height:220, background:'#F0E5D0', overflow:'hidden', position:'relative'}}>
            <img src={r.hero.img} style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'top'}} alt={r.hero.name}/>
            <div style={{position:'absolute', bottom:12, insetInlineEnd:12, background:'var(--c-amber)', color:'#FFF', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:800}}>
              بطل {r.name}
            </div>
          </div>
          <div style={{padding:20}}>
            <h3 style={{fontFamily:'var(--font-display)', fontSize:22, color:'var(--c-ink)'}}>{r.hero.name}</h3>
            <p style={{fontSize:14, color:'#7a5538', marginTop:10, lineHeight:1.6}}>{r.hero.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SymbolsView() {
  const symbols = [
    {id:'flag',   title:'العلم الوطني', desc:'الأخضر يرمز للأمل، الأبيض للسلام، والأحمر لدم الشهداء.', icon:'🇩🇿'},
    {id:'anthem', title:'النشيد الوطني', desc:'"قسماً" هو نشيدنا العظيم الذي كتبه الشاعر مفدي زكريا.', icon:'🎶'},
    {id:'map',    title:'خريطة الوطن',  desc:'أكبر بلد في إفريقيا، يجمع بين البحر والسهول والجبال والصحراء.', icon:'📍'},
  ];

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:24}}>
      {symbols.map(s => (
        <div key={s.id} style={{
          background:'linear-gradient(135deg, #FFF, #FFF6E5)', borderRadius:32, padding:30,
          border:'3px solid var(--c-soft)', textAlign:'center'
        }}>
          <div style={{fontSize:60, marginBottom:20}}>{s.icon}</div>
          <h3 style={{fontFamily:'var(--font-display)', fontSize:28, color:'var(--c-clay)'}}>{s.title}</h3>
          <p style={{fontSize:16, color:'#5a3a1f', marginTop:12, lineHeight:1.7}}>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

window.SectionNationalHistory = SectionNationalHistory;
