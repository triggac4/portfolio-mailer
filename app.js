const express = require("express");
const cors = require("cors");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const app = express();

async function sendMail(email, subject, text, name) {
    let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "koffokansi@gmail.com",
            pass: process.env.pass,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "koffokansi@gmail.com", // sender address
        to: "koffokansi@gmail.com", // list of receivers
        subject: subject, // Subject line
        text: `from: ${email} message:${text}`, // plain text body
        html: `<p>name:${name}
        </br>from: ${email} </br> message:${text}</p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
app.use([cors(), express.json()]);

app.post("/api/v1/contact", async (req, res) => {
    const { email, name, subject, body } = req.body;
    try {
        await sendMail(email, subject, body, name);
        console.log("email sent");
        res.status(200).json({ message: "email sent" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("listening on port " + port);
});
