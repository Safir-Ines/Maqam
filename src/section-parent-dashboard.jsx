import React from 'react';

// Enterprise-Grade Parent & Educator Dashboard
const { useState: useS_p, useEffect: useE_p } = React;

function SectionParentDashboard({ctx}) {
  const [activeTab, setActiveTab] = useS_p('overview'); // overview | accounts | analytics | community
  const [accounts, setAccounts] = useS_p(() => {
    const saved = localStorage.getItem('maqam_accounts');
    return saved ? JSON.parse(saved) : [
      {id: '1', name: 'أمين', age: 8, ageBand: '7-10', progress: 65, status: 'active', timeLimit: 60, lastActive: 'اليوم، 14:30', score: 1250},
      {id: '2', name: 'سارة', age: 5, ageBand: '3-6', progress: 30, status: 'active', timeLimit: 45, lastActive: 'أمس، 09:15', score: 420},
    ];
  });

  useE_p(() => {
    localStorage.setItem('maqam_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (newAcc) => {
    setAccounts([...accounts, { ...newAcc, id: Date.now().toString(), progress: 0, status: 'active', lastActive: 'لم يبدأ بعد', score: 0 }]);
  };

  const deleteAccount = (id) => {
    if(confirm('هل أنت متأكد من حذف هذا الحساب؟ ستفقد جميع البيانات التقدم.')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <div style={{minHeight:'100vh', background:'#F1F5F9', fontFamily:'Inter, system-ui, sans-serif', direction:'rtl', display:'flex'}}>
      
      {/* Professional Sidebar */}
      <aside style={{
        width: 260, background:'#0F172A', color:'#F8FAFC', minHeight:'100vh', 
        display:'flex', flexDirection:'column', borderInlineEnd:'1px solid #1E293B'
      }}>
        <div style={{padding:'24px 20px', borderBottom:'1px solid #1E293B', display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:32, height:32, background:'#4F46E5', borderRadius:6, display:'grid', placeItems:'center'}}>
            <Icon.Star size={18} color="#FFF"/>
          </div>
          <div>
            <div style={{fontSize:16, fontWeight:600, letterSpacing:'-0.01em', color:'#FFF'}}>منصة مقام</div>
            <div style={{fontSize:11, color:'#94A3B8', marginTop:2}}>لوحة الإدارة والإشراف</div>
          </div>
        </div>

        <nav style={{padding:'20px 12px', display:'flex', flexDirection:'column', gap:4, flex:1}}>
          <div style={{fontSize:11, fontWeight:600, color:'#64748B', marginBottom:8, padding:'0 12px', textTransform:'uppercase', letterSpacing:'0.05em'}}>القائمة الرئيسية</div>
          {[
            {id:'overview', label:'نظرة عامة', icon:<Icon.Home size={18}/>},
            {id:'accounts', label:'إدارة الحسابات', icon:<Icon.Users size={18}/>},
            {id:'analytics', label:'التحليلات والتقارير', icon:<Icon.Cards size={18}/>},
            {id:'community', label:'المجتمع الأكاديمي', icon:<Icon.Book size={18}/>}
          ].map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              padding:'10px 12px', background: activeTab === t.id ? '#1E293B' : 'transparent', border:'none', 
              color: activeTab === t.id ? '#F8FAFC' : '#94A3B8', fontWeight:500, fontSize:14, borderRadius:6,
              display:'flex', gap:12, alignItems:'center', cursor:'pointer', transition:'all 0.15s', textAlign:'right'
            }}>
              <span style={{color: activeTab === t.id ? '#4F46E5' : '#64748B'}}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{padding:'20px', borderTop:'1px solid #1E293B'}}>
          <button onClick={()=>ctx.setSection('home')} style={{
            width:'100%', padding:'10px', background:'transparent', border:'1px solid #334155', borderRadius:6,
            color:'#CBD5E1', fontSize:13, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer'
          }}>
            <Icon.Back size={16}/> خروج إلى التطبيق
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{flex:1, padding:'40px 48px', overflowY:'auto', height:'100vh', boxSizing:'border-box'}}>
        <header style={{marginBottom:32}}>
          <h1 style={{fontSize:28, fontWeight:700, color:'#0F172A', margin:0, letterSpacing:'-0.02em'}}>
            {activeTab === 'overview' && 'نظرة عامة'}
            {activeTab === 'accounts' && 'إدارة الحسابات'}
            {activeTab === 'analytics' && 'التحليلات والتقارير'}
            {activeTab === 'community' && 'المجتمع الأكاديمي'}
          </h1>
          <p style={{color:'#64748B', fontSize:14, marginTop:6}}>
            متابعة دقيقة لمسار التعلم والتقدم المعرفي.
          </p>
        </header>

        {activeTab === 'overview' && <OverviewDashboard accounts={accounts} />}
        {activeTab === 'accounts' && <AccountsManager accounts={accounts} onAdd={addAccount} onDelete={deleteAccount} />}
        {activeTab === 'analytics' && <ProgressReports accounts={accounts} />}
        {activeTab === 'community' && <CommunityFeed />}
      </main>
    </div>
  );
}

function OverviewDashboard({accounts}) {
  const totalScore = accounts.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const avgProgress = accounts.length ? Math.round(accounts.reduce((a,c)=>a+(c.progress || 0), 0) / accounts.length) : 0;
  
  return (
    <div style={{display:'flex', flexDirection:'column', gap:24}}>
      {/* KPI Cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20}}>
        <KpiCard label="إجمالي الحسابات النشطة" value={accounts.length} trend="+1 هذا الشهر" />
        <KpiCard label="متوسط التقدم الإجمالي" value={`${avgProgress}%`} trend="مستقر" />
        <KpiCard label="إجمالي النقاط المكتسبة" value={totalScore.toLocaleString()} trend="أداء ممتاز" />
      </div>

      {/* Recent Activity Table */}
      <div style={{background:'#FFF', border:'1px solid #E2E8F0', borderRadius:8, boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid #E2E8F0'}}>
          <h3 style={{fontSize:16, fontWeight:600, color:'#0F172A', margin:0}}>النشاط الأخير</h3>
        </div>
        <table style={{width:'100%', borderCollapse:'collapse', textAlign:'right', fontSize:14}}>
          <thead>
            <tr style={{background:'#F8FAFC', color:'#64748B', borderBottom:'1px solid #E2E8F0', fontSize:12, textTransform:'uppercase'}}>
              <th style={{padding:'12px 20px', fontWeight:600}}>المستخدم</th>
              <th style={{padding:'12px 20px', fontWeight:600}}>الفئة العمرية</th>
              <th style={{padding:'12px 20px', fontWeight:600}}>نسبة الإنجاز</th>
              <th style={{padding:'12px 20px', fontWeight:600}}>آخر دخول</th>
              <th style={{padding:'12px 20px', fontWeight:600}}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id} style={{borderBottom:'1px solid #F1F5F9'}}>
                <td style={{padding:'16px 20px', color:'#0F172A', fontWeight:500}}>{acc.name}</td>
                <td style={{padding:'16px 20px', color:'#475569'}}>{acc.ageBand}</td>
                <td style={{padding:'16px 20px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div style={{flex:1, height:6, background:'#F1F5F9', borderRadius:3, overflow:'hidden'}}>
                      <div style={{width:`${acc.progress}%`, height:'100%', background:'#4F46E5', borderRadius:3}} />
                    </div>
                    <span style={{fontSize:12, color:'#64748B', width:30}}>{acc.progress}%</span>
                  </div>
                </td>
                <td style={{padding:'16px 20px', color:'#475569'}}>{acc.lastActive}</td>
                <td style={{padding:'16px 20px'}}>
                  <span style={{background:'#ECFDF5', color:'#059669', padding:'4px 8px', borderRadius:4, fontSize:12, fontWeight:500}}>نشط</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({label, value, trend}) {
  return (
    <div style={{background:'#FFF', padding:'20px', border:'1px solid #E2E8F0', borderRadius:8, boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
      <div style={{color:'#64748B', fontSize:13, fontWeight:500, marginBottom:8}}>{label}</div>
      <div style={{color:'#0F172A', fontSize:28, fontWeight:700, letterSpacing:'-0.02em'}}>{value}</div>
      <div style={{color:'#10B981', fontSize:12, fontWeight:500, marginTop:8, display:'flex', alignItems:'center', gap:4}}>
        <Icon.Star size={12} color="#10B981" /> {trend}
      </div>
    </div>
  );
}

function AccountsManager({accounts, onAdd, onDelete}) {
  const [showAdd, setShowAdd] = useS_p(false);
  const [formData, setFormData] = useS_p({name:'', age:7, timeLimit:60});

  return (
    <div>
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:20}}>
        <button onClick={()=>setShowAdd(true)} style={{
          background:'#4F46E5', color:'#FFF', padding:'8px 16px', borderRadius:6, fontSize:14, fontWeight:500,
          border:'none', cursor:'pointer', display:'flex', gap:8, alignItems:'center', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'
        }}>
          إضافة مستخدم جديد
        </button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20}}>
        {accounts.map(acc => (
          <div key={acc.id} style={{
            background:'#FFF', border:'1px solid #E2E8F0', borderRadius:8, padding:'20px',
            boxShadow:'0 1px 3px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16}}>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{width:40, height:40, borderRadius:'50%', background:'#F1F5F9', border:'1px solid #E2E8F0', display:'grid', placeItems:'center', color:'#64748B'}}>
                  <Icon.Users size={20}/>
                </div>
                <div>
                  <h3 style={{fontSize:16, fontWeight:600, color:'#0F172A', margin:0}}>{acc.name}</h3>
                  <div style={{fontSize:13, color:'#64748B', marginTop:2}}>العمر: {acc.age} | الفئة: {acc.ageBand}</div>
                </div>
              </div>
              <button onClick={()=>onDelete(acc.id)} style={{background:'none', border:'none', color:'#EF4444', cursor:'pointer', padding:4}} title="حذف الحساب">
                <Icon.Close size={18}/>
              </button>
            </div>
            
            <div style={{background:'#F8FAFC', padding:'12px', borderRadius:6, border:'1px solid #F1F5F9', marginBottom:16, display:'flex', justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:11, color:'#64748B', fontWeight:500}}>الحد الزمني اليومي</div>
                <div style={{fontSize:14, color:'#0F172A', fontWeight:600, marginTop:2}}>{acc.timeLimit} دقيقة</div>
              </div>
              <div>
                <div style={{fontSize:11, color:'#64748B', fontWeight:500}}>إجمالي النقاط</div>
                <div style={{fontSize:14, color:'#4F46E5', fontWeight:600, marginTop:2}}>{acc.score || 0}</div>
              </div>
            </div>

            <div style={{marginTop:'auto'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6}}>
                <span style={{color:'#64748B', fontWeight:500}}>التقدم في المهام</span>
                <span style={{fontWeight:600, color:'#0F172A'}}>{acc.progress || 0}%</span>
              </div>
              <div style={{height:6, background:'#F1F5F9', borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${acc.progress || 0}%`, height:'100%', background:'#4F46E5'}} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(2px)', zIndex:100, display:'grid', placeItems:'center'}}>
          <div style={{background:'#FFF', borderRadius:8, padding:'32px', width:'100%', maxWidth:400, boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:20, fontWeight:600, color:'#0F172A', marginBottom:24, marginTop:0}}>تسجيل مستخدم جديد</h2>
            
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              <div>
                <label style={{display:'block', marginBottom:6, fontSize:13, fontWeight:500, color:'#475569'}}>الاسم الكامل</label>
                <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} 
                  style={{width:'100%', padding:'10px 12px', borderRadius:6, border:'1px solid #CBD5E1', fontSize:14, outline:'none', boxSizing:'border-box'}} 
                  placeholder="الاسم" />
              </div>
              
              <div style={{display:'flex', gap:16}}>
                <div style={{flex:1}}>
                  <label style={{display:'block', marginBottom:6, fontSize:13, fontWeight:500, color:'#475569'}}>العمر</label>
                  <input type="number" value={formData.age} onChange={e=>setFormData({...formData, age:parseInt(e.target.value)})} 
                    style={{width:'100%', padding:'10px 12px', borderRadius:6, border:'1px solid #CBD5E1', fontSize:14, outline:'none', boxSizing:'border-box'}} />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:'block', marginBottom:6, fontSize:13, fontWeight:500, color:'#475569'}}>الحد الزمني (د)</label>
                  <input type="number" value={formData.timeLimit} onChange={e=>setFormData({...formData, timeLimit:parseInt(e.target.value)})} 
                    style={{width:'100%', padding:'10px 12px', borderRadius:6, border:'1px solid #CBD5E1', fontSize:14, outline:'none', boxSizing:'border-box'}} />
                </div>
              </div>
            </div>

            <div style={{display:'flex', gap:12, marginTop:32}}>
              <button onClick={()=>{
                const ageBand = formData.age <= 6 ? '3-6' : formData.age <= 10 ? '7-10' : '11+';
                onAdd({...formData, ageBand}); 
                setShowAdd(false);
              }} style={{flex:1, padding:'10px', background:'#4F46E5', color:'#FFF', borderRadius:6, fontWeight:500, fontSize:14, border:'none', cursor:'pointer'}}>حفظ المستخدم</button>
              <button onClick={()=>setShowAdd(false)} style={{padding:'10px 16px', background:'#FFF', color:'#475569', border:'1px solid #CBD5E1', borderRadius:6, fontWeight:500, fontSize:14, cursor:'pointer'}}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressReports({accounts}) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:24}}>
      {accounts.map(acc => (
        <div key={acc.id} style={{background:'#FFF', borderRadius:8, border:'1px solid #E2E8F0', padding:'24px', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #F1F5F9', paddingBottom:16, marginBottom:20}}>
            <div>
              <h3 style={{fontSize:18, fontWeight:600, color:'#0F172A', margin:0}}>{acc.name}</h3>
              <div style={{fontSize:13, color:'#64748B', marginTop:4}}>تقرير الأداء التفصيلي</div>
            </div>
            <button style={{padding:'6px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:6, fontSize:12, fontWeight:500, color:'#475569', cursor:'pointer'}}>
              تصدير التقرير (PDF)
            </button>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20}}>
            <ReportMetric title="معدل إتمام المهام" value={`${acc.progress || 0}%`} trend="موجب" />
            <ReportMetric title="الأوسمة المكتسبة" value={Math.floor((acc.progress || 0) / 10)} trend="محايد" />
            <ReportMetric title="النقاط التراكمية" value={acc.score || 0} trend="موجب" />
            <ReportMetric title="الوقت المستغرق" value={`${Math.floor(((acc.progress || 0) * 2.5))} دقيقة`} trend="محايد" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportMetric({title, value, trend}) {
  const trendColor = trend === 'موجب' ? '#10B981' : trend === 'سالب' ? '#EF4444' : '#64748B';
  return (
    <div>
      <div style={{fontSize:12, color:'#64748B', fontWeight:500, marginBottom:4}}>{title}</div>
      <div style={{display:'flex', alignItems:'baseline', gap:8}}>
        <span style={{fontSize:22, fontWeight:600, color:'#0F172A'}}>{value}</span>
      </div>
    </div>
  );
}

function CommunityFeed() {
  const posts = [
    {id:1, user:'د. أحمد بن علي', role:'مستشار تربوي', text:'تظهر تحليلات النظام أن استخدام قسم "تاريخ الوطن" يعزز بشكل كبير من الوعي الثقافي لدى الفئة العمرية 7-10 سنوات. نوصي بتوجيه الأطفال لإتمام هذه المهام أولاً.', date:'منذ ساعتين'},
    {id:2, user:'إدارة المدرسة', role:'إشراف عام', text:'تم تحديث منهجيات تقييم التقدم لتشمل مهام التفكير المنطقي في قسم الألغاز. نرجو من الأولياء متابعة مؤشرات التطور في لوحة التقارير.', date:'أمس، 10:45'},
  ];

  return (
    <div style={{display:'flex', gap:24, alignItems:'flex-start'}}>
      <div style={{flex:1, display:'flex', flexDirection:'column', gap:20}}>
        <div style={{background:'#FFF', borderRadius:8, border:'1px solid #E2E8F0', padding:'20px', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
          <textarea style={{
            width:'100%', height:80, border:'1px solid #CBD5E1', borderRadius:6, padding:12, 
            fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', boxSizing:'border-box'
          }} placeholder="كتابة تعميم أو إشعار جديد..." />
          <div style={{display:'flex', justifyContent:'flex-end', marginTop:12}}>
            <button style={{padding:'8px 20px', background:'#4F46E5', color:'#FFF', borderRadius:6, fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}>نشر الإعلان</button>
          </div>
        </div>

        {posts.map(p => (
          <div key={p.id} style={{background:'#FFF', borderRadius:8, border:'1px solid #E2E8F0', padding:'24px', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16}}>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{width:40, height:40, borderRadius:'50%', background:'#F1F5F9', border:'1px solid #E2E8F0', display:'grid', placeItems:'center', color:'#64748B'}}>
                  <Icon.Users size={18}/>
                </div>
                <div>
                  <div style={{fontWeight:600, fontSize:15, color:'#0F172A'}}>{p.user}</div>
                  <div style={{fontSize:12, color:'#64748B', marginTop:2}}>{p.role}</div>
                </div>
              </div>
              <span style={{fontSize:12, color:'#94A3B8'}}>{p.date}</span>
            </div>
            <p style={{color:'#334155', fontSize:14, lineHeight:1.6, margin:0}}>{p.text}</p>
          </div>
        ))}
      </div>

      {/* Side panel for community stats */}
      <div style={{width:280, background:'#FFF', borderRadius:8, border:'1px solid #E2E8F0', padding:'20px', flexShrink:0}}>
        <h3 style={{fontSize:14, fontWeight:600, color:'#0F172A', margin:'0 0 16px 0', paddingBottom:12, borderBottom:'1px solid #F1F5F9'}}>مؤشرات التفاعل</h3>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <div>
            <div style={{fontSize:12, color:'#64748B', marginBottom:4}}>الأولياء النشطون</div>
            <div style={{fontSize:18, fontWeight:600, color:'#0F172A'}}>142</div>
          </div>
          <div>
            <div style={{fontSize:12, color:'#64748B', marginBottom:4}}>الإشعارات المقروءة</div>
            <div style={{fontSize:18, fontWeight:600, color:'#0F172A'}}>89%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SectionParentDashboard = SectionParentDashboard;
