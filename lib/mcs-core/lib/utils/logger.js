'use strict';

const Winston = require('winston');
const Logger = new Winston.Logger();
const config = require('config');
const path = require('path');
Winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

const LOG_CONFIG = config.get('log') || {};
// 14 files is the default maxFiles value for deleting old logs
const { level, filename, maxFiles = 14 } = LOG_CONFIG;

Logger.configure({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, trace: 5 },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'magenta',
    trace: 'gray'
  },
});

Logger.add(Winston.transports.Console, {
  timestamp:true,
  prettyPrint: false,
  humanReadableUnhandledException: true,
  colorize: true,
  handleExceptions: false,
  silent: false,
  stringify: (obj) => JSON.stringify(obj),
  level,
});


if (filename) {
  Logger.add(Winston.transports.DailyRotateFile, {
    filename,
    prettyPrint: false,
    datePattern: '.yyyy-MM-dd',
    prepend: false,
    stringify: (obj) => JSON.stringify(obj), // single lines
    level,
    maxDays: maxFiles,
  });
}

module.exports = Logger;
