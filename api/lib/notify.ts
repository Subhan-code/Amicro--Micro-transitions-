import { SponsorshipRecord } from './db';

/**
 * Notifies the Amicro owner when a new sponsor submits their onboarding details.
 * Dispatches via webhook (Discord/Slack/Telegram/Generic Webhook) if ADMIN_NOTIFICATION_WEBHOOK
 * or DISCORD_WEBHOOK_URL is set, and logs cleanly in production & dev environments.
 */
export async function notifyOwnerOfNewSponsor(
  sponsorship: SponsorshipRecord,
  adminUrl?: string
): Promise<void> {
  const tierName = sponsorship.tier
    ? sponsorship.tier.charAt(0).toUpperCase() + sponsorship.tier.slice(1)
    : 'Silver';

  const notificationText = [
    `New Amicro ${tierName} Sponsor`,
    '',
    `Sponsor:`,
    `${sponsorship.name || sponsorship.company || 'N/A'}`,
    '',
    `Company / Project:`,
    `${sponsorship.company || sponsorship.company_name || 'N/A'}`,
    '',
    `Website:`,
    `${sponsorship.website || sponsorship.site_url || 'N/A'}`,
    '',
    `Email:`,
    `${sponsorship.email || 'N/A'}`,
    '',
    `Description:`,
    `${sponsorship.description || 'N/A'}`,
    '',
    `X:`,
    `${sponsorship.twitter_url || 'N/A'}`,
    '',
    `GitHub:`,
    `${sponsorship.github_url || 'N/A'}`,
    '',
    `Polar Checkout:`,
    `${sponsorship.checkout_id || sponsorship.polar_checkout_id || 'N/A'}`,
    '',
    `Status:`,
    `Pending Review`,
    ...(adminUrl ? ['', `Review & Approve:`, adminUrl] : []),
  ].join('\n');

  console.log('----------------------------------------------------');
  console.log('[AMICRO NOTIFICATION]');
  console.log(notificationText);
  console.log('----------------------------------------------------');

  const webhookUrl =
    process.env.ADMIN_NOTIFICATION_WEBHOOK ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.SLACK_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      // Check if Discord webhook
      if (webhookUrl.includes('discord.com/api/webhooks')) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `**New Amicro ${tierName} Sponsor!** 🚀\n\`\`\`text\n${notificationText}\n\`\`\``,
          }),
        });
      } else {
        // Generic JSON webhook (Slack / Pager / custom)
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_sponsor_submission',
            sponsorshipId: sponsorship.id,
            tier: sponsorship.tier,
            text: notificationText,
            sponsorship,
          }),
        });
      }
    } catch (err) {
      console.warn('Failed to send owner notification webhook:', err);
    }
  }
}
