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

    let formData = new FormData();

    formData.append("fileUpload", file);

    axios
      .post("http://localhost:5000/api/fileupload/upload", formData, {})
      .then((res) => {
        alert("File Uploaded!");
      })
      .catch((err) => {
        alert(err);
      });

    document.getElementById("uploadfile").value = null;
  };

  render() {
    return (
      <div>
        <input
          type="file"
          onChange={this.fileSelectedHandler}
          id="uploadfile"
        />
        <button onClick={this.fileUploadHandler}>Upload</button>
      </div>
    );
  }
}
