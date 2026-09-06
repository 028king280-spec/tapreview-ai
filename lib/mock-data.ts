export type Business = { id: string; name: string; category: string; logo: string }
export type Agent = { id: string; businessId: string; name: string }
export type NfcCard = { id: string; nfcId: string; businessId: string; location: string; active: boolean }
export type Review = { id: string; businessId: string; author: string; rating: number; text: string; sentiment: 'positive' | 'neutral' | 'negative'; createdAt: string }
export const businesses: Business[] = [{ id: 'business-001', name: 'Urban Brew Cafe', category: 'Cafe', logo: 'UB' }]
export const agents: Agent[] = [{ id: 'agent-001', businessId: 'business-001', name: 'Milo' }]
export const nfcCards: NfcCard[] = [{ id: 'nfc-card-001', nfcId: 'NFC-URBAN-001', businessId: 'business-001', location: 'Counter', active: true }]
export const reviews: Review[] = [
 { id: 'review-001', businessId: 'business-001', author: 'Aarav Mehta', rating: 5, text: 'The coffee was excellent and the team was so welcoming.', sentiment: 'positive', createdAt: 'Today, 10:42 AM' },
 { id: 'review-002', businessId: 'business-001', author: 'Mia Chen', rating: 4, text: 'Loved the atmosphere. The wait was a little long.', sentiment: 'neutral', createdAt: 'Yesterday, 4:18 PM' },
 { id: 'review-003', businessId: 'business-001', author: 'Noah Williams', rating: 2, text: 'My order arrived cold after a long wait.', sentiment: 'negative', createdAt: 'Yesterday, 1:05 PM' },
 { id: 'review-004', businessId: 'business-001', author: 'Sara Khan', rating: 5, text: 'Perfect place to work with wonderful service.', sentiment: 'positive', createdAt: 'Mon, 9:14 AM' },
]
export function getBusinessById(id: string) { return businesses.find((item) => item.id === id) }
export function getNfcCardById(nfcId: string) { return nfcCards.find((item) => item.nfcId.toLowerCase() === nfcId.toLowerCase()) }
export function getBusinessByNfcId(nfcId: string) { const card = getNfcCardById(nfcId); return card ? getBusinessById(card.businessId) : undefined }
export function getReviews(businessId = 'business-001') { return reviews.filter((item) => item.businessId === businessId) }
export function getReviewById(id: string) { return reviews.find((item) => item.id === id) }
export function createDemoBusiness(name: string) { return { id: `business-${Date.now()}`, name, category: 'Cafe', logo: name.slice(0, 2).toUpperCase() } }
export function createCustomerSession() { return { id: `session-${Date.now()}`, createdAt: new Date().toISOString() } }
