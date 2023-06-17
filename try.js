const { OpenAI } = require('openai');
const openai = new OpenAI('YOUR_API_KEY');

async function getChatCompletion() {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the weather like today?' },
      { role: 'assistant', content: 'The weather is sunny and warm.' },
      { role: 'user', content: 'Great! Will it rain tomorrow?' }
    ];

    const response = await openai.chatCompletion.create({
      model: 'YOUR_MODEL',
      messages: messages
    });

    const completion = response.choices[0].message.content;
    console.log('Completion:', completion);
  } catch (error) {
    console.error('Error:', error);
  }
}

getChatCompletion();
