
const utilityDB = (() => {
  let mongoose = require("mongoose"),
    Country = require("../models/country"),
    State = require("../models/state"),
    Institution = require("../models/institution"),
    Building = require("../models/building"),
    Floor = require("../models/floor"),
    Room = require("../models/room"),
    Code = require("../models/code"),
    nodemailer = require("nodemailer");

  mongoose.connect("mongodburl", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "username", // generated ethereal user
      pass: "gmail" // generated ethereal password
    }
  });

  const createCode = (email, callback) => {
    let code = [];
		if(!email || email === "") {
			callback({success: false, message: "Email cannot be null!"});
			return;
		}
    for (let i = 0; i < 6; i++)
      code[i] = Math.floor(Math.random() * 10) + 1;
    Code.findOne({ email: email }, (err, rCode) => {
      if (!rCode) {
        code = new Code({ email: email, code: code.join("") })
        code.save(async (err, result) => {
          await transporter.sendMail({
            from: 'campusMap@gmail.com',
            to: email,
            subject: "Verification Code From Campus Mail",
            text: "Hi there,\n\n Here is your verification code: " + code.code
          });
          let resCode = { email: code.email, message: "code has been sent!" }
          callback(resCode);
        })
      } else {
        callback({ result: "Code has been sent!" });
      }
    })
  }

  const verifyCode = (codeObj, callback) => {
    Code.findOne({
      email: codeObj.email
    }, (err, resultCode) => {
      if (err) {
        callback({ success: false, verified: false });
        return
      }
      if (resultCode && resultCode.code === codeObj.code) {
        Code.deleteOne({ email: codeObj.email }, (err, result) => {
          if (err) {
            callback({ success: false, verified: false });
            return
          }
          callback({ success: true, verified: true });
        })
      } else {
        callback({ success: true, verified: false });
      }
    })
  }



  const createIfNotExists = (obj, schema) => {
    schema.findOne({
      key: obj.key
    }, (err, fObj) => {
      if (err) console.log(err)
      if (!fObj) {
        fObj = new schema(obj)
        fObj.save()
      }
    })
  }
  //insert many record using aray
  const insertMany = (objArray, schema) => {
    objArray.forEach((obj) => {
      createIfNotExists(obj, schema)
    })
  }
  //insert a new record
  const insertOne = (obj, schema) => {
    createIfNotExists(obj, schema)
  }
  //delete one record
  const deleteOne = (obj, schema) => {
    schema.deleteOne({
      name: obj.name
    }, (err) => {
      console.log(err)
    });
  }
  //update a record
  const updateOne = (obj, updatedObj, schema) => {
    schema.findOneAndUpdate(obj, updatedObj, (err) => {
      console.log(err)
    }) // executes
  }
  //read based on key and schema
  const readDBbyKey = (queryKey, schema, callback) => {
    schema.find({
      key: queryKey
    }, {
      _id: false,
      __v: false
    }, (err, result) => {
      if (err) console.log(er)
      callback(result)
    });
  }
  //read database using regex
  const readDBbyRegexKey = (regexKey, schema, callback) => {
    schema.find({
      key: new RegExp(regexKey, "i")
    }, {
      _id: false,
      __v: false
    },
      (err, result) => {
        if (err) console.log(err)
        callback(result)
      });
  }
  //get current and next level
  const getCurrentAndNextLevel = (queryKey, currentSchema, nextSchema, callback) => {
    readDBbyKey(queryKey, currentSchema, (fCurrent) => {
      // using regex to match start with key 
      readDBbyRegexKey('^' + queryKey, nextSchema, (fNext) => {
        fCurrent = fCurrent[0]
        callback(fCurrent, fNext)
      })
    })
  }
  /*get data of current and next level by length
  of key and then return both levels using callback*/
  const getJSONByKey = (queryKey, callback) => {
    switch (queryKey.length) {
      case 2: //country
        getCurrentAndNextLevel(queryKey, Country, State, callback)
        break
      case 6: //state
        getCurrentAndNextLevel(queryKey, State, Institution, callback)
        break
      case 11: //institution
        getCurrentAndNextLevel(queryKey, Institution, Building, callback)
        break
      case 16: //building
        getCurrentAndNextLevel(queryKey, Building, Floor, callback)
        break
      default:
        //500 json
        break
    }
  }

  //insert a record using level
  const insertByLevel = (obj, level, callback) => {
    for (let i = 0; i <= level; i++) {
      switch (i) {
        case 0:
          insertOne(obj.country, Country)
          break
        case 1:
          obj.state.key = obj.country.key.concat(obj.state.key)
          insertOne(obj.state, State)
          break
        case 2:
          obj.institution.key = obj.state.key.concat(obj.institution.key)
          insertOne(obj.institution, Institution)
          break
        case 3:
          //hash building key
          obj.building.key = (obj.institution.key.concat(hashBdKey(obj.building.name, 5))).toUpperCase()
          insertOne(obj.building, Building)
          break
        default:
          console.log("err insertByLevel")
          break
      }
    }
    callback(obj)
  }

  // Read Asynchrously
  const getJsonObj = (path) => {
    var fs = require("fs");
    var content = JSON.parse(fs.readFileSync(path));
    return content;
  }

  const hashBdKey = (str, len) => {
    if (len < 1 || str == null)
      return null;
    str = str.trim();
    if (len >= str.length)
      return str.toUpperCase();
    var ucIndex = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      if (c == c.toUpperCase() && c != " ")
        ucIndex.push(i);
    }
    if (ucIndex.length == 0)
      return replaceSpaceWithUnderscore(str.substring(0, len).toUpperCase());
    return getChars(str, ucIndex, len);
  }

  const getChars = (str, ucIndex, len) => {
    var unitCount = len / (ucIndex.length);
    var result = "";
    var endIndex = 0;
    for (var i = 0; i < ucIndex.length; i++) {
      for (var j = 0; j < unitCount; j++) {
        result += str.charAt(ucIndex[i] + j);
      }
      endIndex = i;
    }
    var diff = len - result.length;
    result = result.toUpperCase();
    if (diff < 0)
      return result.substring(0, len);
    for (var i = 0; i < diff; i++) {
      result += str.charAt(ucIndex[endIndex] + i);
    }
    return result;
  }

  const replaceSpaceWithUnderscore = (str) => {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      result += (c == ' ' ? "_" : c);
    }
    return result;
  }

  const verifyUtility = (key, utility, callback) => {
    Building.findOne({
      "key": key
    }, (err, result) => {
      if (!result) {
        callback({ "success": false, "error": "Building key is not found!!!" })
        return;
      }
      for (let i = 0; i < result.utilities.length; i++) {
        if (utility.description === result.utilities[i].description) {
          result.utilities[i].verified = true;
        }
      }
      result.save((err) => {
        if (err) callback({ "success": false, "error": err })
        else callback({ "success": true, "message": "utility is verified" })
      })
    });
  }

  const deleteUtility = (key, utility, callback) => {
    Building.findOne({
      "key": key
    }, (err, result) => {
      if (!result) {
        callback({ "success": true, "error": "Building key is not found!!!" })
        return;
      }
      for (let i = 0; i < result.utilities.length; i++) {
        if (utility.description === result.utilities[i].description) {
					result.utilities.splice(i, 1);	
        }
      }
      result.save((err) => {
        if (err) callback({ "success": false, "error": err })
        else callback({ "success": true, "message": "utility is deleted" })
      })
    });
  }

  //insert utility for buildings
  const insertUtility = (key, utility, callback) => {
    Building.findOne({
      "key": key
    }, (err, result) => {
      if (!result) {
        callback({ "success": false, "error": "Building key is not found!!!" })
        return;
      }
      result.utilities.push(utility)
      result.save((err) => {
        if (err) callback({ "success": false, "error": err })
        else callback({ "success": true, "message": "utility is uploaded" })
      })
    });
  }

  //used to populate buildings
  const populateBuildings = (countryObj, stateObj, institutionObj, bdObjs) => {
    insertOne(countryObj, Country)
    insertOne(stateObj, State)
    insertOne(institutionObj, Institution)
    //spceial because of coordinates
    bdObjs.forEach((bdObj) => {
      var bd = new Building({
        utilities: bdObj.utilities,
        //coordinates is reversed
        lat: bdObj.coordinates[1],
        lng: bdObj.coordinates[0],
        name: bdObj.name,
        key: bdObj.key,
      })
      bd.save()
    })
  }

  function populateMadison() {
    let buildings = getJsonObj('./test_jsons/buildings.json').buildings
    let microwaves = getJsonObj('./test_jsons/Microwaves.json').microwaves
    let printers = getJsonObj('./test_jsons/Printers.json').printers
    buildings.forEach((building) => {
      let utility = []
      microwaves.forEach((microwave) => {
        if (building.key === microwave.key) {
          microwave["verified"] = true;
          utility.push(microwave)
        }
      })
      printers.forEach((printer) => {
        if (building.key === printer.key) {
          printer["verified"] = true;
          utility.push(printer)
        }
      })

      building.utilities = utility //assign utility to buildings
      building.key = "USWISCUWMAD" + building.key
    })
    populateBuildings({
      name: "United States",
      key: "US"
    }, {
      name: "Wisconsin",
      key: "USWISC"
    }, {
      name: "University of Wisconsin-Madison",
      key: "USWISCUWMAD"
    },
      buildings)
  }
  return {
    insertUtility,
    populateMadison,
    verifyUtility,
    getJSONByKey,
    createCode,
    verifyCode,
		deleteUtility
  }
})()

module.exports = utilityDB
