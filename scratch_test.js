const fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch') || globalThis.fetch;

const apiKey = process.env.VITE_GROQ_API_KEY;

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify({
    model: 'llama-3.2-11b-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'return json { "is_real": true }' },
          { type: 'image_url', image_url: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' } }
        ]
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  })
}).then(r => r.text().then(t => console.log(r.status, t)));
