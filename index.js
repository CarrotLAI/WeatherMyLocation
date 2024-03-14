import express from "express";
import axios from "axios";
import bodyParser from "body-parser";



const app = express()
const port = 3000
const API_KEY = "ea9c9b1ceca0e4ae6675b12dc6dae92f"
const URL = "https://api.openweathermap.org/data/2.5/weather?"
const config = {
  headers: {Authorization: `Bearer ${API_KEY}`}
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", (req, res)=>{
  res.render("index", {content: {
        name: "Select country",
        date: today(),
        temperature: 0,
        semiForecast: "img/no-data.png"
  }})
  
})

app.get("/current", async (req, res)=>{
  const countryName = req.query.city
  var todayWeather
  try{ 
    const result = await axios.get(URL, 
      {
        params:{
          units: "metric",
          q: countryName,
          appid: API_KEY
        }
      })
      
    res.render("index", {
      content:{
        date: today(),
        name: result.data.name,
        sys: result.data.sys.country,
        day: today.whatDay,
        temperature: Math.floor(result.data.main.temp),
        semiForecast : checkWeather(result.data.weather[0].description),
        mainForecast: result.data.weather[0].main,
        description: result.data.weather[0].description,
        humidity: result.data.main.humidity,
        wind: result.data.wind.speed, 
    }
    })
  } catch (error){
    console.log("error")
    res.render("index", {content: JSON.stringify(error.response.data)})
  }
})


app.listen(port,()=>{
  console.log(port)
})

// functions

function today(){
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const day = new Date().getDay()
  var whatDay

switch(day){
    case 1:
        whatDay="Monday"
        break
    case 2:
        whatDay="Tuesday"
        break
    case 3:
        whatDay="Wednesday"
        break
    case 4:
        whatDay="Thursday"
        break
    case 5:
        whatDay="Friday"
        break
    case 6:
        whatDay="Saturday"
        break
    case 0:
        whatDay="Sunday"
        break
    default:
        break
}

  const today = whatDay + "    " + month + "/" + day+"/"+ year
  return today
}
function checkWeather(forecast){
  // for corresponding image for weatherforecast
  var answer = forecast
  var fCast
  switch (answer){
    case "clear sky":
      fCast ="img/yellow-sun.png"
      break
    case "few clouds":
      fCast ="img/blue-clouds-and-yellow-sun.png"
      break
    case "scattered clouds":
      fCast ="img/blue-cloud-and-weather.png"  
      break
    case "broken clouds":
      fCast ="img/broken-clouds.png"      
      break
    case "shower rain":
      fCast ="img/downpour-rainy-day.png"
      break
    case "rain":
      fCast ="img/downpour-rainy-day.png"      
      break
    case "thunderstorm":
      fCast ="img/LIGHTNING.png"      
      break
    default:
      fCast = "error"
  }
  return fCast
}
