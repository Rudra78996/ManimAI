# ManimAI

ManimAI is an AI-powered platform for generating math concept animations automatically, providing an interactive way to understand complex mathematical ideas.

## Features

* Generate animations from AI-generated scripts
* Interactive and user-friendly interface
* Real-time progress monitoring

## Tech Stack

* Frontend: React.js
* Backend: Node.js, Express.js
* Database: MongoDB
* Task Queue: Redis
* Animation Engine: Manim (with Docker)
* AI Integration: Gemini LLM

## How It Works

1. User submits a math prompt.
2. Backend processes the prompt and generates an animation script using Gemini LLM.
3. The animation is rendered using Manim inside a Docker container.
4. The generated video is returned to the user and displayed in the frontend.

---

Created by Rudra Pratap Singh
