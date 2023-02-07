/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from './config';
import { colorize } from '../utils/ansi';

export enum LogLevel {
  All = 0,
  WarnError = 1,
  Error = 2,
  None = 3,
}

type TConsoleMethod = 'info' | 'log' | 'warn' | 'error' | 'debug';
const PREFIX = `[${config.appName}]`;

const _rawLog = (action: TConsoleMethod = 'log', ...args: any[]) => {
  if (action === 'debug') return;
  console[action](colorize.cyan(PREFIX), ...args);
};

const _log = (action: TConsoleMethod = 'log', ...args: any[]) => {
  _rawLog(action, ...args);
};

const { logLevel } = config;
console.info(`${PREFIX} log level is ${logLevel} (${LogLevel[logLevel]})`);

const info = (...args: any[]) => {
  if (logLevel <= 0) _log('info', ...args);
};

const warn = (...args: any[]) => {
  if (logLevel <= 1) _log('warn', ...args);
};

const error = (...args: any[]) => {
  if (logLevel <= 2) _log('error', ...args);
};

export const log = { info, log: info, warn, error };
