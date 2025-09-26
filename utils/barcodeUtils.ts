export interface BarcodeResult {
  type: string;
  data: string;
  timestamp: Date;
}

export interface ProductInfo {
  success: boolean;
  product?: any;
  barcode?: string;
  message?: string;
}

export const processBarcodeData = (barcodeData: string, barcodeType: string): BarcodeResult => {
  return {
    type: barcodeType,
    data: barcodeData,
    timestamp: new Date(),
  };
};

export const validateBarcode = (data: string, type: string): boolean => {
  // Basic validation for common barcode types
  switch (type) {
    case 'EAN_13':
      return data.length === 13 && /^\d+$/.test(data);
    case 'EAN_8':
      return data.length === 8 && /^\d+$/.test(data);
    case 'UPC_A':
      return data.length === 12 && /^\d+$/.test(data);
    case 'UPC_E':
      return data.length === 8 && /^\d+$/.test(data);
    case 'CODE_128':
      return data.length > 0;
    case 'CODE_39':
      return data.length > 0;
    case 'QR_CODE':
      return data.length > 0;
    default:
      return data.length > 0;
  }
};

export const getBarcodeTypeName = (type: string): string => {
  const typeNames: { [key: string]: string } = {
    'EAN_13': 'EAN-13',
    'EAN_8': 'EAN-8',
    'UPC_A': 'UPC-A',
    'UPC_E': 'UPC-E',
    'CODE_128': 'Code 128',
    'CODE_39': 'Code 39',
    'QR_CODE': 'QR Code',
    'DATA_MATRIX': 'Data Matrix',
    'PDF_417': 'PDF417',
  };
  
  return typeNames[type] || type;
};

export const searchProductByBarcode = async (barcodeData: string): Promise<ProductInfo> => {
  try {
    // Use centralized API base URL
    const { BACKEND_URL } = await import('../constants/Api');
    const response = await fetch(`${BACKEND_URL}/product/${barcodeData}`);
    const data = await response.json();
    
    if (!response.ok) {
      // Log backend error for debugging
      console.error('Backend error:', data);
      // Show specific error for not found
      if (response.status === 404) {
        return {
          success: false,
          message: data.message || 'Product not found in Open Food Facts database.',
          barcode: barcodeData
        };
      }
      // Other backend errors
      return {
        success: false,
        message: data.message || 'Backend error occurred.',
        barcode: barcodeData
      };
    }
    // If product is missing in the response
    if (!data.product) {
      return {
        success: false,
        message: 'No product details found for this barcode.',
        barcode: barcodeData
      };
    }
    return {
      success: true,
      product: data.product,
      barcode: barcodeData
    };
  } catch (error) {
    // Log network error for debugging
    console.error('Network error searching for product:', error);
    return {
      success: false,
      message: 'Failed to connect to server. Please check your connection.',
      barcode: barcodeData
    };
  }
};

export const formatProductInfo = (product: any): string => {
  if (!product) return 'No product information available';
  
  const info = [];
  
  // Get the best available product name
  let productName = product.product_name || 
                   product.product_name_en || 
                   product.product_name_fr || 
                   product.generic_name ||
                   'Unknown Product';
  
  info.push(`Name: ${productName}`);
  
  if (product.brands) {
    info.push(`Brand: ${product.brands}`);
  }
  
  if (product.quantity) {
    info.push(`Quantity: ${product.quantity}`);
  }
  
  if (product.nutrition_grade_fr) {
    info.push(`Nutrition Grade: ${product.nutrition_grade_fr.toUpperCase()}`);
  }
  
  if (product.ingredients_text) {
    const ingredients = product.ingredients_text.substring(0, 100);
    info.push(`Ingredients: ${ingredients}${product.ingredients_text.length > 100 ? '...' : ''}`);
  }
  
  return info.join('\n');
}; 