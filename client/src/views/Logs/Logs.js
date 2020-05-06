import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
} from "reactstrap";
import { fetchLogs } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { ExportCSV } from "../../utils/ExportCSV";
// import Doc from "../../utils/DocService";
// import PdfContainer from "../../utils/PdfContainer";
// import Datepicker from "../../utils/Datepicker";
import DatePicker from "react-date-picker";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from "jspdf";
import { renderToString } from "react-dom/server";
import html2canvas from "html2canvas";
import axios from "axios";

import "./Logs.css";

// import usersData from "./UsersData";

function LogRow(props) {
  const log = props.log;
  const index = props.index;
  // const val = props.val;
  // const userLink = `/users/${user.id}`

  return (
    <tr key={log.user_id}>
      <th scope="row">{index + 1}</th>
      <td>{log.caller_number}</td>
      <td>{moment.unix(log.start_time).format("MMMM D YYYY HH:mm")}</td>
      <td>{moment.unix(log.end_time).format("MMMM D YYYY HH:mm")}</td>
      <td>{log.duration}</td>
      <td>{log.name + " "}</td>
      <td>{log.call_results + " "}</td>
      <td>{log.user_id + " "}</td>
    </tr>
  );
}

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: [],
      fromDate: "",
      toDate: "",
    };
  }

  componentDidMount() {
    this.props.fetchLogs();
  }

  onChangeFrom = (fromDate) => this.setState({ fromDate });
  onChangeTo = (toDate) => this.setState({ toDate });

  getData(data) {
    let selected = this.state.selection;
    const { fromDate, toDate } = this.state;

    if (selected.length == 2) {
      data = data.filter(
        (item) =>
          item.start_time >= selected[0] && item.start_time <= selected[1]
      );
    }
    // console.log(moment(fromDate).unix(), moment(toDate).unix());

    if (typeof fromDate !== "string" && typeof toDate !== "string") {
      data = data.filter(
        (item) =>
          item.start_time >= moment(fromDate).unix() &&
          item.start_time <= moment(toDate).unix()
      );
    }

    return data;
  }

  getCurrentWeek() {
    let curr = new Date();
    let first = curr.getDate() - curr.getDay();
    let last = first + 6;

    let firstday = new Date(curr.setDate(first)).toUTCString();
    let lastday = new Date(curr.setDate(last)).toUTCString();

    let Monday = moment(firstday).unix();
    let Sunday = moment(lastday).unix();

    return [Monday, Sunday];
  }

  getLastWeek() {
    let today = new Date();

    let first = today.getDate() - today.getDay() - 6;
    let last = first + 6;

    let firstday = new Date(today.setDate(first)).toUTCString();
    let lastday = new Date(today.setDate(last)).toUTCString();

    let Monday = moment(firstday).unix();
    let Sunday = moment(lastday).unix();

    return [Monday, Sunday];
  }

  getCurrentMonth() {
    let date = new Date();

    let first = new Date(date.getFullYear(), date.getMonth(), 1);
    let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let firstDay = moment(first).unix();
    let lastDay = moment(last).unix();

    return [firstDay, lastDay];
  }

  getPrevMonth() {
    let date = new Date();

    let prevStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    let preEndDate = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);

    let firstDay = moment(prevStartDate).unix();
    let lastDay = moment(preEndDate).unix();

    return [firstDay, lastDay];
  }

  dataSelection = (event) => {
    let activeSelection = event.target.value;
    if (activeSelection == 1) {
      activeSelection = this.getCurrentWeek();
    } else if (activeSelection == 2) {
      activeSelection = this.getLastWeek();
    } else if (activeSelection == 3) {
      activeSelection = this.getCurrentMonth();
    } else if (activeSelection == 4) {
      activeSelection = this.getPrevMonth();
    } else if (activeSelection == 0) {
      activeSelection = 0;
    }

    this.setState({
      selection: activeSelection,
    });

    return activeSelection;
  };

  // createPdf = (html) => Doc.createPdf(html);

  // generatePDF = () => {
  //   var doc = new jsPDF("p", "pt");
  //   doc.addHTML(document.getElementById("pdfdata"), function () {
  //     doc.save("demo.pdf");
  //   });

  //   doc.text(20, 20, 'This is the first title.')

  //   doc.setFont('helvetica')
  //   doc.setFontType('normal')
  //   doc.text(20, 60, 'This is the second title.')

  //   doc.setFont('helvetica')
  //   doc.setFontType('normal')
  //   doc.text(20, 100, 'This is the thrid title.')

  //   doc.save('demo.pdf')

  //   const string = renderToString(<Logs />);
  // const pdf = new jsPDF();
  // pdf.fromHTML(string);
  // pdf.save("pdf");
  // };

  printDocument() {
    const input = document.getElementById("logsReport");
    html2canvas(input).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF("p", "pt", "a4");
      doc.setFontSize(100);
      doc.addImage(img, "JPEG", 15, 40, 550, 580);
      doc.save();
      var data = doc.output("blob");

      var formData = new FormData();
      formData.append("pdf", data, "Report.pdf");
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:5000/receive"); // Change to your server
      request.onload = function(){ alert (request.responseText); } 
      request.onerror = function(){ alert (request.responseText); }
      request.send(formData);
      
    });
  }

  render() {
    let data = this.props.auth;

    let dataArry = this.getData(data);
    

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            {/* <PdfContainer createPdf={this.createPdf}> */}

            {/* <ExportCSV  csvData={dataArry} fileName={this.state.fileName} /> */}
            <ReactHTMLTableToExcel
              className="btn btn-success"
              table="logsReport"
              filename="Call_logs_Report"
              sheet="Sheet"
              buttonText="Export to excel"
            />
            <Button
              onClick={this.printDocument}
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              Generate Pdf
            </Button>
            <Card id="logsReport">
              <CardHeader>
                <i className="fa fa-align-justify"></i> CallLogs{" "}
                <span style={{ paddingLeft: "50px" }}>
                  From :{" "}
                  <DatePicker
                    onChange={this.onChangeFrom}
                    value={this.state.fromDate}
                  />
                </span>
                <span style={{ paddingLeft: "30px" }}>
                  To :{" "}
                  <DatePicker
                    onChange={this.onChangeTo}
                    value={this.state.toDate}
                  />
                </span>
                <span style={{ position: "absolute", right: "3rem" }}>
                  Select your Report :{" "}
                  <select
                    name="reportList"
                    id="reportSelection"
                    onChange={this.dataSelection}
                  >
                    <option value="0">Complete Report</option>
                    <option value="1">Current Week</option>
                    <option value="2">Last Week</option>
                    <option value="3">Current Month</option>
                    <option value="4">Last Month</option>
                  </select>
                </span>
                {/* <small className="text-muted">example</small> */}
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Caller Number</th>
                      <th scope="col">Start time</th>
                      <th scope="col">End time</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Name</th>
                      <th scope="col">Call Result</th>
                      <th scope="col">User_ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataArry.map((log, index) => (
                      <LogRow key={index} log={log} index={index} />
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            {/* </PdfContainer> */}
          </Col>
        </Row>
      </div>
    );
  }
}

Logs.propTypes = {
  fetchLogs: PropTypes.func.isRequired,
  auth: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth.logs,
});

export default connect(mapStateToProps, { fetchLogs })(Logs);
