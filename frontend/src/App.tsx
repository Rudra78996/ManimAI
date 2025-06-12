import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnimation = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('http://localhost:5050/generate-animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate animation');
      }
      const videoUrl = await response.json();
      setVideoUrl(videoUrl.videoUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Manim Animation Generator</h1>
        <textarea
          rows={5}
          cols={50}
          placeholder="Enter your animation prompt here... (e.g., 'A red circle transforming into a blue square')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        ></textarea>
        <button onClick={handleGenerateAnimation} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Animation'}
        </button>

        {error && <p className="error-message">Error: {error}</p>}

        {videoUrl && (
          <div className="video-container">
            <h2>Generated Animation:</h2>
            <video controls src={videoUrl} width="640" height="360">
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
