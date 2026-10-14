
const {
  getOrderForUser,
  getOrderHistory,
  createOrder: createOrderService,
} = require("../services/orderService");

const getMyOrder = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await getOrderForUser(
      orderId,
      req.user.userId
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrderHistory = async (req, res, next) => {
  try {
    const orders = await getOrderHistory(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Order history retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const createMyOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(
      req.user.userId,
      req.body.items
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyOrder,
  getMyOrderHistory,
  createMyOrder,
};
