// lib/logging/logger.ts — F16: Comprehensive logging
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LogEntry = { level: LogLevel; message: string; context?: string; data?: any; timestamp: string; requestId?: string }
const isDev = process.env.NODE_ENV === 'development'
export class Logger {
  private context: string
  constructor(context: string) { this.context = context }
  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = { level, message, context: this.context, data, timestamp: new Date().toISOString() }
    if (isDev || level === 'error' || level === 'warn') {
      const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
      fn(`[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, data || '')
    }
  }
  debug(msg: string, data?: any) { this.log('debug', msg, data) }
  info(msg: string, data?: any) { this.log('info', msg, data) }
  warn(msg: string, data?: any) { this.log('warn', msg, data) }
  error(msg: string, data?: any) { this.log('error', msg, data) }
}
export function createLogger(context: string) { return new Logger(context) }