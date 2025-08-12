import { useState } from 'react'
import ARRChart from './components/ARRChart.jsx'
import './App.css'
import './index.css'

function App() {
  return (
    <div >
      <div className="labels-and-dropdown">
        <p>Time-based Analytics</p>
      </div>
      
      <div className="ARR-chart">
        <ARRChart />
      </div>
      <div className="gpu-performance-chart">
        <p>Space for GPU PERFORMANCE</p>
      </div>
      <div className="server-data-chart">
        <p>Space for SERVER DATA</p>
      </div>
    </div>
  )
}

export default App
