export const conversationStates = {
  INITIAL: 'INITIAL',
  GREETING: 'GREETING',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  THINKING: 'THINKING',
  FOLLOW_UP: 'FOLLOW_UP',
  FINAL_RESPONSE: 'FINAL_RESPONSE',
  RATING: 'RATING',
  SUBMITTED: 'SUBMITTED',
  ESCALATED: 'ESCALATED',
} as const

export type ConversationState = (typeof conversationStates)[keyof typeof conversationStates]
export type SupportedLanguage = 'en' | 'hi' | 'hinglish'
export type FeedbackKind = 'compliment' | 'complaint' | 'suggestion' | 'mixed' | 'general'

export type FeedbackAnalysis = {
  language: SupportedLanguage
  kind: FeedbackKind
  sentiment: 'positive' | 'neutral' | 'negative'
  satisfaction: number
  topics: string[]
  severity: 'low' | 'medium' | 'high'
  requiresAttention: boolean
  summary: string
}

export type ConversationMessage = {
  role: 'assistant' | 'customer'
  text: string
  state: ConversationState
}

const greetingByLanguage: Record<SupportedLanguage, string> = {
  en: "Hi! I'm here to hear about your experience. How was our service?",
  hi: 'Namaste! Main aapka experience sunne ke liye yahan hoon. Aapko hamari service kaisi lagi?',
  hinglish: 'Hi! Aapka experience kaisa raha? Jo bhi laga honestly bata sakte hain.',
}

const followUps: Record<FeedbackKind, Record<SupportedLanguage, string>> = {
  compliment: {
    en: 'That is lovely to hear. What made that part of your visit stand out?',
    hi: 'Yeh sunkar bahut accha laga. Aapko sabse zyada kya pasand aaya?',
    hinglish: 'Yeh sunkar accha laga. Aapko sabse zyada kya special laga?',
  },
  complaint: {
    en: 'Thank you for telling me. What would have made that moment better?',
    hi: 'Batane ke liye dhanyavaad. Us moment ko behtar banane ke liye kya ho sakta tha?',
    hinglish: 'Thank you batane ke liye. Us moment ko better banane ke liye kya kar sakte hain?',
  },
  suggestion: {
    en: 'That is a helpful suggestion. When would it make the biggest difference for you?',
    hi: 'Yeh ek helpful suggestion hai. Aapke liye iska sabse bada fayda kab hoga?',
    hinglish: 'Helpful suggestion hai. Aapke liye iska biggest impact kab hoga?',
  },
  mixed: {
    en: 'I hear both the good and the frustrating parts. Which one should we focus on first?',
    hi: 'Main aapki achhi aur difficult dono baatein samajh raha hoon. Pehle kis par focus karein?',
    hinglish: 'Good aur frustrating dono parts samajh aa rahe hain. Pehle kis par focus karein?',
  },
  general: {
    en: 'Could you tell me a little more about that?',
    hi: 'Kya aap iske baare mein thoda aur bata sakte hain?',
    hinglish: 'Iske baare mein thoda aur bata sakte hain?',
  },
}

export function detectLanguage(input: string): SupportedLanguage {
  const value = input.toLowerCase()
  const hindiSignals = /[\u0900-\u097f]|\b(namaste|dhanyavaad|accha|acha|bahut|hamari|kaisa|lagi|pasand)\b/i
  const hinglishSignals = /\b(acha|accha|bahut|kaisa|lagi|pasand|service|better|honestly|special|wala|wali)\b/i
  if (hindiSignals.test(input) && /[\u0900-\u097f]/.test(input)) return 'hi'
  if (hinglishSignals.test(value)) return 'hinglish'
  return 'en'
}

export function analyzeFeedback(input: string): FeedbackAnalysis {
  const value = input.toLowerCase()
  const language = detectLanguage(input)
  const positive = /love|great|excellent|amazing|friendly|helpful|fresh|delicious|accha|bahut accha|pasand|अच्छा|बहुत/.test(value)
  const negative = /bad|poor|slow|rude|cold|wrong|late|issue|problem|disappoint|complaint|not happy|bekaar|problem|शिकायत/.test(value)
  const suggestion = /wish|suggest|could|should|improve|add|more|less|kaash|suggestion|चाहिए/.test(value)
  const kind: FeedbackKind = positive && negative ? 'mixed' : negative ? 'complaint' : suggestion ? 'suggestion' : positive ? 'compliment' : 'general'
  const sentiment = negative && !positive ? 'negative' : positive && !negative ? 'positive' : 'neutral'
  const topics = ['coffee', 'service', 'staff', 'wait time', 'atmosphere'].filter((topic) => value.includes(topic.split(' ')[0]))
  const severity = negative && /(rude|unsafe|allergy|wrong charge|harass|शिकायत)/.test(value) ? 'high' : negative ? 'medium' : 'low'
  const satisfaction = sentiment === 'positive' ? 5 : sentiment === 'negative' ? 2 : 4
  return { language, kind, sentiment, satisfaction, topics: topics.length ? topics : ['overall experience'], severity, requiresAttention: severity === 'high', summary: generateSummary(input, { language, kind, sentiment, satisfaction, topics: topics.length ? topics : ['overall experience'], severity, requiresAttention: severity === 'high', summary: '' }) }
}

export function generateResponse(analysis: FeedbackAnalysis): string {
  if (analysis.requiresAttention) return analysis.language === 'en' ? 'I’m really sorry this happened. I’m flagging this for the team so someone can follow up with you personally.' : analysis.language === 'hi' ? 'Mujhe bahut afsos hai. Main isse team ke liye flag kar raha hoon taaki koi aapse personally follow up kar sake.' : 'Mujhe really afsos hai. Main isse team ke liye flag kar raha hoon so someone can follow up personally.'
  return followUps[analysis.kind][analysis.language]
}

export function generateFollowUpQuestion(analysis: FeedbackAnalysis): string {
  return followUps[analysis.kind][analysis.language]
}

export function generateSummary(input: string, analysis: Partial<FeedbackAnalysis>): string {
  const topic = analysis.topics?.[0] ?? 'overall experience'
  if (analysis.language === 'hi') return `Customer ne ${topic} ke baare mein feedback share kiya.`
  if (analysis.language === 'hinglish') return `Customer ne ${topic} ke baare mein feedback share kiya.`
  return `Customer shared feedback about their ${topic}.`
}

export function createGreeting(language: SupportedLanguage = 'en'): ConversationMessage {
  return { role: 'assistant', text: greetingByLanguage[language], state: conversationStates.GREETING }
}

export function nextConversationState(analysis: FeedbackAnalysis): ConversationState {
  return analysis.requiresAttention ? conversationStates.ESCALATED : conversationStates.FOLLOW_UP
}

export const voice = {
  startRecording: () => Promise.resolve(),
  stopRecording: () => Promise.resolve(new Blob()),
  transcribeAudio: () => Promise.resolve('The coffee and friendly service stood out to me.'),
  speakText: (text: string) => Promise.resolve(text),
  stopSpeaking: () => undefined,
}

export const sleep = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration))
