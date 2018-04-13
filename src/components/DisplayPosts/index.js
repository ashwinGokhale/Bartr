import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { SignOutButton } from '../Common';
import * as routes from '../../constants';
import logo from '../../assets/bartrLogo.png';
import withAuthorization from '../Session/withAuthorization';
import './index.css';

const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(
	'4JI0HWDPVQ',
	'bf4351dbbfa6cea1d6368431735feca1'
);
const index = algolia.initIndex('posts');

class DisplayPosts extends React.Component {

  constructor(props, context){
    super(props, context)
    this.doSearch = this.doSearch.bind(this)
    this.state={
      posts:[]
    }
    this.doSearch();
  }

  doSearch(){
      index.setSettings({
        'searchableAttributes': [
          'title',
          'tags'
        ]
      });

    var fullString = window.location.href;
    var myTag = fullString.split("=");
      
    const results = index.search(myTag[1], {
        "hitsPerPage": "100",
        "analytics": "false",
        "attributesToRetrieve": "*",
        "facets": "[]"
      }).then(res => {
        var i;
        var ar = [];
        for(i = 0; i < res.hits.length; i++){
          //console.log(res.hits[i].description)
          ar.push(res.hits[i])
        }
        this.setState({
          posts: ar
        })
      });
    
    
  }

  render() {  
    {
    const currentPosts = this.state.posts.map((posts, i) =>
      <div key={i} className="placeHolder">
        <div className="postTitle">
          <h3 className="listingTitle">{posts.title}</h3>
        </div>
        <div className="postInfo">
          <div className="postPicture">
            <img className="itemPicture" alt="item/service.png" src={posts.photoUrls}></img>
          </div>
          <div className="postDescription">
            <ul className="descriptionDetails">
              {posts.description}
            </ul>
            <div className="displayPostTags">

            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="displayPostWrapper">
        <div className="displayPostLeft">
          <div className="displayPostFilterCard">
            <center><h3 className="displayPostFilterTitle">Filters</h3></center>
            <hr></hr>
            <div className="filterBox">
              <input className="displayPostCheckbox inlineBlock" type="checkbox"/>
              <p className="displayPostFilterTag inlineBlock">Goods</p>
            </div>
            <div className="filterBox">
              <input className="displayPostCheckbox inlineBlock"type="checkbox"/>
              <p className="displayPostFilterTag inlineBlock">Services</p>
            </div>
          </div>
        </div>
        <div className="displayPostRight">
          <div className="displayPostFeed">
              <div id="div1">
                <div>
                  {currentPosts}
                </div>
              </div>
          </div>
        </div>
      </div>
      )
    }
  }
}

export default compose (
  withRouter,
  withAuthorization((authUser) => !!authUser)
)(DisplayPosts);