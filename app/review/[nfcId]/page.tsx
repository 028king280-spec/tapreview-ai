'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Mic, Send, Sparkles, Volume2 } from 'lucide-react'
import { AICharacter, Waveform, type AICharacterState } from '@/components/ai-character'

type ReviewPageProps = { params: Promise<{ nfcId: string }> }
const business = { name: 'Urban Brew Coffee', location: 'Downtown · Portland, OR', accent: '#dc7251', logo: 'UB' }
const ratings = [{ emoji: '😊', label: 'Excellent', value: 5 }, { emoji: '🙂', label: 'Good', value: 4 }, { emoji: '😐', label: 'Okay', value: 3 }, { emoji: '🙁', label: 'Poor', value: 2 }, { emoji: '😡', label: 'Very Poor', value: 1 }]

export default function ReviewPage({ params }: ReviewPageProps) {
  const [nfcId, setNfcId] = useState('')
  const [intro, setIntro] = useState(true)
  const [rating, setRating] = useState(0)
  const [mode, setMode] = useState<'speak' | 'type'>('speak')
  const [recording, setRecording] = useState(false)
  const [sent, setSent] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => { params.then(({ nfcId: id }) => setNfcId(id)) }, [params])
  useEffect(() => { const timer = window.setTimeout(() => setIntro(false), 1750); return () => window.clearTimeout(timer) }, [])
  const characterState: AICharacterState = recording ? 'listening' : sent ? 'success' : intro ? 'greeting' : rating ? 'happy' : 'idle'
  const prompt = useMemo(() => rating ? (rating >= 4 ? 'That is lovely to hear. What made your visit special?' : 'Thank you for telling me. What could we make better next time?') : 'How was your visit today?', [rating])
  if (nfcId && nfcId !== 'urban-brew-main') return <InvalidNfc />
  if (sent) return <SuccessState />
  return <main className="min-h-screen bg-[#f8f5ed] text-[#183b34] selection:bg-[#f3c5a0]">
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-5 sm:px-7">
      <header className="flex items-center justify-between"><Link href="/" aria-label="Back to TapReview" className="grid size-10 place-items-center rounded-full border border-[#dfd9ce] bg-white/70"><ArrowLeft size={17} /></Link><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-[#183b34] text-xs font-bold text-[#f8f5ed]">{business.logo}</span><div><p className="text-sm font-semibold">{business.name}</p><p className="text-[11px] text-[#6f837b]">{business.location}</p></div></div><button aria-label="Play Milo voice" className="grid size-10 place-items-center rounded-full border border-[#dfd9ce] bg-white/70"><Volume2 size={17} /></button></header>
      <section className="flex flex-1 flex-col items-center justify-center py-8"><AnimatePresence mode="wait"><motion.div key={prompt} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="order-2 mt-7 w-full rounded-[1.75rem] border border-[#ecd9c9] bg-white/80 px-5 py-4 text-center shadow-[0_12px_40px_rgba(24,59,52,0.06)]"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc7251]">Milo says</p><p className="mt-2 text-lg font-medium leading-7">{intro ? 'Hi, I am Milo. I would love to hear about your visit.' : prompt}</p></motion.div></AnimatePresence><div className="order-1 mt-8"><AICharacter state={characterState} /></div>
        <div className="order-3 mt-7 flex w-full flex-col items-center gap-4"><div className="flex flex-wrap justify-center gap-2">{ratings.map((item) => <button key={item.value} onClick={() => setRating(item.value)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${rating === item.value ? 'border-[#183b34] bg-[#183b34] text-[#f8f5ed]' : 'border-[#dfd9ce] bg-white/70 hover:border-[#7ca78f]'}`}><span className="mr-1">{item.emoji}</span>{item.label}</button>)}</div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-[#dfd9ce] bg-white/70 p-1 text-xs font-semibold"><button onClick={() => setMode('speak')} className={`rounded-full px-4 py-2 ${mode === 'speak' ? 'bg-[#183b34] text-[#f8f5ed]' : 'text-[#6f837b]'}`}>Speak</button><button onClick={() => setMode('type')} className={`rounded-full px-4 py-2 ${mode === 'type' ? 'bg-[#183b34] text-[#f8f5ed]' : 'text-[#6f837b]'}`}>Type</button></div>
          {mode === 'speak' ? <button onClick={() => setRecording((value) => !value)} className={`grid size-24 place-items-center rounded-full text-[#f8f5ed] shadow-[0_16px_35px_rgba(24,59,52,0.18)] transition ${recording ? 'bg-[#dc7251]' : 'bg-[#183b34]'}`} aria-label={recording ? 'Stop recording' : 'Start recording'}>{recording ? <Waveform /> : <Mic size={28} />}</button> : <div className="flex w-full gap-2 rounded-2xl border border-[#dfd9ce] bg-white p-2"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Tell Milo what stood out…" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /><button onClick={() => text && setSent(true)} className="grid size-10 place-items-center rounded-xl bg-[#183b34] text-[#f8f5ed]" aria-label="Send feedback"><Send size={16} /></button></div>}
          {recording && <p className="text-xs text-[#dc7251]">Listening… tap again when you are finished.</p>}
        </div>
      </section><footer className="flex items-center justify-center gap-2 pb-2 text-xs text-[#8a9a94]"><Sparkles size={13} /> Powered by TapReview AI</footer>
    </div></main>
}
function InvalidNfc() { return <main className="grid min-h-screen place-items-center bg-[#f8f5ed] px-5 text-center text-[#183b34]"><div className="max-w-sm"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f3c5a0] text-2xl font-bold">?</div><h1 className="mt-6 text-2xl font-semibold">This tap needs a little help.</h1><p className="mt-3 text-sm leading-6 text-[#6f837b]">We could not find a business connected to this NFC card. Please try tapping again or ask a team member for help.</p><Link href="/" className="mt-7 inline-flex rounded-full bg-[#183b34] px-5 py-3 text-sm font-semibold text-[#f8f5ed]">Visit TapReview</Link></div></main> }
function SuccessState() { return <main className="grid min-h-screen place-items-center bg-[#f8f5ed] px-5 text-center text-[#183b34]"><motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#dcefe3] text-[#2e7654]"><Check size={36} /></div><h1 className="mt-6 text-3xl font-semibold tracking-tight">Thank you for sharing.</h1><p className="mt-3 text-sm leading-6 text-[#6f837b]">Your words help Urban Brew make every visit a little better.</p><Link href="/" className="mt-7 inline-flex rounded-full border border-[#dfd9ce] bg-white px-5 py-3 text-sm font-semibold">Done</Link></motion.div></main> }
