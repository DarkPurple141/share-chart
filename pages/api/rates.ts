// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const API_URL = 'https://api.exchangeratesapi.io/history'

export default async ({ query }, res) => {
  const d = new Date()
  const raw = await fetch(
    `${API_URL}?start_at=2019-01-01&end_at=${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()}&base=USD&symbols=${query.rates}`
  ).then((response) => response.json())
  const { rates } = raw
  const data = Object.entries(rates).reduce(
    (acc, [date, rate]) => ({
      ...acc,
      [date]: (rate as any).AUD,
    }),
    {}
  )
  res.statusCode = 200
  res.json(data)
}

export async function getRates(rates: string = 'AUD') {
  return fetch(`http://localhost:3000/api/rates?rates=${rates}`).then((res) =>
    res.json()
  )
}
