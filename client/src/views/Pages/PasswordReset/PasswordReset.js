import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import { withRouter, Redirect } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userPasswordReset } from "../../../actions/authActions";
import classnames from "classnames";
import isEmpty from "is-empty";

const spanStyles = {
  color: "#FF0000",
};

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    // console.log(e.target.id, e.target.value)
  };

  

  onScreenChange = () => {
    this.props.history.push("/login");
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log("email", this.state.email)
    

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    
    

     this.props.userPasswordReset(userData, this.props.history);

     
  };

  render() {
    const { errors, error } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.onSubmit}>
                    <h1>Password Reset</h1>
                    
                      <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        id="email"
                        type="text"
                        className={classnames("", {
                          invalid: errors.email,
                        })}
                        placeholder="Email"
                        autoComplete="email"
                      />
                      <span className="red-text" style={spanStyles}>
                        {errors.email}
                      </span>
                      
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.onChange}
                        value={this.state.password}
                        error={errors.password}
                        id="password"
                        type="password"
                        className={classnames("", {
                          invalid: errors.password,
                        })}
                        placeholder="Password"
                        autoComplete="new-password"
                      />
                      <span className="red-text" style={spanStyles}>
                        {errors.password}
                      </span>
                    </InputGroup>
                    
                    <Button color="success" block>
                      Reset Password
                    </Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12">
                      <Button
                        className="btn-facebook mb-1"
                        block
                        onClick={this.onScreenChange}
                      >
                        <span>Login Page</span>
                      </Button>
                    </Col>
                  </Row>
                </CardFooter>
                {/* <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

userPasswordReset.propTypes = {
  userPasswordReset: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  
});

export default connect(mapStateToProps, { userPasswordReset })(withRouter(PasswordReset));
