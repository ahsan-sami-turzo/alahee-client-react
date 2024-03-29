import React, { Component } from "react";
import "./registration-form.css";
import { Link } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import LoginWithGoogle from "./social-login/login-with-google";
import LoginWithFacebook from "./social-login/login-with-facebook";
import SocialLogin from "./social-login/social-login";

const options = {
  headers: { "Content-Type": "application/json" },
};

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
const img_src = `${fileUrl}/upload/company`;

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email_address: '',
      message: '',
      checkStatus: false,

      email: "",
      password: "",
      error: false,

      isRequestInProcess: false
    };

    this.toggleForgotPasswordModal = this.toggleForgotPasswordModal.bind(this);
    this.handleCheckEmail = this.handleCheckEmail.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }


  validateEmail = (email) => {
    // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());

    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobReg = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

    return emailReg.test(String(email).toLowerCase()) || mobReg.test(String(email).toLowerCase());
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    if (!this.validateEmail(this.state.email)) {
      toast.error("Invalid Email or Mobile !!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    this.setState({ isRequestInProcess: true });

    axios
      .post(`${base}/api/loginCustomerInitial`, userData, options)
      .then((res) => {

        if (!res.data.error) {
          this.setState({ message: '', error: false, isRequestInProcess: false });
          localStorage.setItem("customer_id", res.data.data);

          toast.success("Login Successful !!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            this.props.setAuthentication(true);
            this.props.history.push("/");
            window.location.reload(false);
          }, 2000);

        } else {
          this.setState({ message: res.data.message, error: true, isRequestInProcess: false });

          toast.error("User Not Found !!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((e) => this.setState({ message: 'Error !!', error: true, isRequestInProcess: false }));
  };

  /*handleSocialData = ({ name, email, id }) => {
    const userData = { name, email, id };
    axios.post(`${base}/api/socialLogin`, userData, options).then(res => {
      this.props.setAuthentication(true);
      localStorage.setItem("customer_id", res.data.customer_id);
      this.props.history.push("/");
    });
  };*/

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  toggleForgotPasswordModal(event) {
    var forgotPasswordModalButton = document.getElementById("forgotPasswordModalButton");
    forgotPasswordModalButton.click();
  }

  handleCheckEmail(event) {
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
      fetch(base + `/api/check-email?email=${event.target.value}`, {
        method: "GET"
      })

        .then((result) => result.json())
        .then((info) => {

          if (info.success == true) {
            console.log(info);
            this.setState({
              message: info.message,
              checkStatus: true
            })
          }
          else {
            this.setState({
              message: info.message,
              checkStatus: false
            })
            console.log(info);
          }

        });
    }
    else {
      this.setState({
        message: 'Invalid!',
        checkStatus: false
      })
    }
  }

  submitEmail(event) {
    fetch(base + `/api/forgot-password`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then((result) => result.json())
      .then((info) => {
        console.log('info...', info)
        if (info.success == true) {
          var forgotPasswordModalButton = document.getElementById("forgotPasswordModalButton");
          forgotPasswordModalButton.click();
          var link = document.getElementById("successModalButton");
          link.click();
          this.setState({
            small: !this.state.small,
          })
        }
        else {
          this.setState({
            message: 'Could not send password reset email. Please try agai later!',
            checkStatus: false
          })
        }

      });
  }

  render() {
    const { email, password, error } = this.state;
    const { setAuthentication } = this.props;

    return (
      <>

        <ToastContainer />


        <Loader 
          visible={this.state.isRequestInProcess} 
          type="Oval" 
          color="#009345" 
          height={100} 
          width={100} 
          style={{ display: "flex", justifyContent: "center" }} 
        />


        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8 d-none d-lg-block">
              <img
                className="img-fluid mt-4"
                // src="https://store.banijjo.com.bd/upload/product/compressedProductImages/banner3.png"
                src={`${img_src}/logo-3d-bn.jpg`}
                alt="Ads"
                title="Ads"
              />
            </div>

            <div className="col-md-4">
              <div className="login-form">
                <div className="login-form-div">
                  <form onSubmit={this.onFormSubmit}>
                    <h2 className="text-center">Sign In</h2>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-user" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          onChange={this.onChangeHandler}
                          value={email}
                          placeholder="Email or Mobile"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-lock" />
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          onChange={this.onChangeHandler}
                          value={password}
                          placeholder="Password"
                        />
                      </div>
                    </div>


                    {!this.state.error && (
                      <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />
                    )}


                    {this.state.error && (
                      <div className="has-error">
                        <p className="help-block text-center text-danger">
                          {this.state.message}
                        </p>
                      </div>
                    )}

                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-success btn-block login-btn"
                        disabled={this.state.isRequestInProcess}
                      >
                        Submit
                      </button>
                    </div>

                    <div className="clearfix">
                      <a href="#" className="pull-right text-success" onClick={this.toggleForgotPasswordModal}>
                        Forgot Password?
                      </a>
                    </div>


                    {/* {error && (
                      <div className="has-error">
                        <p className="help-block text-center text-danger">
                          Email or Password is not valid! Try Again.
                        </p>
                      </div>
                    )} */}


                    <div className="or-seperator">
                      <i>or</i>
                    </div>

                    {/*Social login*/}
                  </form>

                  <div className="text-center social-btn">
                    <SocialLogin setAuthentication={setAuthentication} />
                  </div>
                </div>

                <div className="hint-text">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-success">
                    <strong style={{ fontWeight: "bold" }}> Register Now! </strong>
                  </Link>
                </div>

              </div>
            </div>

            <div className="col-md-8 d-lg-none d-block">
              <img
                className="img-fluid mt-4"
                src={`${img_src}/logo-3d-bn.jpg`}
                alt="Ads"
                title="Ads"
              />
            </div>
          </div>
        </div>


        {/* Forgot Password Modal  */}
        <button
          style={{ display: "none !important" }}
          className="d-none"
          id="forgotPasswordModalButton"
          type="button"
          data-toggle="modal"
          data-target="#forgotPasswordModal"
        ></button>

        <div
          className="modal fade"
          id="forgotPasswordModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="forgotPasswordModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="text-justify forgot-password">
                  <input
                    type="email"
                    name="email_address"
                    placeholder="Email"
                    autoComplete="email_address"
                    className="form-control"
                    onChange={this.handleCheckEmail}
                  />
                </p>

                {
                  this.state.checkStatus == true ?
                    <p className="text-justify forgot-password mt-5 text-success">{this.state.message}</p>
                    :
                    <p className="text-justify forgot-password mt-5 text-danger">{this.state.message}</p>
                }

                {'Note: Please provide the appropriate and full email address.'}
              </div>
              <div className="modal-footer cart-modal-footer">
                <button
                  type="button"
                  className={"btn " + (this.state.checkStatus ? 'btn-primary' : 'btn-secondary')}
                  disabled={!this.state.checkStatus}
                  onClick={this.submitEmail}
                >
                  Send Link
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End of Forgot Password Modal  */}

        {/* Success Modal  */}
        <button
          style={{ display: "none !important" }}
          id="successModalButton"
          className="d-none"
          type="button"
          data-toggle="modal"
          data-target="#successModal"
        ></button>

        <div
          className="modal fade"
          id="successModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="successModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body cart-modal-body">
                <p className="pt-4">
                  <i className="fa fa-check font-80" />
                </p>
                <p className="pt-2 pb-2">Password reset link has been sent to your email.</p>
              </div>
              <div className="modal-footer cart-modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End of Success Modal  */}

      </>
    );
  }
}

export default Login;

{
  /*<a href="#" className="btn btn-info btn-block">
              <i className="fa fa-twitter"></i> Sign in with <b>Twitter</b>
            </a>*/
}
