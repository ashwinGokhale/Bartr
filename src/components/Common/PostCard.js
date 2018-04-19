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
        this.state = {
            postId: (this.props.userPosts && this.props.userPosts.length) ? this.props.userPosts[0].postId : '',
            error: null
        }
    }

    onSubmit = async e => {
        const url = `/trades/${this.props.post.postId}-${this.state.postId}`;
        console.log(`Making trade on /trades/${this.props.post.postId}-${this.state.postId}`);
        const data = await createOffer(this.props.post.postId, this.state.postId);
        console.log('Data:', data);
        if (data.error) this.setState({error: data.error});
        else this.props.history.push(routes.OFFERS);
    }


    render = () => {
        const { post, userPosts, self } = this.props;
        return (
            <div className="postCardShiftDown">
                <div className="postCardLeft">
                    <div className="postCardInfoRow round">
                        <h3 className="postCardTitles">Title</h3>
                        <label>{post.title}</label><br/>

                        <h3 className="postCardTitles">Description</h3>
                        <label>{post.description}</label><br/>

                        <h3 className="postCardTitles">Type</h3>
                        <label>{post.type === 'good' ? 'Good' : 'Service'}</label><br/>

                        <h3 className="postCardTitles">Created By</h3>
                        <Link to={`/user/${post.userId}`}><label>{post.displayName}</label></Link><br/>

                        <h3 className="postCardTitles">Created On</h3>
                        <label>{new Date(post.createdAt).toDateString()}</label><br/>

                        <h3 className="postCardTitles">Tags</h3>
                        { post.tags.map((tag, i) => [<label key={i}>{tag} </label>])} <br/>
                    </div>
                    <div className="postCardSubmitRow round">
                        {
                            !self &&
                            <div>
                                <h3 className="floatLeft offerTitle" >Make an Offer:</h3>
                                <select className="floatLeft offerDropDown" onChange={e => this.setState({postId: e.target.value})}>
                                {userPosts.map((userPost, i) => <option key={i} value={userPost.postId} >{userPost.title}</option>)}
                                </select>
                                <input className="postCardSubmit" type='submit' name='submit' value='Submit' onClick={this.onSubmit} />
                            </div>
                        }

                        { !!this.state.error ? <p className="warning" style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }   
                    </div>
                </div>
                <div className="postCardRight">
                    <div className="postCardPhotosColumn round">
                        <div className="postCardPhotosTitle">
                            <h3 className="centerTitle">Photos</h3>
                        </div>
                        <div className="postCardPhotosScroll">
                            { post.photoUrls.map((url, i) => [<img className="centerImage" style={{maxWidth:'15vw',maxHeight: '23vw'}} key={i} src={url} alt={`postPhoto${i}`} />])} <br/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = (state) => ({
	...state.sessionState.dbUser,
	userPostsError: state.postsState.userPostsError
});

export default compose(
  	withAuthorization(),
	connect(mapStateToProps, { createOffer })
)(PostCard);