const winston = require('winston')
require('winston-daily-rotate-file')

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'info-file',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      filename: './logs/%DATE%-info.log',
      maxFiles: '7d',
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      name: 'error-file',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      filename: './logs/%DATE%-error.log',
      maxFiles: '7d',
      level: 'error'
    }),
    new winston.transports.Console({
      colorize: true
    })
  ]
})

logger.stream = {
  write: function (message, encoding) {
    console.log({message})
    logger.info(message)
  }
}

module.exports = logger
