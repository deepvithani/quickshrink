import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const cards = [
  {
    tag: "RETAIL",
    title: "Attract customers and keep loyal shoppers coming back",
    desc:
      "Whether you’re a brick-and-mortar shop or a major department store, Quickshrink helps track in-person and online connections.",
  },
  {
    tag: "CONSUMER PACKAGED GOODS",
    title: "Thriving brands start with raving fans",
    desc:
      "Give consumers the power to learn about products and interact directly with your brand using links and QR Codes.",
  },
  {
    tag: "HOSPITALITY",
    title: "Delight guests at every digital touchpoint",
    desc:
      "From menus to reviews, Quickshrink helps hospitality brands connect faster with customers.",
  },
  // Added two new cards
  {
    tag: "TECHNOLOGY",
    title: "Revolutionize your customer engagement",
    desc:
      "Leverage innovative solutions like AI-powered tools and integrations to enhance your customer relationships.",
  },
  {
    tag: "EDUCATION",
    title: "Engage students and staff seamlessly",
    desc:
      "Empower educational institutions with easy-to-use solutions for digital engagement, from enrollment to graduation.",
  },
];

const UseCasesSlider = () => {
  return (
    <section className="mt-24 bg-[#faf7f2] py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-4xl font-extrabold text-slate-900">
            See how other businesses use Quickshrink
          </h2>

          <div className="flex gap-3">
            <button className="usecase-prev rounded-full border border-slate-300 p-3 hover:bg-white">
              <FaArrowLeft size={24} color="#1D4ED8" />
            </button>
            <button className="usecase-next rounded-full border border-slate-300 p-3 hover:bg-white">
              <FaArrowRight size={24} color="#1D4ED8" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".usecase-next",
            prevEl: ".usecase-prev",
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {cards.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 transition hover:shadow-xl">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    {card.tag}
                  </p>

                  <h3 className="mb-4 text-2xl font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="text-slate-600">{card.desc}</p>
                </div>

                <button className="mt-8 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                  Read more →
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default UseCasesSlider;
