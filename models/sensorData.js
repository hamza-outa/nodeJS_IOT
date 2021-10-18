const mongoose = require("mongoose")

//  /Users/ouham/mongodb/bin/mongod.exe --dbpath=/Users/ouham/mongodb_data

const sensDataSchema = new mongoose.Schema({
  sensorID:{
    type: Number
  },
  waarde:{
    type:Number
  },

  IP:{
    type:String
  },

  datum:{
    type:Number
  }

})

sensDataSchema.methods.toJSON = function () {
  const data = this
  const dataObject = data.toObject()

  delete dataObject.__v
  delete dataObject._id

  return dataObject
}


const SensData = mongoose.model("SensorData",sensDataSchema)
module.exports = SensData
