import React, { Component } from "react";
var Parse = require('parse').Parse;

export default class UserEvent extends Component {
    constructor(props) {
        super(props);

        var Events = Parse.Object.extend("Event");
        var query = new Parse.Query(Events);
        query.equalTo("Owner", Parse.User.current());
        let eventList = Parse.User.current().get("eventList") === undefined ? [] : Parse.User.current().get("eventList");

        this.state = {
            events: eventList,
            eventNames: []
        }

        query.find().then((results) => {
        	for (let i = 0; i < results.length; i++) {
        		let tmp = this.state.eventNames;
        		let obj = results[i].get("eventName");
        		tmp.push(obj);
        		this.setState({ eventNames: tmp });
        	}
        });
    }

    addEvent(event) {
        let currentEvents = this.state.events;
        let currentEventNames = this.state.eventNames;
        let textBox = event.target.previousElementSibling;

        if (textBox.value) {
        	const Event = Parse.Object.extend("Event");
        	const event = new Event();
        	var currentUser = Parse.User.current();

	        event.set("eventName", textBox.value);
	        event.set("Owner", Parse.User.current());

	        event.save().then((event) => {
	           	currentEventNames.push(textBox.value);
	           	currentEvents.push(event);
	            textBox.value = '';
	            	
	            currentUser.set("eventList", this.state.events);
	            currentUser.save().then((finish) => {
	            	alert("Event correctly created");
	            	this.setState({
		            	eventNames: currentEventNames,
		            	events: currentEvents
	            	});
		        });
	        }, (error) => {
	            alert("Error : failed to create event");
	        });        
	    }
    }

    removeEvent(event) {
        let currentEvent = event.target.textContent;
        let updatedEvents = this.state.events.filter((event) => {
            return currentEvent !== event;
        });

        this.setState({
            events: updatedEvents
        });
        alert("event successfully deleted")
    }

    goToEvent(event) {

    }

    render() {
        let events = this.state.eventNames.map((event, i) => {
            return <li>{event}</li>;
        });

        return (
            <div className="events-list">
                <ul>
                    {events}
                </ul>
                <nav className="nav-add">
                    <input type="text" id="input-add" />
                    <button id="new-event"
                        onClick={this.addEvent.bind(this)}>Add Event</button>
                </nav>
            </div>
        );
    }
}