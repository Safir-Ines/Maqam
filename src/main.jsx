import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Side-effect imports to register globals on window
import '../tweaks-panel.jsx';
import './icons.jsx';
import './data.jsx';
import './landing.jsx';
import './app-shell.jsx';
import './section-game.jsx';
import './section-stories.jsx';
import './section-math.jsx';
import './section-spell.jsx';
import './section-coloring.jsx';
import './section-today-history.jsx';
import './section-parent-dashboard.jsx';
import './section-kitchen.jsx';
import './section-dresses.jsx';
import './section-passport.jsx';
import './section-puzzles.jsx';
import './section-national-history.jsx';
import './section-daily-wisdom.jsx';

// Main entry — wires landing → app shell + tweaks panel
const { useState: useS_main, useEffect: useE_main } = React;

const PALETTES = {
  warm:   {name:'الدفء الجزائري', clay:'#C0392B', amber:'#E67E22', sun:'#F9C74F', mint:'#2C7A51', cream:'#FFF6E5', paper:'#FFFBF1', soft:'#FFE9C4'},
  cool:   {name:'برودة البحر',     clay:'#2A6FDB', amber:'#3FA9C9', sun:'#7FE4D6', mint:'#1F8A5B', cream:'#EAF6FB', paper:'#F4FBFE', soft:'#D7EDF7'},
  desert: {name:'رمال الصحراء',    clay:'#B5651D', amber:'#D4A574', sun:'#F4D8A8', mint:'#7C8C5B', cream:'#FBF3E2', paper:'#FFF8EA', soft:'#F0E2BF'},
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 40, background: 'red', color: 'white', minHeight: '100vh', direction: 'ltr', textAlign: 'left'}}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [view, setView] = useS_main('landing'); // landing | app
  const [pickerOpen, setPickerOpen] = useS_main(false);
  const [activeProfileId, setActiveProfileId] = useS_main(() => {
    try { return localStorage.getItem('maqam_profile_id') || 'yasmine'; }
    catch { return 'yasmine'; }
  });
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "warm",
    "landingVariant": "hero"
  }/*EDITMODE-END*/);

  // Apply palette CSS vars
  useE_main(() => {
    const p = PALETTES[t.palette] || PALETTES.warm;
    const r = document.documentElement.style;
    r.setProperty('--c-clay', p.clay);
    r.setProperty('--c-amber', p.amber);
    r.setProperty('--c-sun', p.sun);
    r.setProperty('--c-mint', p.mint);
    r.setProperty('--c-cream', p.cream);
    r.setProperty('--c-paper', p.paper);
    r.setProperty('--c-soft', p.soft);
  }, [t.palette]);

  const profiles = [
    { id:'yasmine', name:'ياسمين', gender:'girl', ageBand:'3-6', avatar:'/assets/pfp/girl.png' },
    { id:'adam', name:'آدم', gender:'boy', ageBand:'7-10', avatar:'/assets/pfp/boy.png' },
    { id:'rayane', name:'ريان', gender:'boy', ageBand:'11+', avatar:'/assets/pfp/boy.png' },
  ];
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const p = PALETTES[t.palette] || PALETTES.warm;

  // Pre-load essential assets for instant display
  useE_main(() => {
    const assetsToLoad = [
      '/assets/logo-maqam-transparent.png',
      '/assets/pfp/girl.png',
      '/assets/pfp/boy.png',
      '/assets/charchters/algeria-map.png'
    ];
    assetsToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Hide loader
  useE_main(() => {
    const l = document.getElementById('loading');
    if (l) l.style.display = 'none';
  }, []);

  return (
    <ErrorBoundary>
      {view === 'landing' && (
        <Landing onEnter={()=>setPickerOpen(true)} variant={t.landingVariant}/>
      )}
      {view === 'app' && (
        <AppShell onExit={()=>setView('landing')} palette={t.palette} profile={activeProfile}/>
      )}
      {pickerOpen && (
        <ProfilePicker
          profiles={profiles}
          onClose={() => setPickerOpen(false)}
          onPick={(profileId) => {
            setActiveProfileId(profileId);
            try { localStorage.setItem('maqam_profile_id', profileId); } catch {}
            setPickerOpen(false);
            setView('app');
          }}
        />
      )}
      <TweaksPanel title="إعدادات">
        <TweakSection label="النسخة">
          <TweakRadio
            label="الصفحة الرئيسية"
            value={t.landingVariant}
            onChange={v=>setTweak('landingVariant', v)}
            options={[
              {value:'hero', label:'بطل'},
              {value:'scroll', label:'قصة'},
            ]}
          />
        </TweakSection>
        <TweakSection label="الألوان">
          <TweakColor
            label="اللوحة"
            value={t.palette}
            onChange={v=>setTweak('palette', v)}
            options={['warm','cool','desert']}
          />
        </TweakSection>
        <TweakSection label="تنقّل">
          <TweakButton label="الصفحة الرئيسية" onClick={()=>setView('landing')}/>
          <TweakButton label="صفحة الطفل" onClick={()=>setView('app')}/>
        </TweakSection>
      </TweaksPanel>
    </ErrorBoundary>
  );
}

function ProfilePicker({profiles, onPick, onClose}) {
  const ageBandLabel = {
    '3-6': 'من 3 إلى 6',
    '7-10': 'من 7 إلى 10',
    '11+': '11 سنة فأكثر',
  };
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(42,24,16,.72)', backdropFilter:'blur(4px)',
      display:'grid', placeItems:'center', zIndex:120, padding:20
    }} onClick={onClose}>
      <div style={{
        width:'100%', maxWidth:760, background:'#FFF6E5', borderRadius:28, border:'4px solid var(--c-amber)',
        boxShadow:'0 22px 60px rgba(0,0,0,.3)', padding:'26px 24px 30px', position:'relative'
      }} onClick={(e)=>e.stopPropagation()}>
        <button onClick={onClose} style={{
          position:'absolute', top:14, insetInlineStart:14, width:38, height:38, borderRadius:'50%',
          background:'var(--c-soft)', display:'grid', placeItems:'center'
        }}>
          <Icon.Close size={18} color="var(--c-clay)"/>
        </button>

        <div style={{textAlign:'center', marginBottom:20}}>
          <div style={{fontSize:13, color:'var(--c-amber)', fontWeight:800, letterSpacing:1}}>· اختر حساب الطفل ·</div>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:36, fontWeight:700, marginTop:8}}>
            من سيدخل الآن؟
          </h2>
          <p style={{fontSize:14, color:'#7a5538', marginTop:6}}>مثل ملفات العائلة: كل طفل يختار حسابه</p>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px,1fr))', gap:14}}>
          {profiles.map((p) => (
            <button key={p.id} onClick={()=>onPick(p.id)} className="squish" style={{
              borderRadius:20, border:'3px solid var(--c-soft)', background:'#FFFBF1', padding:'18px 12px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10, boxShadow:'0 6px 0 rgba(60,30,10,.08)'
            }}>
              <img src={p.avatar} alt={p.name} style={{
                width:92, height:92, borderRadius:'50%', objectFit:'cover',
                border:'4px solid var(--c-amber)', background:'#FFF6E5'
              }}/>
              <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, color:'#3a2614'}}>{p.name}</div>
              <div style={{fontSize:12, color:'#7a5538', fontWeight:700}}>
                {p.gender === 'boy' ? 'ولد' : 'بنت'}
              </div>
              <div style={{
                fontSize:11, color:'#5a3a1f', fontWeight:800, background:'#FFE9C4',
                border:'2px solid var(--c-amber)', borderRadius:999, padding:'4px 10px'
              }}>
                {ageBandLabel[p.ageBand] || p.ageBand}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
