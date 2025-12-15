/**
 * Check Printful API response structure to find catalog IDs
 */

require('dotenv').config({ path: '.env.local' });

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

if (!PRINTFUL_API_KEY) {
  console.error('❌ PRINTFUL_API_KEY not found');
  process.exit(1);
}

async function checkApiStructure() {
  try {
    console.log('🔍 Fetching store product 407686920 to check API structure...\n');
    
    const response = await fetch(`${PRINTFUL_API_URL}/store/products/407686920`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', response.status, errorText);
      process.exit(1);
    }

    const data = await response.json();
    const product = data.result;
    
    if (!product) {
      console.error('❌ Product not found');
      process.exit(1);
    }

    console.log('📦 Product Fields:');
    console.log('Keys:', Object.keys(product).join(', '));
    console.log('\n📋 Product Data (first 2000 chars):');
    console.log(JSON.stringify(product, null, 2).substring(0, 2000));
    
    if (product.variants && product.variants.length > 0) {
      console.log('\n\n🔍 First Variant Fields:');
      console.log('Keys:', Object.keys(product.variants[0]).join(', '));
      console.log('\n📋 Variant Data (first 1500 chars):');
      console.log(JSON.stringify(product.variants[0], null, 2).substring(0, 1500));
      
      // Look for catalog IDs
      console.log('\n\n🔎 Looking for Catalog IDs:');
      console.log('Product catalog_product_id:', product.catalog_product_id);
      console.log('Product product_id:', product.product_id);
      console.log('Product main_category_id:', product.main_category_id);
      
      const variant = product.variants[0];
      console.log('Variant catalog_variant_id:', variant.catalog_variant_id);
      console.log('Variant variant_id:', variant.variant_id);
      console.log('Variant id:', variant.id);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkApiStructure();

