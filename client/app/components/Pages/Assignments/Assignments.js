import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import AssignmentCard from './AssignmentCard';
class Assignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      role: "student",
      assignments: []
    };
  }
  componentDidMount() {
    var self = this;
    var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');
    
    var apiPath = '/api/account/' + userID + '/details'
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          // TODO: throw appropriate error and redirect
          console.log("Error1: " + response.data);
          return;
        }
        var data = response.data;
        self.setState({
          role: data.user.role
        });
      })
      .catch(function (error) {
        console.log('Error2: ', error);
      });
    var apiPath = '/api/assignments/' + userID + '/courses'
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          // TODO: throw appropriate error and redirect
          console.log("Error1: " + response.data);
          <Redirect to="/" />
        }
        var data = response.data;
        // console.log(data);
        self.setState({
          courses: data.courses.courses
        });
        var courses = data.courses.courses;
        for (var i = 0; i < courses.length; i++) {
          var apiPath = '/api/assignments/' + courses[i]._id + '/' + userID + '/new';
          axios.get(apiPath, {
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json'
            }
          })
            .then(function (response) {
              if (!response.data.success) {
                console.log("Error1: " + response.data);
              }
              var data = response.data;
              self.setState({
                assignments: self.state.assignments.concat(data.assignments.assignments)
              });
              console.log(response.data);
            })
            .catch(function (error) {
              console.log('Error2: ', error);
            });
        }// End of for loop
      })
  }
  render() {
    let content;
    const profContent = (
      <div>
        {
          this.state.assignments.map(function (each) {
            return <AssignmentCard key={each.uniqueID} uniqueID={each.uniqueID} name={each.name} details={each.details} type={each.type.toUpperCase()} maxMarks={each.maxMarks} resourceUrl={each.resourceUrl} assignmentID={each._id} submissions={each.submissions} role='prof' />
          })
        }
        <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
      </div>
    );
    const studContent = (
      <div>
        {
          this.state.assignments.map(function (each) {
            return <AssignmentCard key={each.uniqueID} uniqueID={each.uniqueID} name={each.name} details={each.details} type={each.type.toUpperCase()} maxMarks={each.maxMarks} resourceUrl={each.resourceUrl} assignmentID={each._id} submissions={each.submissions} role='student' />
          })
        }
        <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
      </div>
    );
    if (this.state.role == "prof") {
      content = profContent;
    }
    else {
      content = studContent;
    }
    return (
      <div>{content}</div>

    )
  }
}
export default Assignments;