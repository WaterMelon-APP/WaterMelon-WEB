import React, { Component } from "react";
import { HelpBlock, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
var Parse = require('parse').Parse;

export default class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
      username: "",
			email: "",
			passwd: "",
			confirmPasswd: "",
			confirmationCode: "",
			newUser: null
		};
	}

	validateForm() {
    return (
    	this.state.email.length > 0 &&
    	this.state.passwd.length > 0 &&
    	this.state.passwd === this.state.confirmPasswd
    );
  } 

	validateConfirmationForm() {
		return (this.state.confirmationCode.length > 0);
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();

    this.setState({ isLoading: true });
    var user = new Parse.User();
    user.set("username", this.state.username);
    user.set("email", this.state.email);
    user.set("password", this.state.passwd);
    try {
      await user.signUp();
      this.setState({ newUser: user });
    } catch (error) {
      alert("Error : " + error.code + " " + error.message);
    }
    this.setState({ isLoading: false });
	}

	handleConfirmationSubmit = async event => {
		event.preventDefault();

		this.setState({ isLoading: true });

    try {
      await Parse.User.logIn(this.state.email, this.state.passwd);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (error) {
      alert("Error : " + error.code + " " + error.message);
      this.setState({ isLoading: false });
    }
	}

	renderConfirmationForm() {
		return (
			<form onSubmit={this.handleConfirmationSubmit}>
	  		<FormGroup controlId="confirmationCode" bsSize="large">
	    	<ControlLabel>Confirmation Code</ControlLabel>
	    	<FormControl
	     		autoFocus
	     		type="tel"
	     		value={this.state.confirmationCode}
	     		onChange={this.handleChange}
	    	/>
	    	<HelpBlock>Please check your email for the code.</HelpBlock>
	    	</FormGroup>
	    	<LoaderButton
	    		block
	    		bsSize="large"
	    		disabled={!this.validateConfirmationForm()}
	    		type="submit"
	    		isLoading={this.state.isLoading}
	      	text="Verify"
	      	loadingText="Verifying…"
	    	/>
	    </form>
	  );
	}

	  renderForm() {
	    return (
	      	<form onSubmit={this.handleSubmit}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>UserName</ControlLabel>
              <FormControl
                value={this.state.username}
                onChange={this.handleChange}
                type="text"
              />
            </FormGroup>
		        <FormGroup controlId="email" bsSize="large">
		          <ControlLabel>Email</ControlLabel>
		          <FormControl
		            autoFocus
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
		            type="password"
		          />
		        </FormGroup>
		        <FormGroup controlId="confirmPasswd" bsSize="large">
		          <ControlLabel>Confirm Password</ControlLabel>
		          <FormControl
		            value={this.state.confirmPasswd}
		            onChange={this.handleChange}
		            type="password"
		          />
		        </FormGroup>
		        <LoaderButton
		          block
		          bsSize="large"
		          disabled={!this.validateForm()}
		          type="submit"
		          isLoading={this.state.isLoading}
		          text="Signup"
		          loadingText="Signing up…"
		        />
		    </form>
		);
	}

	render() {
	    return (
	      <div className="Signup">
	        {this.state.newUser === null
	          ? this.renderForm()
	          : this.renderConfirmationForm()}
	      </div>
	    );
	}
}