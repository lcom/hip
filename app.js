const PORT = 9000

let express = require('express')
let app = express()
let multer = require('multer')()
let Chatbot = require('./Chatbot.js')

let bot = new Chatbot()
app.post('/chat/messages', multer.single('message'), function (req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': 'http://hipmunk.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': true,
  })
  try{
    bot.processRequest(req.body, result=>{
      let respObj = {'messages': result}
      res.send(JSON.stringify(respObj))
    })
  } catch (error){
    console.error(error)
  }
})

console.log('Server is listening on port ' + PORT + '...')
app.listen(9000)
