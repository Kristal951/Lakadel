import { OrderStatus } from "@prisma/client";

export function getNotificationForStatus(status: OrderStatus, orderId: string) {
  switch (status) {
    case "PAID":
      return {
        title: "Payment confirmed 🎉",
        message: `Your payment for order #${orderId} was successful.`,
        type: "INFO", 
        action: 'PAYMENT_SUCCESS',
      };

    case "FAILED":
      return {
        title: "Payment failed",
        message: `Payment for order #${orderId} failed. Please try again.`,
        type: "INFO", 
        action: 'PAYMENT_FAILED',
      };

    case "SHIPPED":
      return {
        title: "Your order has been shipped 🚚",
        message: `Order #${orderId} is on the way.`,
        type: "ORDER", 
        action: 'ORDER_SHIPPED',
      };

    case "DELIVERED":
      return {
        title: "Order delivered 📦",
        message: `Order #${orderId} has been delivered.`,
        type: "ORDER", 
        action: 'ORDER_DELIVERED',
      };

    case "REFUNDED":
      return {
        title: "Refund processed 💸",
        message: `Your refund for order #${orderId} has been completed.`,
        type: "ORDER", 
        action: 'ORDER_REFUNDED',
      };

    case "PENDING":
      return {
        title: "Order pending",
        message: `Your order with ID #${orderId} is pending.`,
        type: "ORDER", 
        action: 'ORDER_PENDING',
      };

    default:
      return null;
  }
}