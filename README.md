Explain Naija 🇳🇬

Big information. Made simple.

Explain Naija is an AI-powered information accessibility platform that helps everyday Nigerians understand complex public information, official announcements, government notices, grants, and important documents.

Using Meta’s Muse Spark model, Explain Naija transforms complicated information into clear, actionable explanations in multiple Nigerian languages, making important information easier to understand regardless of language preference or literacy level.

Understand better. Make informed decisions. Know what to do next.

⸻

The Problem

Important public information is often communicated through complicated language, lengthy documents, and unfamiliar terminology.

Government announcements, grant opportunities, official notices, and public-service information can be difficult to understand, particularly for people who prefer local languages or struggle with lengthy written information.

This creates an accessibility gap: people may miss opportunities, misunderstand requirements, or fail to take action simply because the information isn’t communicated in a way they understand.

Our Solution

Explain Naija bridges this gap by transforming complex information into simple explanations and actionable guidance.

Users can paste text or upload documents, select their preferred language, and receive an explanation that helps them understand:

* What the information actually means.
* Who the information applies to.
* What actions they need to take.
* Important dates and deadlines.
* Information that is missing or unclear in the original document.

Users can also listen to their explanations through audio playback.

Features

1. AI-Powered Explanations

Uses Meta Muse Spark to simplify complicated information while preserving important facts, requirements, and context.

2. Nigerian Language Support

Generate explanations in:

* Simple English
* Nigerian Pidgin
* Yoruba
* Hausa
* Igbo

3. Document Upload

Upload documents directly instead of manually copying and pasting their contents.

Supported formats:

* PDF
* DOCX
* TXT

4. Actionable Guidance

Explanations are organised into meaningful sections:

* In Plain Words
* Who Is Affected
* Your Next Steps
* Important Dates
* What Is Unclear

5. Listen to Explanations

An integrated text-to-speech feature allows users to listen to generated explanations, with playback controls where supported by the browser.

6. Responsive Experience

A clean, accessible interface designed to work across desktop and mobile devices.

⸻

Built with Meta AI

Explain Naija integrates Meta’s Muse Spark through the Meta Model API.

Muse Spark powers the application’s core intelligence by:

* Understanding complex public information.
* Simplifying unfamiliar terminology.
* Generating structured explanations.
* Following the user’s selected language.
* Identifying missing or ambiguous information.
* Separating information explicitly stated in the source from suggestions.

Meta’s model is central to the experience because the application depends on its ability to understand context and transform complex information into useful, accessible explanations.

⸻

🛠️ Technology Stack

Technology	Purpose
Next.js	Application framework
TypeScript	Type safety
Tailwind CSS	Styling
Meta Model API	AI integration
Muse Spark	Intelligent document explanation
OpenAI Node.js SDK	API client
Browser Speech Synthesis API	Audio playback
Vercel	Deployment

⸻

Architecture

                 USER
                   |
                   ▼
          EXPLAIN NAIJA UI
                   |
          ┌────────┴────────┐
          |                 |
       PASTE TEXT       UPLOAD FILE
          |                 |
          |           TEXT EXTRACTION
          |                 |
          └────────┬────────┘
                   |
                   ▼
             LANGUAGE SELECT
                   |
                   ▼
             NEXT.JS API
              /api/explain
                   |
                   ▼
            META MODEL API
                   |
                   ▼
              MUSE SPARK
                   |
                   ▼
         STRUCTURED EXPLANATION
                   |
          ┌────────┴────────┐
          |                 |
       DISPLAY           AUDIO
       RESULTS           PLAYBACK

⸻

Getting Started

Prerequisites

* Node.js
* npm
* A Meta Model API account and API key

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/explain-naija.git
cd explain-naija

2. Install dependencies

npm install

3. Configure environment variables

Create a .env.local file in the project root.

MODEL_API_KEY=your_meta_model_api_key

Never commit your actual API key to GitHub.

4. Start the development server

npm run dev

Open http://localhost:3000 in your browser.

5. Build for production

npm run build

⸻

Security and Responsible AI

Explain Naija is designed to improve access to information, not replace official sources or professional advice.

The application aims to:

* Preserve facts and important details from submitted documents.
* Avoid inventing eligibility requirements, deadlines, or figures.
* Highlight missing or ambiguous information.
* Distinguish source information from AI-generated suggestions.
* Keep API credentials on the server.
* Avoid permanently storing uploaded documents.

AI-generated explanations should always be checked against the original source, particularly when they concern legal, financial, or government requirements.

⸻

Hackathon Track

Build for Your World

Explain Naija brings Meta’s AI capabilities into a real-world Nigerian context, addressing the accessibility gap between important public information and the people who need to understand it.

The project explores how multimodal AI and language capabilities can make information more inclusive, understandable, and actionable.

⸻

What’s Next?

Potential future improvements include:

* Improved Nigerian language speech synthesis.
* Voice-based document interaction.
* Visual explanations of complex information.
* More Nigerian language support.
* Additional document formats.
* Offline accessibility features.

⸻

👩🏽‍💻 Built By

Jemila Ibrahim

Frontend Developer | AI Enthusiast

Built for the Meta Global AI Developer Hackathon 2026.

⸻

Explain Naija — Clarity for everyone. 🇳🇬