'use client'

import { useState } from 'react'

export default function SummarizePage() {
  const [text, setText] = useState('')
  const [entityId, setEntityId] = useState('')
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, entityId }),
      })

      const data = await res.json()

      if (res.ok) {
        setSummary(data.summary)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>Summarize with Gemini</h1>

      <input
        type="text"
        placeholder="Enter Zendesk Lead/Deal ID"
        value={entityId}
        onChange={(e) => setEntityId(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      <textarea
        rows={10}
        placeholder="Paste your Zendesk ticket text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      <button onClick={handleSummarize} disabled={loading} style={{ padding: '0.75rem 1.5rem' }}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {summary && (
        <div style={{ marginTop: '1.5rem', background: '#f0f0f0', padding: '1rem' }}>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
