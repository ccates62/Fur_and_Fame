/**
 * Helper script to get variant IDs for a specific Printful product
 * 
 * Usage: node scripts/get-printful-variants.js <PRODUCT_ID>
 * Example: node scripts/get-printful-variants.js 96990011
 */

require('dotenv').config({ path: '.env.local' });

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

if (!PRINTFUL_API_KEY) {
  console.error('❌ ERROR: PRINTFUL_API_KEY not found in .env.local');
  process.exit(1);
}

const productId = process.argv[2];

if (!productId) {
  console.error('❌ ERROR: Please provide a Product ID');
  console.log('\nUsage: node scripts/get-printful-variants.js <PRODUCT_ID>');
  console.log('Example: node scripts/get-printful-variants.js 96990011\n');
  process.exit(1);
}

async function getProductVariants() {
  try {
    console.log(`🔍 Fetching variants for Product ID: ${productId}\n`);

    // Try store products API first
    let response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // If that fails, try the catalog products API
    if (!response.ok) {
      console.log('⚠️  Product not found in store, trying catalog API...\n');
      response = await fetch(`${PRINTFUL_API_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', response.status, errorText);
      console.log('\n💡 The Product ID might be from a Product Template.');
      console.log('   Product Templates need to be published to your store first.');
      console.log('   Or find the Variant IDs manually from the Printful dashboard.\n');
      process.exit(1);
    }

    const data = await response.json();
    const product = data.result;
    
    if (!product) {
      console.error('❌ Product not found');
      process.exit(1);
    }

    console.log(`✅ Product: ${product.name || 'Unnamed'}`);
    console.log(`   Product ID: ${product.id}\n`);

    const variants = product.variants || [];
    
    if (variants.length === 0) {
      console.log('⚠️  No variants found for this product');
      process.exit(0);
    }

    console.log(`📦 Found ${variants.length} variant(s):\n`);
    console.log('═'.repeat(80));

    variants.forEach((variant, index) => {
      const variantName = variant.name || `Variant ${index + 1}`;
      const variantId = variant.id;
      const size = variant.size || '';
      const color = variant.color || '';
      
      console.log(`\n${index + 1}. ${variantName}`);
      console.log(`   Variant ID: ${variantId}`);
      if (size) console.log(`   Size: ${size}`);
      if (color) console.log(`   Color: ${color}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n📝 Copy these IDs to update your code:\n');
    
    // Show which variants match common sizes
    variants.forEach((variant) => {
      const size = variant.size || '';
      if (size.includes('12') && size.includes('12')) {
        console.log(`   "canvas-12x12": { productId: ${productId}, variantId: ${variant.id} }`);
      } else if (size.includes('16') && size.includes('20')) {
        console.log(`   "canvas-16x20": { productId: ${productId}, variantId: ${variant.id} }`);
      }
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getProductVariants();

