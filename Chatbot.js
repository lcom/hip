class Chatbot{

  constructor(){
    // Map of user_ids to names
    this.userNames = {}
  }

  // Process a request from the server and return an object with message responses
  processRequest(req){
    if (typeof req.action == 'undefined'){
      throw 'Request has no action'
    }
    let messages = []
    if (req.action == 'join'){
      this.processJoin(req, messages)
    }else if (req.action == 'message'){
      this.processMessage(req, messages)
    }
    return {'messages': messages}
  }

  // Process a 'join' and adds responses to the messages array
  // input:
  processJoin(input, messages){
    // Make sure input is formated correctly
    if (typeof input.user_id == 'undefined' || typeof input.name == 'undefined')
      throw 'Join request was missing user_id or name'

    // Add user to the user map
    this.userNames[input.user_id] = input.name

    // Create a response
    {
      let res = {
        type: 'text',
        text: "Hi " + input.name + ". I'm the weather bot!.",
      }
      messages.push(res)
    }
    {
      let res = {
        type: 'rich',
        html: "<img src='https://i.imgur.com/RBilfXo.jpg'>",
      }
      messages.push(res)
    }

  }

  // Process a 'message' and adds responses to the messages array
  processMessage(input, messages){
    console.log(input)
    if (typeof input.user_id == 'undefined' || typeof input.text == 'undefined')
      throw 'Message request is missing user_id or text'
    if (typeof this.userNames[input.user_id] == 'undefined')
      throw 'User' + input.user_id + ' sent message but never joined'

    // Get the users name from the map
    let name = this.userNames[input.user_id]

    // Create a response to send back to them
    let res = {
      type: 'text',
      text: 'Wow! You said ' + input.text + '...',
    }
    messages.push(res)
  }



}

module.exports = Chatbot
