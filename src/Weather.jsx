import { useState, useRef, useEffect} from "react";
import './Weather.css';
import cities from './Data/Cities.json'

const API_KEY = "YOUR_APP_KEY";

const Weather = () => {
	const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const inputRef = useRef(null);

	const handleCity = (e) => {
		const input = e.target.value;
        setCity(input);

        if (input.length > 0) {
            const matches = cities.filter(city =>
                city.toLowerCase().startsWith(input.toLowerCase())
            );
            setFilteredCities(matches.slice(0, 10)); // show max 10 suggestions
        } else {
            setFilteredCities([]);
        }
	};

    useEffect(() => {
        inputRef.current.focus();
    },[])

    const fetchWeather = async (city) =>{
        try{
            if (!API_KEY) {
                throw new Error('Invalid API Key');
            }
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            if(!response.ok) {
                throw new Error('City not found');
            }else{
                const data = await response.json();
                setWeatherData(data);
            }      
        }
        catch(err){
            alert(err.message);
        }

        setCity('');
        setFilteredCities([]);
        inputRef.current.focus();
    }
    const handleSuggestionClick = (selectedCity) => {
        setCity(selectedCity);
        setFilteredCities([]);
        // fetchWeather(selectedCity);
    };
    const getWeatherStyle = (weather) => {
    if (!weather) return "default-weather";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clouds")) return "cloudy";
    if (condition.includes("rain") || condition.includes("drizzle")) return "rainy";
    if (condition.includes("clear")) return "sunny";
    if (condition.includes("snow")) return "snowy";
    if (condition.includes("storm")) return "stormy";
    return "default-weather";
};

    const handleClickWeather = () => {
        fetchWeather(city);
    }

	return (
		<div className={`weather-container ${getWeatherStyle(weatherData)}`}>
			<h1>In Weather app</h1>
            <br/>
			<label htmlFor="exampleDataList" className="form-label">
				Enter the City to Check Weather
			</label>
             <div style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    className="form-control"
                    placeholder="City..."
                    value={city}
                    onChange={handleCity}
                />
                {filteredCities.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        zIndex: 10,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        width: '100%',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        cursor: 'pointer'
                    }}>
                        {filteredCities.map((city, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(city)}
                                style={{ padding: '8px', borderBottom: '1px solid #eee' }}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <br />
            <button onClick={handleClickWeather}>Get Weather</button>
            <br /><br />
            {weatherData && 
                <div className="weather-card">
                    <h2>Weather Details</h2>
                    <p><strong>City:</strong> {weatherData.name}</p>
                    <p><strong>Temperature:</strong> {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                    <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
                    <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
                </div>
            }
		</div>
	);
};

export default Weather;
