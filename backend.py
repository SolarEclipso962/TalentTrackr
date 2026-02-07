from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Add headers to allow cross-origin requests
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Fallback jobs for when API is unavailable
FALLBACK_JOBS = [
    {
        'id': 1,
        'title': 'Junior Frontend Developer',
        'company': 'TechStart Inc',
        'description': 'Build web applications with React. No experience required, we provide training.',
        'location': 'Remote',
        'salary': '$35,000 - $45,000',
        'type': 'Full-time',
        'tags': ['Tech', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@techstartinc.com', 'phone': '(555) 123-4567'},
        'url': '#'
    },
    {
        'id': 2,
        'title': 'Customer Service Representative',
        'company': 'Global Support',
        'description': 'Help customers with inquiries. Entry-level position, training provided.',
        'location': 'Remote',
        'salary': '$28,000 - $35,000',
        'type': 'Full-time',
        'tags': ['Operations', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@globalsupport.com', 'phone': '(555) 234-5678'},
        'url': '#'
    },
    {
        'id': 3,
        'title': 'Data Entry Specialist',
        'company': 'DataFlow Systems',
        'description': 'Process and organize data. Perfect for beginners looking to start their career.',
        'location': 'Remote',
        'salary': '$26,000 - $32,000',
        'type': 'Full-time',
        'tags': ['Operations', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@dataflowsystems.com', 'phone': '(555) 345-6789'},
        'url': '#'
    },
    {
        'id': 4,
        'title': 'Content Writer (Intern)',
        'company': 'Creative Media',
        'description': 'Create engaging content for our blog. Internship with potential for full-time role.',
        'location': 'Remote',
        'salary': '$18,000 - $24,000',
        'type': 'Internship',
        'tags': ['Content', 'Remote', 'Internship'],
        'contact': {'email': 'jobs@creativemedia.com', 'phone': '(555) 456-7890'},
        'url': '#'
    },
    {
        'id': 5,
        'title': 'Junior Python Developer',
        'company': 'CodeCraft Studios',
        'description': 'Develop backend services with Python. Mentorship available for junior developers.',
        'location': 'Remote',
        'salary': '$40,000 - $50,000',
        'type': 'Full-time',
        'tags': ['Tech', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@codecraftstudios.com', 'phone': '(555) 567-8901'},
        'url': '#'
    },
    {
        'id': 6,
        'title': 'Virtual Assistant',
        'company': 'Administrative Solutions',
        'description': 'Provide administrative support. No prior experience necessary.',
        'location': 'Remote',
        'salary': '$24,000 - $30,000',
        'type': 'Full-time',
        'tags': ['Operations', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@adminsoutions.com', 'phone': '(555) 678-9012'},
        'url': '#'
    },
    {
        'id': 7,
        'title': 'Social Media Coordinator',
        'company': 'Brand Connect',
        'description': 'Manage social media accounts for startups. Entry-level position, no experience needed.',
        'location': 'Remote',
        'salary': '$22,000 - $28,000',
        'type': 'Full-time',
        'tags': ['Marketing', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@brandconnect.com', 'phone': '(555) 789-0123'},
        'url': '#'
    },
    {
        'id': 8,
        'title': 'Junior UX Designer',
        'company': 'DesignHub',
        'description': 'Design user interfaces for web applications. Portfolio or projects appreciated.',
        'location': 'Remote',
        'salary': '$38,000 - $48,000',
        'type': 'Full-time',
        'tags': ['Design', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@designhub.com', 'phone': '(555) 890-1234'},
        'url': '#'
    },
    {
        'id': 9,
        'title': 'Telemarketing Representative',
        'company': 'Sales Force',
        'description': 'Reach out to potential customers. Training provided, no experience required.',
        'location': 'Remote',
        'salary': '$20,000 - $25,000',
        'type': 'Full-time',
        'tags': ['Sales', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@salesforce.com', 'phone': '(555) 901-2345'},
        'url': '#'
    },
    {
        'id': 10,
        'title': 'Quality Assurance Tester',
        'company': 'QA Solutions',
        'description': 'Test software applications for bugs. Entry-level technical role, training provided.',
        'location': 'Remote',
        'salary': '$32,000 - $40,000',
        'type': 'Full-time',
        'tags': ['Tech', 'Remote', 'Entry-level'],
        'contact': {'email': 'jobs@qasolutions.com', 'phone': '(555) 012-3456'},
        'url': '#'
    },
]

# Cache for job data
job_cache = {
    'data': [],
    'timestamp': None,
    'ttl': 3600  # 1 hour cache
}

def is_cache_valid():
    """Check if cache is still valid"""
    if not job_cache['data'] or job_cache['timestamp'] is None:
        return False
    elapsed = (datetime.now() - job_cache['timestamp']).total_seconds()
    return elapsed < job_cache['ttl']

def extract_tags(title='', description=''):
    """Extract job category tags"""
    text = f"{title} {description}".lower()
    tags = []
    
    if any(x in text for x in ['developer', 'engineer', 'programmer', 'javascript', 'python']):
        tags.append('Tech')
    elif any(x in text for x in ['manager', 'coordinator', 'specialist', 'support']):
        tags.append('Operations')
    elif any(x in text for x in ['marketing', 'advertis']):
        tags.append('Marketing')
    elif any(x in text for x in ['designer', 'design']):
        tags.append('Design')
    
    if 'remote' in text:
        tags.append('Remote')
    if any(x in text for x in ['junior', 'entry', 'intern', 'no experience']):
        tags.append('Entry-level')
    
    return tags if tags else ['Job']

def fetch_real_jobs():
    """Fetch real jobs from public APIs"""
    jobs = []
    
    print("Fetching real jobs...")
    
    try:
        # Try using Jooble API
        url = "https://jooble.org/api/position/search"
        payload = {
            "keywords": "entry level junior intern remote",
            "location": ""
        }
        
        response = requests.post(url, json=payload, timeout=8)
        if response.status_code == 200:
            data = response.json()
            positions = data.get('positions', [])
            
            for pos in positions[:15]:
                job = {
                    'id': hash(pos.get('title', '')) % 10000,
                    'title': pos.get('title', 'Job'),
                    'company': pos.get('company', 'Company'),
                    'description': pos.get('snippet', '')[:150],
                    'location': pos.get('location', 'Remote'),
                    'salary': 'Competitive',
                    'type': 'Full-time',
                    'tags': extract_tags(pos.get('title', ''), pos.get('snippet', '')),
                    'contact': {
                        'email': f"jobs@{pos.get('company', 'company').lower().replace(' ', '')}.com",
                        'phone': '(555) 123-4567'
                    },
                    'url': pos.get('url', '#')
                }
                jobs.append(job)
            
            print(f"Got {len(jobs)} jobs from Jooble")
    
    except Exception as e:
        print(f"Error fetching from Jooble: {e}")
    
    # If we got jobs, cache them
    if len(jobs) > 0:
        job_cache['data'] = jobs
        job_cache['timestamp'] = datetime.now()
        print(f"Cached {len(jobs)} real jobs")
    
    return jobs if len(jobs) > 0 else None

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Fetch remote jobs"""
    try:
        count = request.args.get('count', 20, type=int)
        
        # Check cache
        if is_cache_valid():
            return jsonify({
                'success': True,
                'count': len(job_cache['data'][:count]),
                'jobs': job_cache['data'][:count],
                'source': 'cache'
            })
        
        # Fetch real jobs
        real_jobs = fetch_real_jobs()
        
        if real_jobs:
            return jsonify({
                'success': True,
                'count': len(real_jobs[:count]),
                'jobs': real_jobs[:count],
                'source': 'real_api'
            })
        
        # Fallback to cached data
        if job_cache['data']:
            return jsonify({
                'success': True,
                'count': len(job_cache['data'][:count]),
                'jobs': job_cache['data'][:count],
                'source': 'cache_fallback'
            })
        
        # Last resort: return hardcoded fallback jobs
        return jsonify({
            'success': True,
            'count': len(FALLBACK_JOBS[:count]),
            'jobs': FALLBACK_JOBS[:count],
            'source': 'fallback_hardcoded'
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e), 'jobs': []}), 500

@app.route('/api/jobs/search', methods=['GET'])
def search_jobs():
    """Search jobs"""
    try:
        query = request.args.get('q', '').lower()
        
        # Get jobs from cache or fetch
        if not job_cache['data'] or not is_cache_valid():
            fetch_real_jobs()
        
        # Use cached data if available, otherwise use fallback
        jobs = job_cache['data'] if job_cache['data'] else FALLBACK_JOBS
        
        if not query or not jobs:
            return jsonify({
                'success': True,
                'count': len(jobs),
                'jobs': jobs
            })
        
        filtered = [j for j in jobs if query in j['title'].lower() or query in j['description'].lower()]
        
        return jsonify({
            'success': True,
            'count': len(filtered),
            'jobs': filtered
        })
    
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({'success': False, 'error': str(e), 'jobs': []}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'jobs_cached': len(job_cache['data'])})

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({'message': 'TalentTrackr Backend API', 'version': '1.0'})

if __name__ == '__main__':
    print("Starting TalentTrackr Backend...")
    print("Fetching jobs from real job APIs...")
    fetch_real_jobs()
    print("Backend ready on http://0.0.0.0:5000 (accessible from any device on network)")
    app.run(debug=False, host='0.0.0.0', port=5000)

