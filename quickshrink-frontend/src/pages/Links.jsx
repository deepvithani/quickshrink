import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Links = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/links`)
      .then((res) => res.json())
      .then((data) => {
        setLinks(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6 text-slate-100">
      <h1 className="mb-6 text-2xl font-bold text-white">All Short Links</h1>

      {links.length === 0 ? (
        <p className="text-slate-400" >No links available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full border-collapse bg-slate-900">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="border border-slate-700 p-3 text-left">Short URL</th>
                <th className="border border-slate-700 p-3 text-left">Original URL</th>
                <th className="border border-slate-700 p-3 text-center">Clicks</th>
              </tr>
            </thead>
            <tbody>
          {links.map((link, index) => (
            <tr
              key={index}
              className="hover:bg-slate-800 transition"
            >
              <td className="border border-slate-700 p-3">
                <a
                  href={`${API_BASE_URL}/${link.short_code}`}
                  target="_blank"
                  className="text-cyan-400 underline"
                >
                  {link.short_code}
                </a>
              </td>

              <td className="border border-slate-700 p-3 break-all text-slate-300">
                {link.original_url}
              </td>

              <td className="border border-slate-700 p-3 text-center">
                {link.clicks || 0}
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Links;
