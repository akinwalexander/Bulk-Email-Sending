// email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';
import * as nodemailer from 'nodemailer';
import { EmailPayload } from '../shared/interfaces/email-payload.interface';
import { BulkEmailPayload } from '../shared/interfaces/bulk-email.interface';


@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectQueue('email') private emailQueue: bull.Queue,
  ) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send a single email immediately
   */
  async sendEmail(payload: EmailPayload): Promise<any> {
    try {
      const result = await this.transporter.sendMail({
        from: payload.from || process.env.SMTP_FROM,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
      
      this.logger.log(`Email sent successfully to ${payload.to}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${payload.to}:`, error);
      throw error;
    }
  }

  /**
   * Add a single email to the queue
   */
  async queueEmail(payload: EmailPayload, priority = 0): Promise<void> {
    await this.emailQueue.add('send-email', payload, {
      priority,
    });
    this.logger.log(`Email queued for ${payload.to}`);
  }

  /**
   * Add multiple emails to the queue in bulk (optimized for 1000+ users)
   */
  async queueBulkEmails(payload: BulkEmailPayload): Promise<void> {
    const jobs = payload.recipients.map((recipient) => ({
      name: 'send-email',
      data: {
        to: recipient,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        from: payload.from,
      },
    }));

    // Add all jobs to queue in bulk for better performance
    await this.emailQueue.addBulk(jobs);
    
    this.logger.log(
      `Queued ${payload.recipients.length} emails for processing`,
    );
  }

  /**
   * Send emails to 1000+ users with chunking
   */
  async sendBulkEmails(
    payload: BulkEmailPayload,
    chunkSize = 100,
  ): Promise<{ queued: number }> {
    const { recipients } = payload;
    const chunks = this.chunkArray(recipients, chunkSize);

    for (const chunk of chunks) {
      await this.queueBulkEmails({
        ...payload,
        recipients: chunk,
      });
    }

    return { queued: recipients.length };
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<any> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.emailQueue.getWaitingCount(),
      this.emailQueue.getActiveCount(),
      this.emailQueue.getCompletedCount(),
      this.emailQueue.getFailedCount(),
      this.emailQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }

  /**
   * Clear all jobs from the queue
   */
  async clearQueue(): Promise<void> {
    await this.emailQueue.empty();
    this.logger.log('Email queue cleared');
  }

  /**
   * Utility method to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}