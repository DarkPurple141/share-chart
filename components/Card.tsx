import { FC, ReactNode } from 'react'
import Lozenge from '@atlaskit/lozenge'
import { elevation } from '@atlaskit/theme'

interface ICard {
  title: string
  type: string
  children: ReactNode
}

const Card: FC<ICard> = ({ title, type, children }) => (
  <>
    <div className="card">
      <div className="header">
        <h4>{title}</h4>
        <Lozenge appearance={type === 'USD' ? 'inprogress' : 'default'}>
          <h4>{type}</h4>
        </Lozenge>
      </div>
      {children}
    </div>
    <style jsx>{`
      .card {
        padding: 16px;
        ${elevation.e200()}
      }

      .header {
        display: flex;
        justify-content: space-between;
      }
    `}</style>
  </>
)

export default Card
