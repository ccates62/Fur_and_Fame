/**
 * Helper script to list all Printful products and their IDs
 * 
 * Usage: npm run printful:list-products
 * 
 * This script will:
 * 1. Fetch all products from your Printful store
 * 2. Show Product IDs and Variant IDs
 * 3. Help you fill in PRINTFUL_PRODUCT_MAP in src/lib/printful-client.ts
 */

require('dotenv').config({ path: '.env.local' });

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

if (!PRINTFUL_API_KEY) {
  console.error('❌ ERROR: PRINTFUL_API_KEY not found in .env.local');
  console.log('\n📝 Please add your Printful API key to .env.local:');
  console.log('   PRINTFUL_API_KEY=your_api_key_here\n');
  process.exit(1);
}

async function fetchPrintfulProducts() {
  try {
    console.log('🔍 Fetching products from Printful...\n');

    // Fetch store products
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching products:', response.status, errorText);
      
      if (response.status === 401) {
        console.log('\n💡 Your API key might be invalid. Please check:');
        console.log('   1. Go to Printful Dashboard → Stores → API');
        console.log('   2. Copy your API key');
        console.log('   3. Add it to .env.local as PRINTFUL_API_KEY=your_key\n');
      }
      process.exit(1);
    }

    const data = await response.json();
    const products = data.result || [];

    if (products.length === 0) {
      console.log('⚠️  No products found in your Printful store.');
      console.log('\n📝 You need to create products first:');
      console.log('   1. Go to Printful Dashboard → Product Templates');
      console.log('   2. Add products (Canvas, Mug, etc.)');
      console.log('   3. Run this script again\n');
      process.exit(0);
    }

    console.log(`✅ Found ${products.length} product(s):\n`);
    console.log('═'.repeat(80));

    // Fetch details for each product to get variants
    for (const product of products) {
      const productId = product.id;
      const productName = product.name || 'Unnamed Product';
      
      console.log(`\n📦 ${productName}`);
      console.log(`   Product ID: ${productId}`);

      // Fetch product details to get variants
      try {
        const detailResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          const productData = detailData.result;
          
          // Try sync_variants first (most common for store products)
          const syncVariants = productData?.sync_variants || [];
          const variants = productData?.variants || [];

          // Combine both sources
          const allVariants = syncVariants.length > 0 ? syncVariants : variants;

          if (allVariants.length > 0) {
            console.log(`   Variants (${allVariants.length}):`);
            allVariants.forEach((variant, index) => {
              const variantName = variant.name || variant.product?.name || `Variant ${index + 1}`;
              const variantId = variant.id;
              const externalId = variant.external_id || variant.product?.external_id || '';
              const size = variant.size || variant.product?.size || '';
              const color = variant.color || variant.product?.color || '';
              
              console.log(`     ${index + 1}. ${variantName}${size ? ` (${size})` : ''}${color ? ` - ${color}` : ''}`);
              console.log(`        Variant ID: ${variantId}`);
              if (externalId) {
                console.log(`        External ID: ${externalId} ⭐ (Use this for variantId in code)`);
              }
            });
            
            // Generate code snippet
            console.log(`\n   💻 Code snippet for PRINTFUL_PRODUCT_MAP:`);
            allVariants.forEach((variant) => {
              const externalId = variant.external_id || variant.product?.external_id || '';
              const size = variant.size || variant.product?.size || '';
              if (externalId && size) {
                // Generate product key from size (e.g., "37×57" -> "blanket-37x57")
                const sizeKey = size.replace(/[×″]/g, 'x').toLowerCase();
                const productKey = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                console.log(`     "${productKey}-${sizeKey}": {`);
                console.log(`       productId: ${productId},`);
                console.log(`       variantId: "${externalId}",`);
                console.log(`     },`);
              }
            });
          } else {
            console.log(`   ⚠️  No variants found for this product`);
          }
        }
      } catch (error) {
        console.log(`   ⚠️  Could not fetch variant details: ${error.message}`);
      }

      console.log('─'.repeat(80));
    }

    console.log('\n📝 Next Steps:');
    console.log('   1. Copy the Product IDs and Variant IDs above');
    console.log('   2. Open src/lib/printful-client.ts');
    console.log('   3. Update PRINTFUL_PRODUCT_MAP with your IDs');
    console.log('   4. Match products by name (e.g., "Canvas 12x12" → "canvas-12x12")\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
fetchPrintfulProducts();


