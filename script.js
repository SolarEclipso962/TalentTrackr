// API Configuration - Dynamic for network access
const API_BASE = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:5000/api`;
})();

// User Profile
let userProfile = {
    name: '',
    email: '',
    skills: [],
    jobType: 'Any',
    workLocation: 'Any',
    resume: '',
    scores: {}
};

// Load profile from localStorage
function loadProfile() {
    const saved = localStorage.getItem('talenttrackr_profile');
    if (saved) {
        userProfile = JSON.parse(saved);
        updateProfileUI();
    }
}

// Save profile to localStorage
function saveProfile() {
    localStorage.setItem('talenttrackr_profile', JSON.stringify(userProfile));
    updateProfileUI();
}

// Update profile UI display
function updateProfileUI() {
    const profileStatus = document.getElementById('profileStatus');
    const profilePreview = document.getElementById('profilePreview');
    
    if (userProfile.name) {
        profileStatus.textContent = 'Profile complete ✓';
        profileStatus.style.color = '#10b981';
        
        let previewHTML = `
            <div style="margin-bottom: 1rem;">
                <p style="color: #6b7280; font-size: 0.75rem; text-transform: uppercase;">Name</p>
                <p style="color: #1f2937; font-weight: 600;">${userProfile.name}</p>
            </div>
        `;
        
        if (userProfile.skills.length > 0) {
            previewHTML += `
                <div style="margin-bottom: 1rem;">
                    <p style="color: #6b7280; font-size: 0.75rem; text-transform: uppercase;">Skills</p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${userProfile.skills.map(s => `<span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${s}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        profilePreview.innerHTML = previewHTML;
    } else {
        profileStatus.textContent = 'Setup needed';
        profileStatus.style.color = '#f59e0b';
        profilePreview.innerHTML = '<p style="color: #6b7280; font-size: 0.875rem;">No profile data yet. Click "Profile Setup" to get started!</p>';
    }
}

// Modal management
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    loadAllJobs();
    updateTopSkills();
    setupEventListeners();
    setupModal();
});

function setupModal() {
    // Open modal buttons
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'flex';
        });
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Resume upload
    const dropZone = document.getElementById('dropZone');
    const resumeFile = document.getElementById('resumeFile');
    const resumeText = document.getElementById('resumeText');
    
    if (dropZone && resumeFile) {
        dropZone.addEventListener('click', () => resumeFile.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#2563eb';
            dropZone.style.background = '#eff6ff';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '#e5e7eb';
            dropZone.style.background = 'transparent';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#e5e7eb';
            dropZone.style.background = 'transparent';
            if (e.dataTransfer.files.length) {
                handleResumeFile(e.dataTransfer.files[0]);
            }
        });
        
        resumeFile.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleResumeFile(e.target.files[0]);
            }
        });
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            userProfile.name = document.getElementById('fullName').value;
            userProfile.email = document.getElementById('userEmail').value;
            userProfile.skills = document.getElementById('userSkills').value
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            userProfile.jobType = document.getElementById('jobType').value;
            userProfile.workLocation = document.getElementById('workLocation').value;
            
            saveProfile();
            alert('Profile saved! Now go get AI-matched jobs.');
            document.getElementById('profile-modal').style.display = 'none';
        });
    }
    
    // Analyze resume button
    const analyzeBtn = document.getElementById('analyzeResumeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const text = resumeText.value.trim();
            if (!text) {
                alert('Please paste your resume text first');
                return;
            }
            
            analyzeResume(text);
            alert('Resume analyzed! Check your profile.');
            document.getElementById('resume-modal').style.display = 'none';
        });
    }
    
    // Run matching button
    const runMatchBtn = document.getElementById('runMatchBtn');
    if (runMatchBtn) {
        runMatchBtn.addEventListener('click', () => {
            if (!userProfile.name) {
                alert('Please set up your profile first!');
                return;
            }
            runAIMatching();
        });
    }
}

function handleResumeFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        document.getElementById('resumeText').value = text.substring(0, 1000);
    };
    
    if (file.type === 'text/plain') {
        reader.readAsText(file);
    } else {
        document.getElementById('resumeText').value = 'File uploaded: ' + file.name + '\nPlease paste the text content below:';
    }
}

function analyzeResume(resumeText) {
    userProfile.resume = resumeText;
    
    // Extract skills using keywords
    const skillKeywords = {
        'JavaScript': ['javascript', 'js', 'react', 'vue', 'node'],
        'Python': ['python', 'django', 'flask', 'pandas'],
        'SQL': ['sql', 'database', 'mysql', 'postgresql'],
        'Excel': ['excel', 'spreadsheet', 'vba'],
        'Customer Service': ['customer service', 'support', 'help desk', 'communication'],
        'Project Management': ['project management', 'agile', 'scrum', 'planning'],
        'Data Analysis': ['data analysis', 'analytics', 'reporting', 'bi'],
        'Marketing': ['marketing', 'social media', 'content', 'seo'],
        'Sales': ['sales', 'business development', 'negotiation'],
        'Communication': ['communication', 'presentation', 'writing'],
        'Leadership': ['leadership', 'management', 'team', 'mentor'],
        'Problem Solving': ['problem solving', 'analytical', 'critical thinking']
    };
    
    const text = resumeText.toLowerCase();
    const foundSkills = [];
    
    for (const [skill, keywords] of Object.entries(skillKeywords)) {
        if (keywords.some(kw => text.includes(kw))) {
            foundSkills.push(skill);
        }
    }
    
    if (foundSkills.length > 0) {
        userProfile.skills = [...new Set([...userProfile.skills, ...foundSkills])];
        saveProfile();
    }
}

function setupEventListeners() {
    // Search form
    const searchForm = document.querySelector('.search');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchInput').value.toLowerCase();
            if (query.trim()) {
                searchJobs(query);
            }
        });
    }
    
    // Filters
    const typeFilter = document.getElementById('typeFilter');
    const tagFilter = document.getElementById('tagFilter');
    const resetBtn = document.getElementById('resetFilters');
    
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (tagFilter) tagFilter.addEventListener('change', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

// Fetch and display all jobs
async function loadAllJobs() {
    const container = document.getElementById('jobsContainer');
    if (!container) return;
    
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading jobs...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/jobs?count=30`);
        const data = await response.json();
        
        if (data.success && data.jobs && data.jobs.length > 0) {
            displayJobs(data.jobs);
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No jobs available. Try again later.</p>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Error loading jobs. Please refresh.</p>';
    }
}

// Display jobs
function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '';
    
    if (!jobs || jobs.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No jobs found.</p>';
        return;
    }
    
    jobs.forEach(job => {
        const card = createJobCard(job);
        container.appendChild(card);
    });
}

// Create job card element
function createJobCard(job) {
    const card = document.createElement('article');
    card.className = 'card';
    
    const matchScore = calculateMatchScore(job);
    const matchBadge = matchScore > 0 ? `<div style="background: #dbeafe; color: #0c4a6e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">${matchScore}% match</div>` : '';
    
    card.innerHTML = `
        <div>
            ${matchBadge}
            <h3>${job.title}</h3>
            <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>${job.company}</strong></p>
            <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">${job.location} · ${job.salary}</p>
            <p style="color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem;">${job.description.substring(0, 100)}...</p>
            <div class="tags">
                ${(job.tags || []).map(tag => `<span>${tag}</span>`).join('')}
            </div>
        </div>
        <button onclick="openJobModal(${JSON.stringify(job).replace(/"/g, '&quot;')})" style="padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; white-space: nowrap;">Apply Now</button>
    `;
    
    return card;
}

// Job modal
function openJobModal(job) {
    let modal = document.getElementById('job-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'job-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const matchScore = calculateMatchScore(job);
    const matchInfo = matchScore > 0 ? `<p style="color: #10b981; font-weight: 600; margin-bottom: 1rem;">✓ ${matchScore}% AI match based on your profile</p>` : '';
    
    modal.innerHTML = `
        <div class="modal-content">
            ${matchInfo}
            <h2>${job.title}</h2>
            <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 1.5rem;"><strong>${job.company}</strong></p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #f3f4f6; border-radius: 0.75rem;">
                <div>
                    <p style="color: #6b7280; font-size: 0.875rem;">Location</p>
                    <p style="font-weight: 600;">${job.location}</p>
                </div>
                <div>
                    <p style="color: #6b7280; font-size: 0.875rem;">Salary</p>
                    <p style="font-weight: 600;">${job.salary}</p>
                </div>
                <div>
                    <p style="color: #6b7280; font-size: 0.875rem;">Type</p>
                    <p style="font-weight: 600;">${job.type}</p>
                </div>
                <div>
                    <p style="color: #6b7280; font-size: 0.875rem;">Level</p>
                    <p style="font-weight: 600;">Entry-level</p>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f9ff; border-radius: 0.75rem;">
                <h3 style="margin-bottom: 0.5rem;">About This Role</h3>
                <p style="color: #6b7280;">${job.description}</p>
            </div>
            
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fef3c7; border-radius: 0.75rem;">
                <h3 style="margin-bottom: 0.5rem;">Contact Information</h3>
                <p style="color: #6b7280; margin-bottom: 0.5rem;">
                    <strong>Email:</strong> <a href="mailto:${job.contact.email}" style="color: #2563eb; text-decoration: none;">${job.contact.email}</a>
                </p>
                <p style="color: #6b7280;">
                    <strong>Phone:</strong> <a href="tel:${job.contact.phone}" style="color: #2563eb; text-decoration: none;">${job.contact.phone}</a>
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <button class="close-btn secondary" onclick="document.getElementById('job-modal').style.display='none';" style="padding: 0.75rem 1.5rem; border: 1px solid #e5e7eb; background: white; border-radius: 0.5rem; cursor: pointer; font-weight: 600; color: #1f2937;">Close</button>
                <a href="mailto:${job.contact.email}?subject=Application for ${job.title} at ${job.company}&body=Hi,\n\nI'm excited to apply for the ${job.title} position at ${job.company}.\n\nBest regards" style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; text-decoration: none; border-radius: 0.5rem; text-align: center; font-weight: 600;">Send Application Email</a>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// AI Matching Algorithm
function calculateMatchScore(job) {
    if (!userProfile.skills || userProfile.skills.length === 0) return 0;
    
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    let matches = 0;
    
    userProfile.skills.forEach(skill => {
        if (jobText.includes(skill.toLowerCase())) {
            matches++;
        }
    });
    
    let score = Math.round((matches / userProfile.skills.length) * 100);
    
    // Bonus for location match
    if (job.location.toLowerCase() === userProfile.workLocation.toLowerCase()) {
        score = Math.min(100, score + 10);
    }
    
    // Bonus for job type match
    if (job.type === userProfile.jobType) {
        score = Math.min(100, score + 10);
    }
    
    return score;
}

function runAIMatching() {
    const container = document.getElementById('matchResults');
    container.innerHTML = '<p style="text-align: center; padding: 2rem;">Running AI analysis...</p>';
    
    // Simulate AI processing
    setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE}/jobs?count=30`);
            const data = await response.json();
            
            if (data.jobs) {
                // Score and sort jobs
                const scored = data.jobs.map(job => ({
                    ...job,
                    matchScore: calculateMatchScore(job)
                })).sort((a, b) => b.matchScore - a.matchScore);
                
                // Display top matches
                const html = `
                    <div style="margin-bottom: 1rem;">
                        <h3 style="margin-bottom: 1rem;">🎯 Your Top AI-Matched Jobs</h3>
                        ${scored.slice(0, 5).map((job, idx) => `
                            <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem; cursor: pointer; border-left: 4px solid ${job.matchScore >= 70 ? '#10b981' : '#f59e0b'};" onclick="openJobModal(${JSON.stringify(job).replace(/"/g, '&quot;')})">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong>#${idx + 1} - ${job.title}</strong>
                                    <span style="background: ${job.matchScore >= 70 ? '#d1fae5' : '#fef3c7'}; color: ${job.matchScore >= 70 ? '#065f46' : '#92400e'}; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${job.matchScore}%</span>
                                </div>
                                <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">${job.company} · ${job.location}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.innerHTML = html;
            }
        } catch (error) {
            container.innerHTML = '<p style="color: #dc2626;">Error running AI matching. Please try again.</p>';
        }
    }, 1000);
}

// Search jobs
async function searchJobs(query) {
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Searching...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/jobs/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.jobs) {
            displayJobs(data.jobs);
        } else {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No jobs found for "${query}"</p>`;
        }
    } catch (error) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Error searching. Please try again.</p>';
    }
}

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;
    
    loadAllJobs();
    // In a real app, would filter after load
}

// Reset filters
function resetFilters() {
    document.getElementById('typeFilter').value = '';
    document.getElementById('tagFilter').value = '';
    loadAllJobs();
}

// Update top skills display
function updateTopSkills() {
    const topSkillsEl = document.getElementById('topSkills');
    if (topSkillsEl) {
        const skills = ['JavaScript', 'Python', 'SQL', 'Customer Service', 'Project Management', 'Data Analysis'];
        topSkillsEl.textContent = skills.join(' • ');
    }
}
