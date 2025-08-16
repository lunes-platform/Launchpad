#!/bin/bash

# Launchpad Lunes - Complete Dependencies Installation Script
# This script installs all dependencies for the entire project following TDD methodology

set -e  # Exit on any error

echo "🚀 Starting Launchpad Lunes Dependencies Installation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Install Rust and ink! Dependencies for Smart Contracts
install_rust_dependencies() {
    print_status "Installing Rust and ink! dependencies..."
    
    if ! command_exists rustc; then
        print_status "Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source $HOME/.cargo/env
    else
        print_success "Rust already installed"
    fi
    
    # Add WebAssembly target
    print_status "Adding WebAssembly target..."
    rustup target add wasm32-unknown-unknown
    
    # Install cargo-contract for ink! development
    print_status "Installing cargo-contract..."
    cargo install cargo-contract --version ^3.0.0 --force
    
    # Install additional development tools
    print_status "Installing additional Rust tools..."
    cargo install cargo-dylint dylint-link --force
    cargo install cargo-tarpaulin --force  # Code coverage
    cargo install cargo-expand --force     # Macro expansion
    
    print_success "Rust and ink! dependencies installed successfully"
}

# 2. Install Node.js Dependencies for Frontend
install_frontend_dependencies() {
    print_status "Installing Node.js dependencies for frontend..."
    
    if ! command_exists node; then
        print_error "Node.js is required but not installed. Please install Node.js 18.x or higher."
        exit 1
    fi
    
    cd frontend-new
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    cd ..
    print_success "Frontend dependencies installed successfully"
}

# 3. Setup Development Tools
setup_development_tools() {
    print_status "Setting up development tools..."
    
    # Make scripts executable
    find scripts -name "*.sh" -exec chmod +x {} \;
    print_success "Made all scripts executable"
}

# Main installation process
main() {
    print_status "Starting complete dependency installation for Launchpad Lunes..."
    
    # Check if we're in the right directory
    if [ ! -d "smart-contracts" ] || [ ! -d "frontend-new" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Install all dependencies
    install_rust_dependencies
    install_frontend_dependencies
    setup_development_tools
    
    print_success "🎉 All dependencies installed successfully!"
    print_status "Next steps:"
    echo "  1. Run './scripts/setup/setup-development.sh' to configure development environment"
    echo "  2. Follow TDD workflow in each component directory"
    echo "  3. Check SETUP_GUIDE.md for detailed instructions"
}

# Run main function
main "$@"
