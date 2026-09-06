'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, CreditCard, LayoutDashboard, MessageSquare, Settings, Store, Users, WandSparkles } from 'lucide-react'

const nav = [
  ['/dashboard', 'Overview', LayoutDashboard],
  ['/dashboard/reviews', 'Reviews', MessageSquare],
  ['/dashboard/analytics', 'Analytics', BarChart3],
  ['/dashboard/cards', 'NFC cards', CreditCard],
  ['/dashboard/team', 'Team', Users],
  ['/dashboard/ai-agent', 'AI agent', WandSparkles],
] as const

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return <div className="min-h-screen bg-background lg:pl-64">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card px-5 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-xl bg-[#183b34] text-[#f8f5ed]">TR</span><span className="text-lg">tap<span className="text-[#dc7251]">review</span></span></Link>
      <div className="mt-9 rounded-2xl bg-secondary p-3"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#f2c6a0] text-[#183b34]"><Store size={18} /></div><div><p className="text-sm font-semibold">Urban Brew Coffee</p><p className="text-xs text-muted-foreground">Pro plan</p></div></div></div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">{nav.map(([href, label, Icon]) => { const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href)); return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? 'bg-[#e2eee8] text-[#183b34]' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon size={17}/>{label}</Link> })}<div className="my-4 h-px bg-border"/><Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"><Settings size={17}/>Settings</Link></nav>
      <div className="rounded-2xl bg-[#183b34] p-4 text-[#f8f5ed]"><p className="text-sm font-semibold">Need a hand?</p><p className="mt-1 text-xs leading-5 text-[#c7d7c3]">Your AI agent is ready to help turn feedback into action.</p><Link href="/dashboard/ai-agent" className="mt-3 inline-flex rounded-full bg-[#f4c7a1] px-3 py-2 text-xs font-semibold text-[#183b34]">Configure agent</Link></div>
    </aside>
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">{children}</main>
  </div>
}

export function Heading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: string }) { return <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#dc7251]">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1><p className="mt-2 text-muted-foreground">{description}</p></div>{action && <button className="w-fit rounded-full bg-[#183b34] px-4 py-2.5 text-sm font-semibold text-[#f8f5ed]">{action}</button>}</div> }

export function Stat({ label, value, change }: { label: string; value: string; change: string }) { return <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_8px_30px_rgba(24,59,52,0.05)]"><p className="text-sm text-muted-foreground">{label}</p><div className="mt-4 flex items-end justify-between"><strong className="text-3xl tracking-tight">{value}</strong><span className="rounded-full bg-[#dcefe3] px-2 py-1 text-xs font-semibold text-[#2e7654]">↑ {change}</span></div></div> }
