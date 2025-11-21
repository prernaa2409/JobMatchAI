#!/bin/bash

# JobMatchAI - Automated Setup Script
# This script automates the integration of new features

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "JobMatchAI - Automated Setup"
    
    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm found: $(npm --version)"
    
    if ! command_exists git; then
        print_warning "Git not found. Continuing anyway..."
    else
        print_success "Git found: $(git --version)"
    fi
    
    # Step 2: Check project structure
    print_header "Step 2: Verifying Project Structure"
    
    if [ ! -d "server" ]; then
        print_error "server/ directory not found. Are you in the project root?"
        exit 1
    fi
    print_success "server/ directory found"
    
    if [ ! -d "client" ]; then
        print_error "client/ directory not found. Are you in the project root?"
        exit 1
    fi
    print_success "client/ directory found"
    
    # Step 3: Install dependencies
    print_header "Step 3: Installing Dependencies"
    
    print_info "Installing @google/generative-ai..."
    npm install @google/generative-ai
    print_success "Dependencies installed"
    
    # Step 4: Create directories
    print_header "Step 4: Creating Required Directories"
    
    mkdir -p client/src/components
    print_success "Created client/src/components/"
    
    mkdir -p client/src/pages
    print_success "Created client/src/pages/"
    
    mkdir -p tests
    print_success "Created tests/"
    
    # Step 5: Check for service files
    print_header "Step 5: Checking Service Files"
    
    if [ ! -f "server/github.ts" ]; then
        print_warning "server/github.ts not found - you'll need to create this manually"
        echo "          Copy content from Artifact 2 (GitHub Integration Service)"
    else
        print_success "server/github.ts found"
    fi
    
    if [ ! -f "server/resources.ts" ]; then
        print_warning "server/resources.ts not found - you'll need to create this manually"
        echo "          Copy content from Artifact 3 (Learning Resources Service)"
    else
        print_success "server/resources.ts found"
    fi
    
    if [ ! -f "server/resume-builder.ts" ]; then
        print_warning "server/resume-builder.ts not found - you'll need to create this manually"
        echo "          Copy content from Artifact 4 (Auto Resume Builder)"
    else
        print_success "server/resume-builder.ts found"
    fi
    
    # Step 6: Check React components
    print_header "Step 6: Checking React Components"
    
    if [ ! -f "client/src/components/GitHubConnect.tsx" ]; then
        print_warning "GitHubConnect.tsx not found - you'll need to create this manually"
    else
        print_success "GitHubConnect.tsx found"
    fi
    
    if [ ! -f "client/src/components/LearningResources.tsx" ]; then
        print_warning "LearningResources.tsx not found - you'll need to create this manually"
    else
        print_success "LearningResources.tsx found"
    fi
    
    if [ ! -f "client/src/pages/AutoResumePage.tsx" ]; then
        print_warning "AutoResumePage.tsx not found - you'll need to create this manually"
    else
        print_success "AutoResumePage.tsx found"
    fi
    
    # Step 7: Setup environment
    print_header "Step 7: Setting Up Environment"
    
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
        
        # Generate session secret
        SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        cat > .env << EOL
# JobMatchAI Environment Configuration
# Generated on $(date)

# REQUIRED
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=${SESSION_SECRET}

# OPTIONAL
GITHUB_ACCESS_TOKEN=

# SERVER
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# FEATURE FLAGS
ENABLE_GITHUB_INTEGRATION=true
ENABLE_RESOURCES_GENERATION=true
ENABLE_AUTO_RESUME_BUILDER=true
EOL
        
        print_success ".env file created"
        print_warning "⚠ IMPORTANT: Edit .env and add your GEMINI_API_KEY"
        print_info "   Get your API key at: https://makersuite.google.com/app/apikey"
    else
        print_success ".env file already exists"
        
        # Check if GEMINI_API_KEY is set
        if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
            print_warning "⚠ GEMINI_API_KEY not configured in .env"
            print_info "   Get your API key at: https://makersuite.google.com/app/apikey"
        else
            print_success "GEMINI_API_KEY appears to be configured"
        fi
    fi
    
    # Step 8: Create test script
    print_header "Step 8: Setting Up Test Suite"
    
    if [ ! -f "tests/api.test.sh" ]; then
        print_info "Creating test script (you'll need to add content manually)"
        touch tests/api.test.sh
        chmod +x tests/api.test.sh
        print_success "Created tests/api.test.sh"
    else
        print_success "Test script already exists"
        chmod +x tests/api.test.sh
    fi
    
    # Step 9: Backup and update routes
    print_header "Step 9: Backing Up Routes"
    
    if [ -f "server/routes.ts" ]; then
        if [ ! -f "server/routes.ts.backup" ]; then
            cp server/routes.ts server/routes.ts.backup
            print_success "Created backup: server/routes.ts.backup"
        else
            print_info "Backup already exists"
        fi
    fi
    
    # Step 10: Summary
    print_header "Setup Complete!"
    
    echo -e "\n${GREEN}Next Steps:${NC}\n"
    echo "1. Copy service files to server/ directory:"
    echo "   - server/github.ts (Artifact 2)"
    echo "   - server/resources.ts (Artifact 3)"
    echo "   - server/resume-builder.ts (Artifact 4)"
    echo ""
    echo "2. Copy React components to client/src/:"
    echo "   - components/GitHubConnect.tsx (Artifact 6)"
    echo "   - components/LearningResources.tsx (Artifact 7)"
    echo "   - pages/AutoResumePage.tsx (Artifact 9)"
    echo ""
    echo "3. Update server/routes.ts (Artifact 5)"
    echo ""
    echo "4. Configure .env file:"
    echo "   - Add your GEMINI_API_KEY"
    echo "   - Optionally add GITHUB_ACCESS_TOKEN"
    echo ""
    echo "5. Start the development servers:"
    echo "   ${BLUE}npm run dev${NC}"
    echo ""
    echo "6. Run tests:"
    echo "   ${BLUE}bash tests/api.test.sh${NC}"
    echo ""
    echo "7. Test in browser:"
    echo "   ${BLUE}http://localhost:5173${NC}"
    echo ""
    
    print_info "For detailed instructions, see: Integration Checklist (Artifact 12)"
    echo ""
    
    # Check if GEMINI_API_KEY is configured
    if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
        print_warning "\n⚠ Don't forget to add your GEMINI_API_KEY to .env before starting!"
    fi
}

# Run main function
main

exit 0