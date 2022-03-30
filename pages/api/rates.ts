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

const someDate = new Date()

export async function getRates(ratesQuery: string = 'AUD,USD') {
  const dateString = someDate.toISOString().slice(0, 10)
  const urlToQuery = `${API_URL}/${dateString}?access_key=${process.env.RATES_API_KEY}&symbols=${ratesQuery}`
  const response: RatesResponse = await fetch(urlToQuery)
    .then((res) => res.json())
    .catch(console.error)

  const { rates } = response

  return {
    [dateString]: rates.AUD / rates.USD,
  }
}

const handler: NextApiHandler = async (req, res) => {
  const data = await getRates(req.query.rates as any)
  res.statusCode = 200
  res.json(data)
}

export default handler
