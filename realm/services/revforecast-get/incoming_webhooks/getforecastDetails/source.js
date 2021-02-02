// This function is the webhook's request handler.
exports = function(payload, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    //const {arg1, arg2} = payload.query;

    // Headers, e.g. {"Content-Type": ["application/json"]}
    //const contentTypes = payload.headers["Content-Type"];

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const body = payload.body;
    const regions_doc = JSON.parse(body.text());

    console.log("Request body JSON:", JSON.stringify(JSON.parse(body.text())));
    
    // You can use 'context' to interact with other Realm features.
    // Accessing a value:
    // var x = context.values.get("value_name");

    // Querying a mongodb service:
    // const doc = context.services.get("mongodb-atlas").db("dbname").collection("coll_name").findOne();

    // Calling a function:
    // const result = context.functions.execute("function_name", arg1, arg2);

    // The return value of the function is sent as the response back to the client
    // when the "Respond with Result" setting is set.
    //return  "Hello World!";
    return context.functions.execute("generateForecastDetails", regions_doc)
      .then(result => {
        response.setStatusCode(200);
        response.setHeader(
          "Content-Type",
          "application/json"
        );
        response.setBody(JSON.stringify(result));
      })
      .catch(err => console.error(`Failed to generate forecast: ${err}`))
};