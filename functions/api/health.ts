export const onRequestGet = (): Response =>
  Response.json({
    status: 'ok',
    store: 'Svi Studio Malaysia',
    time: new Date().toISOString(),
  });
