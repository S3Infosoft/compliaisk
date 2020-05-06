import React, { Component } from "react";
import axios from "axios";

export default class FileUpload extends Component {
  state = {
    selectedFile: null,
  };
  fileSelectedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  fileUploadHandler = () => {
    let file = this.state.selectedFile;

    let formdata = new FormData();

    formdata.append("image", file);

    axios({
      url: "http://localhost:5000/api/fileupload",
      method: "POST",
      data: formdata,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.fileSelectedHandler} />
        <button onClick={this.fileUploadHandler}>Upload</button>
      </div>
    );
  }
}
