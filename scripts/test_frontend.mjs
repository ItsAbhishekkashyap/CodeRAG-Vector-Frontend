/**
 * Automated Frontend-to-Backend Integration Test Suite for RepoGuard AI
 * Validates API connectivity and payload compatibility with React Next.js Dashboard.
 * Run with: npm test (or node scripts/test_frontend.mjs)
 */

import http from 'http';

const API_BASE_URL = 'http://localhost:8000';

function makePostRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

function makeGetRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE_URL}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: body });
        }
      });
    }).on('error', (e) => reject(e));
  });
}

async function runFrontendIntegrationTests() {
  console.log('='.repeat(60));
  console.log(' 🌐 FRONTEND-TO-BACKEND INTEGRATION TEST SUITE');
  console.log('='.repeat(60));

  let passed = 0;
  let total = 3;

  try {
    // Test 1: Check FastAPI Backend Health
    console.log('\n[Frontend Test 1/3] Testing GET /health endpoint connection...');
    const health = await makeGetRequest('/health');
    if (health.statusCode === 200 && health.data.status === 'healthy') {
      console.log(`  ✓ PASSED: Backend is online! Indexed ${health.data.rules_indexed} CS rules.`);
      passed++;
    } else {
      console.log(`  ❌ FAILED: Health endpoint returned status ${health.statusCode}`);
    }

    // Test 2: Check /api/scan-repo JSON Payload Compatibility
    console.log('\n[Frontend Test 2/3] Testing POST /api/scan-repo endpoint payload structure...');
    const scan = await makePostRequest('/api/scan-repo', { repo_path: './sample_project' });
    if (scan.statusCode === 200 && scan.data.status === 'success') {
      console.log(`  ✓ PASSED: Received payload for ${scan.data.scanned_files_count} file(s). Overall Score: ${scan.data.overall_project_score}%`);
      passed++;
    } else {
      console.log(`  ❌ FAILED: Scan endpoint returned status ${scan.statusCode}`);
    }

    // Test 3: Validate Dashboard UI Field Contracts
    console.log('\n[Frontend Test 3/3] Validating Dashboard UI Contract Fields...');
    if (scan.data && scan.data.audit_results && scan.data.audit_results.length > 0) {
      const sample = scan.data.audit_results[0];
      const requiredFields = ['filename', 'oops_score', 'dbms_score', 'os_concurrency_score', 'security_score', 'overall_score', 'violations', 'recommendations', 'optimized_code_snippet'];
      const missing = requiredFields.filter(f => !(f in sample));

      if (missing.length === 0) {
        console.log('  ✓ PASSED: Audit result objects contain all required UI contract fields (scores, badges, violations, code diff).');
        passed++;
      } else {
        console.log(`  ❌ FAILED: Missing contract fields: ${missing.join(', ')}`);
      }
    } else {
      console.log('  ❌ FAILED: No audit results received to validate UI contract');
    }

  } catch (err) {
    console.log(`\n⚠️ Note: Backend server at http://localhost:8000 is not running yet. Run 'uvicorn main:app --reload' in backend folder first.`);
    console.log(`Error details: ${err.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(` 📊 INTEGRATION TEST SUMMARY: ${passed}/${total} Checks Passed`);
  console.log('='.repeat(60));
}

runFrontendIntegrationTests();
