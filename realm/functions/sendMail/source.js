// "use strict"

// exports = function({origEmail, toEmail, subject, html}){
//   const nodemailer = require("nodemailer");
//   /*
//     Accessing application's values:
//     var x = context.values.get("value_name");

//     Accessing a mongodb service:
//     var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
//     var doc = collection.findOne({owner_id: context.user.id});

//     To call other named functions:
//     var result = context.functions.execute("function_name", arg1, arg2);

//     Try running in the console below.
//   */
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "email-smtp.us-east-1.amazonaws.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: "AKIAZ7FYJS2TZV55PQ4G", // generated ethereal user
//       pass: "BJFtBMm4rzLA3rFSS6GbxKZXF0JMriUEXI0LuQWAsnlE", // generated ethereal password
//     }
//   });

//   (async function() {
//     // send mail with defined transport object
//       try {
//         let info = await transporter.sendMail({
//           from: '"MongoDB Consulting" <ps-bot-noreply@mongodb.com>', // sender address
//           replyTo: origEmail,
//           to: toEmail, // list of receivers
//           subject: subject, // Subject line
//           html: html, // html body
//         });
//         console.log("Message sent: %s", info.messageId);
//       } catch (err) {
//         console.log(err.stack);
//       }
    
//   })()
  
//   return;
// };
exports = function({origEmail, toEmail, subject, html}){
  var col_msg = context.services.get("mongodb-atlas").db("mailer").collection("messages");
  col_msg.insertOne({processed:false,msg:{origEmail, toEmail, subject, html},ts:new Date()})
  return {queued:true};
}