import commentsData from '../../data/comments.json'

export const comments = (productId: string): string[] | undefined => (commentsData as Record<string, string[]>)[productId]