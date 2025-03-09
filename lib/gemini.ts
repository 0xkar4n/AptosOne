export async function generateResponse(userInput: string): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });
  
      const data = await response.json();
      return data.response || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error:', error);
      return 'An error occurred. Please try again.';
    }
  }
  