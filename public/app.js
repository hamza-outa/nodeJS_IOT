const sensorForm = document.querySelector("#manualData")
const sensorID = document.querySelector("#sensID")
const waarde = document.querySelector("#sensValue")
const filterForm = document.querySelector("#filterTable")




async function sendFilterParams(){
  fetch('/sensorDataFiltered' + new URLSearchParams({
    sensorID: filterForm.sensChoice.value,
    filter: 2,
    dateStart: Date.parse(filterForm.date1.value),
    dateEnd: Date.parse(filterForm.date2.value),
    sort: filterForm.orderChoice.value,
    aantal: 2,
}))
}

function filterTable(e){
  e.preventDefault()
  /*console.log(filterForm.sensChoice.value)
  console.log(filterForm.orderChoice.value)
  console.log(filterForm.date1.value)
  console.log(filterForm.date2.value)
  console.log(Date.parse(filterForm.date1.value))
  if (filterForm.date1.value == "" && filterForm.date2.value == "" ) {
    console.log("it worked")
  }*/


}

async function sendData(data){
  const rawResponse = await fetch("/addData",{
    method: "POST",
    headers:{
      "Accept" : "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  const content = await rawResponse.json()
  console.log(content)
}

function getAllData(callback) {
  fetch("/allSensorData").then((response) => {
    response.json().then((data) => {
      callback(data)
    })
  })
}


function submitManualData(e){
  e.preventDefault()

  const sensData = {sensorID:sensorID.value, waarde:waarde.value, IP:"80.200.123.2",datum:Number(Date.now())}
  console.log(sensData.datum)
  sendData(sensData)

  // getAllData((data) => {
  //   document.getElementById("tabel").innerHTML = JSON.stringify(data)
  // })
}

function getAllDataForTable(){
  var checkbox = document.getElementById("boxAllData")
  const table = document.getElementById("tableBody")


  if (checkbox.checked == true) {
      console.log("its true")
    getAllData((data) => {
      data.forEach((item) => {
        let row = table.insertRow()
        let sensorID = row.insertCell(0)
        sensorID.innerHTML = item.sensorID

        let waarde = row.insertCell(1)
        waarde.innerHTML = item.waarde

        let IPAdress = row.insertCell(2)
        IPAdress.innerHTML = item.IP

        let datum = row.insertCell(3)
        //console.time("date/replace")
        datum.innerHTML = Date(item.datum).replace(" GMT+0200 (Midden-Europese zomertijd)","")
        //console.timeEnd("date/replace")

      })

    })
  }

}
// var time = new Date(1634389200000)
// console.log(time.toLocaleString("nl-BE"))
sensorForm.addEventListener("submit",submitManualData)
filterForm.addEventListener("submit",filterTable)
