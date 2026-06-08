import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

export const publishMessage = async (queue, message) => {
  try {
    // Priority on AMQP_URL if set, else construct from host/port/user/pass
    const amqpUrl = process.env.AMQP_URL || `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
    
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queue, { durable: true });
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`[x] Sent message to queue ${queue}:`, message);
    
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('RabbitMQ Publish Error:', error);
  }
};
