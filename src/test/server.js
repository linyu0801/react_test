import { rest } from "msw";
import { setupServer } from "msw/node";

// type HandlerConfig = {
//   url: string,
//   method?: string,
//   handler: (req, res, ctx) => any,
// };

export function createServer(handlerConfig = []) {
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || "get"](config.url, (req, res, ctx) => {
      return res(ctx.json(config.handler(req, res, ctx)));
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
