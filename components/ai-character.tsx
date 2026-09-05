'use client'

import { motion } from 'framer-motion'

export type AICharacterState = 'idle' | 'greeting' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'happy' | 'neutral' | 'concerned' | 'success'

const stateCopy: Record<AICharacterState, string> = {
  idle: 'Ready when you are', greeting: 'Welcome', listening: 'Listening', processing: 'Making sense of that', thinking: 'Thinking', speaking: 'Milo is speaking', happy: 'That made Milo smile', neutral: 'Thank you for sharing', concerned: 'Milo is listening closely', success: 'Feedback received',
}

export function AICharacter({ state = 'idle' }: { state?: AICharacterState }) {
  const happy = ['greeting', 'speaking', 'happy', 'success'].includes(state)
  const concerned = state === 'concerned'
  const thinking = ['thinking', 'processing'].includes(state)
  return (
    <motion.div animate={{ y: [0, -6, 0], rotate: thinking ? [-2, 2, -2] : 0 }} transition={{ duration: thinking ? 1.3 : 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mx-auto flex size-48 items-center justify-center sm:size-56" role="img" aria-label={`Milo: ${stateCopy[state]}`}>
      <motion.div animate={{ scale: [1, 1.025, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-2 rounded-[42%] border-4 border-[#f0b88f] bg-[#f9c9a7] shadow-[0_24px_55px_rgba(220,114,81,0.23)]" />
      <div className="absolute inset-x-0 top-5 flex justify-center gap-2 text-[#183b34]" aria-hidden="true"><span className="size-1.5 rounded-full bg-[#183b34]/35" /><span className="size-1.5 rounded-full bg-[#183b34]/35" /><span className="size-1.5 rounded-full bg-[#183b34]/35" /></div>
      <div className="relative z-10 mt-2 flex flex-col items-center gap-6">
        <div className="flex gap-7">
          {[0, 1].map((eye) => <motion.div key={eye} animate={{ scaleY: [1, 1, .08, 1, 1] }} transition={{ duration: 4.8, repeat: Infinity, delay: eye * .12 }} className="flex size-8 items-center justify-center rounded-full bg-[#183b34]"><motion.span animate={{ x: eye === 0 ? [0, 2, 0] : [0, -2, 0], y: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="size-2 rounded-full bg-[#fff8ed]" /></motion.div>)}
        </div>
        <motion.div animate={{ width: concerned ? 25 : happy ? 38 : 23, height: concerned ? 2 : happy ? 15 : 3 }} transition={{ duration: .25 }} className="rounded-b-full border-b-4 border-[#183b34]" />
      </div>
      <motion.div animate={{ opacity: state === 'listening' ? [0.2, 1, .2] : 0, scale: state === 'listening' ? [1, 1.05, 1] : 1 }} transition={{ duration: 1.2, repeat: Infinity }} className="absolute -inset-4 rounded-[44%] border-2 border-[#7ca78f]" />
      <motion.div animate={{ scale: state === 'success' ? [1, 1.25, 1] : 1, opacity: state === 'success' ? [.45, 0, .45] : 0 }} transition={{ duration: 1.4, repeat: Infinity }} className="absolute -inset-7 rounded-full border border-[#dc7251]" />
      <motion.span animate={{ y: thinking ? [-2, 2, -2] : 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute -bottom-2 rounded-full border border-[#efc3a2] bg-[#fff8ed] px-3 py-1 text-xs font-semibold text-[#183b34] shadow-sm">Milo</motion.span>
    </motion.div>
  )
}

export function Waveform() {
  return <div className="flex h-8 items-center justify-center gap-1" aria-hidden="true">{[3, 8, 14, 21, 11, 6, 16, 9, 4].map((height, index) => <motion.span key={index} animate={{ height: [height, height + 8, height] }} transition={{ duration: .75, repeat: Infinity, delay: index * .08 }} className="w-1 rounded-full bg-[#fff8ed]" style={{ height }} />)}</div>
}
