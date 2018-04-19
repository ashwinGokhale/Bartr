import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { acceptOffer, rejectOffer } from '../../actions';
import PostItem from './PostItem';

class TradeItem extends Component {
	// TODO: Add ability for posts to display more pictures
	onSubmit = async e => {
		e.preventDefault();
		const { id } = e.target;
		console.log('ID:', id);
		if (id === 'ACCEPT') {
			const data = await this.props.acceptOffer(this.props.trade.id);
			console.log('Just accepted offer:', data);
		}
		else if (id === 'REJECT') {
			const data = await this.props.rejectOffer(this.props.trade.id);
			console.log('Just rejected offer:', data);
		}
	}

	render() {
		const { trade, seller } = this.props;
		const tradeType = trade.state;
		console.log('Trade item props:', this.props);
		return (
			<div>
				<PostItem post={trade.seller.post}/>
                <label><strong>For</strong></label>
                <PostItem post={trade.buyer.post}/>
				{
					seller && tradeType === 'OPEN' &&
					<span>
						<input onClick={this.onSubmit} type="button" id="ACCEPT" value="Accept Offer" />
						<input onClick={this.onSubmit} type="button" id="REJECT" value="Reject Offer" />
					</span>
				}
				{/* {
					seller && tradeType === 'OPEN' &&
					<input onClick={this.onSubmit} type="button" id="REJECT" value="Reject Offer" />
				} */}
				<br/><hr/>
			</div>
		)
	}
}

export default compose(
	connect(null, { acceptOffer, rejectOffer })
)(TradeItem);
