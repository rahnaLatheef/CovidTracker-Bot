const Request = require("request-promise");
const numeral = require("numeral");
const dispatcher = async (event) => {
  let response = {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: "Close",
      fulfillmentState: "",
      message: {
        contentType: "PlainText",
        content: "",
      },
    },
  };
  switch (event.currentIntent.name) {
    case "CovidTracker":
      try {
        let url =
          "https://disease.sh/v3/covid-19/countries/" +
          event.currentIntent.slots.country;
        console.log("endpoint: " + url);
        let result = await Request(url, { json: true });

        console.log(result.todayCases);
        response.dialogAction.fulfillmentState = "Fulfilled";
        response.dialogAction.message.content =
          "Today (" +
          new Date().toISOString().slice(0, 10) +
          ") Cases: " +
          numeral(result.todayCases).format("0.0a") +
          ",\n" +
          "Recovered: " +
          numeral(result.todayRecovered).format("0.0a") +
          ",\n" +
          "Deaths: " +
          numeral(result.todayDeaths).format("0.0a") +
          "\n" +
          "Total Cases (till date): " +
          numeral(result.cases).format("0.0a") +
          ",\n" +
          "Recovered: " +
          numeral(result.recovered).format("0.0a") +
          ",\n" +
          "Deaths: " +
          numeral(result.deaths).format("0.0a");
      } catch {
        response.dialogAction.fulfillmentState = "Failed";
        response.dialogAction.message.content =
          "Sorry, no data found for provided country. Please try again with correct country name!";
      }
      break;
    case "Goodbye":
      response.dialogAction.fulfilmentState = "Fulfilled";
      response.dialogAction.message.content =
        "Goodbye, Stay Updated! Stay Protected!";
      break;
    case "AboutBot":
      response.dialogAction.fulfilmentState = "Fulfilled";
      response.dialogAction.message.content =
        "This bot helps to stay updated on the latest covid-19 informations.";
      break;
    case "Welcome":
      response.dialogAction.fulfillmentState = "Fulfilled";
      response.dialogAction.message.content =
        "Hello, I'm Dexa, How can I help you today?";
      break;
    default:
      response.dialogAction.fulfillmentState = "Failed";
      response.dialogAction.message.content = "No data found for this country";
      break;
  }
  return response;
};
exports.handler = async (event) => {
  return dispatcher(event);
};
