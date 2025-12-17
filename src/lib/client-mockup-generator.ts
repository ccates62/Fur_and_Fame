/**
 * Client-side mockup generator for products
 * Generates realistic product mockups in the browser using Canvas API
 */

export interface MockupOptions {
  placement?: 'left' | 'right' | 'front' | 'back';
  perspective?: number; // Perspective transform amount (0-1)
  curvature?: number; // Curvature amount for rounded surfaces (0-1)
}

/**
 * Generate a mug mockup with the customer's image on the right side
 * @param imageUrl - URL of the customer's portrait image
 * @param options - Mockup generation options
 * @returns Promise resolving to a data URL of the generated mockup
 */
export async function generateMugMockup(
  imageUrl: string,
  options: MockupOptions = {}
): Promise<string> {
  const {
    placement = 'right',
    perspective = 0.3,
    curvature = 0.15,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Set canvas size (mug mockup dimensions)
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Load the customer's image
    // If the image is from an external domain, use our proxy to avoid CORS issues
    let imageUrlToLoad = imageUrl;
    try {
      const url = new URL(imageUrl);
      // If it's not from the same origin, use the proxy
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      } else if (typeof window === 'undefined') {
        // Server-side: always use proxy for external URLs
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      }
    } catch (e) {
      // Invalid URL, use proxy as fallback
      console.debug('Could not parse image URL, using proxy:', e);
      imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }

    const customerImage = new Image();
    // Don't set crossOrigin for proxied images (they're same-origin now)
    if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
      try {
        customerImage.crossOrigin = 'anonymous';
      } catch (e) {
        console.debug('CORS setting skipped:', e);
      }
    }
    
    customerImage.onload = () => {
      try {
        // Draw gradient background (light gray to white)
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#f5f5f5');
        bgGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw mug shape (simplified mug silhouette)
        const mugWidth = width * 0.58;
        const mugHeight = height * 0.78;
        const mugX = (width - mugWidth) / 2;
        const mugY = (height - mugHeight) / 2;

        // Mug shading
        const mugGradient = ctx.createLinearGradient(mugX, mugY, mugX + mugWidth, mugY + mugHeight);
        mugGradient.addColorStop(0, '#fdfdfd');
        mugGradient.addColorStop(1, '#f0f0f0');

        // Draw mug body (rounded rectangle with handle)
        ctx.fillStyle = mugGradient;
        ctx.strokeStyle = '#d3d3d3';
        ctx.lineWidth = 3;

        // Main mug body (rounded rectangle)
        const cornerRadius = 32;
        ctx.beginPath();
        ctx.moveTo(mugX + cornerRadius, mugY);
        ctx.lineTo(mugX + mugWidth - cornerRadius, mugY);
        ctx.quadraticCurveTo(mugX + mugWidth, mugY, mugX + mugWidth, mugY + cornerRadius);
        ctx.lineTo(mugX + mugWidth, mugY + mugHeight - cornerRadius);
        ctx.quadraticCurveTo(mugX + mugWidth, mugY + mugHeight, mugX + mugWidth - cornerRadius, mugY + mugHeight);
        ctx.lineTo(mugX + cornerRadius, mugY + mugHeight);
        ctx.quadraticCurveTo(mugX, mugY + mugHeight, mugX, mugY + mugHeight - cornerRadius);
        ctx.lineTo(mugX, mugY + cornerRadius);
        ctx.quadraticCurveTo(mugX, mugY, mugX + cornerRadius, mugY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner rim to give depth
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(mugX + mugWidth / 2, mugY + 8, mugWidth * 0.48, 10, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw handle (semi-circle on the left)
        const handleRadius = mugHeight * 0.18;
        const handleX = mugX - handleRadius * 0.35;
        const handleY = mugY + mugHeight * 0.35;
        
        ctx.strokeStyle = '#d3d3d3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(handleX, handleY, handleRadius, Math.PI / 2, (Math.PI * 3) / 2, false);
        ctx.stroke();

        // Calculate placement area for the design (larger and right-aligned)
        const designArea = {
          x: mugX + mugWidth * 0.47, // Right half
          y: mugY + mugHeight * 0.14,
          width: mugWidth * 0.46,
          height: mugHeight * 0.72,
        };

        // Save context for clipping
        ctx.save();

        // Create clipping path for the design area (rounded rectangle matching mug shape)
        ctx.beginPath();
        ctx.moveTo(designArea.x + cornerRadius, designArea.y);
        ctx.lineTo(designArea.x + designArea.width - cornerRadius, designArea.y);
        ctx.quadraticCurveTo(
          designArea.x + designArea.width,
          designArea.y,
          designArea.x + designArea.width,
          designArea.y + cornerRadius
        );
        ctx.lineTo(
          designArea.x + designArea.width,
          designArea.y + designArea.height - cornerRadius
        );
        ctx.quadraticCurveTo(
          designArea.x + designArea.width,
          designArea.y + designArea.height,
          designArea.x + designArea.width - cornerRadius,
          designArea.y + designArea.height
        );
        ctx.lineTo(designArea.x + cornerRadius, designArea.y + designArea.height);
        ctx.quadraticCurveTo(
          designArea.x,
          designArea.y + designArea.height,
          designArea.x,
          designArea.y + designArea.height - cornerRadius
        );
        ctx.lineTo(designArea.x, designArea.y + cornerRadius);
        ctx.quadraticCurveTo(designArea.x, designArea.y, designArea.x + cornerRadius, designArea.y);
        ctx.closePath();
        ctx.clip();

        // Draw customer's image with proper aspect ratio and positioning
        const imageAspect = customerImage.width / customerImage.height;
        const designAspect = designArea.width / designArea.height;
        
        let drawWidth = designArea.width;
        let drawHeight = designArea.height;
        let drawX = designArea.x;
        let drawY = designArea.y;

        // Maintain aspect ratio and center within design area
        if (imageAspect > designAspect) {
          drawHeight = drawWidth / imageAspect;
          drawY = designArea.y + (designArea.height - drawHeight) / 2;
        } else {
          drawWidth = drawHeight * imageAspect;
          drawX = designArea.x + (designArea.width - drawWidth) / 2;
        }

        // Draw the image directly (the clipping path will handle the rounded corners)
        ctx.drawImage(
          customerImage,
          drawX,
          drawY,
          drawWidth,
          drawHeight
        );

        // Restore context
        ctx.restore();

        // Add subtle shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        // Redraw mug outline with shadow
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mugX + cornerRadius, mugY);
        ctx.lineTo(mugX + mugWidth - cornerRadius, mugY);
        ctx.quadraticCurveTo(mugX + mugWidth, mugY, mugX + mugWidth, mugY + cornerRadius);
        ctx.lineTo(mugX + mugWidth, mugY + mugHeight - cornerRadius);
        ctx.quadraticCurveTo(mugX + mugWidth, mugY + mugHeight, mugX + mugWidth - cornerRadius, mugY + mugHeight);
        ctx.lineTo(mugX + cornerRadius, mugY + mugHeight);
        ctx.quadraticCurveTo(mugX, mugY + mugHeight, mugX, mugY + mugHeight - cornerRadius);
        ctx.lineTo(mugX, mugY + cornerRadius);
        ctx.quadraticCurveTo(mugX, mugY, mugX + cornerRadius, mugY);
        ctx.closePath();
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png', 0.95);
        console.log('✅ Mug mockup canvas generated, data URL length:', dataUrl.length);
        resolve(dataUrl);
      } catch (error) {
        console.error('❌ Error during canvas drawing:', error);
        reject(error);
      }
    };

    customerImage.onerror = (error) => {
      console.error('❌ Failed to load customer image for mug mockup:', error);
      console.error('Image URL attempted:', imageUrlToLoad);
      // If direct load failed and we're not already using proxy, try proxy
      if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
        console.log('🔄 Retrying with image proxy...');
        customerImage.crossOrigin = '';
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        console.log('Proxy URL:', proxyUrl);
        customerImage.src = proxyUrl;
      } else {
        console.error('❌ Image proxy also failed. Image URL may be invalid or inaccessible.');
        reject(new Error(`Failed to load customer image. URL: ${imageUrl}`));
      }
    };

    customerImage.src = imageUrlToLoad;
  });
}

/**
 * Generate a canvas print mockup (simpler - just frame the image)
 * @param imageUrl - URL of the customer's portrait image
 * @returns Promise resolving to a data URL of the generated mockup
 */
export async function generateCanvasMockup(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Load the customer's image
    // If the image is from an external domain, use our proxy to avoid CORS issues
    let imageUrlToLoad = imageUrl;
    try {
      const url = new URL(imageUrl);
      // If it's not from the same origin, use the proxy
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      } else if (typeof window === 'undefined') {
        // Server-side: always use proxy for external URLs
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      }
    } catch (e) {
      // Invalid URL, use proxy as fallback
      console.debug('Could not parse image URL, using proxy:', e);
      imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }

    const customerImage = new Image();
    // Don't set crossOrigin for proxied images (they're same-origin now)
    if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
      try {
        customerImage.crossOrigin = 'anonymous';
      } catch (e) {
        console.debug('CORS setting skipped:', e);
      }
    }
    
    customerImage.onload = () => {
      try {
        // Draw background
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, width, height);

        // Draw canvas frame (white border)
        const frameWidth = width * 0.85;
        const frameHeight = height * 0.85;
        const frameX = (width - frameWidth) / 2;
        const frameY = (height - frameHeight) / 2;

        // Frame shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;

        // Frame background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw image inside frame
        const imagePadding = 20;
        const imageX = frameX + imagePadding;
        const imageY = frameY + imagePadding;
        const imageWidth = frameWidth - imagePadding * 2;
        const imageHeight = frameHeight - imagePadding * 2;

        const imageAspect = customerImage.width / customerImage.height;
        const frameAspect = imageWidth / imageHeight;

        let drawWidth = imageWidth;
        let drawHeight = imageHeight;
        let drawX = imageX;
        let drawY = imageY;

        // Maintain aspect ratio
        if (imageAspect > frameAspect) {
          drawHeight = drawWidth / imageAspect;
          drawY = imageY + (imageHeight - drawHeight) / 2;
        } else {
          drawWidth = drawHeight * imageAspect;
          drawX = imageX + (imageWidth - drawWidth) / 2;
        }

        ctx.drawImage(customerImage, drawX, drawY, drawWidth, drawHeight);

        // Frame border
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        console.log('✅ Canvas mockup generated, data URL length:', dataUrl.length);
        resolve(dataUrl);
      } catch (error) {
        console.error('❌ Error during canvas drawing:', error);
        reject(error);
      }
    };

    customerImage.onerror = (error) => {
      console.error('❌ Failed to load customer image for canvas mockup:', error);
      console.error('Image URL attempted:', imageUrlToLoad);
      // If direct load failed and we're not already using proxy, try proxy
      if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
        console.log('🔄 Retrying with image proxy...');
        customerImage.crossOrigin = '';
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        console.log('Proxy URL:', proxyUrl);
        customerImage.src = proxyUrl;
      } else {
        console.error('❌ Image proxy also failed. Image URL may be invalid or inaccessible.');
        reject(new Error(`Failed to load customer image. URL: ${imageUrl}`));
      }
    };

    customerImage.src = imageUrlToLoad;
  });
}

/**
 * Generate a blanket mockup (similar to canvas - framed image on fabric texture)
 * @param imageUrl - URL of the customer's portrait image
 * @returns Promise resolving to a data URL of the generated mockup
 */
export async function generateBlanketMockup(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Load the customer's image
    // If the image is from an external domain, use our proxy to avoid CORS issues
    let imageUrlToLoad = imageUrl;
    try {
      const url = new URL(imageUrl);
      // If it's not from the same origin, use the proxy
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      } else if (typeof window === 'undefined') {
        // Server-side: always use proxy for external URLs
        imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      }
    } catch (e) {
      // Invalid URL, use proxy as fallback
      console.debug('Could not parse image URL, using proxy:', e);
      imageUrlToLoad = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }

    const customerImage = new Image();
    // Don't set crossOrigin for proxied images (they're same-origin now)
    if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
      try {
        customerImage.crossOrigin = 'anonymous';
      } catch (e) {
        console.debug('CORS setting skipped:', e);
      }
    }
    
    customerImage.onload = () => {
      try {
        // Draw background with fabric texture effect
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#f5f5f5');
        bgGradient.addColorStop(0.5, '#fafafa');
        bgGradient.addColorStop(1, '#f0f0f0');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Add subtle texture pattern (simulate fabric)
        ctx.fillStyle = 'rgba(200, 200, 200, 0.03)';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          ctx.fillRect(x, y, 2, 2);
        }

        // Draw blanket area (slightly rounded corners for soft fabric look)
        const blanketWidth = width * 0.9;
        const blanketHeight = height * 0.85;
        const blanketX = (width - blanketWidth) / 2;
        const blanketY = (height - blanketHeight) / 2;
        const cornerRadius = 15;

        // Blanket shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        // Draw blanket shape with rounded corners
        ctx.beginPath();
        ctx.moveTo(blanketX + cornerRadius, blanketY);
        ctx.lineTo(blanketX + blanketWidth - cornerRadius, blanketY);
        ctx.quadraticCurveTo(blanketX + blanketWidth, blanketY, blanketX + blanketWidth, blanketY + cornerRadius);
        ctx.lineTo(blanketX + blanketWidth, blanketY + blanketHeight - cornerRadius);
        ctx.quadraticCurveTo(blanketX + blanketWidth, blanketY + blanketHeight, blanketX + blanketWidth - cornerRadius, blanketY + blanketHeight);
        ctx.lineTo(blanketX + cornerRadius, blanketY + blanketHeight);
        ctx.quadraticCurveTo(blanketX, blanketY + blanketHeight, blanketX, blanketY + blanketHeight - cornerRadius);
        ctx.lineTo(blanketX, blanketY + cornerRadius);
        ctx.quadraticCurveTo(blanketX, blanketY, blanketX + cornerRadius, blanketY);
        ctx.closePath();

        // Blanket background (slightly off-white for fabric look)
        ctx.fillStyle = '#fefefe';
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw image inside blanket area
        const imagePadding = 15;
        const imageX = blanketX + imagePadding;
        const imageY = blanketY + imagePadding;
        const imageWidth = blanketWidth - imagePadding * 2;
        const imageHeight = blanketHeight - imagePadding * 2;

        const imageAspect = customerImage.width / customerImage.height;
        const blanketAspect = imageWidth / imageHeight;

        let drawWidth = imageWidth;
        let drawHeight = imageHeight;
        let drawX = imageX;
        let drawY = imageY;

        // Maintain aspect ratio
        if (imageAspect > blanketAspect) {
          drawHeight = drawWidth / imageAspect;
          drawY = imageY + (imageHeight - drawHeight) / 2;
        } else {
          drawWidth = drawHeight * imageAspect;
          drawX = imageX + (imageWidth - drawWidth) / 2;
        }

        // Clip to rounded rectangle for image
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(drawX + cornerRadius, drawY);
        ctx.lineTo(drawX + drawWidth - cornerRadius, drawY);
        ctx.quadraticCurveTo(drawX + drawWidth, drawY, drawX + drawWidth, drawY + cornerRadius);
        ctx.lineTo(drawX + drawWidth, drawY + drawHeight - cornerRadius);
        ctx.quadraticCurveTo(drawX + drawWidth, drawY + drawHeight, drawX + drawWidth - cornerRadius, drawY + drawHeight);
        ctx.lineTo(drawX + cornerRadius, drawY + drawHeight);
        ctx.quadraticCurveTo(drawX, drawY + drawHeight, drawX, drawY + drawHeight - cornerRadius);
        ctx.lineTo(drawX, drawY + cornerRadius);
        ctx.quadraticCurveTo(drawX, drawY, drawX + cornerRadius, drawY);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(customerImage, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();

        // Blanket border (subtle, like fabric edge)
        ctx.strokeStyle = '#e8e8e8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(blanketX + cornerRadius, blanketY);
        ctx.lineTo(blanketX + blanketWidth - cornerRadius, blanketY);
        ctx.quadraticCurveTo(blanketX + blanketWidth, blanketY, blanketX + blanketWidth, blanketY + cornerRadius);
        ctx.lineTo(blanketX + blanketWidth, blanketY + blanketHeight - cornerRadius);
        ctx.quadraticCurveTo(blanketX + blanketWidth, blanketY + blanketHeight, blanketX + blanketWidth - cornerRadius, blanketY + blanketHeight);
        ctx.lineTo(blanketX + cornerRadius, blanketY + blanketHeight);
        ctx.quadraticCurveTo(blanketX, blanketY + blanketHeight, blanketX, blanketY + blanketHeight - cornerRadius);
        ctx.lineTo(blanketX, blanketY + cornerRadius);
        ctx.quadraticCurveTo(blanketX, blanketY, blanketX + cornerRadius, blanketY);
        ctx.closePath();
        ctx.stroke();

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        console.log('✅ Blanket mockup generated, data URL length:', dataUrl.length);
        resolve(dataUrl);
      } catch (error) {
        console.error('❌ Error during blanket drawing:', error);
        reject(error);
      }
    };

    customerImage.onerror = (error) => {
      console.error('❌ Failed to load customer image for blanket mockup:', error);
      console.error('Image URL attempted:', imageUrlToLoad);
      // If direct load failed and we're not already using proxy, try proxy
      if (!imageUrlToLoad.startsWith('/api/image-proxy')) {
        console.log('🔄 Retrying with image proxy...');
        customerImage.crossOrigin = '';
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        console.log('Proxy URL:', proxyUrl);
        customerImage.src = proxyUrl;
      } else {
        console.error('❌ Image proxy also failed. Image URL may be invalid or inaccessible.');
        reject(new Error(`Failed to load customer image. URL: ${imageUrl}`));
      }
    };

    customerImage.src = imageUrlToLoad;
  });
}

