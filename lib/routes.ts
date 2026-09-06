export const ROUTES = { home: '/', register: '/register', onboarding: '/onboarding', dashboard: '/dashboard', reviews: '/dashboard/reviews', insights: '/dashboard/insights', nfc: '/dashboard/nfc', aiAgent: '/dashboard/ai-agent', business: '/dashboard/business', settings: '/dashboard/settings' } as const
export const getNfcReviewRoute = (nfcId: string) => `/review/${encodeURIComponent(nfcId)}`
export const getReviewDetailRoute = (reviewId: string) => `/dashboard/reviews/${encodeURIComponent(reviewId)}`
