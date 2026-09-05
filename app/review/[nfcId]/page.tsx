'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, LoaderCircle, Mic, Send, Sparkles, Volume2, WifiOff } from 'lucide-react'
import { AICharacter, Waveform, type AICharacterState } from '@/components/ai-character'
import { analyzeFeedback, conversationStates, createGreeting, generateFollowUpQuestion, generateResponse, nextConversationState, sleep, voice, type ConversationMessage, type ConversationState } from '@/lib/conversation'

type ReviewPageProps = { params: Promise<{ nfcId: string }> }
type MicState = 'idle' | 'recording' | 'processing'
type Business = { name: string; location: string; logo: string; accent: string }
const businesses: Record<string, Business> = { 'urban-brew-main': { name: 'Urban Brew Coffee', location: 'Downtown · Portland, OR', logo: 'UB', accent: '#dc7251' } }
const ratings = [{ emoji: '😊', label: 'Excellent', value: 5 }, { emoji: '🙂', label: 'Good', value: 4 }, { emoji: '😐', label: 'Okay', value: 3 }, { emoji: '🙁', label: 'Poor', value: 2 }, { emoji: '😡', label: 'Very Poor', value: 1 }]

export default function ReviewPage({ params }: ReviewPageProps) {
  const { nfcId } = use(params)
  const business = businesses[nfcId]
  const [intro, setIntro] = useState(true)
  const [rating, setRating] = useState(0)
  const [mode, setMode] = useState<'speak' | 'type'>('speak')
  const [micState, setMicState] = useState<MicState>('idle')
  const [conversationState, setConversationState] = useState<ConversationState>(conversationStates.INITIAL)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [heard, setHeard] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => { setIntro(false); setConversationState(conversationStates.GREETING); setMessages([createGreeting()]) }, 1800)
    return () => window.clearTimeout(timer)
  }, [])

  const latestAssistantText = messages.at(-1)?.role === 'assistant' ? messages.at(-1)?.text : undefined
  const prompt = latestAssistantText ?? (!rating ? 'How was your visit today?' : rating >= 4 ? 'That is lovely to hear. What made your visit special?' : 'Thank you for telling me. What could we make better next time?')
  const state: AICharacterState = speaking ? 'speaking' : micState === 'recording' ? 'listening' : micState === 'processing' ? 'processing' : sent ? 'success' : intro ? 'greeting' : conversationState === conversationStates.THINKING ? 'thinking' : rating >= 4 ? 'happy' : rating ? 'concerned' : 'idle'

  if (!business) return <InvalidNfc />
  if (sent) return <SuccessState business={business} />

  const processFeedback = async (input: string) => {
    if (!input.trim()) return
    setConversationState(conversationStates.PROCESSING)
    setMessages((current) => [...current, { role: 'customer', text: input, state: conversationStates.PROCESSING }])
    await sleep(450)
    setConversationState(conversationStates.THINKING)
    const analysis = analyzeFeedback(input)
    await sleep(650)
    const response = analysis.requiresAttention ? generateResponse(analysis) : generateFollowUpQuestion(analysis)
    setConversationState(nextConversationState(analysis))
    setMessages((current) => [...current, { role: 'assistant', text: response, state: nextConversationState(analysis) }])
    setHeard(input)
    setText('')
    setSpeaking(true)
    await voice.speakText(response)
    await sleep(900)
    setSpeaking(false)
    if (analysis.requiresAttention) setConversationState(conversationStates.ESCALATED)
  }

  const toggleMic = async () => {
    if (micState === 'processing') return
    if (micState === 'recording') {
      await voice.stopRecording()
      setMicState('processing')
      setConversationState(conversationStates.PROCESSING)
      await sleep(850)
      const transcript = await voice.transcribeAudio()
      setMicState('idle')
      await processFeedback(transcript)
      return
    }
    await voice.startRecording()
    setMicState('recording')
    setConversationState(conversationStates.LISTENING)
  }

  const submit = () => { if (text.trim()) void processFeedback(text) }

  return <main className="min-h-screen overflow-hidden bg-[#fff8ed] text-[#183b34] selection:bg-[#f3c5a0]">
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-5 sm:px-7">
      <header className="flex items-center justify-between"><Link href="/" aria-label="Back to TapReview" className="grid size-10 place-items-center rounded-full border border-[#eadfd2] bg-white/70 transition hover:bg-white"><ArrowLeft size={17} /></Link><div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-[#183b34] text-xs font-bold text-[#fff8ed]">{business.logo}</span><div><p className="text-sm font-semibold">{business.name}</p><p className="text-[11px] text-[#71827b]">{business.location}</p></div></div><button onClick={() => { if (latestAssistantText) { setSpeaking(true); void voice.speakText(latestAssistantText).then(() => sleep(700)).finally(() => setSpeaking(false)) } }} aria-label="Play Milo voice" className="grid size-10 place-items-center rounded-full border border-[#eadfd2] bg-white/70 transition hover:bg-white"><Volume2 size={17} /></button></header>
      <section className="flex flex-1 flex-col items-center justify-center py-8"><AnimatePresence mode="wait"><motion.div key={prompt} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="order-2 mt-8 w-full rounded-[1.75rem] border border-[#ecd9c9] bg-white/85 px-5 py-4 text-center shadow-[0_15px_45px_rgba(24,59,52,0.07)]"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc7251]">Milo says</p><p className="mt-2 text-lg font-medium leading-7">{intro ? 'Hi, I’m Milo. I’d love to hear about your visit.' : prompt}</p>{conversationState === conversationStates.ESCALATED && <p className="mt-2 text-xs font-medium text-[#dc7251]">I’ve flagged this for the team.</p>}</motion.div></AnimatePresence><div className="order-1 mt-8"><AICharacter state={state} /></div>
        <div className="order-3 mt-7 flex w-full flex-col items-center gap-4"><div className="flex flex-wrap justify-center gap-2">{ratings.map((item) => <button key={item.value} onClick={() => { setRating(item.value); setConversationState(conversationStates.RATING) }} aria-pressed={rating === item.value} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${rating === item.value ? 'border-[#183b34] bg-[#183b34] text-[#fff8ed] shadow-sm' : 'border-[#eadfd2] bg-white/75 hover:border-[#7ca78f]'}`}><span className="mr-1">{item.emoji}</span>{item.label}</button>)}</div>
          <div className="mt-3 flex items-center gap-1 rounded-full border border-[#eadfd2] bg-white/75 p-1 text-xs font-semibold"><button onClick={() => setMode('speak')} className={`rounded-full px-4 py-2 transition ${mode === 'speak' ? 'bg-[#183b34] text-[#fff8ed]' : 'text-[#71827b]'}`}>Speak</button><button onClick={() => setMode('type')} className={`rounded-full px-4 py-2 transition ${mode === 'type' ? 'bg-[#183b34] text-[#fff8ed]' : 'text-[#71827b]'}`}>Type</button></div>
          {mode === 'speak' ? <><button onClick={() => void toggleMic()} disabled={micState === 'processing'} className={`grid size-24 place-items-center rounded-full text-[#fff8ed] shadow-[0_18px_38px_rgba(24,59,52,0.2)] transition active:scale-95 disabled:cursor-wait ${micState === 'recording' ? 'bg-[#dc7251]' : 'bg-[#183b34]'}`} aria-label={micState === 'recording' ? 'Stop recording' : micState === 'processing' ? 'Processing recording' : 'Start recording'}>{micState === 'recording' ? <Waveform /> : micState === 'processing' ? <LoaderCircle className="animate-spin" size={28} /> : <Mic size={28} />}</button><p className="min-h-5 text-xs text-[#71827b]">{micState === 'recording' ? 'Listening… tap again when you’re finished.' : micState === 'processing' ? 'Milo is thinking…' : speaking ? 'Milo is speaking…' : heard || 'Tap to talk to Milo'}</p></> : <div className="flex w-full gap-2 rounded-2xl border border-[#eadfd2] bg-white p-2 shadow-sm"><input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.nativeEvent.isComposing || event.keyCode === 229) return; if (event.key === 'Enter') submit() }} placeholder="Tell Milo what stood out…" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" aria-label="Your feedback" /><button onClick={submit} disabled={!text.trim() || conversationState === conversationStates.THINKING} className="grid size-10 place-items-center rounded-xl bg-[#183b34] text-[#fff8ed] disabled:opacity-40" aria-label="Send feedback"><Send size={16} /></button></div>}
        </div>
      </section><footer className="flex items-center justify-center gap-2 pb-2 text-xs text-[#8a9a94]"><Sparkles size={13} /> Powered by TapReview AI</footer>
    </div></main>
}

function InvalidNfc() { return <main className="grid min-h-screen place-items-center bg-[#fff8ed] px-5 text-center text-[#183b34]"><div className="max-w-sm"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f3c5a0] text-2xl font-bold"><WifiOff size={25} /></div><h1 className="mt-6 text-2xl font-semibold">This tap needs a little help.</h1><p className="mt-3 text-sm leading-6 text-[#71827b]">We could not find a business connected to this NFC card. Please try tapping again or ask a team member for help.</p><Link href="/" className="mt-7 inline-flex rounded-full bg-[#183b34] px-5 py-3 text-sm font-semibold text-[#fff8ed]">Visit TapReview</Link></div></main> }
function SuccessState({ business }: { business: Business }) { return <main className="grid min-h-screen place-items-center bg-[#fff8ed] px-5 text-center text-[#183b34]"><motion.div initial={{ opacity: 0, scale: .9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-w-sm"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#dcefe3] text-[#2e7654]"><Check size={36} /></div><h1 className="mt-6 text-3xl font-semibold tracking-tight">Thank you for sharing.</h1><p className="mt-3 text-sm leading-6 text-[#71827b]">Your words help {business.name} make every visit a little better.</p><Link href="/" className="mt-7 inline-flex rounded-full border border-[#eadfd2] bg-white px-5 py-3 text-sm font-semibold">Done</Link></motion.div></main> }
