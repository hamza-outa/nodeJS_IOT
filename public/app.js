const sensorForm = document.querySelector("#manualData")
const sensorID = document.querySelector("#sensID")
const waarde = document.querySelector("#sensValue")
const filterForm = document.querySelector("#filterTable")



async function sendFilterParams(callback){
  let filter = filterForm.orderChoice.value.split("-")
  fetch('/sensorDataFiltered?' + new URLSearchParams({
    sensorID: filterForm.sensChoice.value,
    filter: filter[0],
    dateStart: Date.parse(filterForm.date1.value),
    dateEnd: Date.parse(filterForm.date2.value),
    sort: filter[1]
  })).then((response) => {
    response.json().then((data) => {
      callback(data)
    })
  })

}

function filterTable(e){
  e.preventDefault()

  var checkbox = document.getElementById("boxAllData")
  const table = document.getElementById("tableBody")

  sendFilterParams((data) => {
    //console.log(data)
    if (data.length == 0) {
      alert("je zoekopdracht heeft geen resultaten opgeleverd gelieve je zoekcriteria te veranderen")
    }
    //dblocation = data[data.length - 1]
    table.innerHTML = ''
    data.forEach( (item) => {
      let row = table.insertRow()
      let sensorID = row.insertCell(0)
      sensorID.innerHTML = item.sensorID

      let waarde = row.insertCell(1)
      waarde.innerHTML = item.waarde

      let IPAdress = row.insertCell(2)
      IPAdress.innerHTML = item.IP

      let datum = row.insertCell(3)
      //console.time("date/replace")
      datum.innerHTML =  new Date(item.datum).toLocaleString("be-BE")
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
  //console.log(content)
}

function getAllData(callback) {
  fetch("/allSensorData").then((response) => {
    response.json().then((data) => {
      for (var i = 0; i < data.length; i++) {
        data[i].datum = new Date(data[i].datum).toLocaleString("be-BE")
      }

      callback(data)
    })
  })
}

function submitManualData(e){
  e.preventDefault()

  const sensData = {sensorID:sensorID.value, waarde:waarde.value, IP:"80.200.123.2",datum:new Date()}
  //console.log(sensData.datum)
  sendData(sensData)

}


sensorForm.addEventListener("submit",submitManualData)
filterForm.addEventListener("submit",filterTable)

function drawChart(dates,tempData,humData){

  var ctx = document.getElementById("myChart").getContext('2d');

  var xValues = [50,60,70,80,90,100,110,120,130,140,150];
  var yValues = [7,8,8,9,9,9,10,11,14,14,15];

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: 'Temperatuur',
        data: tempData,
        backgroundColor: ['rgba(222, 7, 157, 0.2)'],
        borderColor: ['rgba(148, 0, 103,1)'],
        borderWidth: 1
      },
      {
        label: 'Vochtigheid',
        data: humData,
        backgroundColor: ['rgba(7, 217, 24, 0.2)'],
        borderColor: ['rgba(4, 148, 16,1)'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
            }
        }]
    },
      legend:{
        position:'right',
        labels:{
          fontColor:"#000000",
          fontSize:15
        }
      },
      layout:{
        padding:25
      }
    }
  });

}

function standardChart(){
  let tempData = []
  let humData = []
  let datum = []
  let a = 0, b = 0, c = 0
  getAllData((data) => {
    data.forEach((item) => {
      datum[a] = item.datum
      if(item.sensorID == 1){
        tempData[b] = item.waarde
        b++
      }
      else{
        humData[c] = item.waarde
        c++
      }
      a++
    })

    console.log(tempData)
    console.log(humData)
    console.log(datum)
    drawChart(datum,tempData,humData)

  })

}
