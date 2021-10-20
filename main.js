var bodyParser = require("body-parser")
const express = require("express")
const http = require("http")
const url = require("url")
const path = require("path")
require("./db/mongoose")
const SensData = require("./models/sensorData")

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,'/public')))

var jsonParser = bodyParser.json()

//manuely added data from site
app.post("/addData",jsonParser, async(req,res) => {
  const data = new SensData(req.body)
  try {
    await data.save()
    res.status(200).send(data)
  } catch (e) {
      res.status(400).send(e)
  }

})

//pi uploads data here
app.post("/collector", jsonParser,async (req,res) => {
  console.log(req.body)
  const data = new SensData(req.body)

  try {
    await data.save()
    res.status(200).send(data)
  }
   catch (e) {
    res.status(400).send(e)
  }

})

//if client wants all data
app.get("/allSensorData", async (req,res) => {
  try {
    const data = await SensData.find({}).sort({waarde:"desc"})
    res.status(200).send(data)
  } catch (e) {
      res.status(400).send(e)
  }
})

//for sorting data in list and/or graph
app.get("/sensorDataFiltered",jsonParser, async(req, res) => {
  try {
    const querObj = url.parse(req.url,true).query
  	//console.log(querObj)

    //const test = await SensData.find({_id:{$gte:"616dd4fb4908c75572fccdf2",$lte:"616dd56472c63e8bc13548ee"}})
    //console.log(test)
    if (querObj.filter == "date") {
      const data = await SensData.find({sensorID:querObj.sensorID,datum:{$gte:querObj.dateStart,$lte:querObj.dateEnd}})
                                 .sort({datum:querObj.sort})
                                 .exec()  //desc = nieuw naar oud  en asc = oud naar nieuw
      res.status(200).send(data)
    }
    else if (querObj.filter == "value") {
      const data = await SensData.find({sensorID:querObj.sensorID,datum:{$gte:querObj.dateStart,$lte:querObj.dateEnd}})
                                 .sort({waarde:querObj.sort})
                                 .exec()  //desc = nieuw naar oud  en asc = oud naar nieuw
      res.status(200).send(data)
    }

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }

})


app.listen(port, () => {
    console.log("server is up on port " + port)
})
