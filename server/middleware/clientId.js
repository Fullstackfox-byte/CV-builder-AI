// Lightweight anonymous identity: the browser generates a random id and sends it as x-client-id.
export default function clientId(req, res, next) {
  const id = req.header('x-client-id');
  if (!id || !/^[a-zA-Z0-9-]{8,64}$/.test(id)) return res.status(400).json({ error: 'Missing or invalid x-client-id header' });
  req.clientId = id;
  next();
}
