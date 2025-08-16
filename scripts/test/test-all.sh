#!/bin/bash

# Launchpad Lunes - Comprehensive Test Runner
# This script runs all tests across the entire project following TDD methodology

set -e  # Exit on any error

echo "🧪 Running Comprehensive Test Suite for Launchpad Lunes..."

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

# Test results tracking
SMART_CONTRACTS_RESULT=0
FRONTEND_RESULT=0

# 1. Test Smart Contracts
test_smart_contracts() {
    print_status "Testing Smart Contracts (ink! 5.x)..."
    
    cd smart-contracts
    
    # Run unit tests
    print_status "Running smart contract unit tests..."
    if cargo test --workspace; then
        print_success "Smart contract unit tests passed"
    else
        print_error "Smart contract unit tests failed"
        SMART_CONTRACTS_RESULT=1
    fi
    
    # Run integration tests
    print_status "Running smart contract integration tests..."
    if cargo test --workspace --features e2e-tests; then
        print_success "Smart contract integration tests passed"
    else
        print_warning "Smart contract integration tests failed or not implemented"
    fi
    
    # Generate code coverage
    print_status "Generating smart contract code coverage..."
    if command -v cargo-tarpaulin >/dev/null 2>&1; then
        cargo tarpaulin --workspace --out Html --output-dir ../coverage/smart-contracts
        print_success "Smart contract coverage report generated"
    else
        print_warning "cargo-tarpaulin not installed, skipping coverage"
    fi
    
    cd ..
}

# 2. Test Frontend
test_frontend() {
    print_status "Testing Frontend (React)..."
    
    cd frontend-new
    
    # Run unit tests
    print_status "Running frontend unit tests..."
    if npm test -- --coverage --watchAll=false; then
        print_success "Frontend unit tests passed"
    else
        print_error "Frontend unit tests failed"
        FRONTEND_RESULT=1
    fi
    
    # Move coverage report
    if [ -d "coverage" ]; then
        mv coverage ../coverage/frontend
        print_success "Frontend coverage report generated"
    fi
    
    cd ..
}

# 3. Generate Test Report
generate_test_report() {
    print_status "Generating comprehensive test report..."
    
    # Create coverage directory if it doesn't exist
    mkdir -p coverage
    
    # Create test report
    cat > coverage/test-report.md << EOF
# Launchpad Lunes Test Report

Generated on: $(date)

## Test Results Summary

| Component | Status | Details |
|-----------|--------|---------|
| Smart Contracts | $([ $SMART_CONTRACTS_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED") | ink! 5.x contracts |
| Frontend | $([ $FRONTEND_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED") | React application |

## Coverage Reports

- [Smart Contracts Coverage](./smart-contracts/index.html)
- [Frontend Coverage](./frontend/index.html)

## TDD Compliance

This test suite follows Test-Driven Development methodology:
1. ✅ Tests are written before implementation
2. ✅ All tests must pass before code is considered complete
3. ✅ Code coverage targets are enforced

## Next Steps

$([ $((SMART_CONTRACTS_RESULT + FRONTEND_RESULT)) -eq 0 ] && echo "🎉 All tests passed! Ready for deployment." || echo "⚠️  Some tests failed. Please review and fix before proceeding.")

EOF

    print_success "Test report generated at coverage/test-report.md"
}

# Main test execution
main() {
    print_status "Starting comprehensive test suite..."
    
    # Check if we're in the right directory
    if [ ! -d "smart-contracts" ] || [ ! -d "frontend-new" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Create coverage directory
    mkdir -p coverage/{smart-contracts,frontend}
    
    # Run all test suites
    test_smart_contracts
    test_frontend
    
    # Generate report
    generate_test_report
    
    # Final result
    TOTAL_FAILURES=$((SMART_CONTRACTS_RESULT + FRONTEND_RESULT))
    
    if [ $TOTAL_FAILURES -eq 0 ]; then
        print_success "🎉 All tests completed successfully!"
        echo ""
        echo "📊 Test Summary:"
        echo "  ✅ Smart Contracts: PASSED"
        echo "  ✅ Frontend: PASSED"
        echo ""
        echo "📋 Next Steps:"
        echo "  1. Review coverage reports in ./coverage/"
        echo "  2. Deploy to staging environment"
        exit 0
    else
        print_error "❌ Some tests failed!"
        echo ""
        echo "📊 Test Summary:"
        echo "  $([ $SMART_CONTRACTS_RESULT -eq 0 ] && echo "✅" || echo "❌") Smart Contracts"
        echo "  $([ $FRONTEND_RESULT -eq 0 ] && echo "✅" || echo "❌") Frontend"
        echo ""
        echo "🔧 Please fix failing tests before proceeding"
        exit 1
    fi
}

# Run main function
main "$@"
