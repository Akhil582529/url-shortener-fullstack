import net from 'net';
import dns from 'dns/promises';

const isPrivateIP = (ip) => {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 169 && parts[1] === 254)
    );
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    return (
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe80')
    );
  }
  return false;
};

const BLOCKED_HOSTNAMES = new Set(['localhost', 'metadata.google.internal']);
const BLOCKED_EXTENSIONS = ['.rar', '.exe', '.bat', '.zip', '.cmd', '.sh'];

const validator = async (req, res, next) => {
  console.log("Validator is running");

  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is not entered" });
  }

  url = url.trim();

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    try {
      new URL(url);
    } catch {
      url = "https://" + url;
    }
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "URL is in wrong format" });
  }

  const parsedProtocol = parsed.protocol.toLowerCase();
  if (parsedProtocol !== 'http:' && parsedProtocol !== 'https:') {
    return res.status(400).json({ error: "Only HTTP and HTTPS protocols are acceptable" });
  }

  if (parsed.username || parsed.password) {
    return res.status(400).json({ error: "URLs with credentials are not allowed" });
  }

  const parsedHostname = parsed.hostname.toLowerCase();

  if (!parsedHostname || parsedHostname.includes(' ')) {
    return res.status(400).json({ error: "URL is in wrong format" });
  }

  if (net.isIPv4(parsedHostname) || net.isIPv6(parsedHostname)) {
    return res.status(400).json({ error: "IP addresses are not allowed" });
  }

  if (BLOCKED_HOSTNAMES.has(parsedHostname)) {
    return res.status(400).json({ error: "Internal hostnames are not allowed" });
  }

  try {
    const addresses = await dns.lookup(parsedHostname, { all: true });
    for (const { address } of addresses) {
      if (isPrivateIP(address)) {
        return res.status(400).json({ error: "URL resolves to a private/internal address" });
      }
    }
  } catch {
    return res.status(400).json({ error: "Hostname could not be resolved" });
  }

  const pathName = parsed.pathname.toLowerCase();
  if (BLOCKED_EXTENSIONS.some(ext => pathName.endsWith(ext))) {
    return res.status(400).json({ error: "Executable files are not allowed" });
  }

  req.body.url = parsed.toString();
  console.log("Validator completed running");
  next();
};

export default validator;