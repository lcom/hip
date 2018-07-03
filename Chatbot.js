let getWeather = require('./getWeather.js')

class Chatbot{

  constructor(){
    // Map of user_ids to names
    this.userNames = {}
  }

  // Process a request from the server and calls callback with the response object
  processRequest(req, callback){
    if (typeof req.action == 'undefined'){
      throw 'Request has no action'
    }

    if (req.action == 'join'){
      this.processJoin(req, callback)
    }else if (req.action == 'message'){
      this.processMessage(req, callback)
    }
  }

  // Process a 'join' and calls back with messages in an array
  processJoin(input, callback){
    // Make sure input is formated correctly
    if (typeof input.user_id == 'undefined' || typeof input.name == 'undefined')
      throw 'Join request was missing user_id or name'

    // Add user to the user map
    this.userNames[input.user_id] = input.name

    // Pick a greeting
    let greetings = ['Hi ','Hello ','Hey ', 'Greetings ']
    let greeting = greetings[Math.floor(Math.random()*greetings.length)]
    // Create a response
    let messages = []
    {
      let res = {
        type: 'text',
        text: greeting + input.name + ". I'm Weather Bot!",
      }
      messages.push(res)
    }
    {
      let res = {
        type: 'rich',
        html: "<img src='https://i.imgur.com/RBilfXom.jpg'>",
      }
      messages.push(res)
    }
    let locations = ["New York", "SF", "Dubai", "Denver", "Santiago, Chile",
                     "Tokyo", "Costa Rica", "Belgium", "Hanoi, Vietnam"]
    let location = locations[Math.floor(Math.random()*locations.length)]
    {
      let res = {
        type: 'text',
        text: "Try asking: What's the weather in " + location + "?",
      }
      messages.push(res)
    }

    // Return the greeting back up to be sent
    callback(messages)
  }

  // Process a 'message' and calls back with messages in an array
  processMessage(input, callback){
    if (typeof input.user_id == 'undefined' || typeof input.text == 'undefined')
      throw 'Message request is missing user_id or text'
    if (typeof this.userNames[input.user_id] == 'undefined')
      throw 'User' + input.user_id + ' sent message but never joined'

    // Get the users name from the map
    let name = this.userNames[input.user_id]

    // Check for weather requests
    let messages = []
    let loc = this.parseWeatherRequest(input.text)
    if (loc == null){
      // Create a response to send back to them
      let res = {
        type: 'text',
        text: "Hmm, I'm not sure. Try saying 'weather in [city]'.",
      }
      messages.push(res)

      // Respond with the message
      callback(messages)
    }else{
      // Get the weather for the location provided
      getWeather(loc, (weather)=>{
        let temp = Math.round(weather.temperature) + "F"
        let summ = weather.summary
        let res = {
          type: 'text',
          text: "Currently it's " + temp + ". " + summ,
        }
        messages.push(res)
        
        // Respond with the weather summary
        callback(messages)
      })
    }
  }

  // Parse the text and check if its a weather request
  // If so, return the location requested
  parseWeatherRequest(text){
    let regexes = [/(?<=(what'?s the )?weather in ).*/i,
                   /.*(?= weather)/i]
    for(let i=0; i<regexes.length; i++){
      let match = text.match(regexes[i])
      if (match != null){
        // Remove punctuation and return
        return match[0].replace(/(\?)|(\.$)|(!)/g,"")
      }
    }
    return null
  }

}

module.exports = Chatbot
