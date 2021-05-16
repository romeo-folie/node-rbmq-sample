const express = require("express");
const amqp = require("amqplib");

var connection, channel;
const app = express();
app.use(express.json());

const setupProducer = async () => {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("message");
  } catch (error) {
    console.error(error);
  }
};

setupProducer();

const createMessage = async (data) => {
  await channel.sendToQueue("message", Buffer.from(JSON.stringify(data)));
  // await channel.close();
  // await connection.close();
};

app.post("/send", (req, res) => {
  console.log(req.body);
  createMessage(req.body);
  res.send("Sent");
});

app.listen(3000, () => {
  console.log("producer up on 3000");
});
