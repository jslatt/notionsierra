const CONFIG = require("./config.json");
const moment = require("moment");
let trades = [];

/////////////////////////
//      GET FILLS      //
/////////////////////////
//    1 Day History    //
/////////////////////////
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const encodedParams = new URLSearchParams();

encodedParams.set("AdminUsername", CONFIG.SIERRA_WEB_API_USERNAME);
encodedParams.set("AdminPassword", CONFIG.SIERRA_WEB_API_PASSWORD);
encodedParams.set("UserSCUsername", CONFIG.SIERRA_ACTUAL_USERNAME);
encodedParams.set("Service", "GetTradeOrderFills");
encodedParams.set(
  "StartDateTimeInMicroSecondsUTC",
  moment().subtract(1, "days").unix() * 1000000
);

let url = "https://www.sierrachart.com/API.php";

let options = {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: encodedParams,
};

fetch(url, options)
  .then((res) => res.json())
  .then((data) => {
    /////////////////////////
    //  PARSE & CLEAN DATA //
    /////////////////////////
    let counter = 0;

    // Iterate JSON Object from End
    for (i = Object.keys(data).length - 1; i > -1; i--) {
      // If fill is closing position
      if (data[i].JSON.PositionQuantity == 0) {
        // WARNING WILL BREAK IF TRADING MORE THAN ONE PRODUCT
        // Get counter fills back added
        let executions = [];
        // Add open fills to executions
        for (j = 0; j <= counter; j++) {
          executions.push(data[i + j]);
          console.log(
            "EXE ADDED " +
              j +
              "/" +
              i +
              "   " +
              data[i + j].JSON.InternalOrderID
          );
        }
        console.log("NEW POSITION");
        // Push new set of executions to trades array.
        trades.push(executions);
        counter = 0;
      } else {
        counter++;
        console.log("OPEN " + counter + "    " + data[i].JSON.InternalOrderID);
      }
    }
  })
  .catch((err) => console.error("error:" + err));

///////////////////////////////
//  COMPUTE + POST TO NOTION //
///////////////////////////////
const { Client } = require("@notionhq/client");



