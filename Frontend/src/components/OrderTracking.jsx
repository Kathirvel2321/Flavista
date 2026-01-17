import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer `,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error("Failed to fetch order");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Loading Tracking Details...</h2>
      </div>
    );
  }

  const steps = [
    {
      status: "pending",
      label: "Order Placed",
      icon: "🛒",
      description: "We have received your order.",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: "✅",
      description: "Restaurant has confirmed your order.",
    },
    {
      status: "preparing",
      label: "Preparing",
      icon: "👨‍🍳",
      description: "Your food is being prepared.",
    },
    {
      status: "on-the-way",
      label: "On the Way",
      icon: "🛵",
      description: "Our delivery partner is on the way.",
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: "🎉",
      description: "Enjoy your meal!",
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === "cancelled";

  // Calculate SVG path points for zig-zag
  const stepHeight = 150;
  const pathPoints = steps.map((_, index) => {
    const x = index % 2 === 0 ? 20 : 80; // Zig zag between 20% and 80% width
    const y = index * stepHeight + 50;
    return `,`;
  });

  const pathD =
    `M ${pathPoints[0]} ` +
    pathPoints
      .slice(1)
      .map((p) => `L `)
      .join(" ");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            color: "#1f2937",
          }}
        >
          Track Your Order
        </h1>

        {/* Order Summary */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            Order #{order._id}
          </h2>
          {order.restaurantId && (
            <p style={{ color: "#4b5563" }}>From: {order.restaurantId.name}</p>
          )}
          <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>
            Total Amount: ₹{order.totalPrice}
          </p>
        </div>

        {isCancelled ? (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <strong>Order Cancelled</strong>
          </div>
        ) : (
          <div style={{ position: "relative", paddingBottom: "100px" }}>
            {/* The Road (SVG) */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
              }}
              preserveAspectRatio="none"
              viewBox={`0 0 100 ${steps.length * stepHeight}`}
            >
              {/* Road Border */}
              <path
                d={pathD}
                stroke="#d1d5db"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Road Center Line */}
              <path
                d={pathD}
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Progress Line (Colored) */}
              <motion.path
                d={pathD}
                stroke="#f97316"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(
                    0,
                    currentStepIndex / (steps.length - 1)
                  ),
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Steps */}
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  style={{
                    display: "flex",
                    flexDirection: isLeft ? "row" : "row-reverse",
                    alignItems: "center",
                    marginBottom: "50px", // Adjust based on stepHeight
                    position: "relative",
                    zIndex: 10,
                    height: "100px", // Fixed height for alignment
                  }}
                >
                  {/* Content Card */}
                  <div
                    style={{
                      width: "40%",
                      padding: "0 1rem",
                      textAlign: isLeft ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isCompleted
                          ? "white"
                          : "rgba(255,255,255,0.6)",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        border: isActive ? "2px solid #f97316" : "none",
                      }}
                    >
                      <h3 style={{ fontWeight: "bold", color: "#111827" }}>
                        {step.label}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Marker on Road */}
                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        backgroundColor: isCompleted ? "#f97316" : "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        boxShadow: "0 0 0 4px white",
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  <div style={{ width: "40%" }}></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
