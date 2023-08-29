# Bot WA V2

## Description

Bot WA V2 is a WhatsApp bot that integrates with various services like OpenAI, DeepAI, and Firebase to provide a range of functionalities.

## Requirements

- Node.js
- Baileys (WhatsApp Web API)
- OpenAI
- DeepAI
- Firebase

## Installation

Clone the repository:

```bash
git clone https://github.com/NeguinDev/bot-wa-v2.git
```

Install the dependencies:

```bash
npm install
```

Rename `.env.exemple` to `.env` and fill in the required environment variables:

```
PREFIX=/
OPENAI_API_KEY=your_openai_api_key
```

## Usage

To start the bot, run:

```bash
npm start
```

For development:

```bash
npm run dev
```

## Features

### Commands

The bot supports various commands for different functionalities like downloading Instagram posts, generating stickers, and more.

### AI Integration

The bot integrates with OpenAI's GPT-3 to provide conversational capabilities.

### Image Editing

The bot uses DeepAI for image editing tasks.

### Data Storage

The bot uses Firebase for storing and retrieving data.

## License

ISC
