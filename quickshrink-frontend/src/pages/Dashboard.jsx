import { useEffect, useState } from "react";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/my-links`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((data) => {
        setLinks(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
  
    const res = await fetch(`${API_BASE_URL}/api/links/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (res.ok) {
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 text-slate-100">
    <h1 className="mb-4 text-2xl font-bold text-white">
      My Short Links
    </h1>
  
    {links.length === 0 ? (
      <p className="text-slate-400">No links found.</p>
    ) : (
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full border-collapse bg-slate-900">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="border border-slate-700 p-3 text-left">
                Original URL
              </th>
              <th className="border border-slate-700 p-3 text-left">
                Short URL
              </th>
              <th className="border border-slate-700 p-3 text-center">
                Clicks
              </th>
              <th className="border border-slate-700 p-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
  
          <tbody>
            {links.map((link) => (
              <tr
                key={link.id}
                className="hover:bg-slate-800 transition"
              >
                <td className="border border-slate-700 p-3 break-all text-slate-300">
                  {link.original_url}
                </td>
  
                <td className="border border-slate-700 p-3">
                  <a
                    href={`${API_BASE_URL}/${link.short_code}`}
                    target="_blank"
                    className="text-cyan-400 underline"
                  >
                    {link.short_code}
                  </a>
                </td>
  
                <td className="border border-slate-700 p-3 text-center">
                  {link.clicks || 0}
                </td>
  
                <td className="border border-slate-700 p-3 text-center">
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
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

export default Dashboard;
