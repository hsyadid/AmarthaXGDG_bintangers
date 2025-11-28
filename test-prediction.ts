import { getPredictionBody, predictRiskScore } from './src/actions/data-processing';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
const envFile = readFileSync(join(process.cwd(), '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});

async function testPrediction() {
  const customerNumber = process.env.CUSTOMER_NUMBER;

  if (!customerNumber) {
    console.error('❌ CUSTOMER_NUMBER not found in .env file');
    process.exit(1);
  }

  console.log(`🔍 Testing prediction for customer: ${customerNumber}\n`);

  // Test 1: Get prediction body
  console.log('📦 Step 1: Getting prediction body...');
  const bodyResult = await getPredictionBody(customerNumber);

  if (!bodyResult.success) {
    console.error('❌ Failed to get prediction body:', bodyResult.error);
    process.exit(1);
  }

  console.log('✅ Prediction body retrieved successfully!');
  console.log('📊 Body structure:');
  console.log(JSON.stringify(bodyResult.data, null, 2));
  console.log('\n');

  // Test 2: Get prediction score
  console.log('🚀 Step 2: Calling prediction API...');
  console.log('⚠️  Note: This may fail if the API endpoint is unreachable\n');
  
  const predictionResult = await predictRiskScore(customerNumber);

  if (!predictionResult.success) {
    console.error('❌ Failed to get prediction:', predictionResult.error);
    console.log('\n💡 The API endpoint might be down or unreachable.');
    console.log('   However, getPredictionBody() is working correctly! ✅');
    console.log('   You can use the body data above to test the API manually.');
    process.exit(1);
  }

  console.log('✅ Prediction API call successful!');
  console.log('📈 Prediction result:');
  console.log(JSON.stringify(predictionResult.data, null, 2));
}

testPrediction().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

