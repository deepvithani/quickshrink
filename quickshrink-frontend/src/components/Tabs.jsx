import { FaLink, FaQrcode } from "react-icons/fa";

const Tabs = ({ activeTab, onChange, tabs }) => (
  <div className="mb-6 flex rounded-full bg-slate-900/60 p-1 text-sm text-slate-300">
    <button
      type="button"
      onClick={() => onChange(tabs.SHORT_LINK)}
      className={`flex-1 rounded-full px-4 py-2 transition ${
        activeTab === tabs.SHORT_LINK ? "bg-slate-950 text-slate-50 shadow-sm" : "hover:text-slate-50"
      }`}
    >
      <span className="flex items-center justify-center gap-2 font-semibold">
        <FaLink aria-hidden="true" />
        Shorten a Link
      </span>
    </button>
    <button
      type="button"
      onClick={() => onChange(tabs.QR_CODE)}
      className={`flex-1 rounded-full px-4 py-2 transition ${
        activeTab === tabs.QR_CODE ? "bg-slate-950 text-slate-50 shadow-sm" : "hover:text-slate-50"
      }`}
    >
      <span className="flex items-center justify-center gap-2 font-semibold">
        <FaQrcode aria-hidden="true" />
        Generate QR Code
      </span>
    </button>
  </div>
);

export default Tabs;

