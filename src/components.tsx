import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Compass, ArrowRight, AlertCircle, BadgeCheck } from 'lucide-react'

const nav=[['/','Home'],['/plan','Plan my trip'],['/flights','Compare flights'],['/destinations','Destinations'],['/intelligence','Intelligence'],['/journal','Journal'],['/guide','Booking guide'],['/trips','My trips']]
export function Layout({children}:{children:ReactNode}){
  const [open,setOpen]=useState(false)
  return <div className="min-h-screen bg-ivory text-navy">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
      <div className="shell flex h-18 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={()=>setOpen(false)}><span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60"><Compass size={19} className="text-gold"/></span><span><b className="block font-display text-xl leading-none">RouteWise</b><small className="text-[10px] uppercase tracking-[.26em] text-white/55">Beyond the Ticket</small></span></Link>
        <nav className="hidden items-center gap-5 xl:flex">{nav.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>`text-xs font-semibold ${isActive?'text-gold':'text-white/70 hover:text-white'}`}>{label}</NavLink>)}</nav>
        <button className="xl:hidden" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
      </div>
      {open&&<nav className="shell grid gap-1 border-t border-white/10 py-4 xl:hidden">{nav.map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`rounded-lg px-3 py-2 text-sm ${isActive?'bg-white/10 text-gold':'text-white/75'}`}>{label}</NavLink>)}</nav>}
    </header>
    <main>{children}</main>
    <footer className="mt-20 bg-navy text-white"><div className="shell py-14"><div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,1fr)]"><div><div className="font-display text-3xl">RouteWise</div><p className="mt-1 text-xs uppercase tracking-[.24em] text-gold">Beyond the Ticket</p><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">RouteWise is an independently developed travel intelligence and trip-planning platform.</p></div>{[
      ['Explore',['Destinations','/destinations','Travel Journal','/journal']],
      ['Plan & Compare',['Plan My Trip','/plan','Compare Flights','/flights']],
      ['Intelligence',['Travel Intelligence','/intelligence','Booking Guide','/guide','My Trips','/trips']],
      ['Legal',['About RouteWise','/about','Privacy Notice','/privacy','Terms of Use','/terms','IP Notice','/intellectual-property','Travel Disclaimer','/disclaimer']],
    ].map(([heading,items])=><div key={heading as string}><p className="eyebrow text-gold">{heading}</p><div className="mt-4 grid gap-2">{Array.from({length:(items as string[]).length/2},(_,i)=><Link key={(items as string[])[i*2]} to={(items as string[])[i*2+1]} className="text-sm text-white/55 hover:text-white">{(items as string[])[i*2]}</Link>)}</div></div>)}</div><div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between"><p>© 2026 RouteWise. Created and developed by Aliza Sharif. All rights reserved.</p><p>Independent of airlines and Google Flights · No direct ticket sales</p></div></div></footer>
  </div>
}
export function PageHead({kicker,title,body,action}:{kicker:string,title:string,body:string,action?:ReactNode}){return <section className="bg-navy text-white"><div className="shell grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow text-gold">{kicker}</p><h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-white/60">{body}</p></div>{action}</div></section>}
export function Label({children}:{children:ReactNode}){return <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.15em] text-navy/55">{children}</label>}
export function Empty({title,body}:{title:string,body:string}){return <div className="card grid place-items-center py-16 text-center"><div className="grid h-12 w-12 place-items-center rounded-full bg-mist"><Compass className="text-teal"/></div><h3 className="mt-4 font-display text-2xl">{title}</h3><p className="mt-2 max-w-md text-sm text-navy/55">{body}</p></div>}
export function Notice({children,tone='info'}:{children:ReactNode,tone?:'info'|'warn'|'ok'}){const Icon=tone==='ok'?BadgeCheck:AlertCircle;return <div className={`flex gap-3 rounded-xl border p-4 text-sm ${tone==='warn'?'border-amber-300 bg-amber-50 text-amber-900':tone==='ok'?'border-teal/20 bg-teal/5 text-teal':'border-navy/10 bg-white text-navy/70'}`}><Icon size={19} className="shrink-0"/>{children}</div>}
