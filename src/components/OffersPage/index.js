import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_POST } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import TradeItem from '../Common/TradeItem';
import { fetchOffers } from '../../actions';

class OffersPage extends Component {
  componentDidMount = async () => {
    const data = await this.props.fetchOffers();
    console.log('Offers Page received trades:', data);
  }

  render() {
    console.log('Offers Page props', this.props);
    return (
      <div>
        <h3>Sent Offers:</h3>
        { this.props.open.buyer.length ? this.props.open.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h3>Recieved Offers:</h3>
        { this.props.open.seller.length ? this.props.open.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
        <h3>Your Accepted Trades:</h3>
        { this.props.accepted.buyer.length ? this.props.accepted.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h3>Recieved Accepted Trades:</h3>
        { this.props.accepted.seller.length ? this.props.accepted.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
        <h3>Your Closed Trades:</h3>
        { this.props.closed.buyer.length ? this.props.closed.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h3>Recieved Closed Trades:</h3>
        { this.props.closed.seller.length ? this.props.closed.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.tradesState
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchOffers })
)(OffersPage);
