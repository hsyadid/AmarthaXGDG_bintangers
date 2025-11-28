import { saveRiskScore } from './src/actions/data-processing';
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

async function testSaveRisk() {
  const customerNumber = process.env.CUSTOMER_NUMBER;

  if (!customerNumber) {
    console.error('❌ CUSTOMER_NUMBER not found in .env file');
    process.exit(1);
  }

  console.log(`🔍 Testing save risk score for customer: ${customerNumber}\n`);

  // Mock risk response (format from API)
  const mockRiskResponse = {
    risk: [0.07162851812969029]
  };

  console.log('📊 Mock risk response:');
  console.log(JSON.stringify(mockRiskResponse, null, 2));
  console.log('\n');

  // Test saving risk score
  console.log('💾 Saving risk score to database...');
  const saveResult = await saveRiskScore(
    customerNumber,
    mockRiskResponse,
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

  // Test with different date
  console.log('💾 Testing with different date (2025-11-22)...');
  const saveResult2 = await saveRiskScore(
    customerNumber,
    { risk: [0.085] },
    new Date('2025-11-22')
  );

  if (!saveResult2.success) {
    console.error('❌ Failed to save second risk score:', saveResult2.error);
    process.exit(1);
  }

  console.log('✅ Second risk score saved successfully!');
  console.log('📊 Saved record:');
  console.log(JSON.stringify(saveResult2.data, null, 2));
}

testSaveRisk().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

