import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { fetchUsers } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import usersData from "./UsersData";

function UserRow(props) {
  const user = props.user;
  const index = props.index;
  const userLink = `/users/${user.id}`;

  const getBadge = (status) => {
    return status === "Active"
      ? "success"
      : status === "Inactive"
      ? "secondary"
      : status === "Pending"
      ? "warning"
      : status === "Banned"
      ? "danger"
      : "primary";
  };

  return (
    <tr key={user.id}>
      <th scope="row">{index + 1}</th>
      <td>
        {user.name}
      </td>
      <td>{user.email}</td>
      {/* <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td> */}
    </tr>
  );
}

class Users extends Component {
  componentWillMount() {
    this.props.fetchUsers();
  }

  render() {
    const userList = usersData.filter((user) => user.id < 10);

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users
                {/* <small className="text-muted">example</small> */}
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">email</th>
                      {/* <th scope="col">registered</th>
                      <th scope="col">role</th>
                      <th scope="col">status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.auth.map((user, index) => (
                      <UserRow key={index} user={user} index={index} />
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Users.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  auth: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth.users,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, { fetchUsers })(Users);
