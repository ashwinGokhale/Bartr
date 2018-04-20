import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { acceptTrade, rejectTrade, closeTrade } from '../../actions';
import PostItem from './PostItem';

class TradeItem extends Component {
	// TODO: Add ability for posts to display more pictures
	onSubmit = async e => {
		e.preventDefault();
		const { id } = e.target;
		console.log('ID:', id);
		if (id === 'ACCEPT') {
			const data = await this.props.acceptTrade(this.props.trade.id);
			console.log('Just accepted offer:', data);
		}
		else if (id === 'REJECT') {
			const data = await this.props.rejectTrade(this.props.trade.id);
			console.log('Just rejected offer:', data);
		}
		else if (id === 'CLOSE') {
			const data = await this.props.closeTrade(this.props.trade.id);
			console.log('Just closed offer:', data);
		}
	}

	render() {
		const { trade, seller } = this.props;
		const tradeType = trade.state;
		console.log('Trade item props:', this.props);
		return (
			<div className="tradePage tradePageTop">
				<PostItem post={trade.seller.post}/>
                <div className="tradeFor">
					<h3 className="tradeForBetween">For</h3>
				</div>
                <PostItem post={trade.buyer.post}/>
				{
					seller && tradeType === 'OPEN' &&
					<span>
						<input className="tradeButtons" onClick={this.onSubmit} type="button" id="ACCEPT" value="Accept Offer" />
						<input className="tradeButtons" onClick={this.onSubmit} type="button" id="REJECT" value="Reject Offer" />
					</span>
				}
				{
					((seller && !trade.seller.closed) || (!seller && !trade.buyer.closed)) &&
					tradeType === 'ACCEPTED' &&
					<input onClick={this.onSubmit} type="button" id="CLOSE" value="Close Trade" />
				}
				<br/><hr/>
			</div>
		)
	}
}

export default compose(
	connect(null, { acceptTrade, rejectTrade, closeTrade })
)(TradeItem);
