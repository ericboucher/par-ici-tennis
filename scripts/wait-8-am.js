import { config } from '../staticFiles.js'
import { resolveBookingDate } from '../lib/resolveBookingDate.js'
import { waitUntilBookingTime } from '../lib/waitUntilBookingTime.js'

const { date, skipped, reason } = resolveBookingDate(config)
if (skipped) {
  console.log(reason)
  process.exit(0)
}

await waitUntilBookingTime(date)
