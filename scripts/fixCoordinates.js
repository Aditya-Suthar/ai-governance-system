import mongoose from "mongoose"

const MONGODB_URI = "mongodb+srv://aditya:Bqwx9901@cluster0.li7qain.mongodb.net/ai-governance?retryWrites=true&w=majority"

async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "ai-governance-system"
    }
  })

  const data = await res.json()

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    }
  }

  return null
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run() {

  await mongoose.connect(MONGODB_URI)

  const Complaint = mongoose.model(
    "Complaint",
    new mongoose.Schema({}, { strict: false })
  )

  const complaints = await Complaint.find({
    $or: [
      { latitude: { $exists: false } },
      { longitude: { $exists: false } },
      { latitude: null },
      { longitude: null }
    ]
  })

  console.log("Complaints needing coords:", complaints.length)

  for (const c of complaints) {

    let stateName = c.state

    // convert HR → Haryana
    if (stateName === "HR") {
      stateName = "Haryana"
    }

    let place = ""

    if (c.district && stateName) {
      place = `${c.district}, ${stateName}, India`
    }
    else if (c.location) {
      place = `${c.location}, India`
    }
    else {
      console.log("Skipped (no location data):", c._id)
      continue
    }

    try {

      let geo = await geocode(place)

      // fallback to district if exact place fails
      if (!geo && c.district && stateName) {
        console.log("Retrying with district:", c.district)
        geo = await geocode(`${c.district}, ${stateName}, India`)
      }

      if (geo) {

        await Complaint.updateOne(
          { _id: c._id },
          {
            $set: {
              latitude: geo.lat,
              longitude: geo.lon
            }
          }
        )

        console.log("Updated:", place, geo)

      } else {
        console.log("Failed:", place)
      }

    } catch (err) {
      console.log("Error:", place, err.message)
    }

    await sleep(1200) // Nominatim rate limit

  }

  console.log("Geocoding completed")

  mongoose.disconnect()
}

run()