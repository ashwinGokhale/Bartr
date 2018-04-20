import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_POST } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import TradeItem from '../Common/TradeItem';
import { fetchTrades } from '../../actions';

class TradesPage extends Component {
  componentDidMount = async () => {
    const data = await this.props.fetchTrades();
    console.log('Trades Page received trades:', data);
  }

  render() {
    console.log('Trades Page props', this.props);
    return (
      <div className="tradePage tradePageBottom">
        <h2 style={{'margin': '0', 'color':'rgb(50, 63, 78)', 'font-size': '2vw'}}>Sent Offers</h2>
        { this.props.open.buyer.length ? this.props.open.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h2 className="tradePageTitles">Recieved Offers</h2>
        { this.props.open.seller.length ? this.props.open.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
        <h2 className="tradePageTitles">Your Accepted Trades</h2>
        { this.props.accepted.buyer.length ? this.props.accepted.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h2 className="tradePageTitles">Recieved Accepted Trades</h2>
        { this.props.accepted.seller.length ? this.props.accepted.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
        <h2 className="tradePageTitles">Your Closed Trades</h2>
        { this.props.closed.buyer.length ? this.props.closed.buyer.map((trade, i) => <TradeItem key={i} trade={trade} />) : <div>None</div> }
        <h2 className="tradePageTitles">Recieved Closed Trades</h2>
        { this.props.closed.seller.length ? this.props.closed.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
        <h3>Completed Trades:</h3>
        { this.props.completed.length ? this.props.completed.seller.map((trade, i) => <TradeItem key={i} seller trade={trade} />) : <div>None</div> }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.tradesState
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchTrades })
)(TradesPage);
