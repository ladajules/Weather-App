const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 20010;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Weather App (WeatherAPI.com)</h1>
    <form method="POST" action="/weather">
        <input type="text" name="city" placeholder="Enter city (e.g. Cebu)" required />
        <button type="submit">Get Weather</button>
    </form>
  `);
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.send("City is required");
  }

  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

    const response = await axios.get(url);
    const data = response.data;

    const location = data.location;
    const current = data.current;

    const html = `
      <h2>Weather in ${location.region}, ${location.country}</h2>
      <p>Temperature: ${current.temp_c} °C or ${current.temp_f} °F</p>
      <p>Feels like: ${current.feelslike_c} °C or ${current.feelslike_f} °F</p>
      <p>Condition: ${current.condition.text}</p>
      <p>Humidity: ${current.humidity}%</p>
      <p>Wind: ${current.wind_kph} kph or ${current.wind_mph} mph</p>
      <a href="/">Search again</a>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    res.send(`<p>Could not fetch weather for "${city}". Please try again.</p><a href="/">Back</a>`);
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://linux-24102582.dcism.org:${PORT}`);
});
