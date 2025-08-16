#!/bin/bash

# Launchpad Lunes - Development Environment Setup Script
# This script configures the development environment for smart contracts and frontend

set -e  # Exit on any error

echo "🔧 Setting up Launchpad Lunes Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Setup Environment Files
setup_environment_files() {
    print_status "Setting up environment files..."
    
    # Frontend environment files
    if [ ! -f "frontend-new/.env.development" ]; then
        print_status "Creating frontend development environment file..."
        cat > frontend-new/.env.development << EOF
REACT_APP_ENVIRONMENT=development
REACT_APP_API_BASE_URL=http://localhost:8000 # Placeholder, will be replaced by direct node interaction
# Blockchain Configuration
REACT_APP_LUNES_RPC_URL=ws://127.0.0.1:9944
EOF
    fi
    
    # Root environment file
    if [ ! -f ".env" ]; then
        print_status "Creating root environment file..."
        cat > .env << EOF
# Development Environment Configuration
ENVIRONMENT=development
PROJECT_NAME=Launchpad Lunes
EOF
    fi
    
    print_success "Environment files created"
}

# 2. Run Initial Tests (TDD Verification)
run_initial_tests() {
    print_status "Running initial tests to verify TDD setup..."
    
    # Test smart contracts
    print_status "Testing smart contracts setup..."
    cd smart-contracts
    if cargo test --workspace --no-run; then
        print_success "Smart contracts test setup verified"
    else
        print_warning "Smart contracts tests not ready yet (expected for initial setup)"
    fi
    cd ..
    
    # Test frontend
    print_status "Testing frontend setup..."
    cd frontend-new
    if npm test -- --passWithNoTests --watchAll=false; then
        print_success "Frontend test environment verified"
    else
        print_warning "Frontend tests not ready yet (expected for initial setup)"
    fi
    cd ..
    
    print_success "Initial test verification completed"
}

# 3. Create Initial Project Structure
create_project_structure() {
    print_status "Creating initial project structure..."
    
    # Create missing directories
    mkdir -p smart-contracts/upgradeable/src
    mkdir -p frontend-new/src/{components/{common,project,wallet,admin},pages,services,utils,hooks,styles}
    mkdir -p docs/{smart-contracts,frontend,deployment,testing}
    mkdir -p scripts/{setup,build,test,deploy}
    mkdir -p .github/{workflows,ISSUE_TEMPLATE}
    
    print_success "Project structure created"
}

# 4. Setup Git Hooks and Development Tools
setup_development_tools() {
    print_status "Setting up development tools..."
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore file..."
        cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/
target/
*/target/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build outputs
build/
dist/
*.wasm
*.contract

# Logs
*.log
logs/

# Coverage
coverage/
htmlcov/
.coverage
.nyc_output

# Temporary files
tmp/
temp/

# Environment files
.env
.env.*
!/.env.example
EOF
    fi
    
    print_success "Development tools configured"
}

# Main setup process
main() {
    print_status "Starting development environment setup..."
    
    # Check if we're in the right directory
    if [ ! -d "smart-contracts" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Run setup steps
    create_project_structure
    setup_environment_files
    setup_development_tools
    run_initial_tests
    
    print_success "🎉 Development environment setup completed!"
    print_status "You can now start development with TDD methodology:"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Smart Contracts: cd smart-contracts && cargo test"
    echo "  2. Frontend: cd frontend-new && npm start"
    echo ""
    echo "📚 Documentation:"
    echo "  - Read SETUP_GUIDE.md for detailed instructions"
    echo "  - Follow TDD workflow in tdd-workflow.md"
}

# Run main function
main "$@"
