import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import firebase from 'firebase';
import withAuthorization from '../Session/withAuthorization';

class Chat extends Component{

    constructor(props, context){
        super(props, context)
        this.updateMessage = this.updateMessage.bind(this)
        this.submitMessage = this.submitMessage.bind(this)
        this.updateName = this.updateName.bind(this)
        this.state={
            message:'',
            messages: [],
            uname:''
        }
    }

  
    componentDidMount(){
            console.log('component mounted');
            firebase.database().ref('messages/').on('value', (snapshot) => {
                const currentMessages = snapshot.val()
                if(currentMessages != null){
                    this.setState({
                        messages: currentMessages
                    })
                }
            })
    }

    updateMessage(event){
        this.setState({
            message: event.target.value
        })
    }

    updateName(event){
        this.setState({
            uname: event.target.value
        })
    }

    submitMessage(event){
        console.log('submitMessage: '+this.state.message);
        const nextMessage = {
            id: this.state.messages.length,
            text: this.state.message,
            uname: this.state.uname
        }
        firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
    }

    render(){
        const currentMessage = this.state.messages.map((message, i) =>
            <p key={i}>{message.uname}: {message.text}</p>
        )

        return (
            <div>
                <h1>Chat App</h1>
                <ol>
                    {currentMessage}
                </ol>
                <input onChange={this.updateName} type="text" placeholder="uname" />
                <br />
                <input onChange={this.updateMessage} type="text" placeholder="Message" />
                <br />
                <button onClick={this.submitMessage}>Submit Message</button>
            </div>
        )   
    }
}

export default compose (
    withAuthorization((authUser) => !!authUser)
)(Chat);