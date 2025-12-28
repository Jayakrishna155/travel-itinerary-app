import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getItinerary } from '../services/api'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// FREE geocoding using OpenStreetMap
const geocode = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`
  )
  const data = await res.json()
  if (data.length === 0) return null
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  }
}

function MapView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [itinerary, setItinerary] = useState(null)
  const [markers, setMarkers] = useState([])
  const [center, setCenter] = useState([20.5937, 78.9629]) // India default
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const res = await getItinerary(id)
        const itineraryData = res.itinerary.itineraryData
        setItinerary(itineraryData)

        // 📍 Center map by destination
        const destinationCoords = await geocode(itineraryData.destination)
        if (destinationCoords) {
          setCenter([destinationCoords.lat, destinationCoords.lng])
        }

        // 📍 Geocode activities
        const allMarkers = []

        for (const day of itineraryData.days) {
          for (const activity of day.activities) {
            const locationQuery = `${activity.name}, ${itineraryData.destination}`
            const coords = await geocode(locationQuery)

            if (coords) {
              allMarkers.push({
                ...activity,
                day: day.day,
                title: day.title,
                lat: coords.lat,
                lng: coords.lng,
              })
            }
          }
        }

        setMarkers(allMarkers)
      } catch (err) {
        console.error(err)
        setError('Failed to load map')
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading map...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow p-4 flex justify-between">
        <button
          onClick={() => navigate(`/itinerary/${id}`)}
          className="text-indigo-600"
        >
          ← Back
        </button>
        <h1 className="font-bold text-lg">
          {itinerary.destination} — Map View
        </h1>
        <div />
      </div>

      <div className="p-4">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {markers.map((m, i) => (
            <Marker key={i} position={[m.lat, m.lng]}>
              <Popup>
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm">
                  Day {m.day}: {m.title}
                </p>
                <p className="text-indigo-600">{m.time}</p>
                <p className="text-sm">{m.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {markers.length === 0 && (
          <p className="text-center mt-4 text-yellow-600">
            No locations found for activities
          </p>
        )}
      </div>
    </div>
  )
}

export default MapView
