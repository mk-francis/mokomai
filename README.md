# MOKOM AI - Intelligent Assistant Frontend

A modern, feature-rich AI assistant frontend application with multi-assistant collaboration and real-time communication capabilities.

## 🚀 Features

- **Multi-Assistant Chat**: Switch between different AI assistants seamlessly
- **Real-time Communication**: Voice and video calls with LiveKit integration
- **File Upload**: Support for documents, images, and media files
- **Voice Recording**: Record and send voice messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Modern tech-focused dark UI with blue accents
- **Conversation History**: Save and manage chat conversations
- **Drag & Drop**: Easy file uploading with drag and drop support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Theme**: next-themes
- **Real-time**: LiveKit (ready for integration)

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd mokom-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your API configuration:
\`\`\`env
NEXT_PUBLIC_API_BASE=http://localhost:8000
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Backend API

The frontend expects a backend API running on `http://localhost:8000` with the following endpoints:

- `POST /api/chat` - Send messages to AI assistants
- `GET /api/assistants` - Get available assistants
- `GET /api/conversations` - Get conversation history
- `GET /api/conversations/{id}` - Get specific conversation messages
- `POST /api/upload` - Upload files
- `POST /api/livekit/token` - Get LiveKit room tokens

### LiveKit Integration

For real-time voice/video features, configure LiveKit:

1. Set up a LiveKit server
2. Add LiveKit credentials to `.env.local`
3. The VoiceRoom component will handle connections automatically

## 🎨 Customization

### Theme Colors

The app uses a tech-focused color scheme with blue accents. You can customize colors in:
- `tailwind.config.js` - Tailwind color palette
- `app/globals.css` - CSS custom properties

### Assistant Types

Add new assistant types by updating the `assistantIcons` object in `components/chat/assistant-panel.tsx`.

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar + main content layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Single column with bottom navigation

## 🔐 Security

- Environment variables for sensitive data
- CORS handling in API client
- File type validation for uploads
- XSS protection with proper content sanitization

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## 📄 API Documentation

### Chat API

\`\`\`typescript
// Send message
POST /api/chat
{
  "message": "Hello, AI!",
  "assistant_id": "gpt-4",
  "session_id": "optional-session-id"
}

// Response
{
  "response": "Hello! How can I help you?",
  "assistant_id": "gpt-4",
  "assistant_name": "GPT-4",
  "session_id": "session-123",
  "timestamp": 1640995200000
}
\`\`\`

### File Upload

\`\`\`typescript
POST /api/upload
Content-Type: multipart/form-data

// Response
{
  "file_id": "file-123",
  "file_url": "https://example.com/file.pdf",
  "file_type": "application/pdf"
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

Built with ❤️ using Next.js and modern web technologies.
