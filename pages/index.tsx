import Head from 'next/head'
import { InferGetStaticPropsType } from 'next/types'
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory'
import { colors } from '@atlaskit/theme'
import { Date as DateComponent } from '@atlaskit/date'

import { getRates } from './api/rates'
import { getStock } from './api/stock'
import { simpleDate } from '../utils'
import Card from '../components/Card'

export const getStaticProps = async () => {
  const [rates, stock] = await Promise.all([getRates(), getStock()])

  const data = Object.keys(stock)
    .map((date) => ({
      x: new Date(date).getTime(),
      y: stock[date] * rates[date],
      date,
      price: stock[date],
      rate: rates[date],
    }))
    .filter(({ x, y }) => x && y)

  const relative = data.map(({ x, y, date }) => ({ x, y, date }))
  const absolute = data.map(({ x, price, date }) => ({ x, y: price, date }))

  const maxUSD = absolute.reduce((acc, curr) => ({
    x: acc.y > curr.y ? acc.x : curr.x,
    y: acc.y > curr.y ? acc.y : curr.y,
    date: acc.y > curr.y ? acc.date : curr.date,
  }))

  const maxAUD = relative.reduce((acc, curr) => ({
    x: acc.y > curr.y ? acc.x : curr.x,
    y: acc.y > curr.y ? acc.y : curr.y,
    date: acc.y > curr.y ? acc.date : curr.date,
  }))

  const meta = {
    maxUSDDate: maxUSD.x,
    maxUSDPrice: maxUSD.y.toFixed(2),
    maxUSDPriceInAUD: (rates[maxUSD.date] * maxUSD.y).toFixed(2),
    maxAUDDate: maxAUD.x,
    maxAUDPrice: maxAUD.y.toFixed(2),
    maxAUDPriceInUSD: (maxAUD.y / rates[maxAUD.date]).toFixed(2),
  }

  return {
    props: {
      relative,
      absolute,
      meta,
    },
  }
}
type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ relative, absolute, meta }: Props) {
  return (
    <div>
      <Head>
        <title>TEAM AUD Price</title>
        <link
          rel="icon"
          href="https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png"
        />
      </Head>
      <main>
        <h1>Atlassian Share Price</h1>
        <p>
          The TEAM share price closed at its maximum USD price on{' '}
          <DateComponent value={meta.maxUSDDate} /> at{' '}
          <span className="currency">{meta.maxUSDPrice}</span> (
          <span className="currency aud">{meta.maxUSDPriceInAUD}</span> AUD).
          Atlassian shareholders selling into AUD would've received the highest
          proceeds on <DateComponent value={meta.maxAUDDate} /> when the price
          closed at <span className="currency">{meta.maxAUDPriceInUSD}</span> (
          <span className="currency aud">{meta.maxAUDPrice}</span> AUD).
        </p>
        <div className="grid">
          <Card name="AUD">
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryAxis
                // tickValues specifies both the number of ticks and where
                // they are placed on the axis
                tickCount={3}
                tickFormat={simpleDate}
              />
              <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
              <VictoryLine data={relative} />
            </VictoryChart>
          </Card>
          <Card name="USD">
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryAxis
                // tickValues specifies both the number of ticks and where
                // they are placed on the axis
                tickCount={3}
                tickFormat={simpleDate}
              />
              <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
              <VictoryLine
                style={{ data: { stroke: colors.B100 } }}
                data={absolute}
              />
            </VictoryChart>
          </Card>
        </div>
        <style jsx>{`
          h1 {
            display: inline-block;
            padding-bottom: 0.15em;
            border-bottom: 4px solid ${colors.B100};
          }

          p {
            max-width: 600px;
            font-size: 1.2em;
            line-height: 1.8;
          }

          .currency {
            font-weight: bold;
            color: ${colors.B100};
          }

          .currency:before {
            content: '$';
          }

          .aud {
            color: ${colors.N300};
          }

          .grid {
            display: grid;
            margin: 20px 0;
            gap: 20px;
            grid-template-columns: 1fr 1fr;
          }

          @media screen and (max-width: 768px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </main>
    </div>
  )
}
