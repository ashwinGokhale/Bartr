import React, { Component } from 'react';
import { createRating } from '../../actions';
import './rating.css';

export default class Rating extends Component {
	starHandler = (e, num) => {
		console.log('Value:', e.target.value);
		console.log('Num:', num);
	}

  render() {
	return (
		<fieldset className="rating">
			{[1,2,3,4,5].map(num => [
				<input
					onClick={e => this.starHandler(e, num)}
					type="radio"
					id={`star${num}`}
					name="rating"
					value={num}
				/>,
				<label 
					className="full" 
					for={`star${num}`}
				/>,
				<input 
					onClick={e => this.starHandler(e, num-0.5)} 
					type="radio" 
					id={`star${num}half`}
					name="rating" value={`${num} and a half`}/>,
				<label 
					className="half" 
					for={`star${num}half`}
					title="Pretty good - 4.5 stars">
				</label>
			])}
		</fieldset>
	)
  }
}
