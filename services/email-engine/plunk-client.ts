import axios from 'axios';

const PLUNK_API_KEY = process.env.PLUNK_API_KEY;
const PLUNK_API_URL = 'https://api.useplunk.com/v1';

interface EmailParams {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export class EmailEngine {
  /**
   * Send single email
   */
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      const response = await axios.post(
        `${PLUNK_API_URL}/send`,
        {
          to: params.to,
          subject: params.subject,
          body: params.body,
          from: params.from || 'noreply@skybluecloud.tech'
        },
        {
          headers: {
            'Authorization': `Bearer ${PLUNK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.success;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  /**
   * Send welcome email to new subscriber
   */
  async sendWelcomeEmail(email: string, name: string) {
    const template = `
      <h1>Welcome to Skyblue Cloud Tech! 🚀</h1>
      <p>Hi ${name},</p>
      <p>Thanks for subscribing! You'll now receive:</p>
      <ul>
        <li>Weekly SaaS deals & discounts</li>
        <li>Cloud tool comparisons</li>
        <li>Exclusive partner offers</li>
      </ul>
      <p><a href="https://skybluecloud.tech">Browse Tools</a></p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Skyblue Cloud Tech',
      body: template
    });
  }

  /**
   * Send deal notification
   */
  async sendDealAlert(email: string, dealTitle: string, discountValue: number) {
    const template = `
      <h2>🔥 New Deal Alert!</h2>
      <p><strong>${dealTitle}</strong></p>
      <p>Save ${discountValue}% - Limited time only!</p>
      <p><a href="https://skybluecloud.tech/deals">View Deal</a></p>
    `;

    return this.sendEmail({
      to: email,
      subject: `Deal Alert: ${dealTitle}`,
      body: template
    });
  }

  /**
   * Send newsletter (batch)
   */
  async sendNewsletter(subscribers: string[], subject: string, body: string) {
    const promises = subscribers.map(email => 
      this.sendEmail({ to: email, subject, body })
    );

    const results = await Promise.allSettled(promises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;

    console.log(`📧 Newsletter sent to ${successCount}/${subscribers.length} subscribers`);
    return successCount;
  }
}

export const emailEngine = new EmailEngine();