export async function geocodeLocation(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'travel-itinerary-app'
    }
  })

  const data = await response.json()

  if (!data || data.length === 0) {
    throw new Error('Location not found')
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  }
}
