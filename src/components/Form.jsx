
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import ButtonBack from "./ButtonBack";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
  .toUpperCase()
  .split("")
  .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?"
function Form() {
  const [lat,lng] = useUrlPosition();

  const {CreateCity , isLoading} = useCities();
  const navigate = useNavigate()
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji , setEmoji] = useState("");

  useEffect(function(){
    async function FetchCityData() {
      try {
        const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        setCityName(data.city || data.locality || 'Unknown City!');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      }
      catch(err) {
        console.error(err);
      }
    }
    FetchCityData()
  },[lat,lng])

  if (!lat && !lng) return <Message message='Start By Clicking On The Map' />;
  if (!lat && !lng) return <Spinner/>;

   async function handleSubmit(e) {
    e.preventDefault()
    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: {lat,lng},
      emoji
    }
     await CreateCity(newCity)
      navigate('/applayout/cities');
  }

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={date => setDate(date)} selected={date} dateFormat='dd/MM/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>
          Add
        </Button>
        <ButtonBack>
          Back
        </ButtonBack>
      </div>
    </form>
  );
}

export default Form;
