import React, { Component } from "react";
import { HelpBlock, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			email: "",
			passwd: "",
			confirmPasswd: "",
			confirmationCode: "",
			newUser: null
		};
	}

	validateForm() {
		return (this.state.email.length > 0
			&& this.state.passwd.len$ > 0
			&& this.state.passwd === this.state.confirmPasswd);
	}

	validateConfirmationForm() {
		return this.state.confirmationCode.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = event => {
		event.preventDefault();

		this.setState({ isLoading: true });
		this.setState({ newUser: "test" });
		this.setState({ isLoading: false });
	}
}