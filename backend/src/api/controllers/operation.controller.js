const { PrismaClient } = require('@prisma/client');
const stockService = require('../../services/stock.service');

const prisma = new PrismaClient();

/**
 * Operation Controller - Handles all stock operations (Receipts, Deliveries, Transfers)
 */

/**
 * @desc    Create a new receipt (incoming stock)
 * @route   POST /api/operations/receipt
 */
exports.createReceipt = async (req, res, next) => {
  try {
    const { productId, locationId, quantity, documentNumber, notes } = req.body;

    const receipt = await prisma.stockLedger.create({
      data: {
        productId,
        destinationLocationId: locationId,
        quantity: parseFloat(quantity),
        documentType: 'RECEIPT',
        documentNumber,
        notes,
        status: 'DRAFT',
        createdBy: req.user.id
      },
      include: {
        product: true,
        destinationLocation: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new delivery (outgoing stock)
 * @route   POST /api/operations/delivery
 */
exports.createDelivery = async (req, res, next) => {
  try {
    const { productId, locationId, quantity, documentNumber, notes } = req.body;

    const delivery = await prisma.stockLedger.create({
      data: {
        productId,
        sourceLocationId: locationId,
        quantity: parseFloat(quantity),
        documentType: 'DELIVERY',
        documentNumber,
        notes,
        status: 'DRAFT',
        createdBy: req.user.id
      },
      include: {
        product: true,
        sourceLocation: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new internal transfer
 * @route   POST /api/operations/transfer
 */
exports.createTransfer = async (req, res, next) => {
  try {
    const { productId, sourceLocationId, destinationLocationId, quantity, notes } = req.body;

    // Validate that source and destination are different
    if (sourceLocationId === destinationLocationId) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination locations must be different'
      });
    }

    const transfer = await prisma.stockLedger.create({
      data: {
        productId,
        sourceLocationId,
        destinationLocationId,
        quantity: parseFloat(quantity),
        documentType: 'INTERNAL_TRANSFER',
        notes,
        status: 'DRAFT',
        createdBy: req.user.id
      },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: transfer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate an operation (CRITICAL - Updates stock levels)
 * @route   POST /api/operations/validate/:moveId
 */
exports.validateOperation = async (req, res, next) => {
  try {
    const { moveId } = req.params;

    // Get the operation
    const operation = await prisma.stockLedger.findUnique({
      where: { id: moveId }
    });

    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }

    // Check if already validated
    if (operation.status === 'VALIDATED') {
      return res.status(400).json({
        success: false,
        message: 'Operation already validated'
      });
    }

    // Check if cancelled
    if (operation.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot validate a cancelled operation'
      });
    }

    // Execute the validation through stock service
    const validatedOperation = await stockService.validateOperation({
      moveId: operation.id,
      productId: operation.productId,
      sourceLocationId: operation.sourceLocationId,
      destinationLocationId: operation.destinationLocationId,
      quantity: operation.quantity,
      documentType: operation.documentType,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Operation validated successfully',
      data: validatedOperation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all operations with optional filters
 * @route   GET /api/operations
 */
exports.getOperations = async (req, res, next) => {
  try {
    const { productId, documentType, status, limit } = req.query;

    const filters = {};
    if (productId) filters.productId = productId;
    if (documentType) filters.documentType = documentType;
    if (status) filters.status = status;
    if (limit) filters.limit = parseInt(limit);

    const operations = await stockService.getStockLedger(filters);

    res.status(200).json({
      success: true,
      count: operations.length,
      data: operations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single operation by ID
 * @route   GET /api/operations/:moveId
 */
exports.getOperation = async (req, res, next) => {
  try {
    const { moveId } = req.params;

    const operation = await prisma.stockLedger.findUnique({
      where: { id: moveId },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: operation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel/delete an operation (only if DRAFT)
 * @route   DELETE /api/operations/:moveId
 */
exports.cancelOperation = async (req, res, next) => {
  try {
    const { moveId } = req.params;

    const operation = await prisma.stockLedger.findUnique({
      where: { id: moveId }
    });

    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }

    if (operation.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel operations in DRAFT status'
      });
    }

    await prisma.stockLedger.update({
      where: { id: moveId },
      data: { status: 'CANCELLED' }
    });

    res.status(200).json({
      success: true,
      message: 'Operation cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

