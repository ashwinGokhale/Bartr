import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';

class PostCard extends Component {
    constructor(props) {
        super(props);
        console.log('Post Card props:', this.props);
        this.state = {

        }
    }

    render = () => {
        const { post, userPosts, self } = this.props;
        return (
            <div>
                <label><strong>Title</strong></label>
                <label>{post.title}</label><br/>

                <label><strong>Description</strong></label>
                <label>{post.description}</label><br/>

                <label><strong>Type</strong></label>
                <label>{post.type == 'good' ? 'Good' : 'Service'}</label><br/>

                <label><strong>Created By:</strong></label>
                <Link to={`/user/${post.userId}`}><label>{post.displayName}</label></Link><br/>

                <label><strong>Created On:</strong></label>
                <label>{new Date(post.createdAt).toDateString()}</label><br/>

                <label><strong>Tags</strong></label>
                { post.tags.map((tag, i) => [<label key={i}>{tag} </label>])} <br/>


                <label><strong>Photos</strong></label>
                { post.photoUrls.map((url, i) => [<img style={{maxWidth:'8vw',maxHeight: '15vw'}} key={i} src={url} alt={`photo${i}`} />])} <br/>

                {
                    !self &&
                    <div>
                        <h3>Make an Offer</h3>
                        <select>
                            {userPosts.map((userPost, i) => <option key={i} value={userPost.postId} >{userPost.title}</option>)}
                        </select>
                    </div>
                    
                }
            </div>
        );
    }
    
}

const mapStateToProps = (state) => ({
    userPosts: state.postsState.userPosts,
});
  
export default compose(
    withAuthorization((authUser) => !!authUser),
    connect(null, null)
)(PostCard);