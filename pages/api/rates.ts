import { NextApiHandler } from 'next'

const API_URL = 'http://api.exchangeratesapi.io/v1'

// eslint-disable-next-line
type DateFormat = `${number}-${number}-${number}`

interface RatesResponse {
  success: boolean
  historical: boolean
  date: DateFormat
  timestamp: number // eg. 1387929599,
  base: 'USD' | 'GBP' | 'EUR' // eg 'AUD'
  rates: {
    AUD: number // "USD": 1.636492,
    USD: number
  }
}

const range = Array.from({ length: 18 })
const dayRange = Array.from({ length: 31 })

export async function getRates(ratesQuery: string = 'AUD,USD') {
  const results = await Promise.all(
    range.map(async (_, index) => {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - index)
      const dateString = currentDate.toISOString().slice(0, 10)
      const urlToQuery = `${API_URL}/${dateString}?access_key=${process.env.RATES_API_KEY}&symbols=${ratesQuery}`

      const response: RatesResponse = await fetch(urlToQuery).then((res) =>
        res.json()
      )

      const { rates } = response

      const shortenedDate = dateString.slice(0, 7)
      const rate = rates.AUD / rates.USD

      // this is reduce overfetching from the API and not be rate-limited
      return Object.fromEntries(
        dayRange.map((__, dayIndex) => {
          return [
            `${shortenedDate}-${
              dayIndex + 1 < 10 ? `0${dayIndex + 1}` : dayIndex + 1
            }`,
            rate,
          ]
        })
      )
    })
  )

  return results.reduce((allRates, rate) => {
    return {
      ...allRates,
      ...rate,
    }
  }, {})
}

const handler: NextApiHandler = async (req, res) => {
  const data = await getRates(req.query.rates as any)
  res.statusCode = 200
  res.json(data)
}

export default handler
