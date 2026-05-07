import React from 'react';
// Game section — map → level path → game → reveal
const { useState: useS_g, useEffect: useE_g } = React;

const HERO_CARDS = [
  {id:'mstf',   name:'مصطفى بن بولعيد', img:'assets/charchters/mstf_bn_blaid.png'},
  {id:'mhmd',   name:'محمد بوضياف',      img:'assets/charchters/mhmd_bdf_-_Copy.png'},
  {id:'ddch',   name:'ديدوش مراد',       img:'assets/charchters/ddch_mrd_1.png'},
  {id:'krim',   name:'كريم بلقاسم',      img:'assets/charchters/krim_blkcm.jpeg'},
  {id:'larbi',  name:'لربي بن مهيدي',    img:'assets/charchters/larbi_bn_mhidi.png'},
  {id:'algmap', name:'خريطة الجزائر',    img:'assets/charchters/algeria-map.png'},
];

function RegionBadgeIcon({regionId, size=26, color='#FFF6E5'}) {
  const map = {
    algiers: <Icon.Home size={size} color={color}/>,
    oran: <Icon.Play size={size} color={color}/>,
    constantine: <Icon.Book size={size} color={color}/>,
    bechar: <Icon.Sparkle size={size} color={color}/>,
    ouargla: <Icon.Brush size={size} color={color}/>,
    tamanrasset: <Icon.Crown size={size} color={color}/>,
  };
  return map[regionId] || <Icon.Star size={size} color={color}/>;
}

function LevelKindIcon({kind, size=32, color='#FFF6E5'}) {
  const map = {
    flag: <Icon.Star size={size} color={color}/>,
    symbol: <Icon.Sparkle size={size} color={color}/>,
    count: <Icon.Math size={size} color={color}/>,
    final: <Icon.Crown size={size} color={color}/>,
  };
  return map[kind] || <Icon.Star size={size} color={color}/>;
}

function SectionGame({ctx}) {
  const [picked, setPicked] = useS_g(null);     // region
  const [level, setLevel] = useS_g(null);       // level number 1-4
  const [phase, setPhase] = useS_g('map');      // map | levels | game | reveal
  const [score, setScore] = useS_g(0);
  const [progress, setProgress] = useS_g(() => {
    try {
      const s = localStorage.getItem('maqam_progress');
      if (s) return JSON.parse(s);
    } catch {}
    const init = {};
    REGIONS.forEach(r => { init[r.id] = r.levelsDone; });
    return init;
  });

  useE_g(() => {
    if (Object.keys(progress).length > 0)
      localStorage.setItem('maqam_progress', JSON.stringify(progress));
  }, [progress]);

  const getDone = (rid) => progress[rid] ?? 0;

  const onPickRegion = (r) => {
    if (!r.unlocked) return;
    setPicked(r);
    setPhase('levels');
  };
  const onPickLevel = (n) => {
    setLevel(n);
    setPhase('game');
    setScore(0);
  };
  const onWin = (s) => {
    setScore(s);
    // mark this level done if it's the next one
    setProgress(p => {
      const cur = p[picked.id] ?? 0;
      if (level > cur) return {...p, [picked.id]: level};
      return p;
    });
    // final level = card reveal
    if (level === 4) setPhase('reveal');
    else setPhase('levels');
  };
  const closeAll = () => { setPicked(null); setLevel(null); setPhase('map'); };

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1280, margin:'0 auto'}}>
      <button onClick={()=>{
        if (phase === 'levels') { setPicked(null); setPhase('map'); return; }
        ctx.setSection('home');
      }} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:16}}>
        <Icon.Back size={18} color="var(--c-clay)"/> {phase==='levels' ? 'الخريطة' : 'الرئيسية'}
      </button>

      {phase === 'map' && (
        <MapPhase onPick={onPickRegion} progress={progress}/>
      )}
      {phase === 'levels' && picked && (
        <LevelsPhase region={picked} done={getDone(picked.id)} onPick={onPickLevel}/>
      )}

      {phase === 'game' && picked && level && (
        <GameModal
          region={picked}
          levelNum={level}
          ageBand={ctx?.profile?.ageBand || '7-10'}
          onWin={onWin}
          onClose={()=>setPhase('levels')}
        />
      )}
      {phase === 'reveal' && picked && (
        <CardReveal region={picked} score={score} onClose={() => {
          ctx.collect(picked.id);
          closeAll();
        }}/>
      )}
    </div>
  );
}

// ---------- MAP PHASE ----------
function MapPhase({onPick, progress}) {
  return (
    <>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:16}}>
        <div>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:44, fontWeight:700}}>اختر منطقة</h1>
          <p style={{fontSize:16, color:'#7a5538', marginTop:6}}>كل منطقة فيها <b>4 مستويات</b> لتجمع بطاقتها</p>
        </div>
        <div style={{display:'flex', flexWrap:'wrap', gap:10, alignItems:'center'}}>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <Legend color="var(--c-mint)" label="مكتمل ✓"/>
            <Legend color="var(--c-clay)" label="متاح"/>
            <Legend color="#D4B89A" label="مقفل"/>
          </div>
          <button onClick={()=>ctx.setSection('passport')} className="squish" style={{
            background:'#8B4513', color:'#FFF', padding:'10px 18px', borderRadius:20,
            display:'flex', gap:8, alignItems:'center', border:'3px solid #5D2E0A',
            boxShadow:'0 4px 0 #5D2E0A', fontSize:14, fontWeight:800, marginRight:10
          }}>
            <Icon.Cards size={20}/> جواز السفر
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:30}}>
        <div style={{
          background:'linear-gradient(180deg, #FFE9C4, #FFF6E5)',
          borderRadius:32, padding:24, border:'3px solid var(--c-amber)',
          aspectRatio:'1/1.05', position:'relative', overflow:'hidden'
        }}>
          <BigMap onPick={onPick} progress={progress}/>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {REGIONS.map(r => {
            const done = progress[r.id] ?? r.levelsDone;
            return (
              <button key={r.id} onClick={()=>onPick(r)} disabled={!r.unlocked} className="squish" style={{
                display:'flex', gap:14, alignItems:'center', textAlign:'right',
                background: r.unlocked ? '#FFF6E5' : '#EBEBEB',
                padding:'14px 18px', borderRadius:18,
                border:`3px solid ${r.unlocked ? r.color : '#D1D1D1'}`,
                cursor: r.unlocked?'pointer':'not-allowed'
              }}>
                <div style={{
                  width:48, height:48, borderRadius:'50%', background: r.unlocked ? r.color : '#D4B89A',
                  display:'grid', placeItems:'center', fontSize:24, color:'#FFF6E5',
                  flexShrink:0
                }}><RegionBadgeIcon regionId={r.id} size={24}/></div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:700}}>{r.name}</div>
                  <div style={{fontSize:13, color:'#7a5538'}}>{r.subtitle}</div>
                  {r.unlocked && (
                    <div style={{display:'flex', gap:4, marginTop:6}}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{
                          flex:1, height:6, borderRadius:3,
                          background: n <= done ? r.color : '#FFE9C4'
                        }}/>
                      ))}
                    </div>
                  )}
                </div>
                {done === 4 && <div style={{
                  width:32, height:32, borderRadius:'50%', background:'var(--c-mint)',
                  display:'grid', placeItems:'center'
                }}><Icon.Check size={18} color="#FFF6E5"/></div>}
                {!r.unlocked && <Icon.Lock size={22} color="#A88E6F"/>}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Legend({color, label}) {
  return (
    <div style={{display:'flex', gap:6, alignItems:'center', fontSize:13, fontWeight:600, color:'#5a3a1f'}}>
      <div style={{width:14, height:14, borderRadius:'50%', background:color, border:'2px solid #FFF6E5', boxShadow:'0 0 0 1px '+color}}/>
      {label}
    </div>
  );
}

// Bigger interactive map (image-based)
function BigMap({onPick, progress}) {
  const [hover, setHover] = useS_g(null);
  return (
    <div style={{position:'relative', width:'100%', aspectRatio:'870/682'}}>
      <img src="assets/algeria-map.png" alt="خريطة الجزائر" style={{
        width:'100%', height:'100%', objectFit:'contain',
      }}/>
      {REGIONS.map(r => {
        const done = (progress && progress[r.id]) ?? r.levelsDone;
        const isHover = hover === r.id && r.unlocked;
        const completed = done === 4;
        return (
          <div key={r.id}
            onClick={()=>onPick(r)}
            onMouseEnter={()=>setHover(r.id)}
            onMouseLeave={()=>setHover(null)}
            style={{
              position:'absolute', left:`${r.x}%`, top:`${r.y}%`,
              transform:`translate(-50%,-50%) ${isHover?'scale(1.15)':'scale(1)'}`,
              transition:'transform .2s', cursor: r.unlocked?'pointer':'not-allowed'
            }}>
            <div style={{
              width:56, height:56, borderRadius:'50%',
              background: r.unlocked ? r.color : '#D4B89A',
              border:'4px solid #FFF6E5',
              boxShadow:'0 6px 0 rgba(60,30,10,.3)',
              display:'grid', placeItems:'center', fontSize:26,
              position:'relative'
            }}>
              {r.unlocked ? <RegionBadgeIcon regionId={r.id} size={26}/> : <Icon.Lock size={24} color="#FFF6E5"/>}
              {/* small ring of 4 dots showing level progress */}
              {r.unlocked && !completed && (
                <svg width="68" height="68" style={{position:'absolute', inset:-6, pointerEvents:'none'}} viewBox="0 0 68 68">
                  {[0,1,2,3].map(i => {
                    const angle = (i*90 - 45) * Math.PI/180;
                    const cx = 34 + 30*Math.cos(angle);
                    const cy = 34 + 30*Math.sin(angle);
                    return <circle key={i} cx={cx} cy={cy} r="5" fill={i < done ? r.color : '#FFF6E5'} stroke={r.color} strokeWidth="2"/>;
                  })}
                </svg>
              )}
              {completed && (
                <div style={{
                  position:'absolute', top:-10, insetInlineEnd:-10,
                  width:26, height:26, borderRadius:'50%',
                  background:'#2C7A51', color:'#FFF6E5',
                  display:'grid', placeItems:'center', fontSize:14, fontWeight:900,
                  border:'3px solid #FFF6E5', zIndex:2
                }}>✓</div>
              )}
            </div>
            {isHover && (
              <div style={{
                position:'absolute', top:-46, left:'50%', transform:'translateX(-50%)',
                background:'#2A1810', color:'#FFF6E5', padding:'6px 12px', borderRadius:8,
                fontSize:13, fontWeight:700, whiteSpace:'nowrap'
              }}>{r.name} · {done}/4</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- LEVELS PHASE (Duolingo-style winding path) ----------
function LevelsPhase({region, done, onPick}) {
  const [showVideo, setShowVideo] = useS_g(false);
  const storyVideoSrc = 'assets/STORIES/IMG_9697.MOV';
  // Positions for 4 level pins along a winding path (% of container)
  const positions = [
    {x:25, y:82},
    {x:55, y:62},
    {x:30, y:42},
    {x:60, y:18},
  ];

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:18}}>
        <div style={{
          width:64, height:64, borderRadius:20, background:region.color,
          display:'grid', placeItems:'center', fontSize:32, color:'#FFF6E5',
          boxShadow:'0 6px 0 rgba(60,30,10,.2)'
        }}><RegionBadgeIcon regionId={region.id} size={30}/></div>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:'var(--font-display)', fontSize:38, fontWeight:700}}>{region.name}</h1>
          <p style={{fontSize:15, color:'#7a5538'}}>{region.subtitle} · {done}/4 مستويات</p>
        </div>
        <div style={{display:'flex', gap:6}}>
          {[1,2,3,4].map(n => (
            <div key={n} style={{
              width:28, height:28, borderRadius:'50%',
              background: n<=done ? 'var(--c-mint)' : '#FFE9C4',
              display:'grid', placeItems:'center', fontSize:14, fontWeight:800,
              color: n<=done?'#FFF6E5':'#A88E6F',
              border:`2px solid ${n<=done?'var(--c-mint)':'#E5D4B0'}`
            }}>{n<=done?'✓':n}</div>
          ))}
        </div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:30, alignItems:'stretch'
      }}>
        {/* Winding path */}
        <div style={{
          position:'relative',
          background:`linear-gradient(180deg, ${region.color}26, #FFF6E5)`,
          borderRadius:32, padding:24, border:`3px solid ${region.color}`,
          minHeight:560, overflow:'hidden'
        }}>
          {/* decorative clouds/sand */}
          <div style={{position:'absolute', top:34, left:30, opacity:.28}}><Icon.Sparkle size={42} color={region.color}/></div>
          <div style={{position:'absolute', top:86, right:42, opacity:.26}}><Icon.Star size={36} color={region.color}/></div>
          <div style={{position:'absolute', bottom:28, left:18, opacity:.28}}><RegionBadgeIcon regionId={region.id} size={52} color={region.color}/></div>
          <div style={{position:'absolute', bottom:60, right:30, opacity:.24}}><Icon.Crown size={34} color={region.color}/></div>

          {/* Dashed path connecting levels */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
            position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none'
          }}>
            <path
              d={`M ${positions[0].x} ${positions[0].y} Q 50 75 ${positions[1].x} ${positions[1].y} Q 35 55 ${positions[2].x} ${positions[2].y} Q 50 30 ${positions[3].x} ${positions[3].y}`}
              fill="none" stroke="#A88E6F" strokeWidth="0.6" strokeDasharray="2 2" strokeLinecap="round" opacity=".7"
            />
          </svg>

          {LEVELS.map((lv, i) => {
            const pos = positions[i];
            const status = lv.n <= done ? 'done' : lv.n === done+1 ? 'current' : 'locked';
            const enabled = status !== 'locked';
            return (
              <div key={lv.n} style={{
                position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`,
                transform:'translate(-50%,-50%)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:6
              }}>
                <button
                  disabled={!enabled}
                  onClick={()=>onPick(lv.n)}
                  className="squish"
                  style={{
                    width:96, height:96, borderRadius:'50%',
                    background: status==='done' ? 'var(--c-mint)'
                              : status==='current' ? region.color
                              : '#D4B89A',
                    border:'5px solid #FFF6E5',
                    boxShadow: status==='current'
                      ? `0 8px 0 rgba(60,30,10,.25), 0 0 0 6px ${region.color}55`
                      : '0 8px 0 rgba(60,30,10,.25)',
                    display:'grid', placeItems:'center',
                    cursor: enabled?'pointer':'not-allowed',
                    color:'#FFF6E5',
                    position:'relative',
                    animation: status==='current' ? 'lvlpulse 1.6s ease-in-out infinite' : 'none'
                  }}>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:32, lineHeight:1}}>
                      {status==='done'
                        ? <Icon.Check size={28} color="#FFF6E5"/>
                        : status==='locked'
                          ? <Icon.Lock size={24} color="#FFF6E5"/>
                          : <LevelKindIcon kind={lv.kind} size={30}/>}
                    </div>
                    <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, marginTop:-2}}>
                      {lv.n}
                    </div>
                  </div>
                  {status==='current' && (
                    <div style={{
                      position:'absolute', top:-32, left:'50%', transform:'translateX(-50%)',
                      background:'#2A1810', color:'#FFF6E5', fontSize:11, fontWeight:800,
                      padding:'4px 10px', borderRadius:999, whiteSpace:'nowrap'
                    }}>ابدأ هنا!</div>
                  )}
                </button>
                <div style={{
                  background:'#FFF6E5', borderRadius:999, padding:'4px 10px',
                  fontSize:12, fontWeight:700, color:'#5a3a1f',
                  border:'2px solid '+(enabled?region.color:'#D4B89A'),
                  whiteSpace:'nowrap'
                }}>{lv.title}</div>
              </div>
            );
          })}

          <style>{`
            @keyframes lvlpulse {
              0%,100% { transform: translate(-50%,-50%) scale(1); }
              50% { transform: translate(-50%,-50%) scale(1.06); }
            }
            @keyframes charBounce {
              0%,100% { transform: translateY(0) scale(1); }
              30%  { transform: translateY(-10px) scale(1.1); }
              60%  { transform: translateY(-5px) scale(1.05); }
            }
            @keyframes charShake {
              0%,100% { transform: translateX(0); }
              15% { transform: translateX(-6px) rotate(-3deg); }
              30% { transform: translateX(6px) rotate(3deg); }
              45% { transform: translateX(-5px); }
              60% { transform: translateX(5px); }
              75% { transform: translateX(-3px); }
            }
          `}</style>
        </div>

        {/* Side panel: card preview + level list */}
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {/* Character card */}
          <div style={{
            background:'#FFF6E5', borderRadius:18, overflow:'hidden',
            border:`2px solid ${done===4 ? 'var(--c-mint)' : 'var(--c-amber)'}`,
            display:'flex', gap:10, alignItems:'stretch', padding:10
          }}>
            <div style={{position:'relative', width:72, flexShrink:0, borderRadius:12, overflow:'hidden', minHeight:90}}>
              <img
                src={region.hero.img}
                alt={region.hero.name}
                style={{
                  position:'absolute', inset:0, width:'100%', height:'100%',
                  objectFit:'cover', objectPosition:'top',
                  filter: done===4 ? 'none' : 'blur(8px) brightness(.35) grayscale(.9)',
                  transition:'filter .6s'
                }}
              />
              {done < 4 && (
                <div style={{
                  position:'absolute', inset:0, display:'grid', placeItems:'center'
                }}>
                  <div style={{textAlign:'center', color:'#FFF6E5'}}>
                    <div style={{fontSize:28, lineHeight:1}}>؟</div>
                    <div style={{fontSize:10, fontWeight:700, marginTop:2}}>{done}/4</div>
                  </div>
                </div>
              )}
            </div>
            <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <div style={{fontSize:10, fontWeight:800, color:'var(--c-clay)', letterSpacing:1, marginBottom:4}}>
                {done===4 ? 'البطل المكتشف' : 'أكمل لكشف البطل'}
              </div>
              <div style={{fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color:'#3a2614'}}>
                {done===4 ? region.hero.name : '??? ???'}
              </div>
              <div style={{fontSize:11, color:'#7a5538', marginTop:3, lineHeight:1.5}}>
                {done===4 ? region.hero.bio : 'أكمل 4 مستويات لكشف معلومات البطل'}
              </div>
            </div>
          </div>

          {/* Video Button */}
          <button className="squish" onClick={()=>setShowVideo(true)} style={{
            background:'linear-gradient(135deg, #BB6BD9, #9B51E0)', color:'#FFF6E5',
            padding:'14px 18px', borderRadius:24, border:'none', cursor:'pointer',
            display:'flex', gap:10, alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:16, boxShadow:'0 4px 0 rgba(155, 81, 224, 0.3)'
          }}>
            <Icon.Play size={20} color="#FFF6E5"/> 
            شاهد فيديو المنطقة
          </button>

          {/* Level list */}
          <div style={{
            background:'#FFF6E5', borderRadius:24, padding:18,
            border:'3px solid var(--c-soft)', flex:1
          }}>
            <div style={{fontSize:12, fontWeight:800, color:'var(--c-clay)', letterSpacing:1, marginBottom:10}}>المستويات</div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {LEVELS.map(lv => {
                const status = lv.n <= done ? 'done' : lv.n === done+1 ? 'current' : 'locked';
                const enabled = status !== 'locked';
                return (
                  <button key={lv.n} disabled={!enabled} onClick={()=>onPick(lv.n)} className="squish" style={{
                    display:'flex', gap:12, alignItems:'center', textAlign:'right',
                    background: status==='current' ? region.color+'22' : '#FFF6E5',
                    padding:'10px 12px', borderRadius:14,
                    border: `2px solid ${status==='done'?'var(--c-mint)': status==='current'?region.color:'#E5D4B0'}`,
                    opacity: enabled?1:.55, cursor: enabled?'pointer':'not-allowed'
                  }}>
                    <div style={{
                      width:36, height:36, borderRadius:'50%',
                      background: status==='done'?'var(--c-mint)': status==='current'?region.color:'#D4B89A',
                      display:'grid', placeItems:'center', color:'#FFF6E5', fontWeight:900, fontSize:16
                    }}>{status==='done'?'✓':lv.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#3a2614'}}>{lv.title}</div>
                      <div style={{fontSize:12, color:'#7a5538'}}>
                        {status==='done'?'مكتمل':status==='current'?'متاح الآن':'مقفل'}
                      </div>
                    </div>
                    <div style={{width:24, height:24, display:'grid', placeItems:'center'}}>
                      {status==='locked' ? <Icon.Lock size={20} color="#A88E6F"/> : <LevelKindIcon kind={lv.kind} size={20} color={region.color}/>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showVideo && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(42,24,16,.65)',
          backdropFilter:'blur(4px)', zIndex:200,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end',
          padding:'0 20px 0'
        }} onClick={() => setShowVideo(false)}>
          <div style={{maxWidth:500, width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}
               onClick={e=>e.stopPropagation()}>
            <div style={{
              background:'linear-gradient(135deg, #6B21A8, #9B51E0)',
              borderRadius:20, padding:'20px 24px',
              border:'3px solid #BB6BD9',
              boxShadow:'0 8px 32px rgba(155,81,224,.5)',
              width:'100%', textAlign:'center', position:'relative'
            }}>
              <button onClick={() => setShowVideo(false)} style={{
                position:'absolute', top:12, insetInlineStart:12,
                width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,.2)',
                display:'grid', placeItems:'center', border:'none', cursor:'pointer'
              }}>
                <Icon.Close size={16} color="#FFF6E5"/>
              </button>
              <div style={{color:'#FFF6E5'}}>
                <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700}}>
                  قصة {region.name}
                </div>
                <div style={{fontSize:14, opacity:.85, marginTop:4, marginBottom:16}}>
                  الراوي يحكي لك تاريخ المنطقة
                </div>
                <div style={{
                  background:'rgba(0,0,0,.25)', borderRadius:14, padding:'16px',
                  border:'2px dashed rgba(255,255,255,.25)',
                }}>
                  <video
                    src={storyVideoSrc}
                    controls
                    preload="metadata"
                    style={{
                      width:'100%',
                      maxHeight:320,
                      borderRadius:12,
                      background:'#000'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- GAME MODAL (level-aware) ----------
function GameModal({region, levelNum, ageBand='7-10', onWin, onClose}) {
  const [round, setRound] = useS_g(0);
  const [points, setPoints] = useS_g(0);
  const [feedback, setFeedback] = useS_g(null);

  // questions vary by level kind
  const lvl = LEVELS[levelNum-1];
  const FLAG_ROUNDS_BY_BAND = {
    '3-6': [
      {q:'ماذا حدث في 1 نوفمبر 1954؟', opts:['بدأت الثورة الجزائرية','بدأت العطلة الصيفية','فاز فريق كرة قدم','سقط الثلج'], answer:0},
      {q:'لماذا نتذكر 1 نوفمبر؟', opts:['لأنه يوم بداية الكفاح من أجل الحرية','لأنه يوم ألعاب فقط','لأنه يوم مطر','لأنه يوم سفر'], answer:0},
      {q:'ما الدرس الجميل من قصة 1 نوفمبر للأطفال؟', opts:['حب الوطن والتعاون والشجاعة','الكسل طوال اليوم','إهمال المدرسة','عدم مساعدة الآخرين'], answer:0},
    ],
    '7-10': [
      {q:'ماذا يرمز تاريخ 1 نوفمبر 1954 في الجزائر؟', opts:['انطلاق الثورة التحريرية','افتتاح مدرسة جديدة','بداية موسم الصيف','يوم رياضي'], answer:0},
      {q:'ما الهدف الرئيسي من ثورة 1 نوفمبر؟', opts:['استرجاع الحرية والاستقلال','زيادة العطل المدرسية','تنظيم مهرجان','بناء ملعب'], answer:0},
      {q:'أي قيمة نتعلمها من أبطال 1 نوفمبر؟', opts:['الصبر والشجاعة وحب الوطن','التكاسل','الأنانية','الفوضى'], answer:0},
    ],
    '11+': [
      {q:'أي وصف أدقّ لـ1 نوفمبر 1954؟', opts:['بداية الكفاح المسلح المنظم للتحرر الوطني','اتفاقية سلام نهائية','انتخابات محلية','إعلان إصلاح اقتصادي'], answer:0},
      {q:'لماذا يُعدّ بيان أول نوفمبر وثيقة محورية؟', opts:['لأنه حدّد أهداف الثورة السياسية والوطنية','لأنه كان نشيدًا فقط','لأنه قانونًا رياضيًا','لأنه وثيقة مدرسية بسيطة'], answer:0},
      {q:'أي نتيجة تاريخية ارتبطت بمسار بدأ في 1 نوفمبر؟', opts:['استقلال الجزائر سنة 1962','إلغاء التعليم','انتهاء التاريخ الوطني','بداية الاستعمار'], answer:0},
    ],
  };
  const ROUNDS_BY_KIND = {
    flag: FLAG_ROUNDS_BY_BAND[ageBand] || FLAG_ROUNDS_BY_BAND['7-10'],
    symbol: [
      {q:`ما رمز ${region.subtitle}؟`, opts:[region.name,'بطريق','بيتزا','صاروخ'], answer:0},
      {q:`أين تقع ${region.name}؟`, opts:['الجزائر','فرنسا','تركيا','مصر'], answer:0},
      {q:'أيّ هذه أكلة جزائرية؟', opts:['كسرة','سوشي','بيتزا','تاكو'], answer:0},
    ],
    count: [
      {q:'كم منطقة على الخريطة؟', opts:['4','6','8','10'], answer:1},
      {q:'2 + 3 = ؟', opts:['4','5','6','7'], answer:1},
      {q:'7 - 4 = ؟', opts:['1','2','3','4'], answer:2},
    ],
    final: [
      {q:`اختر بطاقة ${region.name}`, opts:[region.name,'بطريق','بيتزا','صاروخ'], answer:0},
      {q:'كيف نقول مرحبا بالعربية؟', opts:['Hello','مرحبا','Bonjour','Hola'], answer:1},
      {q:'3 × 2 = ؟', opts:['4','5','6','7'], answer:2},
      {q:'لون البحر؟', opts:['أحمر','أزرق','أخضر','أصفر'], answer:1},
    ],
  };
  const rounds = ROUNDS_BY_KIND[lvl.kind] || ROUNDS_BY_KIND.symbol;
  const totalRounds = rounds.length;
  const cur = rounds[round];

  const pick = (i) => {
    if (feedback) return;
    const ok = i === cur.answer;
    setFeedback(ok ? 'ok' : 'no');
    if (ok) setPoints(p => p+10);
    setTimeout(() => {
      setFeedback(null);
      if (round + 1 >= totalRounds) onWin(points + (ok?10:0));
      else setRound(r => r+1);
    }, 900);
  };

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div style={modalStyles.box} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <div style={{
              width:48, height:48, borderRadius:14, background:region.color,
              display:'grid', placeItems:'center', fontSize:24, color:'#FFF6E5'
            }}>{lvl.icon}</div>
            <div>
              <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700}}>
                المستوى {levelNum} · {lvl.title}
              </div>
              <div style={{fontSize:13, color:'#7a5538'}}>
                {region.name} · سؤال {round+1}/{totalRounds}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{width:40, height:40, borderRadius:'50%', background:'var(--c-soft)', display:'grid', placeItems:'center'}}>
            <Icon.Close size={20} color="var(--c-clay)"/>
          </button>
        </div>

        <div style={{display:'flex', gap:6, marginTop:18}}>
          {Array.from({length:totalRounds}).map((_,i) => (
            <div key={i} style={{flex:1, height:8, borderRadius:4, background: i<=round?region.color:'#FFE9C4'}}/>
          ))}
        </div>

        <div style={{textAlign:'center', padding:'30px 0 18px'}}>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:32, fontWeight:700}}>{cur.q}</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginTop:24, maxWidth:480, margin:'24px auto 0'}}>
            {cur.opts.map((o, i) => (
              <button key={i} onClick={()=>pick(i)} className="squish" style={{
                background: feedback && i===cur.answer ? '#E8F4ED' : '#FFF6E5',
                border:`3px solid ${feedback && i===cur.answer ? 'var(--c-mint)' : 'var(--c-soft)'}`,
                borderRadius:20, padding:'24px', fontSize:o.length>3?22:48,
                fontWeight: o.length>3?700:400,
                boxShadow:'0 6px 0 rgba(0,0,0,.08)', cursor:'pointer',
                transition:'all .2s'
              }}>{o}</button>
            ))}
          </div>
          <div style={{minHeight:88, display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:16}}>
            {feedback ? (
              <>
                <div key={round + feedback} style={{
                  animation: feedback==='ok' ? 'charBounce .5s ease' : 'charShake .5s ease',
                  flexShrink:0
                }}>
                  <img
                    src={feedback==='ok' ? 'assets/happy.png' : 'assets/sad.png'}
                    alt={feedback==='ok' ? 'فرحان' : 'حزين'}
                    style={{
                      width:80, height:80, objectFit:'contain',
                      display:'block'
                    }}
                  />
                </div>
                <div style={{
                  background: feedback==='ok' ? '#E8F4ED' : '#FBE3DF',
                  border: `2px solid ${feedback==='ok' ? 'var(--c-mint)' : '#C0392B'}`,
                  borderRadius:14, padding:'10px 16px', position:'relative',
                  fontFamily:'var(--font-display)', fontSize:18, fontWeight:700,
                  color: feedback==='ok' ? 'var(--c-mint)' : '#C0392B',
                }}>
                  <div style={{
                    position:'absolute', top:'50%', right:'100%', marginRight:-1,
                    transform:'translateY(-50%)', width:0, height:0,
                    borderTop:'8px solid transparent', borderBottom:'8px solid transparent',
                    borderRight: `10px solid ${feedback==='ok' ? 'var(--c-mint)' : '#C0392B'}`
                  }}/>
                  {feedback==='ok' ? 'أحسنت! +10' : 'لا تستسلم!'}
                </div>
              </>
            ) : (
              <div style={{display:'flex', alignItems:'flex-end', gap:10}}>
                <img
                  src="assets/storyteller.png"
                  alt="المرشد"
                  style={{
                    width:80, height:80, objectFit:'contain',
                    opacity:.9, display:'block'
                  }}
                />
                <div style={{
                  background:'#FFF6E5', border:'2px solid var(--c-soft)',
                  borderRadius:14, padding:'8px 14px', position:'relative',
                  fontSize:14, fontWeight:600, color:'#7a5538'
                }}>
                  <div style={{
                    position:'absolute', top:'50%', right:'100%', marginRight:-1,
                    transform:'translateY(-50%)', width:0, height:0,
                    borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
                    borderRight:'9px solid var(--c-soft)'
                  }}/>
                  اختر الإجابة الصحيحة!
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, padding:'14px 0',
          borderTop:'2px dashed var(--c-soft)'}}>
          <div style={{fontSize:14, color:'#7a5538'}}>نقاطك</div>
              <div style={{display:'flex', alignItems:'center', gap:8, fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, color:'var(--c-clay)'}}>
                <Icon.Star size={20} color="var(--c-amber)"/> {points}
              </div>
        </div>
      </div>
    </div>
  );
}

function CardReveal({region, score, onClose}) {
  const [flipped, setFlipped] = useS_g([]);
  const allFlipped = flipped.length === HERO_CARDS.length;

  const flip = (id) => {
    if (flipped.includes(id)) return;
    setFlipped(prev => [...prev, id]);
  };

  return (
    <div style={modalStyles.backdrop}>
      <div style={{
        ...modalStyles.box, maxWidth:580, textAlign:'center',
        overflow:'hidden', position:'relative', maxHeight:'92vh', overflowY:'auto'
      }}>
        <div style={{position:'absolute', inset:0, pointerEvents:'none'}}>
          {[...Array(20)].map((_,i) => (
            <div key={i} style={{
              position:'absolute',
              left:`${(i*7)%100}%`, top:`${(i*13)%100}%`,
              fontSize:20, opacity:.4,
              animation:`spin ${2+i%3}s linear infinite`,
              animationDelay:`${i*.1}s`
            }}>{[<Icon.Star size={18} color="var(--c-amber)"/>,<Icon.Sparkle size={18} color="var(--c-clay)"/>,<Icon.Crown size={18} color="var(--c-mint)"/>,<Icon.Heart size={18} color="var(--c-clay)"/>,<Icon.Cards size={18} color="var(--c-amber)"/>][i%5]}</div>
          ))}
        </div>

        <div style={{position:'relative', zIndex:2}}>
          <div style={{fontSize:13, fontWeight:700, color:'var(--c-amber)', letterSpacing:2}}>· مبروك ·</div>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, marginTop:6}}>
            بطاقات الأبطال!
          </h2>
          <p style={{fontSize:14, color:'#7a5538', marginTop:4}}>
            أكملت مستويات {region.name} بنتيجة {score} · اضغط على كل بطاقة لكشفها
          </p>

          <div style={{
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, margin:'20px 0'
          }}>
            {HERO_CARDS.map(hero => {
              const isFlipped = flipped.includes(hero.id);
              return (
                <div key={hero.id}
                  onClick={() => flip(hero.id)}
                  style={{cursor: isFlipped ? 'default' : 'pointer', perspective:800}}
                >
                  <div style={{position:'relative', paddingBottom:'145%'}}>
                    <div style={{
                      position:'absolute', inset:0,
                      transformStyle:'preserve-3d',
                      transition:'transform .7s',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}>
                      {/* Front — hidden face */}
                      <div style={{
                        position:'absolute', inset:0, backfaceVisibility:'hidden',
                        background:'linear-gradient(135deg, var(--c-clay), var(--c-amber))',
                        borderRadius:14, display:'grid', placeItems:'center',
                        border:'3px solid var(--c-clay)', boxShadow:'0 4px 14px rgba(0,0,0,.25)'
                      }}>
                        <div style={{color:'#FFF6E5', textAlign:'center'}}>
                          <Icon.Sparkle size={40} color="#FFF6E5"/>
                          <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, marginTop:4}}>؟</div>
                          <div style={{fontSize:10, fontWeight:600, opacity:.8, marginTop:4}}>اكشف</div>
                        </div>
                      </div>
                      {/* Back — character image */}
                      <div style={{
                        position:'absolute', inset:0, backfaceVisibility:'hidden',
                        transform:'rotateY(180deg)',
                        background:'#FFF6E5', borderRadius:14,
                        border:'3px solid var(--c-mint)',
                        boxShadow:'0 4px 14px rgba(0,0,0,.25)',
                        overflow:'hidden',
                        display:'flex', flexDirection:'column'
                      }}>
                        <img src={hero.img} alt={hero.name} style={{
                          flex:1, width:'100%', objectFit:'cover', objectPosition:'top'
                        }}/>
                        <div style={{
                          padding:'6px 4px',
                          fontFamily:'var(--font-display)', fontSize:11, fontWeight:700,
                          color:'#3a2614', textAlign:'center', background:'#FFF6E5',
                          borderTop:'2px solid var(--c-mint)'
                        }}>{hero.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{fontSize:13, color:'#7a5538', marginBottom:16, fontWeight:600}}>
            {flipped.length} / {HERO_CARDS.length} بطاقات مكشوفة
          </div>

          {allFlipped ? (
            <button onClick={onClose} className="squish" style={{
              background:'var(--c-mint)', color:'#FFF6E5', padding:'14px 34px', borderRadius:999,
              fontSize:17, fontWeight:800, boxShadow:'0 6px 0 #1d5439'
            }}>أضف للألبوم</button>
          ) : (
            <button onClick={onClose} className="squish" style={{
              background:'transparent', color:'var(--c-clay)', padding:'10px 24px', borderRadius:999,
              fontSize:14, fontWeight:700, border:'2px solid var(--c-clay)'
            }}>تخطّي</button>
          )}
        </div>

        <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
}

const modalStyles = {
  backdrop:{
    position:'fixed', inset:0, background:'rgba(42,24,16,.7)', backdropFilter:'blur(4px)',
    display:'grid', placeItems:'center', zIndex:100, padding:20
  },
  box:{
    background:'#FFF6E5', borderRadius:28, padding:30, width:'100%', maxWidth:600,
    border:'4px solid var(--c-amber)', boxShadow:'0 20px 60px rgba(0,0,0,.3)'
  },
};

window.SectionGame = SectionGame;
window.GameModalStyles = modalStyles;
