// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const API_URL = 'https://api.exchangeratesapi.io/history'

export async function getRates(ratesQuery: string = 'AUD') {
  const d = new Date()
  const raw = await fetch(
    `${API_URL}?start_at=2020-01-01&end_at=${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()}&base=USD&symbols=${ratesQuery}`
  ).then((response) => response.json())
  const { rates } = raw
  const data = Object.entries(rates).reduce(
    (acc, [date, rate]) => ({
      ...acc,
      [date]: (rate as any).AUD,
    }),
    {}
  )

  return data
}

export default async (req, res) => {
  const data = await getRates(req.query.rates)
  res.statusCode = 200
  res.json(data)
}
