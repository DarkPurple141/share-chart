import React from 'react'
import Lozenge from '@atlaskit/lozenge'
import { elevation } from '@atlaskit/theme'

interface ICard {
  title: string
  type: string
}

const Card: React.FC<ICard> = ({ title, type, children }) => (
  <>
    <div className="card">
      <div className="header">
        <h3>{title}</h3>
        <Lozenge appearance={type === 'USD' ? 'inprogress' : 'default'}>
          <h3>{type}</h3>
        </Lozenge>
      </div>
      {children}
    </div>
    <style jsx>{`
      .card {
        padding: 10px;
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
