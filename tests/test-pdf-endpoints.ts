import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from the backend folder
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables in backend/.env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  const outputDir = path.join(__dirname, 'test-outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log(`Starting automated PDF generation tests against ${BASE_URL}...`);

  try {
    // 1. Fetch a valid student from Supabase
    console.log('Fetching a valid student from database...');
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, first_name, last_name')
      .limit(1)
      .maybeSingle();

    if (studentError) {
      throw new Error(`Failed to query database: ${studentError.message}`);
    }

    if (!student) {
      console.warn('Warning: No students found in database. Skipping student PDF test.');
    } else {
      const studentId = student.id;
      const studentName = `${student.first_name} ${student.last_name}`;
      console.log(`Found student: "${studentName}" (ID: ${studentId})`);

      // 2. Test Student PDF Endpoint
      const studentPdfUrl = `${BASE_URL}/api/reports/student/${studentId}/pdf`;
      console.log(`Sending request to: ${studentPdfUrl}...`);
      
      const response = await fetch(studentPdfUrl);
      console.log(`Response Status: ${response.status} ${response.statusText}`);
      
      if (response.status !== 200) {
        const errText = await response.text();
        throw new Error(`Student PDF generation failed (status ${response.status}): ${errText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      console.log(`   Content-Type: ${contentType}`);
      if (!contentType.includes('application/pdf')) {
        throw new Error(`Expected PDF content-type, but got: ${contentType}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const studentPdfPath = path.join(outputDir, `student_${studentId}_report.pdf`);
      fs.writeFileSync(studentPdfPath, buffer);
      console.log(`Student report PDF saved successfully to: ${studentPdfPath}`);
    }

    // 3. Test Analytics PDF Endpoint
    const analyticsPdfUrl = `${BASE_URL}/api/reports/analytics/class-performance/pdf`;
    console.log(`Sending request to: ${analyticsPdfUrl}...`);
    
    const analyticsResponse = await fetch(analyticsPdfUrl);
    console.log(`Response Status: ${analyticsResponse.status} ${analyticsResponse.statusText}`);
    
    if (analyticsResponse.status !== 200) {
      const errText = await analyticsResponse.text();
      throw new Error(`Analytics PDF generation failed (status ${analyticsResponse.status}): ${errText}`);
    }

    const analyticsContentType = analyticsResponse.headers.get('content-type') || '';
    console.log(`   Content-Type: ${analyticsContentType}`);
    if (!analyticsContentType.includes('application/pdf')) {
      throw new Error(`Expected PDF content-type, but got: ${analyticsContentType}`);
    }

    const analyticsArrayBuffer = await analyticsResponse.arrayBuffer();
    const analyticsBuffer = Buffer.from(analyticsArrayBuffer);
    const analyticsPdfPath = path.join(outputDir, 'class_performance_analytics.pdf');
    fs.writeFileSync(analyticsPdfPath, analyticsBuffer);
    console.log(`Analytics report PDF saved successfully to: ${analyticsPdfPath}`);

    console.log('\nAll PDF generation tests passed successfully.');

  } catch (error: any) {
    console.error('\nTest run failed:', error.message || error);
    process.exit(1);
  }
}

runTests();
