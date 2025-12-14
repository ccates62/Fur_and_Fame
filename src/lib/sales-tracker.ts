/**
 * Sales Tracker Utility
 * 
 * Handles automatic sales tracking and storage
 */

export interface Sale {
  id: string;
  date: string;
  amount: number;
  product: string;
  customerEmail?: string;
  orderId?: string;
}

/**
 * Track a sale (for client-side use)
 */
export function trackSale(sale: Omit<Sale, "id" | "date">): Sale {
  const newSale: Sale = {
    id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString().split("T")[0],
    ...sale,
  };

  // Save to localStorage (client-side)
  if (typeof window !== "undefined") {
    const existingSales = getSales();
    const updatedSales = [newSale, ...existingSales];
    localStorage.setItem("salesData", JSON.stringify(updatedSales));
  }

  return newSale;
}

/**
 * Get all sales from localStorage
 */
export function getSales(): Sale[] {
  if (typeof window === "undefined") return [];
  
  try {
    const salesData = localStorage.getItem("salesData");
    if (salesData) {
      return JSON.parse(salesData);
    }
  } catch (error) {
    console.error("Error loading sales data:", error);
  }
  
  return [];
}

/**
 * Calculate total sales
 */
export function getTotalSales(): number {
  return getSales().reduce((sum, sale) => sum + sale.amount, 0);
}

/**
 * Get sales by date range
 */
export function getSalesByDateRange(startDate: Date, endDate: Date): Sale[] {
  return getSales().filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });
}









