# Resume Analyzer

An AI-powered resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Built with the MERN stack and powered by Grok AI for intelligent analysis and job recommendations.

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling with custom dark navy/neon violet theme
- **react-hot-toast** - Toast notifications
- **lucide-react** - Icon library
- **react-dropzone** - File upload component

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **axios** - HTTP client for Grok API

### Security
- **helmet** - HTTP security headers
- **express-rate-limit** - Rate limiting for auth routes

## Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Resume Upload** - Support for PDF and DOCX files (max 5MB)
- **AI Analysis** - Powered by Grok AI for ATS scoring and feedback
- **Detailed Feedback** - Strengths, weaknesses, missing keywords, and suggestions
- **Job Recommendations** - Suggested job openings based on strong ATS scores
- **Analysis History** - View past resume analyses
- **Responsive Design** - Mobile-friendly interface
- **Dark Theme** - Modern dark navy and neon violet color scheme

## Project Structure

```
resume-analyzer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ResumeAnalyzerForm.jsx
│   │   │   └── ResultsSection.jsx
│   │   ├── context/       # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
├── server/                # Express backend
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   └── resumeController.js
│   ├── middleware/       # Express middleware
│   │   └── authMiddleware.js
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   └── ResumeAnalysis.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── resume.js
│   ├── utils/            # Utility functions
│   │   ├── upload.js
│   │   ├── extractText.js
│   │   └── grokAnalyzer.js
│   ├── uploads/          # Temporary file storage
│   ├── index.js
│   └── .env
└── README.md
```

## Environment Variables

### Server (.env in /server/)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_jwt_secret_key_here
GROK_API_KEY=your_grok_api_key_here
```

### Required Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `GROK_API_KEY` - API key for Grok AI analysis

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)
- Grok API key from [x.ai](https://x.ai)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-analyzer
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   - Create `.env` file in `/server` directory
   - Add the required environment variables (see above)

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the server**
   ```bash
   cd server
   node index.js
   ```
   Server will start on port 3000

7. **Start the client**
   ```bash
   cd client
   npm run dev
   ```
   Client will start on port 5173 (or next available port)

## Usage

1. **Sign up** - Create a new account at `/signup`
2. **Login** - Access the dashboard at `/login`
3. **Upload Resume** - Navigate to dashboard and upload a PDF or DOCX file
4. **Enter Job Details** - Provide job role, job description, and optional company name
5. **Analyze** - Click "Analyze Resume" to get AI-powered feedback
6. **View Results** - See ATS score, strengths, weaknesses, and suggestions
7. **Job Recommendations** - If ATS score ≥ 75, view recommended job openings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Analysis (Protected)
- `POST /api/resume/analyze` - Analyze resume (requires authentication)
- `GET /api/resume/history` - Get user's analysis history (requires authentication)
- `GET /api/resume/:id` - Get single analysis by ID (requires authentication)

### Health Check
- `GET /api` - API health check

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Rate limiting on auth routes (10 requests per 15 minutes)
- Helmet middleware for HTTP security headers
- File type and size validation
- .env variable validation on server start

## File Upload Constraints

- Accepted formats: PDF, DOCX
- Maximum file size: 5MB
- Automatic file cleanup after analysis

## Troubleshooting

### Server fails to start
- Ensure all required environment variables are set in `.env`
- Check that MongoDB is running
- Verify port 3000 is not in use

### MongoDB connection error
- Ensure MongoDB is running locally or update MONGO_URI for remote instance
- Check MongoDB connection string format

### File upload fails
- Verify file is PDF or DOCX format
- Ensure file size is under 5MB
- Check browser console for specific error messages

### Analysis fails
- Verify GROK_API_KEY is valid and active
- Check server logs for API errors
- Ensure resume text extraction succeeded

## Development

### Running in development mode
- Server: `node index.js` (with nodemon for auto-restart)
- Client: `npm run dev`

### Building for production
```bash
cd client
npm run build
```

## License

MIT License - feel free to use this project for your own purposes.
