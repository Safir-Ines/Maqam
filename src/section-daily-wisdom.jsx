// Daily wisdom section — motivational quote for kids
function SectionDailyWisdom({ctx}) {
  const now = new Date();
  const dateLabel = now.toLocaleDateString('ar-DZ', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const idx = (now.getDate() + now.getMonth()) % DAILY_WISDOM.length;
  const wisdom = DAILY_WISDOM[idx];

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:980, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:16}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{textAlign:'center', marginBottom:18}}>
        <div style={{fontSize:13, fontWeight:800, color:'var(--c-amber)'}}>حكمة اليوم</div>
        <h1 style={{fontFamily:'var(--font-display)', fontSize:44, marginTop:8}}>رسالة تشجيع لك</h1>
        <div style={{fontSize:15, color:'#7a5538', marginTop:4}}>{dateLabel}</div>
      </div>

      <div style={{
        background:'linear-gradient(135deg, #E8F4ED, #FFF6E5)', borderRadius:30,
        border:'3px solid var(--c-mint)', padding:'26px 24px',
        display:'grid', gridTemplateColumns:'150px 1fr', gap:20, alignItems:'center'
      }}>
        <img src="assets/storyteller.png" alt={wisdom.author} style={{width:140, height:140, objectFit:'contain'}}/>
        <div>
          <div style={{
            background:'#FFFBF1', border:'2px dashed var(--c-mint)', borderRadius:20, padding:'18px 16px',
            fontSize:24, lineHeight:1.8, fontFamily:'var(--font-display)', color:'#2A1810'
          }}>
            "{wisdom.text}"
          </div>
          <div style={{fontSize:14, color:'#2C7A51', fontWeight:800, marginTop:10}}>
            قالها: {wisdom.author}
          </div>
        </div>
      </div>
    </div>
  );
}

window.SectionDailyWisdom = SectionDailyWisdom;
