const INITIAL_STATE = {
	// Lawson Building
	_geoloc: {
		lat: 40.427704, 
		lng: -86.916959
	},
	radius: 5
}

function settingsReducer(state = INITIAL_STATE, action) {
	switch(action.type) {
	  case 'GEOLOC_SET' : {
		  console.log('About to change _geoloc to:', action._geoloc)
			return {
				...state,
				_geoloc: action._geoloc
			}
	  }
	  case 'RADIUS_SET' : {
			return {
				...state,
				radius: action.radius
			}
	  }
	  default : return state;
	}
}
  
export default settingsReducer;