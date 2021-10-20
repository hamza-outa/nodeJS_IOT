const sensorForm = document.querySelector("#manualData")
const sensorID = document.querySelector("#sensID")
const waarde = document.querySelector("#sensValue")
const filterForm = document.querySelector("#filterTable")
//var dblocation = undefined



async function sendFilterParams(callback){
  fetch('/sensorDataFiltered?' + new URLSearchParams({
    sensorID: filterForm.sensChoice.value,
    filter: "date",
    dateStart: Date.parse(filterForm.date1.value),
    dateEnd: Date.parse(filterForm.date2.value),
    sort: filterForm.orderChoice.value
  })).then((response) => {
    response.json().then((data) => {
      callback(data)
    })
  })

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

  var checkbox = document.getElementById("boxAllData")
  const table = document.getElementById("tableBody")

  sendFilterParams((data) => {
    console.log(data)
    //dblocation = data[data.length - 1]
    table.innerHTML = ''
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
      datum.innerHTML =  String(new Date(item.datum)).substring(0,25)
      //console.timeEnd("date/replace")

    })
  })

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
  console.log(content._id)
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

//gets data for table. -probs just remove last part or string from constant value[]-
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
