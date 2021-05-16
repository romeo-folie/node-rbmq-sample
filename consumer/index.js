const express = require("express");
const amqp = require("amqplib");

var connection, channel;
const app = express();

const setupConsumer = async () => {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("message");

    channel.consume("message", (data) => {
      if (data) {
        console.log(data.content.toString());
        channel.ack(data);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

setupConsumer();

app.listen(4000, () => {
  console.log("consumer up on 4000");
});
