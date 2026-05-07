import React from 'react';
// Traditional Kitchen Section — Explore Algerian food
function SectionKitchen({ctx}) {
  const [activeDish, setActiveDish] = React.useState(null);

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1120, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:24}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      {!activeDish ? (
        <>
          <div style={{textAlign:'center', marginBottom:40}}>
            <h1 style={{fontFamily:'var(--font-display)', fontSize:54, color:'var(--c-clay)', fontWeight:800}}>مطبخنا الأصيل</h1>
            <p style={{fontSize:18, color:'#7a5538', marginTop:10}}>اكتشف أسرار المطبخ الجزائري العريق</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:24}}>
            {DISHES.map(d => (
              <button key={d.id} onClick={()=>setActiveDish(d)} className="squish" style={{
                background:'#FFF', borderRadius:32, padding:0, overflow:'hidden',
                border:'3px solid var(--c-soft)', boxShadow:'0 10px 0 var(--c-soft)', textAlign:'right'
              }}>
                <img src={d.img} alt={d.title} style={{width:'100%', height:240, objectFit:'cover'}}/>
                <div style={{padding:24}}>
                  <h3 style={{fontFamily:'var(--font-display)', fontSize:28, color:d.color}}>{d.title}</h3>
                  <p style={{fontSize:15, color:'#7a5538', marginTop:10}}>{d.desc}</p>
                  <div style={{marginTop:20, display:'flex', alignItems:'center', gap:8, color:'var(--c-clay)', fontWeight:800}}>
                    ابدأ التحضير <Icon.Play size={16}/>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <DishChef dish={activeDish} onBack={()=>setActiveDish(null)} ageBand={ctx.profile?.ageBand} />
      )}
    </div>
  );
}

function DishChef({dish, onBack, ageBand='7-10'}) {
  const [step, setStep] = React.useState(0);
  const [doneIngs, setDoneIngs] = React.useState([]);
  const [budget, setBudget] = React.useState(100);
  const [historyOpen, setHistoryOpen] = React.useState(false);

  const isJunior = ageBand === '3-6';
  const isMaster = ageBand === '11+';

  const addIng = (ing) => {
    if (doneIngs.includes(ing)) return;

    // 11+ mechanic: Budget management
    if (isMaster) {
      if (budget < 20) {
        alert('لقد نفذت ميزانيتك! كن حذراً في المرة القادمة.');
        return;
      }
      setBudget(b => b - 20);
    }

    const next = [...doneIngs, ing];
    setDoneIngs(next);

    if (next.length === dish.ingredients.length) {
      setTimeout(() => setStep(1), 800);
    }
  };

  return (
    <div style={{maxWidth:900, margin:'0 auto', background:'#FFF', borderRadius:40, padding:40, border:'4px solid var(--c-soft)', boxShadow:'0 20px 50px rgba(0,0,0,0.1)', position:'relative'}}>
      {isMaster && (
        <div style={{position:'absolute', top:-20, left:40, background:'var(--c-amber)', color:'#FFF', padding:'10px 20px', borderRadius:15, fontWeight:800, boxShadow:'0 4px 0 rgba(0,0,0,0.1)'}}>
          الميزانية: {budget} دج
        </div>
      )}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30}}>
        <div>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:36, color:dish.color}}>{dish.title}</h2>
          <div style={{fontSize:14, fontWeight:700, color:'#7a5538'}}>{isJunior ? 'اكتشف المكونات' : isMaster ? 'تحدي الشيف المحترف' : 'حضّر الطبق بدقة'}</div>
        </div>
        <button onClick={onBack} style={{padding:'10px 20px', background:'var(--c-soft)', borderRadius:16, fontWeight:800}}>خروج</button>
      </div>

      {step === 0 ? (
        <div>
          <h3 style={{fontSize:22, fontWeight:800, marginBottom:20}}>
            {isJunior ? 'المس المكونات لتعرف أسماءها' : isMaster ? 'اشترِ المكونات اللازمة بحكمة' : 'اجمع المكونات لتحضير الطبق'}
          </h3>
          <div style={{display:'flex', flexWrap:'wrap', gap:12, marginBottom:40}}>
            {dish.ingredients.map(ing => {
              const ok = doneIngs.includes(ing);
              return (
                <button key={ing} onClick={()=>addIng(ing)} style={{
                  padding: isJunior ? '24px 32px' : '16px 24px', 
                  borderRadius:20, fontSize: isJunior ? 22 : 18, fontWeight:700,
                  background: ok ? 'var(--c-mint)' : '#FFF6E5',
                  color: ok ? '#FFF' : '#7a5538',
                  border: `3px solid ${ok ? 'var(--c-mint)' : 'var(--c-amber)'}`,
                  transition:'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: ok ? 'scale(0.9) rotate(5deg)' : 'scale(1)',
                  boxShadow: ok ? 'none' : '0 6px 0 var(--c-amber)'
                }}>
                  {ok ? '✓ ' : '+ '} {ing}
                  {isMaster && !ok && <span style={{fontSize:12, opacity:0.7, display:'block'}}>20 دج</span>}
                </button>
              );
            })}
          </div>
          
          {isJunior && (
             <div style={{background:'var(--c-soft)', padding:20, borderRadius:20, textAlign:'center'}}>
                <Icon.Sparkle size={40} color="var(--c-amber)"/>
                <p style={{marginTop:10, fontWeight:700}}>كل مكون له حكاية في بلادنا!</p>
             </div>
          )}
        </div>
      ) : (
        <div style={{textAlign:'center', animation:'popIn 0.6s ease'}}>
          <div style={{fontSize:60, marginBottom:20}}>👨‍🍳</div>
          <h3 style={{fontSize:32, fontWeight:800, color:'var(--c-mint)'}}>
            {isJunior ? 'أحسنت يا بطل! انظر ماذا حضرنا' : isMaster ? 'نجحت في التحدي الاقتصادي والطهوي!' : 'عمل رائع! الطبق جاهز للتقديم'}
          </h3>
          
          <div style={{margin:'40px 0'}}>
            <img src={dish.img} style={{width:320, height:320, borderRadius:40, border:'8px solid var(--c-soft)', boxShadow:'0 20px 40px rgba(0,0,0,0.15)'}}/>
          </div>

          <div style={{display:'grid', gridTemplateColumns: isMaster ? '1fr 1fr' : '1fr', gap:20}}>
            <div style={{background:'var(--c-soft)', padding:24, borderRadius:24, textAlign:'right'}}>
              <h4 style={{fontSize:20, fontWeight:800, color:'var(--c-clay)'}}>💡 معلومة ذكية</h4>
              <p style={{fontSize:16, color:'#7a5538', marginTop:8}}>{dish.funFact}</p>
            </div>
            {isMaster && (
              <div style={{background:'#E3F2FD', padding:24, borderRadius:24, textAlign:'right', border:'2px solid #2196F3'}}>
                <h4 style={{fontSize:20, fontWeight:800, color:'#1976D2'}}>📜 الأصل التاريخي</h4>
                <p style={{fontSize:14, color:'#455A64', marginTop:8}}>يعود أصل هذا الطبق إلى العصور القديمة، حيث كان يعبر عن الجود والكرم الجزائري...</p>
              </div>
            )}
          </div>
          
          <button onClick={onBack} style={{marginTop:30, background:dish.color, color:'#FFF', padding:'16px 40px', borderRadius:999, fontSize:20, fontWeight:800}}>العودة للقائمة</button>
        </div>
      )}
    </div>
  );
}

window.SectionKitchen = SectionKitchen;
