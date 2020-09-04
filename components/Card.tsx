import React from 'react'
import Lozenge from '@atlaskit/lozenge'
import { elevation } from '@atlaskit/theme'

interface ICard {
  name: string
}

const Card: React.FC<ICard> = ({ name, children }) => (
  <>
    <div className="card">
      <Lozenge>
        <h2>{name}</h2>
      </Lozenge>
      {children}
    </div>
    <style jsx>{`
      .card {
        padding: 10px;
        ${elevation.e200()}
      }
    `}</style>
  </>
)

export default Card
