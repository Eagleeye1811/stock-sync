const stockService = require('../../services/stock.service');

/**
 * @desc    Get current stock levels
 * @route   GET /api/inventory/stock-levels
 */
exports.getStockLevels = async (req, res, next) => {
  try {
    const filters = {
      productId: req.query.productId,
      locationId: req.query.locationId,
      minQuantity: req.query.minQuantity ? parseFloat(req.query.minQuantity) : undefined
    };

    const stockLevels = await stockService.getStockLevels(filters);

    res.status(200).json({
      success: true,
      count: stockLevels.length,
      data: stockLevels
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stock movement history
 * @route   GET /api/inventory/stock-ledger
 */
exports.getStockLedger = async (req, res, next) => {
  try {
    const filters = {
      productId: req.query.productId,
      locationId: req.query.locationId,
      documentType: req.query.documentType,
      status: req.query.status,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };

    const ledger = await stockService.getStockLedger(filters);

    res.status(200).json({
      success: true,
      count: ledger.length,
      data: ledger
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock alerts
 * @route   GET /api/inventory/low-stock
 */
exports.getLowStock = async (req, res, next) => {
  try {
    const alerts = await stockService.getLowStockAlerts();

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

