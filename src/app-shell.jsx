import React, { useEffect } from 'react';
// App shell — kid home + section nav
const { useState: useState_app, useEffect: useEffect_app } = React;

function AppShell({onExit, sectionInitial='home', profile}) {
  const [section, setSection] = useState_app(sectionInitial);
  const [collected, setCollected] = useState_app(() => {
    try {
      const s = localStorage.getItem('maqam_collected');
      return s ? JSON.parse(s) : ['algiers'];
    } catch { return ['algiers']; }
  });
  const [premium, setPremium] = useState_app(false);

  const collect = (id) => setCollected(prev => prev.includes(id) ? prev : [...prev, id]);

  useEffect_app(() => {
    localStorage.setItem('maqam_collected', JSON.stringify(collected));
  }, [collected]);

  const ctx = { setSection, collected, collect, premium, setPremium, profile };

  return (
    <div style={shellStyles.app}>
      <TopBar onExit={onExit} setSection={setSection} collected={collected} profile={profile}/>
      <div style={{minHeight:'calc(100vh - 90px)'}}>
        {section === 'home' && <KidHome ctx={ctx} profile={profile}/>}
        {section === 'game' && <SectionGame ctx={ctx}/>}
        {section === 'stories' && <SectionStories ctx={ctx}/>}
        {section === 'puzzles' && <SectionPuzzles ctx={ctx}/>}
        {section === 'kitchen' && <SectionKitchen ctx={ctx}/>}
        {section === 'dresses' && <SectionDresses ctx={ctx}/>}
        {section === 'passport' && <SectionPassport ctx={ctx}/>}
        {section === 'parent' && <SectionParentDashboard ctx={ctx}/>}
        {section === 'nationalHistory' && <SectionNationalHistory ctx={ctx}/>}
        {section === 'todayHistory' && <SectionTodayHistory ctx={ctx}/>}
        {section === 'dailyWisdom' && <SectionDailyWisdom ctx={ctx}/>}
        {section === 'math' && <SectionMath ctx={ctx}/>}
        {section === 'spell' && <SectionSpell ctx={ctx}/>}
        {section === 'album' && <Album ctx={ctx}/>}
        {section === 'coloring' && <SectionColoring ctx={ctx}/>}
      </div>
    </div>
  );
}

const shellStyles = {
  app: { minHeight:'100vh', background:'var(--c-paper)' },
  topbar: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'16px 4%', background:'#FFF6E5',
    borderBottom:'3px dashed var(--c-soft)', position:'sticky', top:0, zIndex:40
  },
};

function TopBar({onExit, setSection, collected, profile}) {
  return (
    <div style={shellStyles.topbar}>
      <div style={{display:'flex', alignItems:'center', gap:14}}>
        <button onClick={onExit} className="squish" style={{
          width:44, height:44, borderRadius:14, background:'var(--c-soft)',
          display:'grid', placeItems:'center'
        }} title="الرجوع للصفحة الرئيسية">
          <Icon.Back size={22} color="var(--c-clay)"/>
        </button>
        <button onClick={()=>setSection('home')} style={{display:'flex', alignItems:'center', gap:10}}>
          <img src="/assets/logo-maqam-transparent.png" alt="مقام" style={{height:40}}/>
        </button>
      </div>
      
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <button onClick={()=>setSection('parent')} className="squish" style={{
          background:'#F1F5F9', color:'#475569', padding:'8px 14px', borderRadius:14,
          display:'flex', gap:6, alignItems:'center', border:'1px solid #E2E8F0',
          fontSize:12, fontWeight:700
        }}>
          <Icon.Settings size={16}/> لوحة الأولياء
        </button>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <button onClick={()=>setSection('passport')} className="squish" style={{
          background:'#8B4513', color:'#FFF', padding:'8px 16px', borderRadius:20,
          display:'flex', gap:8, alignItems:'center', border:'3px solid #5D2E0A',
          boxShadow:'0 4px 0 #5D2E0A', fontSize:14, fontWeight:800
        }}>
          <Icon.Cards size={20}/> جواز السفر
        </button>
        <button onClick={()=>setSection('album')} className="squish" style={{
          background:'#FFE9C4', padding:'10px 16px', borderRadius:999,
          display:'flex', gap:8, alignItems:'center', fontWeight:700, fontSize:14, color:'#5a3a1f',
          border:'2px solid var(--c-amber)'
        }}>
          <Icon.Cards size={18} color="var(--c-amber)"/>
          ألبومي · {collected.length}/{REGIONS.length}
        </button>
        <div style={{width:42, height:42, borderRadius:'50%', background:'var(--c-soft)',
          display:'grid', placeItems:'center', color:'#FFF6E5', border:'2px solid #FFF6E5', overflow:'hidden'}}>
          <img src={profile?.avatar || '/assets/pfp/girl.png'} alt={profile?.name || 'Profile'} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>
      </div>
    </div>
  );
}

function KidHome({ctx, profile}) {
  const now = new Date();
  const todayKey = `${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const todayEvent = TODAY_HISTORY_EVENTS[todayKey];
  const ageBand = profile?.ageBand || '7-10';
  const sectionsByBand = {
    '3-6': [
      {id:'kitchen', icon:<Icon.Sparkle size={80}/>, title:'مطبخنا', subtitle:'أكلات لذيذة', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'dresses', icon:<Icon.Crown size={80}/>, title:'أزياء بلادي', subtitle:'تراثنا الجميل', color:'#E91E63', bg:'#FFF0F5', tag:'جديد'},
      {id:'puzzles', icon:<Icon.Game size={80}/>, title:'كنوز الجزائر', subtitle:'ألغاز الصور', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'coloring', icon:<Icon.Brush size={80}/>, title:'التلوين', subtitle:'ألوان مرحة للأطفال', color:'#9B51E0', bg:'#F3E8FF', tag:null},
      {id:'stories', icon:<Icon.Book size={80}/>, title:'قارئ القصص', subtitle:'قصص قصيرة وسهلة', color:'#E67E22', bg:'#FFE9C4', tag:null},
      {id:'nationalHistory', icon:<Icon.Star size={80}/>, title:'أبطال الجزائر', subtitle:'تعرف على أبطالنا', color:'#C0392B', bg:'#FBE3DF', tag:'مهم'},
      {id:'math', icon:<Icon.Math size={80}/>, title:'تعلم الحساب', subtitle:'عدّ وجمع بسيط', color:'#2C7A51', bg:'#E8F4ED', tag:'سهل'},
      {id:'spell', icon:<Icon.Spell size={80}/>, title:'تعلم الحروف', subtitle:'الحروف الأبجدية', color:'#C0392B', bg:'#FBE3DF', tag:'سهل'},
      {id:'dailyWisdom', icon:<Icon.Sparkle size={80} color="#7B4CC2"/>, title:'حكمة اليوم', subtitle:'رسالة تشجيع يومية', color:'#7B4CC2', bg:'#F4EBFF', tag:'يومي'},
    ],
    '7-10': [
      {id:'passport', icon:<Icon.Cards size={80}/>, title:'جواز السفر', subtitle:'رحلاتك الاستكشافية', color:'#8B4513', bg:'#F5E6D3', tag:'مهم'},
      {id:'kitchen', icon:<Icon.Sparkle size={80}/>, title:'مطبخنا', subtitle:'أكلات لذيذة', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'dresses', icon:<Icon.Crown size={80}/>, title:'أزياء بلادي', subtitle:'تراثنا الجميل', color:'#E91E63', bg:'#FFF0F5', tag:'جديد'},
      {id:'game', icon:<Icon.Game size={80}/>, title:'العاب الخريطة', subtitle:'8 مغامرات', color:'#F9C74F', bg:'#FFF6E5', tag:null},
      {id:'stories', icon:<Icon.Book size={80}/>, title:'قصص الوطن', subtitle:'قصص أوضح وأطول', color:'#E67E22', bg:'#FFE9C4', tag:null},
      {id:'puzzles', icon:<Icon.Game size={80}/>, title:'كنوز الجزائر', subtitle:'ألغاز الصور', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'nationalHistory', icon:<Icon.Star size={80}/>, title:'التاريخ الوطني', subtitle:'رحلة عبر الزمن', color:'#C0392B', bg:'#FBE3DF', tag:'جديد'},
      {id:'todayHistory', icon:<Icon.Book size={80}/>, title:'تاريخ اليوم', subtitle:'أحداث تاريخية مبسطة', color:'#5B6EE1', bg:'#EEF0FF', tag:'جديد'},
      {id:'math', icon:<Icon.Math size={80}/>, title:'الحساب المتقدم', subtitle:'عمليات وتحديات', color:'#2C7A51', bg:'#E8F4ED', tag:'متقدم'},
      {id:'spell', icon:<Icon.Spell size={80}/>, title:'تعلم الإنجليزية', subtitle:'مفردات وكلمات', color:'#C0392B', bg:'#FBE3DF', tag:'جديد'},
      {id:'dailyWisdom', icon:<Icon.Sparkle size={80} color="#7B4CC2"/>, title:'حكمة اليوم', subtitle:'رسالة تشجيع يومية', color:'#7B4CC2', bg:'#F4EBFF', tag:'يومي'},
    ],
    '11+': [
      {id:'passport', icon:<Icon.Cards size={80}/>, title:'جواز السفر', subtitle:'رحلاتك الاستكشافية', color:'#8B4513', bg:'#F5E6D3', tag:'مهم'},
      {id:'kitchen', icon:<Icon.Sparkle size={80}/>, title:'مطبخنا', subtitle:'أكلات لذيذة', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'dresses', icon:<Icon.Crown size={80}/>, title:'أزياء بلادي', subtitle:'تراثنا الجميل', color:'#E91E63', bg:'#FFF0F5', tag:'جديد'},
      {id:'game', icon:<Icon.Game size={80}/>, title:'تحديات الخريطة', subtitle:'أسئلة أصعب ومراحل أدق', color:'#F9C74F', bg:'#FFF6E5', tag:'متقدم'},
      {id:'stories', icon:<Icon.Book size={80}/>, title:'قصص معمقة', subtitle:'قراءة تاريخية أعمق', color:'#E67E22', bg:'#FFE9C4', tag:'تحليل'},
      {id:'puzzles', icon:<Icon.Game size={80}/>, title:'كنوز الجزائر', subtitle:'ألغاز الصور', color:'#F2994A', bg:'#FFF6E5', tag:'جديد'},
      {id:'todayHistory', icon:<Icon.Book size={80}/>, title:'تحليل حدث اليوم', subtitle:'سياق تاريخي وتفكير نقدي', color:'#5B6EE1', bg:'#EEF0FF', tag:'متقدم'},
      {id:'math', icon:<Icon.Math size={80}/>, title:'رياضيات متقدمة', subtitle:'ألغاز منطق ومسائل', color:'#2C7A51', bg:'#E8F4ED', tag:'متقدم'},
      {id:'spell', icon:<Icon.Spell size={80}/>, title:'English Skills', subtitle:'Vocabulary and comprehension', color:'#C0392B', bg:'#FBE3DF', tag:'advanced'},
      {id:'dailyWisdom', icon:<Icon.Sparkle size={80} color="#7B4CC2"/>, title:'حكمة اليوم', subtitle:'رسالة تشجيع يومية', color:'#7B4CC2', bg:'#F4EBFF', tag:'يومي'},
    ],
  };
  const sections = sectionsByBand[ageBand] || sectionsByBand['7-10'];
  return (
    <div style={{padding:'40px 6% 80px', maxWidth:1280, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32}}>
        <div>
          <div style={{fontSize:16, color:'#7a5538'}}>مرحبًا</div>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:48, fontWeight:700, marginTop:4}}>
            هيّا نلعب يا {profile?.name || 'صديقي'}!
          </h1>
        </div>
        <div style={{display:'flex', gap:14}}>
          <Stat icon={<Icon.Sparkle size={24} color="var(--c-amber)"/>} label="نقاطك" value="240"/>
          <Stat icon={<Icon.Cards size={24} color="var(--c-mint)"/>} label="أبطالك" value={`${ctx.collected.length}/${REGIONS.length}`}/>
          <Stat icon={<Icon.Star size={24} color="var(--c-clay)"/>} label="أيام متتالية" value="7"/>
        </div>
      </div>

      {todayEvent && (
        <button onClick={()=>ctx.setSection('todayHistory')} className="squish" style={{
          width:'100%', marginBottom:18, textAlign:'right',
          background:'linear-gradient(135deg, #5B6EE1, #7B4CC2)', color:'#FFF6E5',
          borderRadius:22, border:'3px solid rgba(255,255,255,.25)',
          padding:'16px 18px', display:'flex', alignItems:'center', gap:14
        }}>
          <div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,.18)', display:'grid', placeItems:'center'}}>
            <Icon.Book size={24} color="#FFF6E5"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12, opacity:.9, fontWeight:700}}>إشعار اليوم</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700}}>اكتشف ماذا حدث اليوم في تاريخ الجزائر</div>
          </div>
          <Icon.Back size={20} color="#FFF6E5" rtl={true}/>
        </button>
      )}

      {/* Daily mission */}
      <div style={{
        background:'linear-gradient(135deg, var(--c-clay), var(--c-amber))',
        borderRadius:28, padding:'24px 32px', display:'flex', alignItems:'center', gap:24,
        color:'#FFF6E5', marginBottom:32, position:'relative', overflow:'hidden'
      }}>
        <div style={{position:'absolute', insetInlineEnd:18, top:18, opacity:.22}}>
          <Icon.Sparkle size={84} color="#FFF6E5"/>
        </div>
        <div style={{width:74, height:74, borderRadius:'50%', background:'rgba(255,255,255,.16)', display:'grid', placeItems:'center'}}>
          <Icon.Cards size={38} color="#FFF6E5"/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14, opacity:.9, fontWeight:700}}>تحدّي اليوم</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, marginTop:4}}>
            أكمل لعبة وهران واحصل على بطاقة جديدة!
          </div>
        </div>
        <button onClick={()=>ctx.setSection('game')} className="squish" style={{
          background:'#FFF6E5', color:'var(--c-clay)', padding:'14px 28px', borderRadius:999,
          fontWeight:800, fontSize:16, boxShadow:'0 4px 0 rgba(0,0,0,.2)'
        }}>ابدأ الآن</button>
      </div>

      {/* Section grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:20}}>
        {sections.map((s) => (
          <button key={s.id} onClick={()=>ctx.setSection(s.id)} className="squish" style={{
            background:s.bg, padding:'32px 28px', borderRadius:32, textAlign:'right',
            border:`3px solid ${s.color}`, boxShadow:'0 8px 0 rgba(60,30,10,.1)',
            position:'relative', cursor:'pointer'
          }}>
            {s.tag && (
              <div style={{position:'absolute', top:14, insetInlineEnd:14, background:'var(--c-clay)',
                color:'#FFF6E5', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:999,
                display:'flex', gap:4, alignItems:'center'}}>
                <Icon.Crown size={12} color="#FFF6E5"/>{s.tag}
              </div>
            )}
            <div style={{marginBottom:16}}>{s.icon}</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700}}>{s.title}</div>
            <div style={{fontSize:14, color:'#7a5538', marginTop:4}}>{s.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({icon, label, value}) {
  return (
    <div style={{
      background:'#FFF6E5', padding:'10px 18px', borderRadius:18,
      display:'flex', gap:10, alignItems:'center', border:'2px solid var(--c-soft)'
    }}>
      <div style={{width:24, height:24, display:'grid', placeItems:'center'}}>{icon}</div>
      <div>
        <div style={{fontSize:11, color:'#7a5538'}}>{label}</div>
        <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:700}}>{value}</div>
      </div>
    </div>
  );
}

function Album({ctx}) {
  return (
    <div style={{padding:'40px 6%', maxWidth:1280, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:20}}>
        <Icon.Back size={18} color="var(--c-clay)"/> العودة
      </button>
      <h1 style={{fontFamily:'var(--font-display)', fontSize:48, fontWeight:700}}>ألبوم الأبطال</h1>
      <p style={{fontSize:17, color:'#7a5538', marginTop:8}}>
        جمعت <b>{ctx.collected.length}</b> بطل من أصل {REGIONS.length} · أكمل مستويات كل منطقة لكشفهم
      </p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:20, marginTop:32}}>
        {REGIONS.map(region => {
          const has = ctx.collected.includes(region.id);
          return has ? (
            <HeroAlbumCard key={region.id} region={region}/>
          ) : (
            <div key={region.id} style={{
              borderRadius:20, overflow:'hidden', position:'relative',
              border:'3px dashed #C7B89A', background:'#F0E5D0',
              aspectRatio:'3/4'
            }}>
              <img src={region.hero.img} alt="" style={{
                position:'absolute', inset:0, width:'100%', height:'100%',
                objectFit:'cover', objectPosition:'top',
                filter:'blur(14px) brightness(.25) grayscale(1)'
              }}/>
              <div style={{
                position:'absolute', inset:0, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', color:'#FFF6E5'
              }}>
                <Icon.Lock size={36} color="#FFF6E5"/>
                <div style={{fontSize:13, fontWeight:700, marginTop:8}}>غير مكتشف</div>
                <div style={{
                  marginTop:8, background: region.color, color:'#FFF6E5',
                  fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:999
                }}><Icon.Star size={11} color="#FFF6E5"/> {region.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroAlbumCard({region}) {
  return (
    <div style={{
      borderRadius:20, overflow:'hidden',
      border:'3px solid var(--c-mint)',
      boxShadow:'0 8px 20px rgba(60,30,10,.15)',
      background:'#FFF6E5',
      display:'flex', flexDirection:'column',
      transition:'transform .2s'
    }}
    onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
    >
      <div style={{position:'relative', paddingBottom:'115%', overflow:'hidden'}}>
        <img src={region.hero.img} alt={region.hero.name} style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'top'
        }}/>
        <div style={{
          position:'absolute', top:8, insetInlineEnd:8,
          background:region.color, color:'#FFF6E5',
          fontSize:11, fontWeight:800, padding:'4px 9px', borderRadius:999,
          boxShadow:'0 2px 6px rgba(0,0,0,.2)'
        }}><Icon.Star size={10} color="#FFF6E5"/> {region.name}</div>
        <div style={{
          position:'absolute', bottom:8, insetInlineStart:8,
          background:'var(--c-mint)', color:'#FFF6E5',
          fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:999
        }}><Icon.Check size={10} color="#FFF6E5"/> مكتشف</div>
      </div>
      <div style={{padding:'10px 12px 14px'}}>
        <div style={{fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'#3a2614'}}>
          {region.hero.name}
        </div>
        <div style={{fontSize:11, color:'#7a5538', marginTop:4, lineHeight:1.5}}>
          {region.hero.bio}
        </div>
      </div>
    </div>
  );
}

window.AppShell = AppShell;
