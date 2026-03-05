# Project Zero Point - AI Governance System Setup Guide

## Overview
Project Zero Point is a modern citizen complaint management system that empowers citizens to report issues and helps government authorities respond efficiently with AI-powered categorization and tracking.

## Prerequisites
- Node.js 18+ and pnpm
- MongoDB database (local or cloud)
- Environment variables configured

## Environment Variables
Create a `.env.local` file in the project root with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secure-random-secret-key-here
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   - Copy the environment variables above to `.env.local`
   - Replace `MONGODB_URI` with your actual MongoDB connection string
   - Generate a secure `JWT_SECRET` (use any random string)

3. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000 in your browser

4. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## User Roles & Flows

### Citizens
- **Sign up** with email and password
- **Submit complaints** with title, description, location, and optional images
- **View dashboard** with all their submitted complaints
- **Track status** of each complaint (Pending → In Progress → Resolved)
- **View detailed updates** on complaint progress

### Authorities (Government Officials)
- **Sign up** with email and password
- **View all complaints** in the system
- **Filter complaints** by status, priority, or category
- **Update complaint status** as it progresses
- **Assign priorities** to complaints
- **View analytics** on complaint metrics

## Key Features

### 1. Complaint Submission
- Simple form with image upload support
- Auto-categorization using AI rules engine
- Real-time status tracking
- Unique complaint ID for reference

### 2. Dual Dashboards
- **Citizen Dashboard**: Personal complaint list with search/filter
- **Authority Dashboard**: System-wide analytics and complaint management

### 3. Authentication
- Secure password hashing with bcrypt
- JWT tokens with httpOnly cookies
- Session management across page refreshes
- Role-based access control

### 4. AI Categorization
- Automatic complaint categorization based on keywords
- Priority assignment (Low/Medium/High/Critical)
- Extensible rule-based system for future AI integration

## File Structure

```
/app
  /api                           # Backend API routes
    /auth                        # Authentication endpoints
    /complaints                  # Complaint management
    /admin                       # Authority-only endpoints
  /dashboard                     # Citizen dashboard
  /admin                         # Authority dashboard
  /complaint                     # Complaint detail pages
  /login                         # Login page
  /signup                        # Signup page
  /page.tsx                      # Homepage

/lib
  /models                        # Mongoose schemas
  /context                       # React Context for auth
  /db.ts                        # Database connection
  /auth.ts                      # Authentication utilities
  /validation.ts                # Zod schemas
  /ai.ts                        # AI categorization

/components
  /shared                        # Shared components
  /ui                           # shadcn/ui components
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Complaints (Citizen)
- `GET /api/complaints` - Get user's complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints/[id]` - Get complaint details
- `PUT /api/complaints/[id]` - Update complaint

### Admin (Authority)
- `GET /api/admin/complaints` - Get all complaints (with filters)
- `PUT /api/admin/complaints/[id]` - Update complaint status/priority

## Troubleshooting

### Database Connection Error
- Verify MONGODB_URI is correct
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set correctly
- Verify token hasn't expired

### Image Upload Issues
- Check file size (max 5MB)
- Verify file is image format (jpg, png, etc)
- Ensure public folder is writable

## Development Tips

1. **Adding New API Endpoint**
   - Create file in `/app/api/[route]/route.ts`
   - Use `validateAuthToken` or `validateAuthorityRole` for protection
   - Return JSON responses with proper status codes

2. **Adding New Page**
   - Create in `/app/[route]/page.tsx`
   - Add route to middleware protection if needed
   - Import Navigation component

3. **Testing Authentication**
   - Use signup as citizen/authority
   - Check browser dev tools → Applications → Cookies
   - Verify auth-token exists and is valid

## Security Notes

- All passwords are hashed with bcrypt
- JWT tokens stored in httpOnly cookies
- CSRF protection via Next.js
- Input validation with Zod schemas
- SQL injection prevention via Mongoose
- Rate limiting recommended for production

## Future Enhancements

1. Real AI integration (OpenAI, etc)
2. Email notifications
3. File upload to cloud storage (AWS S3, Vercel Blob)
4. Advanced analytics and reporting
5. SMS notifications
6. Complaint escalation workflows
7. Multi-language support
8. Mobile app

## Support

For issues or questions, please refer to the codebase comments or check the Next.js and MongoDB documentation.

## License

This project is part of the Zero Point AI Governance initiative.
