const fetch = require("cross-fetch");
const moment = require("moment");
require("dotenv").config();

const Logs = require("../models/Logs_model");

module.exports = dailyDataLoad = () => {
    let yesDate = moment().subtract(1, "days").startOf("day").toString();
    let currDate = moment().subtract(0, "days").startOf("day").toString();
    

  let start_datetime = moment(Date.parse(yesDate)).unix();
  let end_datetime = moment(Date.parse(currDate)).unix();

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
      }

      // res.send(dataArry);
    });
};
