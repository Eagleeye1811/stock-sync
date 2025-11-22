const { PrismaClient } = require('@prisma/client');
const stockService = require('../../services/stock.service');

const prisma = new PrismaClient();

/**
 * @desc    Get dashboard KPIs
 * @route   GET /api/dashboard/kpis
 */
exports.getKPIs = async (req, res, next) => {
  try {
    // Parallel queries for performance
    const [
      totalProducts,
      totalLocations,
      pendingReceipts,
      pendingDeliveries,
      lowStockAlerts,
      recentMoves
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.location.count({ where: { isActive: true } }),
      prisma.stockLedger.count({
        where: { documentType: 'RECEIPT', status: 'DRAFT' }
      }),
      prisma.stockLedger.count({
        where: { documentType: 'DELIVERY', status: 'DRAFT' }
      }),
      stockService.getLowStockAlerts(),
      stockService.getStockLedger({ limit: 10 })
    ]);

    // Calculate total stock value (you can enhance this with pricing data)
    const stockLevels = await stockService.getStockLevels();
    const totalStockItems = stockLevels.reduce((sum, stock) => sum + stock.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalLocations,
        pendingReceipts,
        pendingDeliveries,
        lowStockCount: lowStockAlerts.length,
        totalStockItems: Math.round(totalStockItems),
        recentMoves
      }
    });
  } catch (error) {
    next(error);
  }
};

