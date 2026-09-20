import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

/** Paris tennis slots for D+6 open at 08:00 Europe/Paris. */
const BOOKING_WINDOW_DAYS = 6
const BOOKING_OPEN_HOUR = 8
const BOOKING_OPEN_MINUTE = 0
const PARIS_TZ = 'Europe/Paris'

/**
 * Waits until the court opens exactly BOOKING_WINDOW_DAYS before the desired date.
 * Call after login so the browser is ready, then book right on time.
 */
export async function waitUntilBookingTime (desiredDate) {
  const now = dayjs().tz(PARIS_TZ)
  const targetDay = dayjs.tz(desiredDate.format('YYYY-MM-DD'), PARIS_TZ).startOf('day')
  const dayDiff = targetDay.diff(now.startOf('day'), 'day')
  const dateLabel = targetDay.format('DD/MM/YYYY')
  const logPrefix = `[${dateLabel}]`

  if (dayDiff < BOOKING_WINDOW_DAYS) {
    console.log(`${logPrefix} Booking date ${dateLabel} is only ${dayDiff} days away - within the ${BOOKING_WINDOW_DAYS}-day window.`)
    console.log(`${logPrefix} We can book immediately without waiting.`)
    return
  }

  if (dayDiff > BOOKING_WINDOW_DAYS) {
    console.log(`${logPrefix} Booking date ${dateLabel} is ${dayDiff} days away - outside the ${BOOKING_WINDOW_DAYS}-day window.`)
    console.log(`${logPrefix} The earliest we can book is in ${dayDiff - BOOKING_WINDOW_DAYS} days. Proceeding anyway...`)
    return
  }

  console.log(`${logPrefix} Booking date ${dateLabel} is exactly ${BOOKING_WINDOW_DAYS} days away - we need precise timing.`)

  const targetTime = now
    .hour(BOOKING_OPEN_HOUR)
    .minute(BOOKING_OPEN_MINUTE)
    .second(0)
    .millisecond(0)

  if (now.isAfter(targetTime) || now.isSame(targetTime)) {
    console.log(`${logPrefix} Current time ${now.format('HH:mm:ss')} is already past booking time ${targetTime.format('HH:mm:ss')}, proceeding immediately`)
    return
  }

  const msToWait = targetTime.diff(now) + 1000

  console.log(`${logPrefix} Waiting for booking time: ${targetTime.format('HH:mm:ss')}`)
  console.log(`${logPrefix} Current time: ${now.format('HH:mm:ss')}`)
  console.log(`${logPrefix} Waiting for ${Math.floor(msToWait / 1000)} seconds...`)

  await new Promise(resolve => setTimeout(resolve, msToWait))

  console.log(`${logPrefix} It's now ${dayjs().tz(PARIS_TZ).format('HH:mm:ss')}, resuming booking process`)
}
