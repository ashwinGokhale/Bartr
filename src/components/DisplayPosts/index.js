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
    const currentPosts = this.state.posts.map((posts, i) =>
    <div key={i} className="makePost">
      <img className="image" src={posts.photoUrls} alt="goodsForGoods.png"></img>
      <br></br>
      Title: {posts.title}
      <br></br>
      Tags: {posts.tags}
      <br></br>
      Description: {posts.description}      
      <br></br>
      <br></br>
    </div>
   )
    return (
      <div id="div1" className="textfieldSupport">
          <ol>
              {currentPosts}
          </ol>
      </div>
    )
  }
}

export default compose (
  withRouter,
  withAuthorization((authUser) => !!authUser)
)(DisplayPosts);