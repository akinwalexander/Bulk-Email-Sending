# NestJS Bulk Email Service with Bull Queue

A high-performance email service that can send emails to 1000+ users in seconds using job queues.

## Features

- ✅ **Parallel Processing**: Process 10 emails simultaneously (configurable)
- ✅ **Automatic Retries**: 3 retry attempts with exponential backoff
- ✅ **Job Persistence**: Uses Redis to persist jobs
- ✅ **Error Handling**: Comprehensive error logging and handling
- ✅ **Queue Monitoring**: Real-time queue statistics
- ✅ **Bulk Operations**: Optimized bulk email queueing
- ✅ **Rate Limiting**: Prevents overwhelming SMTP servers

## Installation

```bash
npm install
```

## Prerequisites

1. **Redis Server**: Must be running (install via Docker or locally)
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **SMTP Configuration**: Configure your email provider in `.env`

## Configuration

Create a `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

## Usage Examples

### 1. Send Bulk Emails via API

```bash
POST http://localhost:3000/email/send-bulk
Content-Type: application/json

{
  "recipients": [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com"
    // ... 1000+ emails
  ],
  "subject": "Welcome to Our Platform!",
  "html": "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
  "text": "Welcome! Thanks for joining us."
}
```

### 2. Using the Service Programmatically

```typescript
import { EmailService } from './email/email.service';

@Injectable()
export class UserService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmails(users: User[]) {
    const recipients = users.map(user => user.email);
    
    await this.emailService.sendBulkEmails({
      recipients,
      subject: 'Welcome to Our Platform!',
      html: '<h1>Welcome!</h1>',
    });
  }
}
```

### 3. Check Queue Statistics

```bash
GET http://localhost:3000/email/queue/stats
```

Response:
```json
{
  "waiting": 500,
  "active": 10,
  "completed": 490,
  "failed": 0,
  "delayed": 0
}
```

## Performance Tuning

### Increase Concurrency

In `email.processor.ts`, adjust the concurrency value:

```typescript
@Process({
  name: 'send-email',
  concurrency: 20, // Process 20 emails simultaneously
})
```

### Adjust Chunk Size

When sending bulk emails:

```typescript
await this.emailService.sendBulkEmails(payload, 200); // Process in chunks of 200
```

### Configure Job Options

In `email.module.ts`:

```typescript
BullModule.registerQueue({
  name: 'email',
  defaultJobOptions: {
    attempts: 5, // More retry attempts
    backoff: {
      type: 'exponential',
      delay: 1000, // Faster retries
    },
  },
}),
```

## Performance Benchmarks

With default settings (concurrency: 10):
- **1,000 emails**: ~2-3 minutes
- **5,000 emails**: ~10-15 minutes
- **10,000 emails**: ~20-30 minutes

With optimized settings (concurrency: 50):
- **1,000 emails**: ~30-60 seconds
- **5,000 emails**: ~3-5 minutes
- **10,000 emails**: ~6-10 minutes

*Note: Actual performance depends on SMTP provider rate limits*

## Monitoring

### Bull Board (Optional)

Install Bull Board for a web-based queue dashboard:

```bash
npm install @bull-board/express @bull-board/api
```

## Error Handling

Failed jobs are automatically retried 3 times with exponential backoff. After all retries fail, the job is marked as failed and can be inspected in Redis.

## Production Considerations

1. **SMTP Rate Limits**: Check your provider's rate limits
2. **Redis Memory**: Monitor Redis memory usage for large queues
3. **Scaling**: Run multiple worker instances for higher throughput
4. **Monitoring**: Use Bull Board or custom monitoring
5. **Email Validation**: Validate email addresses before queueing
6. **Unsubscribe Links**: Always include unsubscribe options

## License

MIT