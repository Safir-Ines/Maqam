import React from 'react';
// Parent/School Dashboard — Management & Monitoring
const { useState: useS_p, useEffect: useE_p } = React;

function SectionParentDashboard({ctx}) {
  const [activeTab, setActiveTab] = useS_p('accounts'); // accounts | progress | community
  const [accounts, setAccounts] = useS_p(() => {
    const saved = localStorage.getItem('maqam_accounts');
    return saved ? JSON.parse(saved) : [
      {id: '1', name: 'أمين', age: 8, ageBand: '7-10', progress: 65, status: 'active', timeLimit: 60},
      {id: '2', name: 'سارة', age: 5, ageBand: '3-6', progress: 30, status: 'active', timeLimit: 45},
    ];
  });

  useE_p(() => {
    localStorage.setItem('maqam_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (newAcc) => {
    setAccounts([...accounts, { ...newAcc, id: Date.now().toString(), progress: 0, status: 'active' }]);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <div style={{minHeight:'100vh', background:'#F8FAFC', padding:'40px 6%'}}>
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40}}>
        <div>
          <h1 style={{fontSize:32, fontWeight:800, color:'#1E293B'}}>لوحة التحكم العائلية</h1>
          <p style={{color:'#64748B', marginTop:4}}>أهلاً بك، يمكنك إدارة حسابات أطفالك ومتابعة تطورهم</p>
        </div>
        <button onClick={()=>ctx.setSection('home')} style={{
          padding:'12px 24px', background:'#FFF', border:'1px solid #E2E8F0', borderRadius:12,
          fontWeight:700, color:'#1E293B', display:'flex', gap:8, alignItems:'center', cursor:'pointer'
        }}>
          <Icon.Home size={20}/> العودة للتطبيق
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:32, borderBottom:'1px solid #E2E8F0', marginBottom:32}}>
        {[
          {id:'accounts', label:'إدارة الحسابات', icon:<Icon.Users size={20}/>},
          {id:'progress', label:'تقارير الإنجاز', icon:<Icon.Book size={20}/>},
          {id:'community', label:'مجتمع الأولياء', icon:<Icon.Sparkle size={20}/>}
        ].map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            padding:'16px 8px', background:'none', border:'none', borderBottom: activeTab===t.id ? '3px solid #3B82F6' : '3px solid transparent',
            color: activeTab===t.id ? '#3B82F6' : '#64748B', fontWeight:700, fontSize:16,
            display:'flex', gap:10, alignItems:'center', cursor:'pointer', transition:'all 0.2s'
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'accounts' && <AccountsManager accounts={accounts} onAdd={addAccount} onDelete={deleteAccount} />}
      {activeTab === 'progress' && <ProgressReports accounts={accounts} />}
      {activeTab === 'community' && <CommunityFeed />}
    </div>
  );
}

function AccountsManager({accounts, onAdd, onDelete}) {
  const [showAdd, setShowAdd] = useS_p(false);
  const [formData, setFormData] = useS_p({name:'', age:7, timeLimit:60});

  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24}}>
        {accounts.map(acc => (
          <div key={acc.id} style={{
            background:'#FFF', borderRadius:24, padding:24, border:'1px solid #E2E8F0',
            boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', position:'relative'
          }}>
            <div style={{display:'flex', gap:16, alignItems:'center', marginBottom:20}}>
              <div style={{width:64, height:64, borderRadius:20, background:'#EFF6FF', display:'grid', placeItems:'center', fontSize:32}}>👦</div>
              <div>
                <h3 style={{fontSize:20, fontWeight:800, color:'#1E293B'}}>{acc.name}</h3>
                <span style={{background:'#F1F5F9', padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:600, color:'#475569'}}>عمر {acc.age} سنوات</span>
              </div>
            </div>
            
            <div style={{marginBottom:20}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:8}}>
                <span style={{color:'#64748B'}}>نسبة الإنجاز</span>
                <span style={{fontWeight:700, color:'#3B82F6'}}>{acc.progress}%</span>
              </div>
              <div style={{height:8, background:'#F1F5F9', borderRadius:4, overflow:'hidden'}}>
                <div style={{width:`${acc.progress}%`, height:'100%', background:'#3B82F6'}} />
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:16, borderTop:'1px solid #F1F5F9'}}>
              <div style={{fontSize:13, color:'#64748B'}}>⏳ الحد اليومي: {acc.timeLimit} دقيقة</div>
              <button onClick={()=>onDelete(acc.id)} style={{background:'none', border:'none', color:'#EF4444', fontWeight:600, cursor:'pointer'}}>حذف</button>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <button onClick={()=>setShowAdd(true)} style={{
          background:'#FFF', borderRadius:24, padding:24, border:'2px dashed #CBD5E1',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
          cursor:'pointer', minHeight:200, transition:'all 0.2s'
        }}>
          <div style={{width:48, height:48, borderRadius:'50%', background:'#F1F5F9', display:'grid', placeItems:'center', color:'#64748B'}}>+</div>
          <span style={{fontWeight:700, color:'#64748B'}}>إضافة طفل جديد</span>
        </button>
      </div>

      {showAdd && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', backdropFilter:'blur(4px)', zIndex:1000, display:'grid', placeItems:'center'}}>
          <div style={{background:'#FFF', borderRadius:32, padding:40, width:'100%', maxWidth:480, boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)'}}>
            <h2 style={{fontSize:24, fontWeight:800, marginBottom:24, textAlign:'center'}}>إضافة طفل جديد</h2>
            <div style={{display:'flex', flexDirection:'column', gap:20}}>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:700, color:'#475569'}}>الاسم</label>
                <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} style={{width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid #E2E8F0', outline:'none'}} placeholder="مثلاً: أمين" />
              </div>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:700, color:'#475569'}}>العمر</label>
                <input type="number" value={formData.age} onChange={e=>setFormData({...formData, age:parseInt(e.target.value)})} style={{width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid #E2E8F0', outline:'none'}} />
              </div>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:700, color:'#475569'}}>الحد اليومي (دقائق)</label>
                <input type="number" value={formData.timeLimit} onChange={e=>setFormData({...formData, timeLimit:parseInt(e.target.value)})} style={{width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid #E2E8F0', outline:'none'}} />
              </div>
              <div style={{display:'flex', gap:12, marginTop:10}}>
                <button onClick={()=>{onAdd(formData); setShowAdd(false);}} style={{flex:1, padding:'14px', background:'#3B82F6', color:'#FFF', borderRadius:12, fontWeight:800, border:'none', cursor:'pointer'}}>تأكيد الإضافة</button>
                <button onClick={()=>setShowAdd(false)} style={{flex:1, padding:'14px', background:'#F1F5F9', color:'#475569', borderRadius:12, fontWeight:800, border:'none', cursor:'pointer'}}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressReports({accounts}) {
  return (
    <div style={{background:'#FFF', borderRadius:32, padding:40, border:'1px solid #E2E8F0'}}>
      <h3 style={{fontSize:24, fontWeight:800, marginBottom:32}}>تقارير التقدم المعرفي</h3>
      <div style={{display:'flex', flexDirection:'column', gap:32}}>
        {accounts.map(acc => (
          <div key={acc.id}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, alignItems:'center'}}>
              <span style={{fontWeight:800, fontSize:18}}>{acc.name}</span>
              <span style={{color:'#64748B', fontSize:14}}>آخر نشاط: اليوم</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
              <StatBox label="المناطق المستكشفة" value="6 / 8" color="#3B82F6" />
              <StatBox label="الأختام المجموعة" value="12" color="#10B981" />
              <StatBox label="نقاط الألغاز" value="850" color="#F59E0B" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({label, value, color}) {
  return (
    <div style={{padding:20, borderRadius:20, background:color+'08', border:`1px solid ${color}22`}}>
      <div style={{color:'#64748B', fontSize:12, fontWeight:700, marginBottom:8}}>{label}</div>
      <div style={{color:color, fontSize:24, fontWeight:800}}>{value}</div>
    </div>
  );
}

function CommunityFeed() {
  const posts = [
    {id:1, user:'الأستاذ أحمد', role:'معلم تاريخ', text:'أنصح الأولياء بالتركيز على قسم "قصص الوطن" هذا الأسبوع، فهو غني بمعلومات عن المقاومة الشعبية.', likes:24, comments:5},
    {id:2, user:'السيدة مريم', role:'ولي أمر', text:'أعجبني جداً قسم المطبخ! ابني أصبح يعرف مكونات الكسكسي ويحب مساعدتي في المطبخ الآن.', likes:42, comments:12},
  ];

  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <div style={{background:'#FFF', borderRadius:24, padding:24, border:'1px solid #E2E8F0', marginBottom:24}}>
        <textarea style={{width:'100%', height:100, border:'1px solid #E2E8F0', borderRadius:16, padding:16, outline:'none', resize:'none'}} placeholder="شارك نصيحة أو تجربة مع المجتمع..." />
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:12}}>
          <button style={{padding:'10px 24px', background:'#3B82F6', color:'#FFF', borderRadius:12, fontWeight:800, border:'none', cursor:'pointer'}}>نشر</button>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:20}}>
        {posts.map(p => (
          <div key={p.id} style={{background:'#FFF', borderRadius:24, padding:24, border:'1px solid #E2E8F0'}}>
            <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
              <div style={{width:40, height:40, borderRadius:12, background:'#F1F5F9', display:'grid', placeItems:'center'}}>👤</div>
              <div>
                <div style={{fontWeight:800}}>{p.user}</div>
                <div style={{fontSize:12, color:'#64748B'}}>{p.role}</div>
              </div>
            </div>
            <p style={{color:'#334155', lineHeight:1.6, marginBottom:20}}>{p.text}</p>
            <div style={{display:'flex', gap:20, fontSize:14, color:'#64748B'}}>
              <span>❤️ {p.likes} إعجاب</span>
              <span>💬 {p.comments} تعليق</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.SectionParentDashboard = SectionParentDashboard;
