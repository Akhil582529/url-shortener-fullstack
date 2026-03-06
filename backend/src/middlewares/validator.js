import net from 'net';

const validator = async (req, res, next) => {
    console.log("Validator is running");
    let { url } = req.body;

    // No URL is passed
    if (!url) {
        return res.status(400).json({ error: "URL is not entered" });
    }

    url = url.trim();

    // add protocol
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
    } catch (err) {
        return res.status(400).json({ error: "URL is in wrong format" });
    }

    const parsedProtocol = parsed.protocol.toLowerCase();
    if (parsedProtocol !== 'http:' && parsedProtocol !== 'https:') {
        return res.status(400).json({ error: "Only HTTP and HTTPS protocols are acceptable" });
    }

    const parsedHostname = parsed.hostname.toLowerCase();
    if (!parsedHostname || parsedHostname.includes(' ')) {
        return res.status(400).json({ error: "URL is in wrong format" });
    }

    if (net.isIPv4(parsedHostname) || net.isIPv6(parsedHostname)) {
        return res.status(400).json({ error: "IP addresses are not allowed" });
    }

    const extensions = ['.rar', '.exe', '.bat', '.zip', '.cmd', '.sh'];
    const pathName = parsed.pathname.toLowerCase();
    for (const ext of extensions) {
        if (pathName.endsWith(ext)) {
        return res.status(400).json({ error: "Executable files are not allowed" });
        }
    }

    req.body.url = parsed.toString();
    console.log("Validator completed running");
    next();
};

export default validator;