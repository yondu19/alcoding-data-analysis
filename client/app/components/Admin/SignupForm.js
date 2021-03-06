import React, { Component } from 'react';
import axios from 'axios';

class SignupForm extends Component {
	constructor() {
		super();
    this.handleSubmitStudents = this.handleSubmitStudents.bind(this);
		this.handleSubmitContenders = this.handleSubmitContenders.bind(this);    
    this.handleDownload = this.handleDownload.bind(this);    
		this.fileInput = React.createRef();
	}

	handleSubmitStudents(event) {
		event.preventDefault();
		var fileObj = this.fileInput.current.files[0];
		var token = 'Bearer ' + localStorage.getItem('token');
		var configSignup = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': token
			}
		};
		var signUpUrl = '/api/admin/signup';
		const NO_OF_MANDATORY_FIELDS = 3; //NUMBER OF FIELDS MANDATORY FOR SIGNUP.
		var reader = new FileReader();
		reader.onload = function (file) {
			var data = file.target.result.split('\n');
			var row, invalid, attributes,count;
			for (var row_count = 0; row_count < data.length; row_count++) {
				row = data[row_count];
				invalid = 0;
				attributes = row.split(',');
				for (count = 0; count < NO_OF_MANDATORY_FIELDS; count++) {
					if (attributes[count] == "") { invalid = 1; }
				};//to check cases where there are blank fields for each user
				if (!invalid) {
					var body = "firstName=" + attributes[0];
					body += '&email=' + attributes[1];
					body += '&usn=' + attributes[2];

					axios.post(signUpUrl, body, configSignup)
						.then(function (response) {
						    console.log(response.data);
						 })
						.catch(function (err) {
						    console.log(err);
						 })
				}
				else {
					console.log("error at user: " + attributes);
				}
			}
		}
		
		if (fileObj) {
			reader.readAsText(fileObj, "UTF-8");
		}
		else { console.log('Please Upload a file!'); }
  }
  
  handleSubmitContenders(event) {
		event.preventDefault();
		var fileObj = this.fileInput.current.files[0];
		var token = 'Bearer ' + localStorage.getItem('token');
		var configSignup = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': token
			}
		};
		var signUpUrl = '/api/contests/updateContenders';
		var reader = new FileReader();
		reader.onload = function (file) {
      var data = JSON.parse(file.target.result);
      for(var key in data) {
        // console.log(key + " -> " + data[key]);
        var body = "usn=" + key;
        body += "&name=" + data[key].name;
        body += "&email=" + data[key].email;
        body += "&rating=" + data[key].rating; 
        body += "&volatility=" + data[key].volatility; 
        body += "&timesPlayed=" + data[key].timesPlayed; 
        body += "&lastFive=" + data[key].lastFive; 
        body += "&best=" + data[key].best; 
        body += "&codejam=" + data[key].codejam; 
        body += "&hackerearth=" + data[key].hackerearth;

        axios.post(signUpUrl, body, configSignup)
						.then(function (response) {
						    console.log(response.data);
						 })
						.catch(function (err) {
						    console.log(err);
						 })
      }
		}
		
		if (fileObj) {
			reader.readAsText(fileObj, "UTF-8");
		}
		else { console.log('Please Upload a file!'); }
  }
  
  handleDownload(event){
		event.preventDefault();

  }

	render() {
		return (
			<div className='container-fluid'>
				<h3>Upload Student Details: </h3>
				<form id="formObject">
					<span>Please upload a .csv file</span>
					<input type="file" className="btn btn-default form-control" ref={this.fileInput} />
					<br />
					<button type="submit" className="btn btn-dark form-control col-2" onClick={this.handleSubmitStudents}>Submit</button>
				</form>
        <br />
        <h3>Upload/Download Contender Details: </h3>
				<form id="formObject">
					<span>Please upload a .json file</span>
					<input type="file" className="btn btn-default form-control" ref={this.fileInput} />
					<br />
					<button type="submit" className="btn btn-dark form-control col-2" onClick={this.handleSubmitContenders}>Submit</button> &nbsp;
					<button type="submit" className="btn btn-dark form-control col-2" onClick={this.handleDownload}>Download</button>
				</form>
			</div>
		);
	}
}

export default SignupForm;
