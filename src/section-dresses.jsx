import React from 'react';
// Traditional Dresses Section — Explore Algerian cultural attire
function SectionDresses({ctx}) {
  const dresses = [
    {id:'karakou', title:'الكاراكو العاصمي', region:'الجزائر العاصمة', color:'#1A237E', desc:'زي عاصمي فاخر يتكون من سترة مخملية مطرزة بالخيط الذهبي.'},
    {id:'chedda', title:'الشدة التلمسانية', region:'تلمسان', color:'#D4AF37', desc:'زي تاريخي مرصع بالمجوهرات واللؤلؤ، يعكس أصالة تلمسان.'},
    {id:'kabyle', title:'الجبة القبائلية', region:'منطقة القبائل', color:'#E91E63', desc:'فستان ملون بتطريزات أمازيغية أصيلة تعبر عن الهوية والجمال.'},
    {id:'chaoui', title:'الملحفة الشاوية', region:'الأوراس', color:'#000000', desc:'لباس عريق يرمز للقوة والشموخ، يتزين بالخلالة الفضية.'},
  ];

  const [active, setActive] = React.useState(null);

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1120, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{textAlign:'center', marginBottom:40}}>
        <h1 style={{fontFamily:'var(--font-display)', fontSize:54, color:'var(--c-clay)', fontWeight:800}}>أزياء بلادي</h1>
        <p style={{fontSize:18, color:'#7a5538', marginTop:10}}>جمال وتنوع اللباس التقليدي الجزائري</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20}}>
        {dresses.map(d => (
          <button key={d.id} onClick={()=>setActive(d)} className="squish" style={{
            background:'#FFF', borderRadius:24, padding:20, textAlign:'right',
            border:`3px solid ${d.color}`, boxShadow:`0 8px 0 ${d.color}33`,
            position:'relative', overflow:'hidden'
          }}>
            <div style={{fontSize:40, marginBottom:16}}>👗</div>
            <h3 style={{fontFamily:'var(--font-display)', fontSize:24, color:d.color}}>{d.title}</h3>
            <div style={{fontSize:12, fontWeight:800, color:'#7a5538', marginTop:4}}>{d.region}</div>
            <p style={{fontSize:14, color:'#7a5538', marginTop:10, lineHeight:1.4}}>{d.desc}</p>
          </button>
        ))}
      </div>

      {active && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000,
          display:'grid', placeItems:'center', padding:20
        }} onClick={()=>setActive(null)}>
          <div style={{
            background:'#FFF', borderRadius:40, maxWidth:500, width:'100%', padding:40,
            textAlign:'center', border:`8px solid ${active.color}`, position:'relative'
          }} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:80, marginBottom:20}}>✨</div>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:36, color:active.color}}>{active.title}</h2>
            <p style={{fontSize:18, color:'#7a5538', marginTop:16}}>{active.desc}</p>
            <div style={{marginTop:30, padding:20, background:active.color+'11', borderRadius:20}}>
              <strong>المنطقة:</strong> {active.region}
            </div>
            <button onClick={()=>setActive(null)} style={{
              marginTop:30, background:active.color, color:'#FFF', padding:'14px 40px',
              borderRadius:999, fontSize:18, fontWeight:800
            }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.SectionDresses = SectionDresses;
