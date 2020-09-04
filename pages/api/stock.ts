const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TEAM&apikey=${process.env.STOCK_API_KEY}&outputsize=full`

const CLOSE_KEY = '4. close'
const TIME_SERIES_KEY = 'Time Series (Daily)'

export default async (req, res) => {
  const response = await fetch(API_URL)
  const raw = await response.json()
  const data = Object.entries(raw[TIME_SERIES_KEY]).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Number(value[CLOSE_KEY]),
    }),
    {}
  )

  res.statusCode = 200
  res.json(data)
}

export async function getStock(stock: string = 'TEAM') {
  return fetch('http://localhost:3000/api/stock').then((res) => res.json())
}
