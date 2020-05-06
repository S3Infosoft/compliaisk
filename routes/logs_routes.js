const express = require("express");
const router = express.Router();
const fetch = require("cross-fetch");
const moment = require("moment");
require("dotenv").config();

const Logs = require("../models/Logs_model");


// @route GET api/users/userslist
// @desc Get all users
// @access Private
router.get("/logs", async (req, res) => {
  try {
    const logs = await Logs.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// @route GET api/calllogs/logs
// @desc Get all logs
// @access Private
// Still pending to work
router.get("/log", (req, res) => {
  fetch("https://developers.myoperator.co/search", {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: process.env.OPERATER_TOKEN,
  })
    .then((res) => res.json())
    .then((data) => {
      let dataArry = [];
      let vals = data.data ? data.data.hits : [];
      for (let i = 0; i < vals.length; i++) {
        let dataObj = {};
        dataObj["caller_number"] = vals[i]._source.caller_number;
        dataObj["state"] = vals[i]._source.state;
        dataObj["start_time"] = vals[i]._source.start_time;
        dataObj["end_time"] = vals[i]._source.end_time;
        dataObj["duration"] = vals[i]._source.duration;

        if (vals[i]._source.log_details !== []) {
          dataObj["user_id"] = vals[i]._source.log_details.map(
            (item) => item.received_by[0].user_id
          );
          dataObj["name"] = vals[i]._source.log_details.map(
            (item) => item.received_by[0].name
          );
          dataObj["_ds"] = vals[i]._source.log_details.map((item) => item._ds);
        }
        dataArry.push(dataObj);
      }

      res.send(dataArry);
    });
});

// @route GET api/calllogs/logs/duration
// @desc Get all logs
// @access Private
// Still pending to work
router.get("/logs/duration", (req, res) => {
  const start_datetime = "1587335502";
  const end_datetime = "1587421934";
  fetch("https://developers.myoperator.co/search", {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body:
      process.env.OPERATER_TOKEN +
      "&from=" +
      start_datetime +
      "&to=" +
      end_datetime,
  })
    .then((res) => res.json())
    .then((data) => {
      let dataArry = [];
      let vals = data.data ? data.data.hits : [];
      for (let i = 0; i < vals.length; i++) {
        let dataObj = {};
        dataObj["caller_number"] = vals[i]._source.caller_number;
        dataObj["state"] = vals[i]._source.state;
        dataObj["start_time"] = vals[i]._source.start_time;
        dataObj["end_time"] = vals[i]._source.end_time;
        dataObj["duration"] = vals[i]._source.duration;

        if (vals[i]._source.log_details !== []) {
          dataObj["user_id"] = vals[i]._source.log_details.map(
            (item) => item.received_by[0].user_id
          );
          dataObj["name"] = vals[i]._source.log_details.map(
            (item) => item.received_by[0].name
          );
          dataObj["_ds"] = vals[i]._source.log_details.map((item) => item._ds);
        }
        dataArry.push(dataObj);
      }

      res.send(dataArry);
    });
});

// @route POST api/calllogs/logs/load
// @desc POST all logs
// @access Private
// Still pending to work
router.get("/logs/load", (req, res) => {
  let dates = [
    "10/01/2019 00:00",
    "11/01/2019 00:00",
    "12/01/2019 00:00",
    "01/01/2020 00:00",
    "02/01/2020 00:00",
    "03/01/2020 00:00",
    "04/01/2020 00:00",
  ];

  let epochTime;

  for (let i = 0; i < dates.length; i++) {
    epochTime = dates.map(timeFormat);

    function timeFormat(item) {
      let d = new Date(item);
      let LastDayInMonth = LastDayOfMonth(d.getFullYear(), d.getMonth());

      let parsedDate = moment(item, "MM/DD/YYYY HH:mm").valueOf();
      return [moment(parsedDate).unix(), moment(LastDayInMonth).unix()];
    }

    function LastDayOfMonth(Year, Month) {
      return new Date(new Date(Year, Month + 1, 0));
    }

    let start_datetime = epochTime[i][0];
    let end_datetime = epochTime[i][1];

    fetch("https://developers.myoperator.co/search", {
      method: "post",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body:
        process.env.OPERATER_TOKEN +
        "&from=" +
        start_datetime +
        "&to=" +
        end_datetime,
    })
      .then((res) => res.json())
      .then((data) => {
        let dataArry = [];
        let vals = data.data ? data.data.hits : [];
        for (let i = 0; i < vals.length; i++) {
          let dataObj = {};
          dataObj["caller_number"] = vals[i]._source.caller_number;
          dataObj["state"] = vals[i]._source.state;
          dataObj["start_time"] = vals[i]._source.start_time;
          dataObj["end_time"] = vals[i]._source.end_time;
          dataObj["duration"] = vals[i]._source.duration;

          if (vals[i]._source.log_details !== []) {
            dataObj["user_id"] = vals[i]._source.log_details.map(
              (item) => item.received_by[0].user_id
            );
            dataObj["name"] = vals[i]._source.log_details.map(
              (item) => item.received_by[0].name
            );
            dataObj["_ds"] = vals[i]._source.log_details.map(
              (item) => item._ds
            );
          }

          const logRec = new Logs({
            caller_number: dataObj.caller_number,
            state: dataObj.state,
            start_time: dataObj.start_time,
            end_time: dataObj.end_time,
            duration: dataObj.duration,
            user_id: dataObj.user_id,
            name: dataObj.name,
            call_results: dataObj._ds,
          });

          logRec.save();

          dataArry.push(dataObj);
        }

        dataArry = [];

        // res.send(dataArry);
      });
  }

  res.send(epochTime);
});

module.exports = router;
