import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { fetchFiles } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileRow(props) {
  const file = props.file;
  const index = props.index;

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
    <tr key={file._id}>
      <th scope="row">{index + 1}</th>
      <td>{file.name}</td>
      <td>{file.uploadedDate}</td>
      <td>{file.size}</td>
      <td>
        <a href={file.filePath}>{file.filePath}</a>
      </td>
    </tr>
  );
}

class FileUpload extends Component {
  state = {
    selectedFile: null,
    loaded: 0,
  };

  componentDidMount() {
    this.props.fetchFiles();
  }

  fileSelectedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  fileUploadHandler = () => {
    const file = this.state.selectedFile;

    const formData = new FormData();

    formData.append("fileUpload", file);

    axios
      .post("http://localhost:5000/api/fileupload/upload", formData, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      })
      .then((res) => {
        toast.success("upload success");
        
      })
      .catch((err) => {
        toast.error("upload fail");
      });

    document.getElementById("uploadfile").value = null;
    
    
  };

  render() {
    const data = this.props.auth;

    return (
      // <div>
      //   <input
      //     type="file"
      //     onChange={this.fileSelectedHandler}
      //     id="uploadfile"
      //   />
      //   <button onClick={this.fileUploadHandler}>Upload</button>
      // </div>
      <>
        <div className="container">
          <div
            className="row"
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              margin: "20px",
            }}
          >
            <div className="offset-md-3 col-md-6">
              <div className="form-group files">
                <label>Upload Your File </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={this.fileSelectedHandler}
                  id="uploadfile"
                />
              </div>
              <div className="form-group">
                <ToastContainer />
                <Progress max="100" color="success" value={this.state.loaded}>
                  {Math.round(this.state.loaded, 2)}%
                </Progress>
              </div>

              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.fileUploadHandler}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="animated fadeIn">
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Files
                  {/* <small className="text-muted">example</small> */}
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">File Name</th>
                        <th scope="col">Upload Date</th>
                        <th scope="col">File Size (MB)</th>
                        <th scope="col">Access the File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((file, index) => (
                        <FileRow key={index} file={file} index={index} />
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

FileUpload.propTypes = {
  fetchFiles: PropTypes.func.isRequired,
  auth: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth.files,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, { fetchFiles })(FileUpload);
