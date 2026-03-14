# Multimodal stress detection

Multimodal AI-based stress detection and mental wellness assistant.

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- MongoDB
- AI APIs (LLM + Emotion Models)

## Phase 1 Goal
- AI Chat
- Text Emotion Detection
- Stress Score Tracking
- Analytics Dashboard

## Status
## Project Status

🚧 Phase 1 — Core Features Development

Completed:
- Chat interface
- Emotion detection
- Stress score analytics
- Session management

Upcoming:
- Voice stress detection
- Facial emotion detection
- Multimodal fusion model

---

# Development Workflow

## Branch Structure
- main → Stable production branch
- dev → Active development branch
- feature/* → Individual feature branches

## Rules
1. DO NOT push directly to main
2. Always branch from dev
3. Create feature branches like:
  - feature/chat-ui
  - feature/backend-api
  - feature/database
4. Push feature branch
5. Create Pull Request to merge into dev
6. After testing, dev will be merged into main

---

# Steps: 

## Step 1: Clone Repository

```bash
git clone https://github.com/Hrisshhii/multimodal-stress-detection.git
cd multimodal-stress-detection
```

## Step 2 — Switch to Dev Branch

```bash
git checkout dev
git pull origin dev
```

## Step 3 — Create Your Feature Branch
eg: 
```bash
git checkout -b feature/chat-ui
```

## Step 4 — Commit Your Changes

```bash
git add .
git commit -m "Added chat UI layout"
```

## Step 5 — Push Your Feature Branch

```bash
git push -u origin feature/chat-ui
```

## Step 6 — Create Pull Request
1. Click "Compare & Pull Request"
2. Base branch: dev
3. Merge your feature branch into dev
After review/testing, merged to main.
