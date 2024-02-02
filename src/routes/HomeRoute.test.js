import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createServer } from "../test/server";
import HomeRoute from "./HomeRoute";

// test 3 - msw mock
// const handlers = [
//   rest.get("/api/repositories", (req, res, ctx) => {
//     // searchParams.get("q") => ex : "stars:>10000 language:javascript"
//     const language = req.url.searchParams.get("q").split("language:")[1];
//     return res(
//       ctx.json({
//         items: [
//           { id: 1, full_name: `${language}_one` },
//           { id: 2, full_name: `${language}_two` },
//         ],
//       })
//     );
//   }),
// ];

// const server = setupServer(...handlers);

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

describe("HomeRoute componentw", () => {
  createServer([
    {
      url: "/api/repositories",
      method: "get",
      handler: (req, res, ctx) => {
        // searchParams.get("q") => ex : "stars:>10000 language:javascript"
        const language = req.url.searchParams.get("q").split("language:")[1];
        return {
          items: [
            { id: 1, full_name: `${language}_one` },
            { id: 2, full_name: `${language}_two` },
          ],
        };
      },
    },
  ]);

  test("should render two links for each table", async () => {
    render(
      <MemoryRouter>
        <HomeRoute />
      </MemoryRouter>
    );
    const languages = [
      "javascript",
      "typescript",
      "rust",
      "go",
      "python",
      "java",
    ];
    await screen.findAllByRole("link");
    // screen.debug();
    for (const language of languages) {
      const links = await screen.findAllByRole("link", {
        name: new RegExp(`${language}_`),
      });
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent(`${language}_one`);
      expect(links[1]).toHaveTextContent(`${language}_two`);
      expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
      expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
    }
  });
});

const pause = () => new Promise((resolve) => setTimeout(resolve, 1000));
