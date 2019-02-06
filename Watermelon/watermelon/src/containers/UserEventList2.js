import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { HelpBlock, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoaderButton from "../components/LoaderButton";

var Parse = require('parse').Parse;

export default class UserEventList extends Component {
    constructor(props) {
        super(props);

        var Events = Parse.Object.extend("Event");
        var query = new Parse.Query(Events);
        query.equalTo("Owner", Parse.User.current());

        this.state = {
            eventSeeds: [],
            eventNames: [],
            name: "",
            items: [],
            isLoading: false,
            modifyingEvent: false,
            modifyingEventSeed: ""
        }

        query.find().then((results) => {
            for (let i = 0; i < results.length; i++) {
                let names = this.state.eventNames;
                let seeds = this.state.eventSeeds;
                let obj = results[i].get("eventName");
                let seed = results[i].id;
                names.push(obj);
                seeds.push(seed);
                this.setState({ eventNames: names, eventSeeds: seeds });
            }
        });
    }

    goBack() {
        this.setState({ modifyingEvent: false, modifyingEventSeed: "", items: [] });
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    onChange = date => {
        this.setState({ dateStart: date });
    }

    addEvent = (event) => {
        this.setState({ modifyingEvent: true });
    }

    checkEvent(eventSeed) {
        this.setState({ modifyingEvent: true, modifyingEventSeed: eventSeed });
    }

    addBring = (event) => {
    }

    addDonation = (event) => {
    }

    renderForm() {
        let itemNameList = [];
        let itemQuantityList = [];
        let itemGiveList = [];
        let itemBringList = [];
        let dateStart = new Date();
        let eventName = "";

        var Items = Parse.Object.extend("Item");
        var itemQuery = new Parse.Query(Items);
        itemQuery.equalTo("RelatedTo", this.state.modifyingEventSeed);

        itemQuery.find().then((results) => {
            for (let i = 0; i < results.length; i++) {
                itemNameList.push(results[i].get("name"));
                itemQuantityList.push(results[i].get("quantity"));
                itemGiveList.push(results[i].get("give"));
                itemBringList.push(results[i].get("bring"));
            }
        });

        var Event = Parse.Object.extend("Event");
        var eventQuery = new Parse.Query(Event);
        eventQuery.equalTo("objectId", this.state.modifyingEventSeed);
        eventQuery.find().then((result) => {
            if (result.length != 1) {
                alert("error");
            }
            else {
                dateStart = result[0].get("dateEvent");
                eventName = result[0].get("eventName");
            }
        });

        let items = itemNameList.map((item, i) => {
            return <li>
                    <label>
                        { itemNameList[i] }
                    </label>
                    <label>
                        <input readOnly type="text" name="quantity" value={ itemQuantityList[i] } />
                    </label>
                    <label>
                        <input readOnly type="text" name="bring" value={ itemBringList[i] } />
                        <button onClick={this.addBring}>Bring it</button>
                    </label>
                    <label>
                        <input readOnly type="text" name="donate" value={ itemGiveList[i] } />
                        <button onClick={this.addDonation}>Donate</button>
                    </label>
                </li>;
        });

        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Event Name</ControlLabel>
                    <FormControl
                        value={eventName}
                        onChange={this.handleChange}
                        type="text"
                    />
                </FormGroup>
                <FormGroup controlId="dateStart" bsSize="large">
                    <ControlLabel>Start</ControlLabel>
                    <DatePicker
                        selected={dateStart}
                        onChange={this.onChange}
                        shouldCloseOnSelect={true}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                </FormGroup>
                <FormGroup controlId="items" bsSize="small">
                    { items }
                </FormGroup>
                <li>
                    <label>
                        <input type="text" name="name" value="" />
                    </label>
                    <label>
                        <input type="text" name="quantity" value="0" />
                    </label>
                    <label>
                        <input type="text" name="bring" value="None" />
                        <button onClick={this.addBring}>Bring it</button>
                    </label>
                    <label>
                        <input type="text" name="donate" value="None" />
                        <button onClick={this.addDonation}>Donate</button>
                    </label>
                </li>
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

    renderList() {
        let events = this.state.eventNames.map((event, i) => {
            return <li onClick={() => this.checkEvent(this.state.eventSeeds[i])}>{event}</li>;
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

    render() {
        return (
            <div className="events-list">
                {
                    this.state.modifyingEvent === false ? this.renderList() : this.renderForm()
                }
            </div>
        )
    }
}