import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getItinerary, exportPDF } from '../services/api'

function Itinerary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItinerary(id)
        setItinerary(response.itinerary)
      } catch (err) {
        setError(err.message || 'Failed to load itinerary')
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [id])

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await exportPDF(id)
    } catch (err) {
      alert(err.message || 'Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Itinerary not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Home
            </button>
            <div className="flex gap-3">
              <Link
                to={`/map/${id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Map
              </Link>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {itinerary.itineraryData.destination}
            </h1>
            <p className="text-gray-600">
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
            </p>
            {itinerary.preferences && (
              <div className="mt-4 flex flex-wrap gap-2">
                {itinerary.preferences.budget && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {itinerary.preferences.budget}
                  </span>
                )}
                {itinerary.preferences.travelPace && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {itinerary.preferences.travelPace}
                  </span>
                )}
                {itinerary.preferences.interests && itinerary.preferences.interests.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {itinerary.preferences.interests.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {itinerary.itineraryData.days.map((day) => (
              <div key={day.day} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-indigo-600 text-white px-6 py-4">
                  <h2 className="text-2xl font-bold">Day {day.day}: {day.title}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-indigo-600">{activity.time}</span>
                              <h3 className="text-lg font-semibold text-gray-800">{activity.name}</h3>
                            </div>
                            <p className="text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Itinerary


