import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import {  } from '../../actions';
import PostItem from './PostItem';

class TradeItem extends Component {
	// onClick = (e) => {
	// 	this.props.deletePost(this.props.post.postId);
	// }
	
	// TODO: Add ability for posts to display more pictures
	render() {
		const { trade, type } = this.props;
		console.log('Trade item:', trade);
		return (
			<div>
				<PostItem post={trade.seller.post}/>
                <label><strong>For</strong></label>
                <PostItem post={trade.buyer.post}/>
			</div>
		)
	}
}

export default compose(
	connect(null, { })
)(TradeItem);
