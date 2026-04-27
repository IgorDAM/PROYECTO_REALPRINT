/**
 * Sistema centralizado de logging.
 *
 * Características:
 * - 5 niveles: debug, info, warn, error, fatal
 * - Persistencia en localStorage (últimas 100 entradas)
 * - Context automático: usuario, timestamp, ubicación
 * - Soporte para envío a servidor (cuando backend listo)
 */

const LOG_STORAGE_KEY = 'realprint_logs';
const MAX_LOGS = 100;
const IS_DEV = import.meta.env.DEV;
const PERSIST_LOGS = IS_DEV;

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
} as const;

const LogLevelPriority: Record<string, number> = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
};

interface LogEntry {
  level: string;
  message: string;
  data: Record<string, any>;
  timestamp: string;
  user: string;
  url: string;
  userAgent: string;
}

function sanitizeLogData(value: any, depth = 0): any {
  if (value == null || depth > 3) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitizeLogData(item, depth + 1));
  if (typeof value !== 'object') {
    if (typeof value === 'string' && value.length > 500) return `${value.slice(0, 500)}…`;
    return value;
  }

  const redactedKeys = new Set(['password', 'token', 'accessToken', 'refreshToken', 'authorization', 'secret']);
  const output: Record<string, any> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (redactedKeys.has(key.toLowerCase())) {
      output[key] = '[redacted]';
      continue;
    }
    output[key] = sanitizeLogData(entry, depth + 1);
  }

  return output;
}

class Logger {
  private minLevel: string;
  private logs: LogEntry[];

  constructor(minLevel: string = LogLevel.DEBUG) {
    this.minLevel = minLevel;
    this.logs = this._loadLogs();
  }

  private _loadLogs(): LogEntry[] {
    if (!PERSIST_LOGS) return [];
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private _saveLogs(): void {
    if (!PERSIST_LOGS) return;
    try {
      const recent = this.logs.slice(-MAX_LOGS);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
      console.warn('Failed to save logs to localStorage', e);
    }
  }

  private _shouldLog(level: string): boolean {
    return LogLevelPriority[level] >= LogLevelPriority[this.minLevel];
  }

  private _createLogEntry(level: string, message: string, data: Record<string, any> = {}): LogEntry {
    return {
      level,
      message,
      data: sanitizeLogData(data),
      timestamp: new Date().toISOString(),
      user: IS_DEV ? this._getCurrentUser() : 'redacted',
      url: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: IS_DEV && typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'redacted',
    };
  }

  private _getCurrentUser(): string {
    try {
      const userStr = localStorage.getItem('realprint_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || 'unknown';
      }
    } catch {
      // ignored
    }
    return 'anonymous';
  }

  private _logToConsole(level: string, message: string, data: Record<string, any>): void {
    if (!IS_DEV) return;

    const styles: Record<string, string> = {
      DEBUG: 'color: #888; font-size: 12px;',
      INFO: 'color: #0066cc; font-weight: bold;',
      WARN: 'color: #ff9900; font-weight: bold;',
      ERROR: 'color: #cc0000; font-weight: bold;',
      FATAL: 'color: #990000; font-weight: bold; background: #ffcccc;',
    };

    if (Object.keys(data).length > 0) {
      console.log(`%c[${level}] ${message}`, styles[level], data);
    } else {
      console.log(`%c[${level}] ${message}`, styles[level]);
    }
  }

  private log(level: string, message: string, data: Record<string, any> = {}): void {
    if (!this._shouldLog(level)) return;

    const entry = this._createLogEntry(level, message, data);
    this.logs.push(entry);
    this._saveLogs();
    this._logToConsole(level, message, data);

    // Enviar a servidor si está disponible (implementar cuando backend listo)
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      // TODO: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    }
  }

  debug(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, data);
  }

  fatal(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, data);
  }

  getLogs(level: string | null = null): LogEntry[] {
    if (!IS_DEV) return [];
    if (!level) return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
    if (PERSIST_LOGS) {
      localStorage.removeItem(LOG_STORAGE_KEY);
    }
  }

  exportLogs(): string {
    return IS_DEV ? JSON.stringify(this.logs, null, 2) : '[]';
  }
}

// Singleton global
export const logger = new Logger(LogLevel.DEBUG);

// Para testing
export { LogLevel, Logger };
