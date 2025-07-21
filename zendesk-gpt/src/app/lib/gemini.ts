

export async function summarizeWithGemini(text: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API Key')
  }

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Summarize this message:\n\n${text}`,
              },
            ],
          },
        ],
      }),
    }
  )

  const data = await res.json()

  if (data.error) {
    console.error('Gemini Error:', data.error)
    throw new Error(data.error.message)
  }

  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text
  return summary || 'No summary generated'
}
