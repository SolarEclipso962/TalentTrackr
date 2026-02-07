# 🚀 TalentTrackr - AI-Powered Job Matching Platform

A fully functional, AI-powered job matching platform designed for entry-level job seekers. No downloads required - access directly from any device on the network!

## ✨ Features

### 🤖 AI-Powered Features
- **AI Resume Analysis**: Upload your resume and our AI extracts your skills automatically
- **AI Job Matching**: Get jobs ranked by match percentage based on your skills (0-100%)
- **Smart Skill Detection**: AI identifies 12+ different job skills from your resume
- **Intelligent Filtering**: Filter jobs by type, category, location, and salary
- **Career Guidance**: AI-generated insights on top in-demand skills and interview tips

### 📱 User Features
- **Profile Creation**: Build your professional profile with skills, preferences, and work location
- **Resume Upload**: Drag-and-drop or paste resume text for AI analysis
- **Job Search**: Real-time search across 10+ entry-level positions
- **One-Click Applications**: Apply directly via email with pre-filled information
- **Job Details Modal**: View full job information, company contact, and salary details
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile phones

### 💼 Job Features
- **10 Entry-Level Positions**: Pre-loaded job listings with full details
- **Company Contact Info**: Direct email and phone for all positions
- **Tags & Categories**: Filter by Tech, Remote, Entry-level, Operations, and more
- **Salary Information**: Clear salary ranges for all positions
- **Job Descriptions**: Detailed role descriptions and requirements

## 🌐 Access from Phone

### Option 1: Same Network (Recommended)
1. Make sure your phone is on the same Wi-Fi network as your computer
2. Open a browser on your phone
3. Visit: **http://10.0.0.147:8000**
   - Note: Replace `10.0.0.147` with the IP shown in your terminal
4. Bookmark this URL for easy access

### Option 2: Mobile Testing
The website is fully responsive and mobile-optimized:
- Single-column layout on mobile
- Touch-friendly buttons and forms
- Optimized modal popups
- Fast loading times

### Option 3: Using localhost on Same Device
- Desktop: http://localhost:8000
- Tablets/Phones on same network: http://YOUR_IP:8000

## 📋 How to Use

### 1. **Create Your Profile**
   - Click "Profile Setup" button
   - Enter your name, email, and skills
   - Select preferred job type and work location
   - Save profile to localStorage

### 2. **Upload Your Resume (Optional)**
   - Click "📄 Upload Resume" button
   - Either drag-and-drop a file OR paste resume text
   - Click "Analyze Resume"
   - AI automatically extracts your skills

### 3. **Get AI-Matched Jobs**
   - Click "⚡ Get AI Matches" button
   - See jobs ranked by match percentage
   - Your skills are highlighted against job requirements
   - Jobs with 70%+ match highlighted in green

### 4. **Search for Jobs**
   - Use search bar: filter by role, skill, or company
   - Filter by job type (Full-time, Part-time, Internship)
   - Filter by category (Tech, Remote, Entry-level)
   - Reset filters to see all jobs

### 5. **Apply for Jobs**
   - Click "Apply Now" on any job card
   - View full job details in modal
   - See AI match percentage
   - Click "Send Application Email"
   - Email automatically pre-filled with job details

## 🎯 AI Matching Algorithm

The AI calculates match scores based on:
1. **Skill Match** (60%): Does your resume contain job-related skills?
2. **Location Match** (+10%): Do location preferences align?
3. **Job Type Match** (+10%): Does job type match your preference?
4. **Result**: 0-100% match score displayed on each job

### Top In-Demand Skills (AI Detected)
- JavaScript / React
- Python / Django
- SQL / Database
- Customer Service
- Project Management
- Data Analysis
- Excel / Spreadsheets
- Marketing
- Sales
- Communication
- Leadership
- Cloud Technologies

## 🏢 Pre-Loaded Jobs

All jobs include:
- ✓ Company name and contact info
- ✓ Full job description
- ✓ Salary range
- ✓ Work location (Remote/Hybrid/On-site)
- ✓ Job type (Full-time/Part-time/Internship)
- ✓ Relevant tags and categories

### Job Categories
- **Tech**: Junior Frontend Developer, Data Entry Specialist, Python Developer, QA Tester
- **Customer Service**: Customer Service Rep, Virtual Assistant, Support Specialist
- **Operations**: Operations Coordinator, Warehouse Lead
- **Marketing**: Social Media Coordinator
- **Design**: Junior UX Designer, Graphic Designer

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - With CSS variables, Grid, Flexbox, animations
- **JavaScript (Vanilla)** - No frameworks needed

### Backend
- **Python Flask** - Micro web framework
- **Flask-CORS** - Cross-origin requests
- **Requests Library** - HTTP client

### Data Storage
- **localStorage** - Client-side profile storage
- **Fallback Jobs Database** - 10 pre-loaded positions
- **Memory Cache** - 1-hour job data caching

## 💾 Data Privacy

- All user data stored locally (localStorage) - never sent to server
- Resume text stored only in your browser
- No cookies or third-party tracking
- Profiles persist across browser sessions

## 🔧 System Requirements

- **Browser**: Chrome, Firefox, Safari, Edge (modern versions)
- **Network**: Connected to same network as server
- **Server**: Python 3.x with Flask installed
- **Storage**: ~5MB for website files

## 🚀 Installation & Running

```bash
# Install dependencies
pip install -r requirements.txt

# Start backend API (port 5000)
python backend.py

# Start frontend server (port 8000)
python3 -m http.server 8000

# Access website
# Desktop: http://localhost:8000
# Mobile: http://YOUR_IP:8000
```

## 📊 API Endpoints

### Get All Jobs
```
GET /api/jobs?count=20
```
Returns JSON with jobs array, success status, and source

### Search Jobs
```
GET /api/jobs/search?q=developer
```
Returns filtered jobs matching query

### Health Check
```
GET /api/health
```
Returns API status and cached jobs count

## 🎓 Career Guidance Section

AI provides tips on:
- **Resume Writing**: Action verbs, customization, transferable skills
- **Interview Prep**: Practice questions, company research, follow-ups
- **Entry-Level Success**: Overcoming no-experience barrier
- **Skill Development**: Most in-demand skills to learn

## 📱 Mobile Optimization

✓ Fully responsive design
✓ Touch-optimized buttons
✓ Single-column layout on mobile
✓ Readable font sizes
✓ Fast page loads
✓ Optimized modals for small screens

## 🐛 Troubleshooting

### Website won't load
- Check if backend is running: `curl http://localhost:5000/api/health`
- Check if frontend server is running: `curl http://localhost:8000`
- Try clearing browser cache

### Can't access from phone
- Ensure phone is on same Wi-Fi network
- Use correct IP address (not localhost)
- Check firewall settings allow ports 5000 and 8000

### No jobs showing
- Refresh the page
- Check backend logs for errors
- Verify API is returning jobs: `curl http://localhost:5000/api/jobs`

### AI matching not working
- Complete your profile first
- Make sure you have skills listed
- Try uploading/analyzing a resume

## 📞 Support

For issues or questions:
- Email: steeleeclipse962@gmail.com
- Check browser console (F12) for errors
- Verify both servers are running

## 📄 License

TalentTrackr © 2025 - Built for real-time job availability

---

**Ready to find your next job? Start by clicking "Profile Setup" to begin your AI-powered job matching journey!** 🚀
