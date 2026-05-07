import React from 'react';
// What happened today section — kid-friendly Algerian history by date
function SectionTodayHistory({ctx}) {
  const now = new Date();
  const key = `${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const fallback = TODAY_HISTORY_EVENTS['05-08'];
  const event = TODAY_HISTORY_EVENTS[key] || fallback;
  const ageBand = ctx?.profile?.ageBand || '7-10';

  const eventByBand = {
    short: {
      '3-6': 'قصة اليوم بطريقة بسيطة وممتعة للصغار.',
      '7-10': event.short,
      '11+': `قراءة أعمق لحدث "${event.title}" مع فهم سياقه التاريخي.`,
    },
    story: {
      '3-6': [
        `في ${event.dateLabel} حدث أمر مهم في تاريخ الجزائر.`,
        'كان الناس يحبون وطنهم، وتعاونوا من أجل مستقبل أجمل.',
        'نتعلم من هذا اليوم أن الشجاعة والعمل معًا يصنعان الفرق.',
      ],
      '7-10': event.story,
      '11+': [
        `يُعد ${event.dateLabel} محطة مهمة ضمن مسار تشكّل الوعي الوطني الجزائري.`,
        'تكشف هذه الذكرى ارتباط الحدث التاريخي بالتحولات الاجتماعية والسياسية في تلك المرحلة.',
        'فهم هذا السياق يساعد على قراءة التاريخ كعملية متراكمة لا كحدث معزول.',
      ],
    },
  };
  const shortText = eventByBand.short[ageBand] || event.short;
  const storyParts = eventByBand.story[ageBand] || event.story;

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1080, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:16}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{
        background:'linear-gradient(135deg, #FFF6E5, #FFE9C4)',
        border:'3px solid var(--c-amber)', borderRadius:28, padding:'26px 24px',
        display:'grid', gridTemplateColumns:'120px 1fr', gap:18, alignItems:'center'
      }}>
        <img src="assets/storyteller.png" alt="الراوي" style={{width:110, height:110, objectFit:'contain'}}/>
        <div>
          <div style={{fontSize:13, fontWeight:800, color:'var(--c-amber)'}}>ماذا حدث في هذا اليوم؟</div>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:38, marginTop:6}}>{event.title}</h1>
          <div style={{fontSize:14, color:'#7a5538', marginTop:8}}>{event.dateLabel}</div>
        </div>
      </div>

      <div style={{
        marginTop:18, background:'#FFFBF1', border:'3px solid var(--c-soft)', borderRadius:24, padding:'24px'
      }}>
        <p style={{fontSize:18, color:'#5a3a1f', lineHeight:1.9, marginBottom:14}}>{shortText}</p>
        <div style={{display:'grid', gap:10}}>
          {storyParts.map((part, i) => (
            <div key={i} style={{
              background:'#FFF6E5', borderRadius:16, border:'2px solid var(--c-soft)',
              padding:'14px 16px', fontSize:17, lineHeight:1.9
            }}>
              {part}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SectionTodayHistory = SectionTodayHistory;
