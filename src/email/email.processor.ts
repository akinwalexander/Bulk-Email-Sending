// email.processor.ts
import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import bull from 'bull';
import {EmailService } from './email.service';
import { EmailPayload } from 'src/shared/interfaces/email-payload.interface';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process({
    name: 'send-email',
    concurrency: 10, // Process 10 emails simultaneously
  })
  async handleSendEmail(job: bull.Job<EmailPayload>): Promise<any> {
    const { to, subject } = job.data;
    
    this.logger.debug(`Processing email job ${job.id} for ${to}`);
    
    try {
      const result = await this.emailService.sendEmail(job.data);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error; // This will trigger retry logic
    }
  }

  @OnQueueActive()
  onActive(job: bull.Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data.to)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: bull.Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result.messageId)}`,
    );
  }

  @OnQueueFailed()
  onError(job: bull.Job, error: Error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}