import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";

const Pricing = () => {
  const pricingPlans = {
    monthly: [
      {
        name: "Free",
        price: "$0",
        period: "/month",
        // badge: "With ads",
        features: [
          "5 QR Codes/month",
          "10 links/month",
          "2 custom landing pages",
          "Unlimited clicks & scans",
        ],
      },
      {
        name: "Core",
        price: "$15",
        period: "/month",
        features: [
          "10 QR Codes/month",
          "100 links/month",
          "5 landing pages",
          "30 days analytics",
        ],
      },
      {
        name: "Growth",
        price: "$35",
        period: "/month",
        popular: true,
        features: [
          "15 QR Codes/month",
          "500 links/month",
          "10 landing pages",
          "Branded links",
        ],
      },
      {
        name: "Premium",
        price: "$300",
        period: "/month",
        features: [
          "200 QR Codes/month",
          "3000 links/month",
          "Advanced analytics",
          "Deep linking",
        ],
      },
    ],

    annual: [
      {
        name: "Free",
        price: "$0",
        period: "/month",
        // badge: "With ads",
        features: [
          "5 QR Codes/month",
          "10 links/month",
          "2 custom landing pages",
          "Unlimited clicks & scans",
        ],
      },
      {
        name: "Core",
        price: "$10",
        period: "/month",
        note: "Billed $120/year",
        features: [
          "10 QR Codes/month",
          "100 links/month",
          "5 landing pages",
          "30 days analytics",
        ],
      },
      {
        name: "Growth",
        price: "$29",
        period: "/month",
        popular: true,
        note: "Billed $348/year",
        features: [
          "15 QR Codes/month",
          "500 links/month",
          "10 landing pages",
          "Custom domain",
        ],
      },
      {
        name: "Premium",
        price: "$199",
        period: "/month",
        note: "Billed $2388/year",
        features: [
          "200 QR Codes/month",
          "3000 links/month",
          "1 year analytics",
          "Campaign tracking",
        ],
      },
    ],
  };
  const [billing, setBilling] = useState("annual");

  return (
    <div className="min-h-screen bg-[#faf7f2] py-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-4 text-black">
        Pricing for brands and businesses of all sizes
      </h1>
      <p className=" font-bold text-center mb-8 text-[#474747]">
      Connect to your audience with branded links, QR Codes, and landing pages that will get their attention.
      </p>
      

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-1 rounded-full shadow">
          {["annual", "monthly"].map((type) => (
            <button
              key={type}
              onClick={() => setBilling(type)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billing === type
                  ? "bg-blue-600 text-white"
                  : "text-black"
              }`}
            >
              Pay {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingPlans[billing].map((plan, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-6 border ${
              plan.popular
                ? "border-orange-500 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                Recommended
              </span>
            )}

            <h3 className="text-xl font-bold mt-4 text-black">{plan.name}</h3>
            {plan.badge && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                {plan.badge}
              </span>
            )}

            <div className="my-6">
              <span className="text-4xl font-bold text-black">{plan.price}</span>
              <span className="text-gray-500">{plan.period}</span>
              {plan.note && (
                <p className="text-sm text-gray-400">{plan.note}</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex gap-2 text-black">
                  <FaCheck className="text-blue-600 mt-1" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg font-semibold ${
                plan.popular
                  ? "bg-blue-600 text-white"
                  : "border border-blue-600 text-blue-600"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
