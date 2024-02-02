import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";
import { SWRConfig } from "swr";

// test 4 - verify AuthButtons show

const renderComponent = async () => {
  render(
    //  reset swr cache
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  return await screen.findAllByRole("link");
};

// createServer() ---> { user: null }
describe("when user is not signed in", () => {
  createServer([
    {
      url: "/api/user",
      method: "get",
      handler: () => {
        return { user: null };
      },
    },
  ]);

  test("should show sign in and sign up", async () => {
    // debugger
    await renderComponent();
    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("sign out is not visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", { name: /sign out/i });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

// createServer() ---> { user: { id: number, email: string } }
describe("when user is signed in", () => {
  createServer([
    {
      url: "/api/user",
      method: "get",
      handler: () => {
        return { user: { id: 1, email: "foo@gmail.com" } };
      },
    },
  ]);
  test("sign out is visible", async () => {
    // debugger
    await renderComponent();
    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });
    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("sign in and sign out are not visible", async () => {
    await renderComponent();
    const signOutButton = screen.getByRole("link", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});
