import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import firebase from 'firebase';
import withAuthorization from '../Session/withAuthorization';
import { fetchDBUser } from '../../actions';

import './chat.css'

class Chat extends Component{

    constructor(props, context){
        super(props, context)
        let { dbUser } = this.props;
        this.getMessage = this.getMessage.bind(this)
        this.getAllUserNames = this.getAllUserNames.bind(this)
        this.updateWhoChat = this.updateWhoChat.bind(this)
        this.updateMessage = this.updateMessage.bind(this)
        this.submitMessage = this.submitMessage.bind(this)
        this.changeSelect = this.changeSelect.bind(this)
        this.state={
            messages: [],
            uname:'',
            usersAr: [],
            myMessage:'',
            selectValue: dbUser.displayName,
            displayName:''
        }
    }


    getAllUserNames(){
        var doc = firebase.firestore().collection("users")
        .get()
        .then(snapshot => {
            snapshot.forEach(data => {
                if(data.data().displayName != this.state.displayName){
                    var joined = this.state.usersAr.concat(data.data().displayName);
                    this.setState({
                        usersAr: joined
                    })       
                }         
            })
        });
    }

  
    componentDidMount(){
            console.log('component mounted');
            this.getAllUserNames();
            const { dbUser } = this.props;
            this.setState({
                displayName: dbUser.displayName
            })

            this.interval = setInterval(this.getMessage, 1000);
    }

    updateWhoChat(e){
        this.setState({selectValue: e.target.value})
        document.getElementById('dropDown').key=e.target.value;
    }

    updateMessage(event){
        this.setState({
            myMessage: event.target.value
        })
    }

    changeSelect(){
        console.log("Chat selected");
        this.setState({
            messages: []
        })
        this.getMessage()
    }

    getMessage(){
      if(this.state.displayName != null && this.state.selectValue != null){
          var docName;
        if(this.state.selectValue > this.state.displayName){
            docName = this.state.selectValue.toString().replace(/\s+/g, '') + "_" + this.state.displayName.toString().replace(/\s+/g, '');
        }else{
            docName = this.state.displayName.toString().replace(/\s+/g, '') + "_" + this.state.selectValue.toString().replace(/\s+/g, '');
        }
        var checkDoc = firebase.firestore().collection("chat").doc(docName).collection("messages");

       checkDoc.orderBy('date').get()
       .then((querySnapshot) => {
           if (!querySnapshot.empty) {
                this.setState({
                    messages: []
                })
    
                querySnapshot.forEach(data => {
                var newMessage = data.data().displayName + ": " + data.data().message;
                var joined = this.state.messages.concat(newMessage);
                this.setState({
                    messages: joined
                })  
             });
           } 
       });
    }
  }

    submitMessage(name){
        if(this.state.displayName != null && this.state.selectValue != null){
        var data = {
            displayName: this.state.displayName,
            message: this.state.myMessage,
            date: Date.now()
        }
        var docName;
        if(this.state.selectValue > this.state.displayName){
            docName = this.state.selectValue.toString().replace(/\s+/g, '') + "_" + this.state.displayName.toString().replace(/\s+/g, '');
        }else{
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

    render(){
        let dataUI = this.state.usersAr;
        const currentMessage = <div id="div1" className="scrollBox">{this.state.messages.map((message, i) =>
            {
                if(message.toString().startsWith(this.state.displayName)){
                    return <div className="container">
                     <p key={i}>{message}</p>
                    </div>
                }else{
                    return <div className="container darker">
                    <p key={i}>{message}</p>
                    </div>
                }
            }
            
        )}</div>

        const curUsers = <select id="dropDown" onChange={this.updateWhoChat}>{dataUI.map((users, j) =>
        <option key={users}>{users}</option>)}</select>

        return (
            <div className="chatBoxFormat">
                <h1>Chat App</h1>
                {curUsers}
                <button onClick={this.changeSelect}>Chat</ button>
                <br />
                {currentMessage}
                <br />
                <input onChange={this.updateMessage} type="text" placeholder="myMessage" />
                <br />
                <button onClick={this.submitMessage}>Submit Message</button>
            </div>
        )   
    }
}

const mapStateToProps = (state) => ({
    dbUser: state.sessionState.dbUser
});

export default compose (
    withAuthorization((authUser) => !!authUser),
    connect(mapStateToProps, { fetchDBUser })
)(Chat);