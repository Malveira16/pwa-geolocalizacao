import { useState } from "react"

interface Place {
  pageid: number
  title: string
  lat: number
  lon: number
  dist: number
}

export default function App() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])

  function getLocation() {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização")
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latitude}|${longitude}&gsradius=10000&gslimit=5&format=json&origin=*`
      const res = await fetch(url)
      const data = await res.json()
      setPlaces(data.query.geosearch)
      setLoading(false)
    })
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotos((prev) => [...prev, reader.result as string])
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌍 LocalExplorer</h1>

      <button onClick={getLocation}>
        Buscar locais próximos
      </button>

      {loading && <p>Carregando...</p>}

      <ul>
        {places.map((p) => (
          <li key={p.pageid}>
            <strong>{p.title}</strong> – {p.dist.toFixed(0)}m
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <h2>📸 Tirar foto</h2>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>🖼️ Minhas fotos</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`foto-${idx}`}
              style={{ width: "150px", borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
