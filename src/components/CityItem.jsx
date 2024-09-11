import { NavLink } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date)); //wtfffffff
  
    function CityItem({city}) {
      const {cityName,emoji,date,id,position} = city; //amazing amazing!!!!!!!!!
      const {currentCity , DeleteCity} = useCities()
      function handleDelete(e){
        e.preventDefault()
        DeleteCity(id)
      }
    return (
        <li>
            <NavLink className={`${styles.cityItem} ${id === currentCity.id ? styles['cityItem--active'] : ''}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
              <span className={styles.emoji}>{emoji}</span>
              <h3 className={styles.name}>{cityName}</h3>
              <time className={styles.date}>({formatDate(date)})</time>
              <button className={styles.deleteBtn} onClick={handleDelete}>&times;</button>
            </NavLink>
        </li>
    )
}

export default CityItem
//استفاده از url  به جای usestate 
// Migan age in karo koni dige age masalan taraf ye linko boomark kone ya ye page ro berfreste vase kesi dige,,(maslan age filter zade basshe roo mahsoolat filter ha bara un tarafi ke linko vasash ferestadi ham e'mal mishe, jaleb nist namoosan?)