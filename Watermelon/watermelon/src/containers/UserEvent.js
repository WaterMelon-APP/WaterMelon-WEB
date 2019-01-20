import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { HelpBlock, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoaderButton from "../components/LoaderButton";

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
            eventNames: [],
            newEvent: false,
            name: "",
            dateStart: new Date(),
            isLoading: false
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

    addEvent = (event) => {
        this.setState({ newEvent: true });
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

    renderRedirect = (idEvent) => {
    	alert(idEvent.id);
    	return <Redirect to='/ItemList' id='$idEvent' />
    }

    handleSubmit = event => {
    	alert("ok1");
    	let currentEvents = this.state.events;
    	let currentEventNames = this.state.eventNames;

    	if (this.state.name) {
    		alert("ok2");
    		const Event = Parse.Object.extend("Event");
    		const event = new Event();
    		var currentUser = Parse.User.current();

    		event.set("eventName", this.state.name);
    		event.set("Owner", currentUser);
    		event.set("dateEvent", this.state.dateStart);
    		alert("ok3");
    		event.save().then((event) => {
    			currentEventNames.push(this.state.name);
    			currentEvents.push(event);

    			currentUser.set("eventList", this.state.events);
    			currentUser.save().then((finish) => {
    				alert("Event correctly created");
    				this.setState({
    					eventNames: currentEventNames,
    					events: currentEvents
    				}, (error) => {
    					alert("ono");
    				});
    			});
    		}, (error) => {
    			alert("Error: failed to create event");
    		});
    	}
    	this.props.history.push("/event");
    }

    handleChange = event => {
    	this.setState({ [event.target.id]: event.target.value });
    }

    onChange = date => {
    	this.setState({ dateStart: date });
    }

    renderList() {
        let events = this.state.eventNames.map((event, i) => {
            return <li onClick={this.renderRedirect.bind(this.state.events[i])}>{event}</li>;
        });

        return (
            <div className="events-list">
                <ul>
                    {events}
                </ul>
                <nav className="nav-add">
                    <button id="new-event"
                        onClick={this.addEvent}>Add Event</button>
                </nav>
            </div>
        );
    }

    renderForm() {
    	return (
    		<form onSubmit={this.handleSubmit}>
               	<FormGroup controlId="name" bsSize="large">
                	<ControlLabel>Event Name</ControlLabel>
                	<FormControl
                		value={this.state.name}
                		onChange={this.handleChange}
                		type="text"
                	/>
                </FormGroup>
                <FormGroup controlId="dateStart" bsSize="large">
                	<ControlLabel>Start</ControlLabel>
                	<DatePicker
                		selected={this.state.dateStart}
                		onChange={this.onChange}
                		shouldCloseOnSelect={true}
                		showTimeSelect
                		dateFormat="Pp"
                	/>
                </FormGroup>
                <LoaderButton
		          block
		          bsSize="large"
		          type="submit"
		          isLoading={this.state.isLoading}
		          text="Create event"
		          loadingText="Creating event…"
		        />
            </form>
    	);
    }

    render() {
    	return (
    		<div className="events-list">
    			{
    				this.state.newEvent === false ? this.renderList() : this.renderForm()
    			}
    		</div>
    	)
    }
}