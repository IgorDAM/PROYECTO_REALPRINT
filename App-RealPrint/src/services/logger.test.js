import { describe, it, expect, beforeEach } from 'vitest';
import { logger, LogLevel, Logger } from './logger.js';

describe('logger', () => {
  beforeEach(() => {
    // Limpiar logs antes de cada test
    logger.clearLogs();
  });

  it('debe crear una entrada de log con nivel DEBUG', () => {
    logger.debug('Mensaje de debug', { data: 'test' });

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('DEBUG');
    expect(logs[0].message).toBe('Mensaje de debug');
    expect(logs[0].data).toEqual({ data: 'test' });
  });

  it('debe crear una entrada de log con nivel INFO', () => {
    logger.info('Mensaje de información');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('INFO');
  });

  it('debe crear una entrada de log con nivel WARN', () => {
    logger.warn('Advertencia', { warning: 'test' });

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('WARN');
  });

  it('debe crear una entrada de log con nivel ERROR', () => {
    logger.error('Error crítico', { error: 'test' });

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('ERROR');
  });

  it('debe crear una entrada de log con nivel FATAL', () => {
    logger.fatal('Error fatal', { fatal: 'test' });

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('FATAL');
  });

  it('debe filtrar logs por nivel', () => {
    logger.info('Mensaje 1');
    logger.warn('Mensaje 2');
    logger.error('Mensaje 3');

    const errors = logger.getLogs('ERROR');
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Mensaje 3');
  });

  it('debe agregar timestamp a cada log', () => {
    logger.info('Test con timestamp');

    const logs = logger.getLogs();
    expect(logs[0].timestamp).toBeDefined();
    expect(logs[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('debe limpiar todos los logs', () => {
    logger.info('Mensaje 1');
    logger.info('Mensaje 2');
    logger.info('Mensaje 3');

    expect(logger.getLogs()).toHaveLength(3);

    logger.clearLogs();

    expect(logger.getLogs()).toHaveLength(0);
  });

  it('debe exportar logs como JSON', () => {
    logger.info('Mensaje 1', { id: 1 });
    logger.info('Mensaje 2', { id: 2 });

    const exported = logger.exportLogs();
    const parsed = JSON.parse(exported);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
  });

  it('debe respetar el nivel mínimo de logging', () => {
    const restrictedLogger = new Logger(LogLevel.WARN);

    restrictedLogger.debug('Debug - no debe guardarse');
    restrictedLogger.info('Info - no debe guardarse');
    restrictedLogger.warn('Warn - sí debe guardarse');

    const logs = restrictedLogger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('WARN');
  });
});

