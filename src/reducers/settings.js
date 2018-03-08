import { LAT_SET, LNG_SET, RADIUS_SET } from '../actions';

const INITIAL_STATE = {
	// Cached geo location or Lawson Building
	lat: localStorage.getItem('lat') || 40.427704, 
	lng: localStorage.getItem('lng') || -86.916959,
	radius: localStorage.getItem('radius') || 5
}

function settingsReducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case LAT_SET : {
			localStorage.setItem('lat', action.lat)
			return {
				...state,
				lat: action.lat
			}
		}
		case LNG_SET : {
			localStorage.setItem('lng', action.lng)
			return {
				...state,
				lng: action.lng
			}
		}
		case RADIUS_SET : {
			localStorage.setItem('radius', action.radius)
			return {
				...state,
				radius: action.radius
			}
		}
		default : return state;
	}
}
  
export default settingsReducer;