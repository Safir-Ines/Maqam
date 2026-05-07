import React from 'react';
// Stories section — choose read/listen, AI reader modal
const { useState: useS_s } = React;
function StoryCover({story, size=72}) {
  return (
    <div style={{
      width:size, height:size, borderRadius:20, background:'rgba(255,255,255,.22)',
      border:'2px solid rgba(255,255,255,.38)', display:'grid', placeItems:'center'
    }}>
      <Icon.Book size={size*0.55} color="#FFF6E5"/>
    </div>
  );
}

function SectionStories({ctx}) {
  const [open, setOpen] = useS_s(null);
  const [mode, setMode] = useS_s(null); // read | listen
  const ageBand = ctx?.profile?.ageBand || '7-10';
  const complexityLabel = ageBand === '3-6' ? 'سهل' : ageBand === '11+' ? 'متقدم' : 'متوسط';

  return (
    <div style={{padding:'30px 6% 60px', maxWidth:1280, margin:'0 auto'}}>
      <button onClick={()=>ctx.setSection('home')} style={{display:'flex', gap:8, alignItems:'center',
        fontSize:15, fontWeight:700, color:'var(--c-clay)', marginBottom:16}}>
        <Icon.Back size={18} color="var(--c-clay)"/> الرئيسية
      </button>

      <div style={{textAlign:'center', marginBottom:40}}>
        <div style={{fontSize:14, fontWeight:700, color:'var(--c-amber)', letterSpacing:2}}>· قصص الوطن ·</div>
        <h1 style={{fontFamily:'var(--font-display)', fontSize:48, fontWeight:700, marginTop:8}}>
          حكايات الجزائر
        </h1>
        <p style={{fontSize:17, color:'#7a5538', marginTop:8, maxWidth:560, margin:'8px auto 0'}}>
          اختر قصة، اقرأها أو استمع إليها، واسأل القارئ الذكي عن أيّ شيء.
        </p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:24}}>
        {STORIES.map((s, i) => (
          <button key={s.id} onClick={()=>{setOpen(s); setMode(null);}} className="squish" style={{
            background:'#FFF6E5', borderRadius:28, padding:0, overflow:'hidden',
            border:`3px solid ${s.color}`, boxShadow:'0 8px 0 rgba(60,30,10,.1)',
            textAlign:'right', cursor:'pointer'
          }}>
            <div style={{
              background:`linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
              padding:'40px 24px', display:'flex', flexDirection:'column', alignItems:'center',
              gap:8, color:'#FFF6E5'
            }}>
              <StoryCover story={s} size={86}/>
              <div style={{fontSize:13, fontWeight:700, opacity:.95, letterSpacing:1}}>{s.date}</div>
            </div>
            <div style={{padding:'20px 22px'}}>
              <h3 style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:700}}>{s.title}</h3>
              <p style={{fontSize:14, color:'#7a5538', marginTop:6}}>{s.subtitle}</p>
              <div style={{display:'flex', gap:14, marginTop:14, fontSize:13, color:'#5a3a1f'}}>
                <span>{s.duration}</span>
                <span>{s.pages} صفحات</span>
                <span>المستوى: {complexityLabel}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {open && !mode && <ModeChoice story={open} onPick={setMode} onClose={()=>setOpen(null)}/>}
      {open && mode && <StoryReader story={open} mode={mode} ageBand={ageBand} onClose={()=>{setOpen(null); setMode(null);}}/>}
    </div>
  );
}

function ModeChoice({story, onPick, onClose}) {
  return (
    <div style={mStyles.backdrop} onClick={onClose}>
      <div style={mStyles.box} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:'absolute', top:14, insetInlineEnd:14, width:36, height:36,
          borderRadius:'50%', background:'var(--c-soft)', display:'grid', placeItems:'center'}}>
          <Icon.Close size={18} color="var(--c-clay)"/>
        </button>
        <div style={{textAlign:'center', padding:'20px 0'}}>
          <div style={{display:'flex', justifyContent:'center', marginBottom:8}}><StoryCover story={story} size={88}/></div>
          <div style={{fontSize:13, fontWeight:700, color:story.color, letterSpacing:1}}>· {story.date} ·</div>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, marginTop:6}}>{story.title}</h2>
          <p style={{fontSize:15, color:'#5a3a1f', marginTop:14, lineHeight:1.7, maxWidth:420, margin:'14px auto 0'}}>
            {story.excerpt}
          </p>

          <div style={{fontSize:14, fontWeight:700, color:'#7a5538', marginTop:30, marginBottom:14}}>كيف تحبّ القصة؟</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <button onClick={()=>onPick('read')} className="squish" style={{
              background:'#FFE9C4', border:'3px solid var(--c-amber)', borderRadius:20, padding:'24px 14px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10
            }}>
              <Icon.Book size={48} color="var(--c-amber)"/>
              <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:700}}>اقرأ</div>
              <div style={{fontSize:12, color:'#7a5538'}}>صفحة بصفحة بنفسي</div>
            </button>
            <button onClick={()=>onPick('listen')} className="squish" style={{
              background:'#E8F4ED', border:'3px solid var(--c-mint)', borderRadius:20, padding:'24px 14px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10
            }}>
              <Icon.Mic size={48} color="var(--c-mint)"/>
              <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:700}}>استمع</div>
              <div style={{fontSize:12, color:'#7a5538'}}>القارئ يحكي لي</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryReader({story, mode, ageBand='7-10', onClose}) {
  const [page, setPage] = useS_s(0);
  const [playing, setPlaying] = useS_s(mode === 'listen');
  const [askOpen, setAskOpen] = useS_s(false);
  const speechRef = React.useRef(null);

  // Reset page when story changes
  React.useEffect(() => {
    setPage(0);
  }, [story.id]);

  const pagesByBand = {
    '3-6': [
      `في يوم جميل من تاريخ الجزائر، بدأت حكاية شجاعة. ${story.excerpt}`,
      'كان الناس يحبون وطنهم كثيرًا، ويتعاونون حتى يكون المستقبل أفضل.',
      'الأطفال كانوا يسمعون قصص الأبطال ويتعلمون معنى المحبة والاحترام.',
      'كبر الفرح في القلوب، لأن الجميع آمن أن الوطن يستحق الأفضل.',
      'تعلمنا من القصة أن نكون طيبين، شجعان، ونحب الجزائر دائمًا. 🇩🇿',
    ],
    '7-10': [
      `كانت الجزائر في تلك الأيام مشتاقة إلى الحرية. ${story.excerpt}`,
      'في الجبال والمدن، كان الناس يعدّون أنفسهم لشيء كبير، شيء سيغيّر تاريخ البلاد.',
      'الأطفال كانوا يستمعون إلى أهلهم وهم يتحدّثون بصوت خافت في الليل، عن وطن وحلم.',
      'وفي ذلك اليوم العظيم، رفع الشباب الأعلام، ودوّت الأناشيد، وانطلق الفجر الجديد.',
      'وهكذا، أصبحت الجزائر بلدًا يفخر بأبنائه، ويذكر شهداءه في كلّ مناسبة.',
      'وأنت يا صغيري، لا تنسى أبدًا أنّ هذا الوطن أمانة في عنقك. 🇩🇿',
    ],
    '11+': [
      `تبدأ هذه الحكاية من لحظة مفصلية في تاريخ الجزائر. ${story.excerpt}`,
      'كان الوعي الوطني يتصاعد بين مختلف فئات المجتمع، مع إدراك عميق بأن التغيير يحتاج تنظيمًا وتضحية.',
      'تداخلت الأحداث السياسية والاجتماعية، فصارت القرى والمدن فضاءً لنقاش الحرية والهوية والمستقبل.',
      'في لحظة الانطلاق، لم يكن الهدف مجرد رد فعل، بل مشروعًا تاريخيًا لبناء دولة مستقلة.',
      'تُظهر هذه القصة كيف يصنع الوعي الجماعي مسار الأمم، وكيف يصبح الأفراد جزءًا من حدث أكبر منهم.',
      'قراءة هذه الذاكرة تساعدنا اليوم على فهم معنى المسؤولية تجاه الوطن والتاريخ. 🇩🇿',
    ],
  };
  const pages = pagesByBand[ageBand] || pagesByBand['7-10'];
  const cur = pages[Math.min(page, pages.length-1)];

  // Ensure voices are loaded
  React.useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  React.useEffect(() => {
    if (playing) {
      // Small delay to ensure browser is ready for speech after interaction
      const t = setTimeout(() => speak(cur), 100);
      return () => { clearTimeout(t); stop(); };
    } else {
      stop();
    }
    return () => stop();
  }, [playing, page, cur]);

  function speak(text) {
    window.speechSynthesis.cancel();
    if (!text || !playing) return;

    // Very simple cleaning to avoid breaking the engine
    const cleanText = text.replace(/[🇩🇿]|DZ/g, ' الجزائر ').trim();

    // Split text into sentences for more stable reading
    const sentences = cleanText.split(/[.،!؟]\s+/).filter(s => s.length > 1);
    let currentSentence = 0;

    const speakSentence = (index) => {
      if (index >= sentences.length || !playing) {
        if (page < pages.length - 1 && playing) {
          setTimeout(() => setPage(p => p + 1), 1500);
        } else {
          setPlaying(false);
        }
        return;
      }

      const ut = new SpeechSynthesisUtterance(sentences[index]);
      
      // Try to find the BEST Arabic voice (Preferring MALE for Uncle Rachid)
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Male') || v.name.includes('Naayf') || v.name.includes('Hamza'))) ||
                        voices.find(v => v.lang === 'ar-SA' || v.lang === 'ar-EG') || 
                        voices.find(v => v.lang.startsWith('ar')) ||
                        voices.find(v => v.name.includes('Arabic'));
      
      if (bestVoice) {
        ut.voice = bestVoice;
        ut.lang = bestVoice.lang;
      } else {
        ut.lang = 'ar';
      }

      // Voice settings for an "Old Wise Man" (Uncle Rachid) - Balanced
      ut.rate = 0.88; // More natural speed
      ut.pitch = 0.85; // Deep but clear

      ut.onend = () => {
        setTimeout(() => speakSentence(index + 1), 200);
      };

      ut.onerror = (e) => {
        console.error("Sentence error:", e);
        // Fallback: just try the next sentence
        setTimeout(() => speakSentence(index + 1), 500);
      };

      window.speechSynthesis.speak(ut);
      speechRef.current = ut;
    };

    speakSentence(0);
  }

  function stop() {
    window.speechSynthesis.cancel();
  }

  return (
    <div style={mStyles.fullscreen}>
      {/* Top bar */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px',
        background:'#FFF6E5', borderBottom:'2px dashed var(--c-soft)'}}>
        <button onClick={onClose} className="squish" style={{display:'flex', gap:8, alignItems:'center',
          fontWeight:700, color:'var(--c-clay)'}}>
          <Icon.Close size={20} color="var(--c-clay)"/> إغلاق
        </button>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:11, fontWeight:700, color:story.color, letterSpacing:1}}>{story.date}</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:700}}>{story.title}</div>
        </div>
        <div style={{fontSize:14, color:'#7a5538', fontWeight:700}}>صفحة {page+1} / {story.pages}</div>
      </div>

      {/* Story page */}
      <div style={{flex:1, overflow:'auto', padding:'40px 24px',
        background:`linear-gradient(180deg, ${story.color}10, transparent)`}}>
        <div style={{maxWidth:680, margin:'0 auto', background:'#FFFBF1', borderRadius:24, padding:'40px 36px',
          border:`3px solid ${story.color}`, boxShadow:'0 12px 40px rgba(60,30,10,.15)',
          minHeight:380, position:'relative'}}>
          <div style={{display:'flex', justifyContent:'center', marginBottom:24, position:'relative'}}>
            <StoryCover story={story} size={96}/>
            {mode === 'listen' && (
              <img src="assets/storyteller.png" alt="الراوي" style={{
                position:'absolute', bottom:-10, insetInlineEnd:-10, width:60, height:60,
                borderRadius:15, border:'3px solid #FFF', boxShadow:'0 4px 12px rgba(0,0,0,.15)',
                animation: playing ? 'talking 1s ease-in-out infinite' : 'none'
              }}/>
            )}
          </div>
          <p style={{fontSize:22, lineHeight:2, color:'#2A1810', textAlign:'justify', textWrap:'pretty'}}>
            {cur}
          </p>
          <style>{`
            @keyframes talking {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `}</style>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{padding:'18px 24px', background:'#FFF6E5', borderTop:'2px dashed var(--c-soft)',
        display:'flex', alignItems:'center', gap:14}}>
        <button onClick={()=>setPage(Math.max(0, page-1))} disabled={page===0} className="squish" style={{
          width:50, height:50, borderRadius:'50%', background:'var(--c-soft)',
          display:'grid', placeItems:'center', opacity:page===0?.4:1
        }}>
          <Icon.Back size={22} color="var(--c-clay)" rtl={false}/>
        </button>

        {mode === 'listen' && (
          <>
            <button onClick={()=>setPlaying(!playing)} className="squish" style={{
              width:60, height:60, borderRadius:'50%', background:story.color,
              display:'grid', placeItems:'center'
            }}>
              {playing ? <Icon.Pause size={26} color="#FFF6E5"/> : <Icon.Play size={26} color="#FFF6E5"/>}
            </button>

            <div style={{flex:1, display:'flex', flexDirection:'column', gap:6}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#7a5538'}}>
                <span>{playing ? 'يقرأ الآن بصوت عمّي رشيد...' : 'توقف القارئ'}</span>
                <span>الصفحة {page + 1} من {pages.length}</span>
              </div>
              <div style={{height:8, background:'var(--c-soft)', borderRadius:4, overflow:'hidden', position:'relative'}}>
                {/* Real progress bar based on pages */}
                <div style={{
                  width:`${((page + 1) / pages.length) * 100}%`, 
                  height:'100%', background:story.color, borderRadius:4,
                  transition:'width 0.5s ease'
                }}/>
                {/* Voice wave animation when playing */}
                {playing && (
                  <div style={{position:'absolute', inset:0, display:'flex', gap:2, padding:'0 10px', alignItems:'center', opacity:0.4}}>
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} style={{
                        flex:1, height:'60%', background:'#FFF', borderRadius:2,
                        animation:`wave 1s ease-in-out infinite`,
                        animationDelay:`${i*0.1}s`
                      }}/>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <style>{`
              @keyframes wave {
                0%, 100% { height: 30%; }
                50% { height: 80%; }
              }
            `}</style>

            <button onClick={()=>{setPlaying(false); setAskOpen(true);}} className="squish" style={{
              background:'var(--c-clay)', color:'#FFF6E5', padding:'14px 22px', borderRadius:999,
              display:'flex', gap:8, alignItems:'center', fontWeight:700, fontSize:14,
              boxShadow:'0 4px 0 #8B2616'
            }}>
              <Icon.Mic size={18} color="#FFF6E5"/> اسأل القارئ
            </button>
          </>
        )}

        {mode === 'read' && (
          <div style={{flex:1, textAlign:'center', fontSize:14, color:'#7a5538'}}>
            استخدم الأسهم لتقليب الصفحات
          </div>
        )}

        <button onClick={()=>setPage(Math.min(pages.length-1, page+1))} className="squish" style={{
          width:50, height:50, borderRadius:'50%', background:story.color,
          display:'grid', placeItems:'center'
        }}>
          <Icon.Back size={22} color="#FFF6E5" rtl={true}/>
        </button>
      </div>

      {askOpen && <AskAI story={story} onClose={()=>setAskOpen(false)}/>}
    </div>
  );
}

function AskAI({story, onClose}) {
  const [messages, setMessages] = useS_s([
    {role:'ai', text:`مرحبًا! أنا القارئ الذكي. اسألني أيّ شيء عن قصة "${story.title}"`}
  ]);
  const [input, setInput] = useS_s('');
  const [thinking, setThinking] = useS_s(false);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, {role:'user', text}]);
    setInput('');
    setThinking(true);
    // Mock response
    setTimeout(() => {
      const responses = {
        'لماذا': `سؤال جميل! ${story.title} حدث لأنّ الجزائريين أرادوا حرية وكرامة بعد سنوات طويلة من المعاناة.`,
        'متى': `كان ذلك في ${story.date}، وهو يوم لا ينساه التاريخ.`,
        'من': 'كان هناك أبطال كثيرون: شباب، نساء، شيوخ، وحتى أطفال مثلك! كلّهم أحبّوا وطنهم.',
      };
      const key = Object.keys(responses).find(k => text.includes(k));
      const reply = responses[key] || `سؤال رائع! في قصة ${story.title}، حدث الكثير من الأشياء المهمة. هل تريد أن أحكي لك عن جزء معيّن؟`;
      setMessages(m => [...m, {role:'ai', text:reply}]);
      setThinking(false);
    }, 1100);
  };

  const suggestions = ['لماذا حدث هذا؟', 'متى كان ذلك؟', 'من هم الأبطال؟'];

  return (
    <div style={{...mStyles.backdrop, zIndex:200, alignItems:'stretch', padding:0}}>
      <div style={{
        width:'100%', maxWidth:'100%', height:'100%', background:'#FFF6E5',
        display:'flex', flexDirection:'column'
      }}>
        {/* Header with avatar */}
        <div style={{
          background:'linear-gradient(135deg, var(--c-clay), var(--c-amber))',
          padding:'30px 24px', display:'flex', alignItems:'center', gap:20, color:'#FFF6E5',
          position:'relative'
        }}>
          <button onClick={onClose} style={{position:'absolute', top:16, insetInlineStart:16, width:40, height:40,
            borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'grid', placeItems:'center'}}>
            <Icon.Close size={20} color="#FFF6E5"/>
          </button>
          <img
            src="assets/storyteller.png"
            alt="عمّي رشيد"
            style={{
              width:120, height:120, borderRadius:20, background:'#FFF6E5',
              border:'4px solid #FFF6E5', boxShadow:'0 6px 20px rgba(0,0,0,.2)',
              objectFit:'contain', padding:8, animation:'pulse 2s ease-in-out infinite'
            }}
          />
          <div>
            <div style={{fontSize:13, fontWeight:700, opacity:.9, letterSpacing:1}}>· القارئ الذكي ·</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:700}}>عمّي رشيد</div>
            <div style={{fontSize:13, opacity:.95, marginTop:2}}>أعرف كلّ شيء عن قصص الجزائر</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1, overflow:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:14}}>
          {messages.map((m, i) => (
            <div key={i} style={{display:'flex', justifyContent: m.role==='user'?'flex-start':'flex-end', alignItems:'flex-end', gap:10}}>
              {m.role==='ai' && <img src="assets/storyteller.png" alt="" style={{width:42, height:42, borderRadius:10, objectFit:'contain', background:'#FFF6E5', border:'2px solid var(--c-soft)', padding:3}}/>}
              <div style={{
                maxWidth:'70%', padding:'14px 18px', borderRadius:20,
                background: m.role==='user' ? 'var(--c-clay)' : '#FFFBF1',
                color: m.role==='user' ? '#FFF6E5' : '#2A1810',
                border: m.role==='ai' ? '2px solid var(--c-soft)' : 'none',
                fontSize:16, lineHeight:1.6,
                borderBottomLeftRadius: m.role==='ai' ? 4 : 20,
                borderBottomRightRadius: m.role==='user' ? 4 : 20,
              }}>{m.text}</div>
              {m.role==='user' && <div style={{width:36, height:36, borderRadius:'50%', background:'#FFF6E5', border:'2px solid var(--c-soft)', overflow:'hidden'}}>
                <img src="assets/pfp/girl.png" alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>}
            </div>
          ))}
          {thinking && (
            <div style={{display:'flex', justifyContent:'flex-end', gap:10, alignItems:'flex-end'}}>
              <img src="assets/storyteller.png" alt="" style={{width:42, height:42, borderRadius:10, objectFit:'contain', background:'#FFF6E5', border:'2px solid var(--c-soft)', padding:3}}/>
              <div style={{padding:'14px 18px', borderRadius:20, background:'#FFFBF1', border:'2px solid var(--c-soft)', display:'flex', gap:6}}>
                {[0,1,2].map(i => <div key={i} style={{
                  width:8, height:8, borderRadius:4, background:'var(--c-clay)',
                  animation:`bb 1s ease-in-out infinite`, animationDelay:`${i*.15}s`
                }}/>)}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions + input */}
        <div style={{padding:'16px 24px', background:'#FFFBF1', borderTop:'2px dashed var(--c-soft)'}}>
          <div style={{display:'flex', gap:8, marginBottom:10, flexWrap:'wrap'}}>
            {suggestions.map(s => (
              <button key={s} onClick={()=>send(s)} style={{
                background:'#FFE9C4', padding:'8px 14px', borderRadius:999, fontSize:13,
                color:'var(--c-clay)', fontWeight:600, border:'2px solid var(--c-amber)'
              }}>{s}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter') send(input)}}
              placeholder="اكتب سؤالك..." style={{
              flex:1, padding:'14px 18px', borderRadius:999, border:'2px solid var(--c-soft)',
              fontFamily:'inherit', fontSize:16, background:'#FFF6E5', outline:'none'
            }}/>
            <button className="squish" style={{
              width:54, height:54, borderRadius:'50%', background:'var(--c-clay)',
              display:'grid', placeItems:'center', boxShadow:'0 4px 0 #8B2616'
            }}>
              <Icon.Mic size={22} color="#FFF6E5"/>
            </button>
            <button onClick={()=>send(input)} className="squish" style={{
              padding:'0 24px', borderRadius:999, background:'var(--c-mint)', color:'#FFF6E5',
              fontWeight:800, fontSize:15, boxShadow:'0 4px 0 #1d5439'
            }}>إرسال</button>
          </div>
        </div>

        <style>{`
          @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
          @keyframes bb{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}
        `}</style>
      </div>
    </div>
  );
}

const mStyles = {
  backdrop:{
    position:'fixed', inset:0, background:'rgba(42,24,16,.7)', backdropFilter:'blur(4px)',
    display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:20
  },
  box:{
    background:'#FFF6E5', borderRadius:28, padding:30, width:'100%', maxWidth:520,
    border:'4px solid var(--c-amber)', boxShadow:'0 20px 60px rgba(0,0,0,.3)',
    position:'relative'
  },
  fullscreen:{
    position:'fixed', inset:0, background:'#FFF6E5', zIndex:100,
    display:'flex', flexDirection:'column'
  },
};

window.SectionStories = SectionStories;
