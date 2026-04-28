#!/bin/bash

# Cleaning Buddy API Smoke Tests
# This script tests the API endpoints to ensure they are working correctly

# Set BASE_URL from environment variable or use default
BASE_URL="${BASE_URL:-http://localhost:3000}"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for passed/failed tests
PASSED=0
FAILED=0

# Function to test an endpoint
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local expected_status="$4"
    local data="$5"

    echo -n "Testing: $test_name... "

    if [ -z "$data" ]; then
        # GET request
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${endpoint}")
    else
        # POST request with data
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "${BASE_URL}${endpoint}")
    fi

    if [ "$status_code" -eq "$expected_status" ] || [ "$status_code" -eq "409" ]; then
      if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (Status: $status_code)"
      else
        echo -e "${GREEN}PASS${NC} (Status: $status_code - Duplicate expected)"
      fi
      ((PASSED++))
    else
      echo -e "${RED}FAIL${NC} (Expected: $expected_status or 409, Got: $status_code)"
      ((FAILED++))
    fi
}

echo "========================================"
echo "Cleaning Buddy API Smoke Tests"
echo "========================================"
echo "Base URL: $BASE_URL"
echo "========================================"
echo ""

# Test 1: GET /api/rooms
test_endpoint "GET /api/rooms" "GET" "/api/rooms" 200

# Test 2: GET /api/task-templates/1
test_endpoint "GET /api/task-templates/1" "GET" "/api/task-templates/1" 200

# Test 3: GET /api/cleaning-tips
test_endpoint "GET /api/cleaning-tips" "GET" "/api/cleaning-tips" 200

# Test 4: POST /api/quiz-responses
test_endpoint "POST /api/quiz-responses" "POST" "/api/quiz-responses" 201 '{"user_id": 1, "question_id": 8, "option_id": 1}'

echo ""
echo "========================================"
echo "Test Results"
echo "========================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "========================================"

# Exit with non-zero status if any tests failed
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi
