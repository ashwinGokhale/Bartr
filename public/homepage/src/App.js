import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: 'Search...'
    };
  }
  
  updateSearch(event) {
    this.setState({search: event.target.value.substr(0,20)});
  }

  render() {
    return (
      <div className="searchBar">
        <ul>
        
        </ul>
        <input type="text" value={this.state.search}/>
      </div>
    );
  }
}

export default App;