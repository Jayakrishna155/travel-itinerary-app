import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Itinerary from './pages/Itinerary'
import MapView from './pages/MapView'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itinerary/:id" element={<Itinerary />} />
        <Route path="/map/:id" element={<MapView />} />
      </Routes>
    </Router>
  )
}

export default App


