import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import LoaderButton from "../components/LoaderButton";

var Parse = require('parse').Parse;

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			email: "",
			passwd: ""
		};
	}

	validateForm() {
		return this.state.email.length > 0 && this.state.passwd.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({ isLoading: true });

		try {
			const user = await Parse.User.logIn(this.state.email, this.state.passwd);
			this.props.userHasAuthenticated(true);
			this.props.history.push("/");
		} catch (e) {
			alert(e.message);
		}
	}

	render() {
		return (
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="email" bsSize="large">
						<ControlLabel>Email</ControlLabel>
						<FormControl
						autofocus
						type="email"
						value={this.state.email}
						onChange={this.handleChange}
						/>
					</FormGroup>
					<FormGroup controlId="passwd" bsSize="large">
						<ControlLabel>Password</ControlLabel>
						<FormControl
						value={this.state.passwd}
						onChange={this.handleChange}
						type="Password"
						/>
					</FormGroup>
					<LoaderButton
						block
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={this.state.isLoading}
						text="Login"
						loadingText="Logging in…"
					/>
				</form>
			</div>
		);
	}
}