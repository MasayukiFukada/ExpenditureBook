import { EventEmitter } from 'events'

// 開発環境のホットリロード等で複数インスタンスが作成されるのを防ぐためグローバルに保持
const globalForEvents = global as unknown as { eventEmitter?: EventEmitter }

export const eventEmitter = globalForEvents.eventEmitter || new EventEmitter()

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.eventEmitter = eventEmitter
}

export const EVENT_EXPENDITURE_UPDATED = 'expenditure_updated'
