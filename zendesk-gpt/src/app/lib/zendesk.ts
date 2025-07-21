export async function postNoteToZendesk(entityId: string, summary: string) {
  const url = `https://${process.env.ZENDESK_DOMAIN}.zendesk.com/api/v2/sell/deals/${entityId}/notes`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.ZENDESK_EMAIL + '/token:' + process.env.ZENDESK_API_TOKEN).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: summary }),
  });

  if (!response.ok) {
    throw new Error('Failed to post summary to Zendesk');
  }
}
