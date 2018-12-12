import React, { Component } from "react";
var Parse = require('parse').Parse;

export default class UserEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    addItem(event) {
        let currentItems = this.state.items;
        let textBox = event.target.previousElementSibling;

        if (textBox.value) {
            currentItems.push(textBox.value);
            textBox.value = '';

            this.setState({
                items: currentItems
            });
        }
    }

    removeItem(event) {
        let currentItem = event.target.textContent;
        let updatedItems = this.state.items.filter((item) => {
            return currentItem !== item;
        });

        this.setState({
            items: updatedItems
        });
        alert("Item successfully deleted")
    }

    render() {
        let items = this.state.items.map((item, i) => {
            return <li onClick={this.removeItem.bind(this)}
                key={"Item" + i}>{item}</li>;
        });

        return (
            <div className="items-list">
                <ul>
                    {items}
                </ul>
                <nav className="nav-add">
                    <input type="text" id="input-add" />
                    <button id="new-item"
                        onClick={this.addItem.bind(this)}>New Item</button>
                </nav>
            </div>
        );
    }
}