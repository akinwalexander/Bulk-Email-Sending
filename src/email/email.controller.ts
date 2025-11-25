// email.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import * as bulkEmailInterface from '../shared/interfaces/bulk-email.interface';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-bulk')
  async sendBulkEmails(
    @Body() payload: bulkEmailInterface.BulkEmailPayload,
  ): Promise<{ message: string; queued: number }> {
    const result = await this.emailService.sendBulkEmails(payload);
    return {
      message: 'Emails queued successfully',
      queued: result.queued,
    };
  }

  @Get('queue/stats')
  async getQueueStats() {
    return this.emailService.getQueueStats();
  }

  @Post('queue/clear')
  async clearQueue() {
    await this.emailService.clearQueue();
    return { message: 'Queue cleared successfully' };
  }
}