import React from "react";
import { Sparkles, Recycle, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: <Sparkles size={32} color="#00B0B9" />,
    title: "Premium Print Quality",
    desc: "Your design deserves the best materials and ink.",
  },
  {
    icon: <Recycle size={32} color="#00B0B9" />,
    title: "Sustainable Options",
    desc: "Eco-friendly options like Cotton and recycled paper.",
  },
  {
    icon: <BadgeCheck size={32} color="#00B0B9" />,
    title: "Satisfaction Guarantee",
    desc: "We reprint or refund if you’re not 100% happy.",
  },
];

const FeaturesSection = () => {
  return (
    <div
      style={{
        backgroundColor: "#FDF6ED",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "40px", fontWeight: "bold" }}>
        Why Blue Link Business Cards?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {features.map((item, index) => (
          <div key={index}>
            <div>{item.icon}</div>
            <h4 style={{ marginTop: "15px", fontSize: "18px", fontWeight: "600" }}>
              {item.title}
            </h4>
            <p style={{ color: "#555", fontSize: "14px", marginTop: "8px" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
