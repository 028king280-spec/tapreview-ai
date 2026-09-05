'use client'

import { motion } from 'framer-motion'

type AICharacterState = 'idle' | 'greeting' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'happy' | 'neutral' | 'concerned' | 'success'

export function AICharacter({ state = 'idle' }: { state?: AICharacterState }) {
  const isHappy = ['greeting', 'speaking', 'happy', 'success'].includes(state)
  const isConcerned = state === 'concerned'
  const isThinking = ['thinking', 'processing'].includes(state)
  return (
    <motion.div
      animate={{ y: [0, -5, 0], rotate: isThinking ? [-2, 2, -2] : 0 }}
      transition={{ duration: isThinking ? 1.8 : 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto flex size-44 items-center justify-center sm:size-52"
      aria-label={`Milo is ${state}`}
      role="img"
    >
      <motion.div animate={{ scale: [1, 1.025, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-2 rounded-[42%] border-4 border-[#f3c5a0] bg-[#f8d5b6] shadow-[0_22px_40px_rgba(220,114,81,0.22)]" />
      <div className="relative z-10 mt-1 flex flex-col items-center gap-5">
        <div className="flex gap-7">
          {[0, 1].map((eye) => <motion.div key={eye} animate={{ scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: 4.5, repeat: Infinity, delay: eye * 0.08 }} className="flex size-7 items-center justify-center rounded-full bg-[#183b34]"><motion.span animate={{ x: eye === 0 ? [0, 2, 0] : [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="size-2 rounded-full bg-[#f8f5ed]" /></motion.div>)}
        </div>
        <motion.div animate={{ width: isConcerned ? 26 : isHappy ? 34 : 22, height: isHappy ? 15 : 4, borderRadius: 999 }} className="border-b-4 border-[#183b34]" />
      </div>
      <motion.div animate={{ opacity: state === 'listening' ? [0.3, 1, 0.3] : 0 }} transition={{ duration: 1.2, repeat: Infinity }} className="absolute -inset-3 rounded-[44%] border-2 border-[#7ca78f]" />
      <motion.div animate={{ scale: state === 'success' ? [1, 1.2, 1] : 1, opacity: state === 'success' ? [0.4, 0, 0.4] : 0 }} transition={{ duration: 1.4, repeat: Infinity }} className="absolute -inset-6 rounded-full border border-[#dc7251]" />
      <span className="absolute -bottom-1 rounded-full border border-[#efc3a2] bg-[#f8f5ed] px-3 py-1 text-xs font-semibold text-[#183b34] shadow-sm">Milo</span>
    </motion.div>
  )
}

export type { AICharacterState }

function Waveform() {
  return <div className="flex h-8 items-center justify-center gap-1" aria-hidden="true">{[3, 7, 12, 18, 10, 5, 14, 8, 4].map((height, index) => <motion.span key={index} animate={{ height: [height, height + 8, height] }} transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.08 }} className="w-1 rounded-full bg-[#f8f5ed]" style={{ height }} />)}</div>
}

export { Waveform }
