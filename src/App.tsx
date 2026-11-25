import { useMemo, useState, type FormEvent } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import {
  Bell, BriefcaseBusiness, ChevronRight, CircleDollarSign, ClipboardCheck,
  Clock3, Coins, LayoutDashboard, LogOut, Menu,
  PackagePlus, Search, Send, ShieldCheck, Sparkles, Users, WalletCards, X,
} from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'
import './App.css'

type Role = 'worker' | 'buyer' | 'admin'
type User = { name: string; email: string; photo: string; role: Role; coins: number }
type Task = {
  id: number; title: string; detail: string; buyer: string; buyerEmail: string;
  completionDate: string; payable: number; workers: number; image: string; submissionInfo: string
}
type Submission = {
  id: number; taskTitle: string; payable: number; workerName: string; workerEmail: string;
  buyerName: string; status: 'pending' | 'approved' | 'rejected'; details: string
}

const seedUser: User = {
  name: 'Alex Morgan',
  email: 'alex@taskly.com',
  photo: 'https://i.pravatar.cc/160?img=12',
  role: 'worker',
  coins: 340,
}

const tasks: Task[] = [
  { id: 1, title: 'Review a mobile banking app', detail: 'Create a short review of the app experience and share honest feedback on usability, speed, and design.', buyer: 'Northstar Labs', buyerEmail: 'buyer@northstar.com', completionDate: '2026-12-04', payable: 12, workers: 24, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80', submissionInfo: 'Upload a screenshot and 2–3 sentences of feedback.' },
  { id: 2, title: 'Test an AI writing tool', detail: 'Generate one blog outline using the linked tool and evaluate whether the result was useful.', buyer: 'Scribe Studio', buyerEmail: 'buyer@scribe.com', completionDate: '2026-12-07', payable: 18, workers: 17, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80', submissionInfo: 'Share the generated outline and a brief rating.' },
  { id: 3, title: 'Follow a creator and comment', detail: 'Visit the creator profile, follow the account, and leave a thoughtful comment on the latest post.', buyer: 'Brightwave Media', buyerEmail: 'buyer@brightwave.com', completionDate: '2026-12-10', payable: 8, workers: 42, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80', submissionInfo: 'Provide the profile link and screenshot of your comment.' },
  { id: 4, title: 'Complete a quick product survey', detail: 'Answer eight questions about your shopping preferences and submit the final confirmation page.', buyer: 'Common Ground', buyerEmail: 'buyer@common.com', completionDate: '2026-12-12', payable: 10, workers: 30, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80', submissionInfo: 'Upload a screenshot of the completed survey.' },
]

const seedSubmissions: Submission[] = [
  { id: 1, taskTitle: 'Write an app store review', payable: 15, workerName: 'Alex Morgan', workerEmail: 'alex@taskly.com', buyerName: 'Northstar Labs', status: 'approved', details: 'I reviewed the app and shared screenshots.' },
  { id: 2, taskTitle: 'Test a checkout experience', payable: 10, workerName: 'Alex Morgan', workerEmail: 'alex@taskly.com', buyerName: 'Scribe Studio', status: 'pending', details: 'Completed the checkout test.' },
  { id: 3, taskTitle: 'Watch and comment on a video', payable: 12, workerName: 'Alex Morgan', workerEmail: 'alex@taskly.com', buyerName: 'Brightwave Media', status: 'rejected', details: 'Watched the video and left feedback.' },
]

const topWorkers = [
  { name: 'Maya Chen', coins: 2840, photo: 'https://i.pravatar.cc/160?img=47' },
  { name: 'Jon Bell', coins: 2490, photo: 'https://i.pravatar.cc/160?img=11' },
  { name: 'Sara Khan', coins: 2210, photo: 'https://i.pravatar.cc/160?img=32' },
  { name: 'Leo Martin', coins: 1980, photo: 'https://i.pravatar.cc/160?img=53' },
  { name: 'Nora Silva', coins: 1760, photo: 'https://i.pravatar.cc/160?img=44' },
  { name: 'Eli James', coins: 1640, photo: 'https://i.pravatar.cc/160?img=15' },
]

function useSession() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('taskly-user')
    return saved ? JSON.parse(saved) : null
  })
  const updateUser = (next: User | null) => {
    setUser(next)
    if (next) localStorage.setItem('taskly-user', JSON.stringify(next))
    else localStorage.removeItem('taskly-user')
  }
  return { user, setUser: updateUser }
}

function Brand() {
  return <Link className="brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={21} /></span><span>Task<span>ly</span></span></Link>
}

function PublicNavbar({ user, logout }: { user: User | null; logout: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Brand />
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {user ? (
            <>
              <Link to={`/dashboard/${user.role}`} onClick={() => setOpen(false)}>Dashboard</Link>
              <div className="coin-pill"><Coins size={16} /> {user.coins}</div>
              <div className="profile-nav">
                <img src={user.photo} alt="" />
                <button type="button" onClick={logout} aria-label="Log out"><LogOut size={17} /></button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link className="nav-register" to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
          <a className="developer-link" href="https://github.com/" target="_blank" rel="noreferrer">Join as Developer</a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div><Brand /><p>Small tasks. Real rewards. A better way to earn online.</p></div>
        <div><strong>Platform</strong><Link to="/tasks">Browse tasks</Link><Link to="/register">Become a worker</Link><Link to="/dashboard/buyer">For buyers</Link></div>
        <div><strong>Company</strong><a href="#how">How it works</a><a href="#stories">Community</a><a href="#support">Support</a></div>
        <div><strong>Follow us</strong><div className="socials"><a href="https://linkedin.com" aria-label="LinkedIn">in</a><a href="https://facebook.com" aria-label="Facebook">f</a><a href="https://github.com" aria-label="GitHub">GH</a></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Taskly. All rights reserved.</span><span>Privacy · Terms</span></div>
    </footer>
  )
}

function HomePage() {
  const slides = [
    { eyebrow: 'Complete tasks. Earn daily.', title: 'Turn your free time into real rewards.', text: 'Find simple online tasks, submit your work, and get paid for every approved completion.', color: 'violet', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85' },
    { eyebrow: 'Trusted by growing teams', title: 'Get quality work done, faster.', text: 'Post a campaign and connect with skilled workers ready to complete it accurately.', color: 'blue', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85' },
    { eyebrow: 'One platform, thousands of opportunities', title: 'Work anywhere. Build at your pace.', text: 'Choose tasks that fit your schedule and withdraw earnings through a payment method you trust.', color: 'coral', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=85' },
  ]
  return (
    <main>
      <Swiper className="hero-swiper" modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop>
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <section className={`hero slide-${slide.color}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(20,18,38,.88), rgba(20,18,38,.18)), url(${slide.image})` }}>
              <div className="hero-content">
                <span className="eyebrow">{slide.eyebrow}</span>
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
                <div className="hero-actions"><Link className="button primary" to="/tasks">Explore tasks <ChevronRight size={18} /></Link><Link className="button glass" to="/register">Start earning</Link></div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="stats-strip" id="how">
        <div><strong>12k+</strong><span>Active workers</span></div>
        <div><strong>3.4k</strong><span>Tasks completed</span></div>
        <div><strong>$86k</strong><span>Rewards paid</span></div>
        <div><strong>98%</strong><span>Approval rate</span></div>
      </section>

      <section className="section" id="workers">
        <div className="section-heading"><div><span className="kicker">Community highlights</span><h2>Meet our top workers</h2></div><Link to="/tasks">View leaderboard <ChevronRight size={17} /></Link></div>
        <div className="worker-grid">
          {topWorkers.map((worker, index) => (
            <article className="worker-card" key={worker.name}>
              <span className="rank">#{index + 1}</span><img src={worker.photo} alt={worker.name} /><h3>{worker.name}</h3><div><Coins size={16} /><strong>{worker.coins}</strong><span> coins</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section testimonials" id="stories">
        <div className="section-heading centered"><div><span className="kicker">Member stories</span><h2>People are getting things done</h2></div></div>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500 }} pagination={{ clickable: true }} slidesPerView={1} breakpoints={{ 800: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}>
          {[
            ['“I started completing two tasks after work and my first payout arrived within a week.”', 'Lena Ortiz', 'Worker', 'https://i.pravatar.cc/160?img=25'],
            ['“The quality of submissions is excellent, and I can scale campaigns without long hiring cycles.”', 'Marcus Hill', 'Buyer', 'https://i.pravatar.cc/160?img=8'],
            ['“The dashboard makes it easy to track submissions and know exactly what needs my attention.”', 'Priya Kapoor', 'Worker', 'https://i.pravatar.cc/160?img=29'],
          ].map(([quote, name, role, photo]) => (
            <SwiperSlide key={name}><article className="testimonial"><div className="quote-mark">“</div><p>{quote}</p><div className="person"><img src={photo} alt={name} /><div><strong>{name}</strong><span>{role}</span></div></div></article></SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="section extra-grid">
        <article className="feature-card purple"><div className="feature-icon"><Sparkles /></div><h3>Fair work, clear rewards</h3><p>Every task shows its reward and requirements before you begin.</p></article>
        <article className="feature-card mint"><div className="feature-icon"><ShieldCheck /></div><h3>Verified submissions</h3><p>Simple review flows keep buyers and workers aligned.</p></article>
        <article className="feature-card peach"><div className="feature-icon"><Clock3 /></div><h3>Flexible schedule</h3><p>Complete work when it suits you, from any device.</p></article>
      </section>

      <section className="cta-section"><div><span className="kicker">Ready when you are</span><h2>Make today productive.</h2></div><Link className="button primary" to="/register">Create free account <ChevronRight size={18} /></Link></section>
    </main>
  )
}

function AuthPage({ mode, setUser }: { mode: 'login' | 'register'; setUser: (user: User) => void }) {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('worker')
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || 'Alex Morgan')
    const email = String(data.get('email') || 'alex@taskly.com')
    const photo = String(data.get('photo') || 'https://i.pravatar.cc/160?img=12')
    const next: User = { name, email, photo, role, coins: isRegister ? (role === 'buyer' ? 50 : role === 'worker' ? 10 : 0) : seedUser.coins }
    setUser(next)
    localStorage.setItem('access-token', 'demo-access-token')
    toast.success(isRegister ? 'Account created successfully' : 'Welcome back')
    navigate(`/dashboard/${role}`)
  }
  return (
    <main className="auth-page">
      <section className="auth-art">
        <Link className="auth-brand" to="/"><span className="brand-mark"><BriefcaseBusiness /></span><span>Taskly</span></Link>
        <div><span className="eyebrow">Your next opportunity is here</span><h1>Do small tasks.<br />Earn real rewards.</h1><p>Join a global community completing meaningful work and growing with every task.</p></div>
        <div className="auth-social-proof"><div className="avatar-stack">{topWorkers.slice(0, 4).map(w => <img key={w.name} src={w.photo} alt="" />)}</div><span><strong>12,000+</strong> active members</span></div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <span className="kicker">{isRegister ? 'Create an account' : 'Welcome back'}</span>
          <h2>{isRegister ? 'Start your earning journey' : 'Log in to Taskly'}</h2>
          <form onSubmit={submit}>
            {isRegister && <label>Full name<input name="name" placeholder="Enter your name" required /></label>}
            <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
            {isRegister && <label>Profile picture URL<input name="photo" type="url" placeholder="https://..." /></label>}
            <label>Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
            {isRegister && <label>Choose your role<select value={role} onChange={e => setRole(e.target.value as Role)}><option value="worker">Worker</option><option value="buyer">Buyer</option></select></label>}
            <button className="auth-submit" type="submit">{isRegister ? 'Create account' : 'Log in'} <ChevronRight size={18} /></button>
          </form>
          <button className="google-button" type="button" onClick={() => { setUser({ ...seedUser, role }); localStorage.setItem('access-token', 'google-demo-token'); navigate(`/dashboard/${role}`); toast.success('Signed in with Google') }}>
            <span className="google-g">G</span> Continue with Google
          </button>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Taskly?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create account'}</Link></p>
        </div>
      </section>
    </main>
  )
}

function TaskList({ user }: { user: User | null }) {
  const [query, setQuery] = useState('')
  const visible = tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()))
  return (
    <main className="public-page">
      <section className="page-hero"><span className="kicker">Available opportunities</span><h1>Find your next task</h1><p>Complete simple tasks and earn coins for approved work.</p></section>
      <section className="task-browser">
        <div className="task-toolbar"><div className="search-box"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks" /></div><button type="button">Newest <ChevronRight size={16} /></button></div>
        <div className="task-grid">
          {visible.map(task => (
            <article className="task-card" key={task.id}>
              <img src={task.image} alt="" />
              <div className="task-card-body"><div className="task-meta"><span>{task.buyer}</span><span><Clock3 size={14} /> {new Date(task.completionDate).toLocaleDateString()}</span></div><h3>{task.title}</h3><p>{task.detail}</p><div className="task-card-footer"><div><strong>{task.payable}</strong><span> coins</span></div><span>{task.workers} spots left</span><Link to={user ? `/dashboard/worker/task/${task.id}` : '/login'}>View task <ChevronRight size={15} /></Link></div></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Dashboard({ user, setUser }: { user: User; setUser: (user: User) => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const base = `/dashboard/${user.role}`
  const items = useMemo(() => {
    if (user.role === 'worker') return [['Home', 'worker-home', LayoutDashboard], ['Task list', 'task-list', BriefcaseBusiness], ['My submissions', 'submissions', ClipboardCheck], ['Withdrawals', 'withdrawals', WalletCards]]
    if (user.role === 'buyer') return [['Home', 'buyer-home', LayoutDashboard], ['Add new task', 'add-task', PackagePlus], ['My tasks', 'my-tasks', BriefcaseBusiness], ['Purchase coins', 'purchase', CircleDollarSign], ['Payment history', 'payments', WalletCards]]
    return [['Home', 'admin-home', LayoutDashboard], ['Manage users', 'users', Users], ['Manage tasks', 'tasks', BriefcaseBusiness]]
  }, [user.role])
  return (
    <div className={`dashboard${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      <aside className="sidebar">
        <Link className="brand dashboard-brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={20} /></span><span>Task<span>ly</span></span></Link>
        <div className="role-label">{user.role}</div>
        <nav>{items.map(([label, route, Icon]) => <NavLink key={route as string} to={`${base}/${route}`} onClick={() => setMobileOpen(false)}><Icon size={19} /><span>{label as string}</span></NavLink>)}</nav>
        <button className="sidebar-collapse" type="button" onClick={() => setCollapsed(!collapsed)}><ChevronRight size={18} /></button>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-title"><button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle sidebar"><Menu /></button><div><span>{user.role} dashboard</span><strong>Good morning, {user.name.split(' ')[0]}</strong></div></div>
          <div className="dashboard-actions">
            <div className="dash-coins"><Coins size={17} /><strong>{user.coins}</strong><span>coins</span></div>
            <div className="notification-wrap"><button type="button" className="notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={20} /><span /></button>{notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><div><span className="notification-dot" /><p>Your submission was approved. <small>12 minutes ago</small></p></div><div><span className="notification-dot" /><p>A buyer left a task for review. <small>1 hour ago</small></p></div></div>}</div>
            <img className="dashboard-avatar" src={user.photo} alt={user.name} />
          </div>
        </header>
        <div className="dashboard-content" onClick={() => { if (notificationsOpen) setNotificationsOpen(false) }}>
          <Routes>
            <Route path="worker-home" element={<WorkerHome />} />
            <Route path="task-list" element={<WorkerTaskList />} />
            <Route path="task/:taskId" element={<TaskDetails />} />
            <Route path="submissions" element={<MySubmissions />} />
            <Route path="withdrawals" element={<Withdrawals user={user} />} />
            <Route path="buyer-home" element={<BuyerHome />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="my-tasks" element={<BuyerTasks />} />
            <Route path="purchase" element={<PurchaseCoins user={user} setUser={setUser} />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="admin-home" element={<AdminHome />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="tasks" element={<ManageTasks />} />
            <Route path="*" element={<Navigate to={`${base}/${user.role}-home`} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function PageHeading({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{text}</p></div>{action}</div>
}

function StatCards({ stats }: { stats: { label: string; value: string; icon: React.ReactNode; tone: string }[] }) {
  return <div className="stat-grid">{stats.map(stat => <article className="stat-card" key={stat.label}><div className={`stat-icon ${stat.tone}`}>{stat.icon}</div><div><span>{stat.label}</span><strong>{stat.value}</strong></div></article>)}</div>
}

function WorkerHome() {
  return <><PageHeading title="Overview" text="Track your submissions and earnings." /><StatCards stats={[
    { label: 'Total submissions', value: '24', icon: <ClipboardCheck />, tone: 'purple' },
    { label: 'Pending submissions', value: '5', icon: <Clock3 />, tone: 'amber' },
    { label: 'Total earnings', value: '340 coins', icon: <CircleDollarSign />, tone: 'green' },
  ]} /><section className="content-card"><div className="card-heading"><h2>Approved submissions</h2><button type="button">View all</button></div><div className="table-wrap"><table><thead><tr><th>Task</th><th>Buyer</th><th>Reward</th><th>Status</th></tr></thead><tbody>{seedSubmissions.filter(s => s.status === 'approved').map(s => <tr key={s.id}><td>{s.taskTitle}</td><td>{s.buyerName}</td><td>{s.payable} coins</td><td><span className="status approved">Approved</span></td></tr>)}</tbody></table></div></section></>
}

function WorkerTaskList() {
  return <><PageHeading title="Task list" text="Choose an opportunity and submit your work." /><div className="dashboard-task-grid">{tasks.map(task => <article className="dashboard-task" key={task.id}><img src={task.image} alt="" /><div><span className="buyer-name">{task.buyer}</span><h3>{task.title}</h3><div className="mini-meta"><span><Clock3 size={14} /> {new Date(task.completionDate).toLocaleDateString()}</span><span><Coins size={14} /> {task.payable} coins</span><span>{task.workers} spots</span></div><Link className="outline-button" to={`/dashboard/worker/task/${task.id}`}>View details</Link></div></article>)}</div></>
}

function TaskDetails() {
  const { taskId } = useParams()
  const task = tasks.find(item => item.id === Number(taskId)) || tasks[0]
  const submit = (event: FormEvent) => { event.preventDefault(); toast.success('Submission sent for review') }
  return <><Link className="back-link" to="/dashboard/worker/task-list">← Back to task list</Link><div className="detail-layout"><section className="detail-card"><img src={task.image} alt="" /><div><span className="buyer-name">Posted by {task.buyer}</span><h1>{task.title}</h1><p>{task.detail}</p><div className="detail-facts"><div><span>Reward</span><strong>{task.payable} coins</strong></div><div><span>Deadline</span><strong>{new Date(task.completionDate).toLocaleDateString()}</strong></div><div><span>Workers needed</span><strong>{task.workers}</strong></div></div><h3>What to submit</h3><p>{task.submissionInfo}</p></div></section><section className="submission-card"><h2>Submit your work</h2><form onSubmit={submit}><label>Submission details<textarea placeholder="Paste your proof, links, or a short description..." required /></label><button className="auth-submit" type="submit">Submit for review <Send size={17} /></button></form></section></div></>
}

function MySubmissions() {
  const [page, setPage] = useState(1)
  return <><PageHeading title="My submissions" text="Review the status of your submitted work." /><section className="content-card"><div className="table-wrap"><table><thead><tr><th>Task</th><th>Buyer</th><th>Reward</th><th>Status</th></tr></thead><tbody>{seedSubmissions.slice((page - 1) * 5, page * 5).map(s => <tr key={s.id}><td>{s.taskTitle}</td><td>{s.buyerName}</td><td>{s.payable} coins</td><td><span className={`status ${s.status}`}>{s.status}</span></td></tr>)}</tbody></table></div><div className="pagination"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><button className="active" type="button">1</button><button type="button" disabled>Next</button></div></section></>
}

function Withdrawals({ user }: { user: User }) {
  const [coins, setCoins] = useState(200)
  const submit = (event: FormEvent) => { event.preventDefault(); toast.success('Withdrawal request submitted') }
  return <><PageHeading title="Withdraw earnings" text="Convert your coin balance into real money." /><div className="withdraw-layout"><section className="withdraw-summary"><div className="balance-ring"><span>Available balance</span><strong>{user.coins}</strong><small>coins</small></div><div className="dollar-amount"><span>Withdrawal value</span><strong>${(coins / 20).toFixed(2)}</strong></div></section><section className="content-card form-card"><h2>Withdrawal request</h2>{user.coins < 200 ? <div className="insufficient">Insufficient coin</div> : <form onSubmit={submit}><label>Coins to withdraw<input type="number" min={200} max={user.coins} value={coins} onChange={e => setCoins(Number(e.target.value))} /></label><label>Withdrawal amount ($)<input value={`$${(coins / 20).toFixed(2)}`} disabled /></label><label>Payment system<select><option>Stripe</option><option>Bkash</option><option>Rocket</option><option>Nagad</option></select></label><label>Account number<input placeholder="Enter account number" required /></label><button className="auth-submit" type="submit">Request withdrawal <ChevronRight size={17} /></button></form>}</section></div></>
}

function BuyerHome() {
  const [selected, setSelected] = useState<Submission | null>(null)
  return <><PageHeading title="Buyer overview" text="Review submissions and monitor your campaigns." /><StatCards stats={[
    { label: 'Total tasks', value: '18', icon: <BriefcaseBusiness />, tone: 'purple' },
    { label: 'Pending workers', value: '46', icon: <Users />, tone: 'amber' },
    { label: 'Total paid', value: '1,240 coins', icon: <CircleDollarSign />, tone: 'green' },
  ]} /><section className="content-card"><div className="card-heading"><h2>Submissions to review</h2></div><div className="table-wrap"><table><thead><tr><th>Worker</th><th>Task</th><th>Reward</th><th>Action</th></tr></thead><tbody>{seedSubmissions.filter(s => s.status === 'pending').map(s => <tr key={s.id}><td>{s.workerName}</td><td>{s.taskTitle}</td><td>{s.payable} coins</td><td><div className="row-actions"><button className="outline-button compact" onClick={() => setSelected(s)}>View</button><button className="approve" onClick={() => toast.success('Submission approved')}>Approve</button><button className="reject" onClick={() => toast.error('Submission rejected')}>Reject</button></div></td></tr>)}</tbody></table></div></section>{selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><section className="modal-card" onMouseDown={e => e.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close">×</button><span className="kicker">Submission details</span><h2>{selected.taskTitle}</h2><p>{selected.details}</p><div className="modal-meta"><span>Worker: <strong>{selected.workerName}</strong></span><span>Reward: <strong>{selected.payable} coins</strong></span></div></section></div>}</>
}

function AddTask() {
  const submit = (event: FormEvent) => { event.preventDefault(); toast.success('Task published successfully') }
  return <><PageHeading title="Add new task" text="Create a clear task and reach available workers." /><section className="content-card form-card wide-form"><form onSubmit={submit}><div className="form-grid"><label>Task title<input placeholder="e.g. Watch my video and leave a comment" required /></label><label>Completion date<input type="date" required /></label><label className="full">Task details<textarea placeholder="Describe exactly what workers need to do" required /></label><label>Required workers<input type="number" min={1} defaultValue={10} required /></label><label>Payable amount (coins)<input type="number" min={1} defaultValue={10} required /></label><label className="full">Submission information<textarea placeholder="Tell workers what proof to provide" required /></label><label className="full">Task image URL<input type="url" placeholder="https://..." /></label></div><button className="auth-submit" type="submit">Publish task <ChevronRight size={17} /></button></form></section></>
}

function BuyerTasks() {
  const [editing, setEditing] = useState<Task | null>(null)
  return <><PageHeading title="My tasks" text="Manage your active campaigns." /><section className="content-card"><div className="table-wrap"><table><thead><tr><th>Task</th><th>Deadline</th><th>Workers</th><th>Reward</th><th>Actions</th></tr></thead><tbody>{tasks.slice(0, 3).map(t => <tr key={t.id}><td>{t.title}</td><td>{new Date(t.completionDate).toLocaleDateString()}</td><td>{t.workers}</td><td>{t.payable} coins</td><td><div className="row-actions"><button className="approve" onClick={() => setEditing(t)}>Update</button><button className="reject" onClick={() => toast.success('Task deleted')}>Delete</button></div></td></tr>)}</tbody></table></div></section>{editing && <div className="modal-backdrop" onMouseDown={() => setEditing(null)}><form className="modal-card edit-modal" onMouseDown={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); toast.success('Task updated'); setEditing(null) }}><button className="modal-close" type="button" onClick={() => setEditing(null)} aria-label="Close">×</button><span className="kicker">Update task</span><label>Task title<input defaultValue={editing.title} required /></label><label>Task details<textarea defaultValue={editing.detail} required /></label><label>Submission details<textarea defaultValue={editing.submissionInfo} required /></label><button className="auth-submit" type="submit">Save changes</button></form></div>}</>
}

function PurchaseCoins({ user, setUser }: { user: User; setUser: (user: User) => void }) {
  const packs = [{ coins: 10, price: 1 }, { coins: 150, price: 10 }, { coins: 500, price: 20 }, { coins: 1000, price: 35 }]
  const buy = (coins: number) => { setUser({ ...user, coins: user.coins + coins }); toast.success(`${coins} coins added`) }
  return <><PageHeading title="Purchase coins" text="Choose a coin pack for your next campaign." /><div className="coin-pack-grid">{packs.map(pack => <article className="coin-pack" key={pack.coins}><div className="coin-pack-icon"><Coins /></div><strong>{pack.coins}</strong><span>coins</span><h3>${pack.price}</h3><button type="button" onClick={() => buy(pack.coins)}>Purchase</button></article>)}</div></>
}

function PaymentHistory() {
  return <><PageHeading title="Payment history" text="All purchases made for your campaigns." /><section className="content-card"><div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Date</th><th>Coins</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr><td>#TXN-1048</td><td>Nov 24, 2026</td><td>500</td><td>$20.00</td><td><span className="status approved">Paid</span></td></tr><tr><td>#TXN-0921</td><td>Nov 11, 2026</td><td>150</td><td>$10.00</td><td><span className="status approved">Paid</span></td></tr></tbody></table></div></section></>
}

function AdminHome() {
  return <><PageHeading title="Admin overview" text="Monitor platform activity and pending requests." /><StatCards stats={[
    { label: 'Total workers', value: '1,842', icon: <Users />, tone: 'purple' },
    { label: 'Total buyers', value: '316', icon: <BriefcaseBusiness />, tone: 'blue' },
    { label: 'Available coins', value: '48,620', icon: <Coins />, tone: 'green' },
    { label: 'Total payments', value: '$12,480', icon: <CircleDollarSign />, tone: 'amber' },
  ]} /><section className="content-card"><div className="card-heading"><h2>Pending withdrawals</h2></div><div className="table-wrap"><table><thead><tr><th>Worker</th><th>Coins</th><th>Amount</th><th>Method</th><th>Action</th></tr></thead><tbody><tr><td>Jane Cooper</td><td>240</td><td>$12.00</td><td>Nagad</td><td><button className="approve" onClick={() => toast.success('Payment approved')}>Approve payment</button></td></tr><tr><td>Dianne Russell</td><td>300</td><td>$15.00</td><td>Stripe</td><td><button className="approve" onClick={() => toast.success('Payment approved')}>Approve payment</button></td></tr></tbody></table></div></section></>
}

function ManageUsers() {
  const users = [
    { name: 'Alex Morgan', email: 'alex@taskly.com', role: 'Worker', coins: 340, photo: 'https://i.pravatar.cc/80?img=12' },
    { name: 'Sarah Miller', email: 'sarah@taskly.com', role: 'Buyer', coins: 920, photo: 'https://i.pravatar.cc/80?img=32' },
    { name: 'Devon Lane', email: 'devon@taskly.com', role: 'Worker', coins: 510, photo: 'https://i.pravatar.cc/80?img=11' },
  ]
  return <><PageHeading title="Manage users" text="Update roles and maintain platform accounts." /><section className="content-card"><div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Coins</th><th>Action</th></tr></thead><tbody>{users.map(u => <tr key={u.email}><td><div className="table-user"><img src={u.photo} alt="" /><div><strong>{u.name}</strong><span>{u.email}</span></div></div></td><td><select className="role-select" defaultValue={u.role.toLowerCase()}><option value="worker">Worker</option><option value="buyer">Buyer</option><option value="admin">Admin</option></select></td><td>{u.coins}</td><td><button className="reject" onClick={() => toast.success('User removed')}>Remove</button></td></tr>)}</tbody></table></div></section></>
}

function ManageTasks() {
  return <><PageHeading title="Manage tasks" text="Review and remove tasks across the platform." /><section className="content-card"><div className="table-wrap"><table><thead><tr><th>Task</th><th>Buyer</th><th>Deadline</th><th>Workers</th><th>Action</th></tr></thead><tbody>{tasks.map(t => <tr key={t.id}><td>{t.title}</td><td>{t.buyer}</td><td>{new Date(t.completionDate).toLocaleDateString()}</td><td>{t.workers}</td><td><button className="reject" onClick={() => toast.success('Task deleted')}>Delete</button></td></tr>)}</tbody></table></div></section></>
}

function RoleRoute({ user, setUser }: { user: User | null; setUser: (user: User) => void }) {
  const { role } = useParams()
  if (!user) return <Navigate to="/login" replace />
  if (role !== user.role) return <Navigate to={`/dashboard/${user.role}`} replace />
  return <Dashboard user={user} setUser={setUser} />
}

function App() {
  const { user, setUser } = useSession()
  const logout = () => { setUser(null); localStorage.removeItem('access-token'); toast.success('Logged out') }
  const publicLayout = (page: React.ReactNode) => <><PublicNavbar user={user} logout={logout} />{page}<Footer /></>
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={publicLayout(<HomePage />)} />
        <Route path="/tasks" element={publicLayout(<TaskList user={user} />)} />
        <Route path="/login" element={<AuthPage mode="login" setUser={setUser} />} />
        <Route path="/register" element={<AuthPage mode="register" setUser={setUser} />} />
        <Route path="/dashboard/:role/*" element={<RoleRoute user={user} setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
