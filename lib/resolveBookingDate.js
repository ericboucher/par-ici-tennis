import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const PARIS_TZ = 'Europe/Paris'

const WEEKDAYS = {
  sunday: 0,
  sun: 0,
  dimanche: 0,
  dim: 0,
  monday: 1,
  mon: 1,
  lundi: 1,
  lun: 1,
  tuesday: 2,
  tue: 2,
  mardi: 2,
  mar: 2,
  wednesday: 3,
  wed: 3,
  mercredi: 3,
  mer: 3,
  thursday: 4,
  thu: 4,
  jeudi: 4,
  jeu: 4,
  friday: 5,
  fri: 5,
  vendredi: 5,
  ven: 5,
  saturday: 6,
  sat: 6,
  samedi: 6,
  sam: 6,
}

/**
 * Resolve booking target date from config.
 * - `date`: explicit D/M/YYYY (wins over `day`)
 * - else Paris today + 6 days
 * - if `day` set (and no `date`): return that D+6 only when weekday matches, else null
 */
export function resolveBookingDate (config) {
  if (config.date) {
    const date = dayjs(config.date, ['D/M/YYYY', 'D/MM/YYYY'], true)
    if (!date.isValid()) {
      throw new Error(`Invalid date "${config.date}". Use D/M/YYYY.`)
    }
    return { date, skipped: false }
  }

  const date = dayjs().tz(PARIS_TZ).add(6, 'days')

  if (!config.day) {
    return { date, skipped: false }
  }

  const wanted = WEEKDAYS[String(config.day).trim().toLowerCase()]
  if (wanted === undefined) {
    throw new Error(`Unknown day "${config.day}". Use e.g. friday / vendredi.`)
  }

  if (date.day() !== wanted) {
    return {
      date: null,
      skipped: true,
      reason: `D+6 is ${date.format('dddd DD/MM/YYYY')}, config.day is ${config.day} — skip`,
    }
  }

  return { date, skipped: false }
}
