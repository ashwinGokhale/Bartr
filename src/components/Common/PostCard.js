import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createOffer } from '../../actions';
import * as routes from '../../constants';
import withAuthorization from '../Session/withAuthorization';

class PostCard extends Component {
    constructor(props) {
        super(props);
        console.log('Post Card props:', this.props);
        const userPosts = 
            (this.props.userPosts && this.props.userPosts.length) ? 
            this.props.userPosts.filter(post => !this.props.offers.find(trade => post.postId === trade.buyer.postId)) : 
            []
        
        console.log('Post Card userPosts:', userPosts);
        this.state = {
            userPosts,
            postId: (userPosts && userPosts.length) ? userPosts[0].postId : '',
            error: null
        }
    }

    onSubmit = async e => {
        if (!this.state.postId) return;
        const url = `/trades/${this.props.post.postId}-${this.state.postId}`;
        console.log(`Making trade on /trades/${this.props.post.postId}-${this.state.postId}`);
        const data = await this.props.createOffer(this.props.post.postId, this.state.postId);
        console.log('Data:', data);
        if (data.error) this.setState({error: data.error});
        else this.props.history.push(routes.OFFERS);
    }


    render = () => {
        const { post, self } = this.props;
        const { userPosts } = this.state;
        return (
            <div>
                <label><strong>Title</strong></label>
                <label>{post.title}</label><br/>

                <label><strong>Description</strong></label>
                <label>{post.description}</label><br/>

                <label><strong>Type</strong></label>
                <label>{post.type === 'good' ? 'Good' : 'Service'}</label><br/>

                <label><strong>Created By:</strong></label>
                <Link to={`/user/${post.userId}`}><label>{post.displayName}</label></Link><br/>

                <label><strong>Created On:</strong></label>
                <label>{new Date(post.createdAt).toDateString()}</label><br/>

                <label><strong>Tags</strong></label>
                { post.tags.map((tag, i) => [<label key={i}>{tag} </label>])} <br/>


                <label><strong>Photos</strong></label><br/>
                { post.photoUrls.map((url, i) => [<img style={{maxWidth:'8vw',maxHeight: '15vw'}} key={i} src={url} alt={`postPhoto${i}`} />])} <br/>

                {
                    !self && post.state === 'OPEN' &&
                    <div>
                        <h3>Make an Offer</h3>
                        <select onChange={e => this.setState({postId: e.target.value})}>
                            {
                                userPosts
                                .map((userPost, i) => <option key={i} value={userPost.postId} >{userPost.title}</option>)
                            }
                        </select>
                        <input className="submit" type='submit' name='submit' value='Submit' onClick={this.onSubmit} />
                    </div>
                    
                }

                { !!this.state.error ? <p className="warning" style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }
            </div>
        );
    }
    
}

const mapStateToProps = (state) => ({
    ...state.sessionState.dbUser,
    offers: state.tradesState.open.buyer,
	userPostsError: state.postsState.userPostsError
});

export default compose(
  	withAuthorization(),
	connect(mapStateToProps, { createOffer })
)(PostCard);