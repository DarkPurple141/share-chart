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
  const absolute = data.map(({ x, price, date }) => ({
    x,
    y: price,
    date,
  }))

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
    maxUSDPriceRaw: maxUSD.y,
    maxUSDPrice: maxUSD.y.toFixed(2),
    maxUSDPriceInAUD: (rates[maxUSD.date] * maxUSD.y).toFixed(2),
    maxAUDDate: maxAUD.x,
    maxAUDPrice: maxAUD.y.toFixed(2),
    maxAUDPriceRaw: maxAUD.y,
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
const GRAPH_WIDTH = 700

export default function Home({ relative, absolute, meta }: Props) {
  return (
    <>
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
          <Card title="TEAM Closing Price (2020)" type="AUD">
            <VictoryChart theme={VictoryTheme.material} width={GRAPH_WIDTH}>
              <VictoryAxis tickCount={3} tickFormat={simpleDate} />
              <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
              <VictoryLine
                labels={(data) => data.label}
                style={{
                  data: {
                    strokeDasharray: 10,
                    stroke: colors.B100,
                  },
                }}
                data={[
                  {
                    x: relative[0].x,
                    y: meta.maxAUDPriceRaw,
                  },
                  {
                    x: relative[Math.floor(relative.length / 2)].x,
                    y: meta.maxAUDPriceRaw,
                    label: `Max $${meta.maxAUDPrice}`,
                  },
                  {
                    x: relative[relative.length - 1].x,
                    y: meta.maxAUDPriceRaw,
                  },
                ]}
                key="maxPrice"
              />
              <VictoryLine data={relative} key="data" />
            </VictoryChart>
          </Card>
          <Card title="TEAM Closing Price (2020)" type="USD">
            <VictoryChart width={GRAPH_WIDTH} theme={VictoryTheme.material}>
              <VictoryAxis tickCount={3} tickFormat={simpleDate} />
              <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
              <VictoryLine
                style={{ data: { stroke: colors.B100 } }}
                data={absolute}
              />
              <VictoryLine
                labels={(data) => data.label}
                style={{
                  data: {
                    strokeDasharray: 10,
                    stroke: colors.B100,
                  },
                }}
                data={[
                  {
                    x: relative[0].x,
                    y: meta.maxUSDPriceRaw,
                  },
                  {
                    x: relative[Math.floor(relative.length / 2)].x,
                    y: meta.maxUSDPriceRaw,
                    label: `Max $${meta.maxUSDPrice}`,
                  },
                  {
                    x: relative[relative.length - 1].x,
                    y: meta.maxUSDPriceRaw,
                  },
                ]}
                key="maxPrice"
              />
            </VictoryChart>
          </Card>
        </div>
        <style jsx>{`
          h1 {
            display: inline-block;
            padding-bottom: 0.15em;
            border-bottom: 2px solid ${colors.B100};
          }

          p {
            max-width: 680px;
            font-size: 1.1em;
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
            margin: 40px 0;
            gap: 40px;
          }

          @media screen and (max-width: 768px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </main>
    </>
  )
}
