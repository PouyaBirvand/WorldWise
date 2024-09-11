import  React ,{ createContext , useCallback, useContext, useEffect , useReducer} from 'react'
const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000"

const reducer = (state, action) => {
  switch (action.type) {
    case 'cities/loaded':
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      }
    case 'loaded':
      return {...state,isLoading: true}
    case 'city/loaded':
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      }
    case 'city/created':
      return {
        ...state,
        cities: [...state.cities,action.payload],
        currentCity: action.payload,
        isLoading: false,
      }
    case 'city/deleted':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload)
      }
    
    default: throw new Error('Unknown action type');
      
  }
}

const initialState = { cities: [], currentCity: {}, isLoading: false };

function CitiesProvider({children}) {
  const [{cities,currentCity},dispatch] = useReducer(reducer,initialState);

  useEffect(function(){ 
    async function fetchCities(){
      dispatch({type: 'loaded'})
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: 'cities/loaded',payload: data})
      } catch (error) {
        console.log(error, 'Maw Maw Miyow ');
      }
    }
    fetchCities();
  },[])
  
  
  const getCity = useCallback( async function getCity(id) {
    if(Number(id) === currentCity.id) return;
    dispatch({type: 'loaded'})
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({type: 'city/loaded',payload: data})
      } catch (error) {
        console.log(error, 'Maw Maw Miyow ');
      }

},[currentCity.id])

  async function CreateCity(newCity) {
    dispatch({type: 'loaded'})
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'post',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      dispatch({type: 'city/created' , payload: data})//wrong wrong wrong.....
      console.log('response', data);
      
    } catch (error) {
      console.log(error, 'Maw Maw Miyow ');
    } 
  }

  async function DeleteCity(id) {
    try {
      dispatch({type: 'loaded'})
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      dispatch({type: 'city/deleted' , payload: id}) //wrong wrong wrong.....
      console.log('response', data);
      
    } catch (error) {
      console.log(error, 'Maw Maw Miyow ');
    } 
  }

  return (
    <CitiesContext.Provider value={{cities,currentCity,getCity,CreateCity,DeleteCity}}>
        {children}
    </CitiesContext.Provider>
  )
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error ('CitiesContext was used outside the CitiesProvider')
 return context
}

export { CitiesProvider, useCities}
