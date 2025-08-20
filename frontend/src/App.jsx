import { useState } from 'react'
import './App.css'
import './index.css'
import ARRChart from './components/ARRChart.jsx'
import ServerTable from './components/ServerTable.jsx'

function App() {
  return (
    <div >
      <div className="ARR-chart">
        <ARRChart />
      </div>
      <div className="ARR-chart">
        <p>*^-^*</p>
      </div>
      <div className="server-data-chart">
        <ServerTable />
      </div>
    </div>
  )
}

export default App
