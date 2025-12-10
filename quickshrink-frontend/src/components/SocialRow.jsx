import { FaGoogle, FaFacebookF, FaMicrosoft, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const providers = [
  { label: "Google", Icon: FaGoogle },
  { label: "Facebook", Icon: FaFacebookF },
  { label: "X (Twitter)", Icon: FaXTwitter },
  { label: "Twitter", Icon: FaTwitter },
  { label: "Microsoft", Icon: FaMicrosoft },
];

const SocialRow = () => (
  <div className="flex flex-wrap gap-2">
    {providers.map(({ label, Icon }) => (
      <button
        key={label}
        type="button"
        className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
      >
        <Icon className="text-base" />
        {label}
      </button>
    ))}
  </div>
);

export default SocialRow;

