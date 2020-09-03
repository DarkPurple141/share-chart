// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch'
const API_URL = 'https://api.exchangeratesapi.io/history'

export default async (req, res) => {
  const d = new Date()
  const data = await fetch(`${API_URL}?start_at=2019-01-01&end_at=${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}&base=USD&symbols=AUD`).then(res => res.json())
  const { rates } = data;
  const sorted = Object.entries(rates).map(([d, rate]) => ({
    d: new Date(d).getTime(),
    rate: (rate as any).AUD,
  })).sort((a, b) => a.d - b.d)
  res.statusCode = 200
  res.json(sorted)
}
