import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const initConsumer = async () => {
  try {
    const amqpUrl = process.env.AMQP_URL || `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    const queue = 'application_queue';

    await channel.assertQueue(queue, { durable: true });
    
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          const { application_id } = content;
          console.log(`[x] Received application_id: ${application_id}`);

          const query = `
            SELECT 
              a.id AS application_id, 
              a.applied_at AS application_date,
              u_applicant.name AS applicant_name, 
              u_applicant.email AS applicant_email,
              j.title AS job_title,
              u_owner.email AS owner_email,
              u_owner.name AS owner_name
            FROM applications a
            JOIN users u_applicant ON a.user_id = u_applicant.id
            JOIN jobs j ON a.job_id = j.id
            JOIN users u_owner ON j.created_by = u_owner.id
            WHERE a.id = $1
          `;
          
          const { rows } = await pool.query(query, [application_id]);
          
          if (rows.length > 0) {
            const data = rows[0];
            
            const mailOptions = {
              from: '"OpenJob Notifier" <no-reply@openjob.com>',
              to: data.owner_email,
              subject: `Lamaran Baru untuk Posisi ${data.job_title}`,
              text: `Halo ${data.owner_name},\n\nAnda menerima lamaran baru untuk posisi ${data.job_title}.\n\nDetail Pelamar:\nNama: ${data.applicant_name}\nEmail: ${data.applicant_email}\nTanggal Melamar: ${data.application_date}\n\nSalam,\nTim OpenJob`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent to job owner: %s', info.messageId);
          } else {
            console.log(`Data not found for application_id: ${application_id}`);
          }
          
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (err) {
    console.error('Consumer error:', err);
  }
};

initConsumer();
