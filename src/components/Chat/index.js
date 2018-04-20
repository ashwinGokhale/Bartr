import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import firebase from 'firebase';
import withAuthorization from '../Session/withAuthorization';
import { fetchDBUser } from '../../actions';

import './chat.css'

class Chat extends Component {

    constructor(props, context) {
        super(props, context)
        let { dbUser } = this.props;
        this.state = {
            messages: [],
            uname: '',
            usersAr: [],
            myMessage: '',
            selectValue: dbUser.displayName,
            displayName: ''
        }
    }


    getAllUserNames = async () => {
        const users = await firebase.firestore().collection("users").get();
        users.forEach(data => this.setState({usersAr: [...this.state.usersAr, data.data().displayName]}));  
    }


    componentDidMount = async () => {
        console.log('component mounted');
        await this.getAllUserNames();
        const { dbUser } = this.props;
        this.setState({
            displayName: dbUser.displayName
        });

        this.interval = setInterval(this.getMessage, 1000);
    }


    updateWhoChat = (e) => {
        this.setState({selectValue: e.target.value})
        document.getElementById('dropDown').key=e.target.value;
    }

    updateMessage = (e) => this.setState({myMessage: e.target.value});

    changeSelect = () => {
        console.log("Chat selected");
        this.setState({
            messages: []
        });
        this.getMessage();
    }


    getMessage = () => {
        if(this.state.displayName != null && this.state.selectValue != null) {
            var docName;
            if(this.state.selectValue > this.state.displayName) {
                docName = this.state.selectValue.toString().replace(/\s+/g, '') + "_" + this.state.displayName.toString().replace(/\s+/g, '');
            } else {
                docName = this.state.displayName.toString().replace(/\s+/g, '') + "_" + this.state.selectValue.toString().replace(/\s+/g, '');
            }
        }
    }

    submitMessage = (name) => {
        if (this.state.displayName != null && this.state.selectValue != null) {
            var data = {
                displayName: this.state.displayName,
                message: this.state.myMessage,
                date: Date.now()
            }
            var docName;
            if (this.state.selectValue > this.state.displayName) {
                docName = this.state.selectValue.toString().replace(/\s+/g, '') + "_" + this.state.displayName.toString().replace(/\s+/g, '');
            } else {
                docName = this.state.displayName.toString().replace(/\s+/g, '') + "_" + this.state.selectValue.toString().replace(/\s+/g, '');
            }
            var checkDoc = firebase.firestore().collection("chat").doc(docName);

            checkDoc.get()
                .then((docSnapshot) => {
                    if (!docSnapshot.empty) {
                        checkDoc.onSnapshot((doc) => {
                            checkDoc.collection("messages").doc().set(data);
                        });
                    } else {
                        firebase.firestore().collection("chat").doc(docName).collection("messages").doc().set(data);
                    }
                });
            this.changeSelect();
        }
    }

    render = () => {
        let dataUI = this.state.usersAr;
        const currentMessage = <div id="div1" className="scrollBox">{this.state.messages.map((message, i) => {
            if (message.toString().startsWith(this.state.displayName)) {
                return <div className="container">
                    <p key={i}>{message}</p>
                </div>
            } else {
                return <div className="container darker">
                    <p key={i}>{message}</p>
                </div>
            }
        }

        )}</div>


        const curUsers = <select id="dropDown" onChange={this.updateWhoChat}>{dataUI.map((users, j) =>
        <option key={users}>{users}</option>)}</select>

        return (
            <div className="chatBox">
                <div className="whiteBox">

                    <div className="chatBoxFormat">
                        <div className="centerChatHeader">
                            <h1>Chat App</h1>
                        </div>
                        {curUsers}
                        <button className="chatSelect" onClick={this.changeSelect}>Chat</ button>
                        <br />
                        {currentMessage}
                        <br />
                        <input onChange={this.updateMessage} type="text" placeholder="myMessage" />
                        <br />
                        <button className="centerChatButton" onClick={this.submitMessage}>Submit Message</button>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dbUser: state.sessionState.dbUser
});

export default compose(
    withAuthorization(),
    connect(mapStateToProps, { fetchDBUser })
)(Chat);