const districts = [
  "Kurukshetra",
  "Karnal",
  "Ambala",
  "Panipat",
  "Rohtak",
  "Gurugram",
  "Faridabad",
  "Hisar",
  "Sonipat"
]

const categories = [
  "Roads",
  "Water",
  "Sanitation",
  "Electricity",
  "Safety"
]

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

async function generateComplaints(){

  for(let i = 0; i < 200; i++){

    const res = await fetch("http://localhost:3000/api/complaints", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  "x-dev-seed": "true"
},
      body: JSON.stringify({
        title: `Civic Issue ${i+1}`,
        description: "Citizen reporting a civic issue",
        location: "Sector " + Math.floor(Math.random()*20),
        state: "HR",
        district: random(districts),
        ward: "Ward " + Math.floor(Math.random()*10),
        category: random(categories)
      })
    })

    const text = await res.text()

    console.log("Complaint", i+1, "Status:", res.status)
    console.log(text)

  }

}

generateComplaints()