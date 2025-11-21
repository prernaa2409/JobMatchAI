#!/bin/bash

# JobMatchAI - API Testing Suite
# Run this script to test all endpoints

BASE_URL="http://localhost:5000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "JobMatchAI API Testing Suite"
echo "========================================"
echo ""

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -n "Testing: $name... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "Response: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "========================================"
echo "1. EXISTING ENDPOINTS"
echo "========================================"
echo ""

# Test: Analyze Resume
test_endpoint \
    "Analyze Resume" \
    "POST" \
    "/analyze" \
    '{
        "resumeText": "John Doe\nSoftware Engineer\nSkills: Python, JavaScript, React\nExperience: 5 years at Tech Corp\nEducation: BS Computer Science",
        "userId": "test-user"
    }'

sleep 1

# Test: Get Quota
test_endpoint \
    "Get Quota" \
    "GET" \
    "/quota?userId=test-user" \
    ""

sleep 1

# Test: Improve Resume
test_endpoint \
    "Improve Resume" \
    "POST" \
    "/improve" \
    '{
        "resumeText": "Software engineer with experience in web development",
        "userId": "test-user"
    }'

sleep 1

echo ""
echo "========================================"
echo "2. GITHUB INTEGRATION"
echo "========================================"
echo ""

# Test: Fetch GitHub Repos
test_endpoint \
    "Fetch GitHub Repos" \
    "POST" \
    "/github/repos" \
    '{
        "username": "torvalds"
    }'

sleep 2

# Test: Analyze GitHub Projects
test_endpoint \
    "Analyze GitHub Projects" \
    "POST" \
    "/github/analyze" \
    '{
        "username": "torvalds",
        "jobDescription": "Senior Software Engineer position requiring strong experience in C programming, kernel development, and systems programming. Must have experience with Git and version control systems. Linux expertise required."
    }'

sleep 3

# Test: Extract GitHub Skills
test_endpoint \
    "Extract GitHub Skills" \
    "POST" \
    "/github/skills" \
    '{
        "username": "torvalds"
    }'

sleep 2

echo ""
echo "========================================"
echo "3. RESOURCES GENERATION"
echo "========================================"
echo ""

# Test: Generate Learning Resources
test_endpoint \
    "Generate Learning Resources" \
    "POST" \
    "/resources/generate" \
    '{
        "jobDescription": "Full Stack Developer position requiring React, Node.js, MongoDB, and AWS experience. Must have strong JavaScript skills and experience with RESTful APIs.",
        "userSkills": ["JavaScript", "React"]
    }'

sleep 3

# Test: Generate Interview Questions
test_endpoint \
    "Generate Interview Questions" \
    "POST" \
    "/resources/interview-questions" \
    '{
        "jobDescription": "Senior Backend Engineer position requiring Python, Django, PostgreSQL, and microservices architecture experience."
    }'

sleep 3

# Test: Analyze Skill Gap
test_endpoint \
    "Analyze Skill Gap" \
    "POST" \
    "/resources/skill-gap" \
    '{
        "jobDescription": "Data Scientist role requiring Python, Machine Learning, TensorFlow, SQL, and data visualization skills.",
        "userSkills": ["Python", "SQL", "Pandas"]
    }'

sleep 3

echo ""
echo "========================================"
echo "4. AUTO RESUME BUILDER"
echo "========================================"
echo ""

# Test: Parse Resume
test_endpoint \
    "Parse Resume Text" \
    "POST" \
    "/resume/parse" \
    '{
        "resumeText": "JOHN DOE\njohn@example.com | (555) 123-4567\n\nEXPERIENCE\nSoftware Engineer at Tech Corp (2020-Present)\n- Developed web applications using React and Node.js\n- Led team of 3 engineers\n\nEDUCATION\nBS Computer Science, MIT (2020)"
    }'

sleep 3

# Test: Generate Professional Summary
test_endpoint \
    "Generate Professional Summary" \
    "POST" \
    "/resume/summary" \
    '{
        "userProfile": {
            "name": "John Doe",
            "title": "Software Engineer",
            "skills": ["React", "Node.js", "Python"],
            "experience": [
                {
                    "company": "Tech Corp",
                    "position": "Software Engineer",
                    "duration": "3 years",
                    "responsibilities": ["Built web apps", "Led team"]
                }
            ],
            "education": []
        },
        "jobDescription": "Senior Full Stack Engineer position at innovative startup"
    }'

sleep 3

# Test: Auto-Generate Complete Resume
test_endpoint \
    "Auto-Generate Resume" \
    "POST" \
    "/resume/auto-generate" \
    '{
        "userProfile": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "(555) 123-4567",
            "location": "San Francisco, CA",
            "title": "Full Stack Engineer",
            "skills": ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
            "experience": [
                {
                    "company": "Tech Corp",
                    "position": "Senior Software Engineer",
                    "duration": "2020 - Present",
                    "responsibilities": [
                        "Led development of microservices architecture",
                        "Mentored junior developers",
                        "Improved system performance by 40%"
                    ]
                }
            ],
            "education": [
                {
                    "degree": "BS Computer Science",
                    "institution": "MIT",
                    "year": "2020",
                    "gpa": "3.8"
                }
            ],
            "certifications": ["AWS Solutions Architect"]
        },
        "jobDescription": "Senior Full Stack Engineer position requiring React, Node.js, and AWS experience",
        "githubProjects": [
            {
                "name": "awesome-project",
                "description": "Full-stack e-commerce platform",
                "techStack": ["React", "Node.js", "MongoDB"],
                "bullets": [
                    "Built scalable e-commerce platform handling 10k+ users",
                    "Implemented real-time inventory management",
                    "Achieved 99.9% uptime"
                ]
            }
        ]
    }'

sleep 5

# Test: Generate Cover Letter
test_endpoint \
    "Generate Cover Letter" \
    "POST" \
    "/resume/cover-letter" \
    '{
        "userProfile": {
            "name": "John Doe",
            "title": "Software Engineer",
            "skills": ["React", "Node.js", "Python"]
        },
        "jobDescription": "Senior Full Stack position at TechStartup Inc.",
        "companyName": "TechStartup Inc."
    }'

sleep 3

echo ""
echo "========================================"
echo "5. JOB DESCRIPTION PARSING"
echo "========================================"
echo ""

# Test: Parse Job Description
test_endpoint \
    "Parse Job Description" \
    "POST" \
    "/jd/parse" \
    '{
        "jobDescription": "Senior DevOps Engineer\n\nRequired Skills:\n- Kubernetes and Docker\n- CI/CD pipelines (Jenkins, GitLab)\n- AWS or Azure\n- Python scripting\n- Terraform/Ansible\n\nNice to have:\n- Prometheus/Grafana\n- Service mesh (Istio)"
    }'

sleep 3

echo ""
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo ""
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the output above.${NC}"
    exit 1
fi