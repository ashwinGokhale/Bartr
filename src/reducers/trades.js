import { OPEN_TRADES_SET, ACCEPTED_TRADES_SET, REJECTED_TRADES_SET, CLOSED_TRADES_SET, TRADES_ERROR } from '../actions';

function tradesReducer(state = {
	open: {
		seller: [],
		buyer: []
	},
    accepted: {
		seller: [],
		buyer: []
	},
    rejected: {
		seller: [],
		buyer: []
	},
    closed: {
		seller: [],
		buyer: []
	},
    error:null
}, action) {
	switch (action.type) {
		case OPEN_TRADES_SET: {
			return {
				...state,
				open: action.open
			}
		}
		case ACCEPTED_TRADES_SET: {
			return {
				...state,
				accepted: action.accepted
			}
        }
        case REJECTED_TRADES_SET: {
			return {
				...state,
				rejected: action.rejected
			}
        }
        case CLOSED_TRADES_SET: {
			return {
				...state,
				closed: action.closed
			}
		}
		case TRADES_ERROR: {
			return {
				...state,
				error: action.error
			}
		}
		default:
			return state;
	}
}

export default tradesReducer;