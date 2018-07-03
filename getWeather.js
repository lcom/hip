let request = require('request')

// Calls callback with weather for location
function getWeather(loc, callback){
  getCoordinates(loc, (coord)=>{
    getWeatherFromCoordinates(coord, callback)
  })
}

function getCoordinates(loc, callback){
  let API_KEY = 'AIzaSyD7W7v5psM8TDJwUV2WxsPkoYRtByh07Y0'
  let URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
  let reqUrl = URL + loc + '&key=' + API_KEY

  request(reqUrl, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        let respObj = JSON.parse(response.body)
        let coord = respObj.results[0].geometry.location
        callback(coord)
      }else{
        if (error) throw error
        throw 'Google API returned response code ' + response.statusCode
      }
  })
}

function getWeatherFromCoordinates(coord, callback){
  let API_KEY = '8b4d5ca925446f9db4f7d7d0aac8b40c'
  let URL = 'https://api.darksky.net/forecast/'
  let reqUrl = URL + API_KEY + '/' + coord.lat + ',' + coord.lng

  request(reqUrl, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        let respObj = JSON.parse(response.body)
        let weather = respObj.currently
        callback(weather)
      }else{
        if (error) throw error
        throw 'DarkSky API returned response code ' + response.statusCode
      }
  })
}

module.exports = getWeather
