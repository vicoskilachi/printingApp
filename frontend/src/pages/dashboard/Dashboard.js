import React from 'react'
import ServiceChart from '../../components/serviceChart/ServiceChart'
import ExpenditureChart from '../../components/expenditureChart/ExpenditureChart'


const Dashboard = () => {
  return (
    <div>
        <ServiceChart/>
        <ExpenditureChart/>
    </div>
  )
}

export default Dashboard