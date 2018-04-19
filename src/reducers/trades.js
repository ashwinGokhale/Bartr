import { 
	OPEN_TRADES_SET, 
	OPEN_TRADES_ADD, 
	OPEN_TRADES_REMOVE, 
	ACCEPTED_TRADES_SET, 
	ACCEPTED_TRADES_ADD, 
	ACCEPTED_TRADES_REMOVE, 
	REJECTED_TRADES_SET, 
	REJECTED_TRADES_ADD,
	REJECTED_TRADES_REMOVE,
	CLOSED_TRADES_SET,
	CLOSED_TRADES_ADD,
	CLOSED_TRADES_REMOVE,
	TRADES_ERROR 
} from '../actions';

const INITIAL_STATE = {
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
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case OPEN_TRADES_SET: {
			return {
				...state,
				open: action.open
			}
		}
		case OPEN_TRADES_ADD: {
			return {
				...state,
				open: {
					...state.open,
					buyer: [...state.open.buyer, action.trade]
				}
			}
		}
		case OPEN_TRADES_REMOVE: {
			return {
				...state,
				open: {
					buyer: state.open.buyer.filter(trade => trade.buyer.postId !== action.buyer.postId),
				}
			}
		}
		case ACCEPTED_TRADES_SET: {
			return {
				...state,
				accepted: action.accepted
			}
		}
		case ACCEPTED_TRADES_ADD: {
			return {
				...state,
				accepted: {
					...state.accepted,
					buyer: [...state.accepted.buyer, action.trade]
				}
			}
		}
		case ACCEPTED_TRADES_REMOVE: {
			return {
				...state,
				accepted: {
					buyer: state.accepted.buyer.filter(trade => trade.buyer.postId !== action.buyer.postId),
				}
			}
		}
        case REJECTED_TRADES_SET: {
			return {
				...state,
				rejected: action.rejected
			}
		}
		case REJECTED_TRADES_ADD: {
			return {
				...state,
				rejected: {
					...state.rejected,
					buyer: [...state.rejected.buyer, action.trade]
				}
			}
		}
		case REJECTED_TRADES_REMOVE: {
			return {
				...state,
				rejected: {
					buyer: state.rejected.buyer.filter(trade => trade.buyer.postId !== action.buyer.postId),
				}
			}
		}
        case CLOSED_TRADES_SET: {
			return {
				...state,
				closed: action.closed
			}
		}
		case CLOSED_TRADES_ADD: {
			return {
				...state,
				closed: {
					...state.closed,
					buyer: [...state.closed.buyer, action.trade]
				}
			}
		}
		case CLOSED_TRADES_REMOVE: {
			return {
				...state,
				closed: {
					buyer: state.closed.buyer.filter(trade => trade.buyer.postId !== action.buyer.postId),
				}
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