var bodyParser = require("body-parser")
const express = require("express")
const url = require("url")
const path = require("path")
const helmet = require("helmet")
require("./db/mongoose")
const SensData = require("./models/sensorData")

const app = express()
const port = process.env.PORT || 3000

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
)

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
    const data = await SensData.find({}).sort({datum:"asc"})
    res.status(200).send(data)
  } catch (e) {
      res.status(400).send(e)
  }
})

//for sorting data in list and/or graph
app.get("/sensorDataFiltered",jsonParser, async(req, res) => {
  try {
    const queryObj = url.parse(req.url,true).query

    //const test = await SensData.find({_id:{$gte:"616dd4fb4908c75572fccdf2",$lte:"616dd56472c63e8bc13548ee"}})//tussen objecten zoeken
    //crieer object om te kunnen filteren op asc en desc alsook op waarde of datum
    let sortby = {}
    sortby[queryObj.filter] = queryObj.sort

    //om te filteren op welke sensor
    let arr = [0,0]
    if (Number(queryObj.sensorID) == 3) {
      arr[0] = 1
      arr[1] = 2
    }
    else{
      arr[0] = queryObj.sensorID
    }


    if (queryObj.dateStart == "NaN" || queryObj.dateEnd == "NaN") {
      const data = await SensData.find({sensorID:{$in:[arr[0],arr[1]]}})
                                 .sort(sortby)
                                 .exec()  //desc = nieuw naar oud  en asc = oud naar nieuw
      res.status(200).send(data)
    }
    else{
      const data = await SensData.find({sensorID:{$in:[arr[0],arr[1]]},datum:{$gte:queryObj.dateStart,$lte:queryObj.dateEnd}})
                                 .sort(sortby)
                                 .exec()  //desc = nieuw naar oud  en asc = oud naar nieuw
      res.status(200).send(data)
    }


  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }

})

app.get("/chartDataFiltered", jsonParser, async(req,res) => {
  try {
    const queryObj = url.parse(req.url,true).query

    if (queryObj.dateStart == "NaN" || queryObj.dateEnd == "NaN") {
      res.status(400).send("noDates")
    }
    else{
      const data = await SensData.find({datum:{$gte:queryObj.dateStart,$lte:queryObj.dateEnd}})
                                 .sort("asc")
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
