export interface BulkEmailPayload {
  recipients: string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}