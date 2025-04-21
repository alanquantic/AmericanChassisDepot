declare module 'mailgun-js' {
  interface MailgunMessage {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: any[];
    [key: string]: any;
  }

  interface MailgunClient {
    messages(): {
      send(data: MailgunMessage): Promise<any>;
    };
  }

  interface MailgunOptions {
    apiKey: string;
    domain: string;
    host?: string;
    endpoint?: string;
    protocol?: string;
    port?: number;
    timeout?: number;
    retry?: number;
  }

  export default function mailgun(options: MailgunOptions): MailgunClient;
}