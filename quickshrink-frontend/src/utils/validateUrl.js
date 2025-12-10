export const validateUrl = (value = "") => {
  if (!value.trim()) {
    return "Please paste a valid URL.";
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return "That does not look like a valid URL. Include https:// or http://";
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return "Only HTTP and HTTPS URLs are supported.";
  }

  return parsed.toString();
};

