@echo off
REM Cleaning Buddy API Smoke Tests
REM This script tests the API endpoints to ensure they are working correctly

REM Set BASE_URL from environment variable or use default
if "%BASE_URL%"=="" set BASE_URL=http://localhost:3000

REM Counter for passed/failed tests
set PASSED=0
set FAILED=0

echo ========================================
echo Cleaning Buddy API Smoke Tests
echo ========================================
echo Base URL: %BASE_URL%
echo ========================================
echo.

REM Test 1: GET /api/rooms
echo Testing: GET /api/rooms...
curl -s -o nul -w "%%{http_code}" "%BASE_URL%/api/rooms" > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt
if %STATUS%==200 (
    echo PASS ^(Status: %STATUS%^)
    set /a PASSED+=1
) else (
    echo FAIL ^(Expected: 200, Got: %STATUS%^)
    set /a FAILED+=1
)

REM Test 2: GET /api/task-templates/1
echo Testing: GET /api/task-templates/1...
curl -s -o nul -w "%%{http_code}" "%BASE_URL%/api/task-templates/1" > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt
if %STATUS%==200 (
    echo PASS ^(Status: %STATUS%^)
    set /a PASSED+=1
) else (
    echo FAIL ^(Expected: 200, Got: %STATUS%^)
    set /a FAILED+=1
)

REM Test 3: GET /api/cleaning-tips
echo Testing: GET /api/cleaning-tips...
curl -s -o nul -w "%%{http_code}" "%BASE_URL%/api/cleaning-tips" > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt
if %STATUS%==200 (
    echo PASS ^(Status: %STATUS%^)
    set /a PASSED+=1
) else (
    echo FAIL ^(Expected: 200, Got: %STATUS%^)
    set /a FAILED+=1
)

REM Test 4: POST /api/quiz-responses
echo Testing: POST /api/quiz-responses...
curl -s -o nul -w "%%{http_code}" -X POST -H "Content-Type: application/json" -d "{\"user_id\": 1, \"question_id\": 8, \"option_id\": 1}" "%BASE_URL%/api/quiz-responses" > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt
if %STATUS%==201 (
    echo PASS ^(Status: %STATUS%^)
    set /a PASSED+=1
) else if %STATUS%==409 (
    echo PASS ^(Status: %STATUS% - Duplicate expected^)
    set /a PASSED+=1
) else (
    echo FAIL ^(Expected: 201 or 409, Got: %STATUS%^)
    set /a FAILED+=1
)

echo.
echo ========================================
echo Test Results
echo ========================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo ========================================

REM Exit with non-zero status if any tests failed
if %FAILED% GTR 0 (
    echo Some tests failed!
    exit /b 1
) else (
    echo All tests passed!
    exit /b 0
)
