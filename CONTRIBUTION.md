# Contributing to NestJS Bulk Email Service

Thank you for your interest in contributing to the NestJS Bulk Email Service! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style Guidelines](#code-style-guidelines)
- [Performance Considerations](#performance-considerations)

## Getting Started

Before you begin:
- Ensure you have Node.js (v16 or higher) installed
- Have Redis running locally or via Docker
- Familiarize yourself with NestJS, Bull, and email handling concepts
- Read through the main README.md to understand the project

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/nestjs-bulk-email-service.git
   cd nestjs-bulk-email-service
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

4. **Configure Environment**
   
   Create a `.env` file:
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-test-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@test.com
   ```

5. **Run in Development Mode**
   ```bash
   npm run start:dev
   ```

## Project Structure

```
src/
├── email/
│   ├── email.module.ts       # Module configuration and Bull setup
│   ├── email.service.ts      # Email service with queue management
│   ├── email.processor.ts    # Job processor for handling email jobs
│   ├── email.controller.ts   # API endpoints
│   └── dto/                  # Data transfer objects
├── config/                   # Configuration files
└── main.ts                   # Application entry point
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-email-templates`
- `fix/retry-logic-bug`
- `docs/update-readme`
- `perf/optimize-queue-processing`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]
[optional footer]
```

Examples:
- `feat(email): add HTML template support`
- `fix(processor): handle null email addresses`
- `docs(readme): update installation instructions`
- `perf(queue): increase concurrency to 20`

### Areas for Contribution

We welcome contributions in these areas:

1. **Features**
   - Email templates system
   - Scheduled email sending
   - Email tracking (opens, clicks)
   - Attachment support
   - Multi-tenant support
   - Advanced rate limiting strategies

2. **Performance**
   - Queue optimization
   - Memory usage improvements
   - Better chunking algorithms
   - Connection pooling

3. **Testing**
   - Unit tests for services
   - Integration tests for processors
   - E2E tests for API endpoints
   - Load testing scripts

4. **Documentation**
   - Code examples
   - Architecture diagrams
   - Performance tuning guides
   - Troubleshooting guides

5. **DevOps**
   - Docker compose setup
   - Kubernetes configurations
   - CI/CD pipelines
   - Monitoring dashboards

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Writing Tests

- Place unit tests next to the source file: `email.service.spec.ts`
- Use descriptive test names: `should retry failed emails 3 times`
- Mock external dependencies (Redis, SMTP)
- Test edge cases and error conditions

Example:
```typescript
describe('EmailService', () => {
  it('should queue bulk emails in chunks', async () => {
    const recipients = Array(1000).fill('test@example.com');
    await service.sendBulkEmails({ recipients, subject: 'Test' });
    
    expect(queueMock.addBulk).toHaveBeenCalledTimes(10); // 1000/100 chunks
  });
});
```

## Submitting Changes

1. **Ensure Quality**
   - All tests pass
   - Code follows style guidelines
   - No console.log statements
   - Documentation is updated

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Include screenshots for UI changes
   - List breaking changes if any

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   How was this tested?
   
   ## Checklist
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] Code follows style guidelines
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use async/await over promises
- Always specify return types for public methods

```typescript
// Good
async sendEmail(payload: EmailPayload): Promise<void> {
  // ...
}

// Avoid
async sendEmail(payload) {
  // ...
}
```

### NestJS Patterns

- Use dependency injection
- Follow module organization
- Use DTOs for validation
- Leverage decorators properly

```typescript
// Good
@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private readonly logger: Logger,
  ) {}
}
```

### Error Handling

- Use try-catch for async operations
- Log errors with context
- Throw meaningful exceptions
- Handle edge cases

```typescript
try {
  await this.sendEmail(payload);
} catch (error) {
  this.logger.error(`Failed to send email to ${payload.to}`, error.stack);
  throw new InternalServerErrorException('Email sending failed');
}
```

### Comments

- Write self-documenting code
- Comment complex algorithms
- Document public APIs
- Avoid obvious comments

```typescript
// Good: Explains WHY
// Process emails in chunks to avoid memory overflow
const chunks = this.chunkArray(recipients, 100);

// Avoid: States the obvious
// Loop through recipients
for (const recipient of recipients) { }
```

## Performance Considerations

When contributing performance improvements:

1. **Benchmark First**
   - Measure current performance
   - Document baseline metrics
   - Compare before/after results

2. **Consider Trade-offs**
   - Memory vs. speed
   - Complexity vs. maintainability
   - Cost vs. benefit

3. **Test at Scale**
   - Test with 1K, 10K, 100K emails
   - Monitor memory usage
   - Check Redis memory consumption
   - Verify SMTP rate limits

4. **Document Changes**
   - Update performance benchmarks
   - Explain configuration changes
   - Note any breaking changes

## Questions or Issues?

- Open an issue for bugs or feature requests
- Use discussions for questions
- Join our community chat (if available)
- Tag maintainers for urgent matters

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make this project better! 🚀