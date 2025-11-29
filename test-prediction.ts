import { getPredictionBody, predictRiskScore, getWeeklyCashFlow, saveRiskScore, predictAndSaveRiskScore } from './src/actions/data-processing';
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
  console.log('📊 Body structure (before weekly replacement):');
  console.log(JSON.stringify(bodyResult.data, null, 2));
  console.log('\n');

  // Test 1.5: Get weekly cash flow
  console.log('💰 Step 1.5: Getting weekly cash flow for today...');
  const weeklyResult = await getWeeklyCashFlow(customerNumber, new Date());
  
  if (!weeklyResult.success || !weeklyResult.data) {
    console.error('❌ Failed to get weekly cash flow:', weeklyResult.error);
    process.exit(1);
  }
  
  console.log('✅ Weekly cash flow retrieved!');
  console.log('📊 Weekly cash flow data:');
  console.log(JSON.stringify(weeklyResult.data, null, 2));
  console.log('\n');

  // Test 2: Get prediction score (with weekly cash flow replacement)
  console.log('🚀 Step 2: Calling prediction API with updated weekly cash flow...');
  console.log('⚠️  Note: This may fail if the API endpoint is unreachable\n');
  
  const predictionResult = await predictRiskScore(customerNumber, new Date('2025-11-21'));

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
  console.log('\n');

  // Test 3: Save risk score to database
  console.log('💾 Step 3: Saving risk score to database...');
  const saveResult = await saveRiskScore(
    customerNumber,
    predictionResult.data,
    new Date('2025-11-21')
  );

  if (!saveResult.success) {
    console.error('❌ Failed to save risk score:', saveResult.error);
    process.exit(1);
  }

  console.log('✅ Risk score saved successfully!');
  console.log('📊 Saved record:');
  console.log(JSON.stringify(saveResult.data, null, 2));
  console.log('\n');

  // Test 4: Test the combined function
  console.log('🔄 Step 4: Testing combined predictAndSaveRiskScore function...');
  const combinedResult = await predictAndSaveRiskScore(
    customerNumber,
    new Date('2025-11-22'),
    true
  );

  if (!combinedResult.success) {
    console.error('❌ Combined function failed:', combinedResult.error);
    process.exit(1);
  }

  console.log('✅ Combined function successful!');
  console.log('📊 Combined result:');
  console.log(JSON.stringify(combinedResult.data, null, 2));
}

testPrediction().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

