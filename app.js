const PORT = 9000

let express = require('express')
let app = express()
let multer = require('multer')()

app.post('/chat/messages', multer.single('message'), function (req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': 'http://hipmunk.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': true,
  })
  let input = req.body
  console.log(input)
})

console.log("Server is listening on port " + PORT + "...")
app.listen(9000)
