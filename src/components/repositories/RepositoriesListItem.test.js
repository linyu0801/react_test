import { render, screen, act } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router";

// test 2 - 加上連結，驗證連結存在

// clear act warning : method 2
// jest.mock("../tree/FileIcon", () => () => "fake file icon");

const renderComponent = () => {
  const repository = {
    full_name: "facebook/react",
    language: "javaScript",
    description: "A js library",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
  return { repository };
};

test("should show a link to the github homepage for the repository", async () => {
  const { repository } = renderComponent();
  // clear act warining : method 1 (推薦)
  await screen.findByRole("img", {
    name: /javaScript/i,
  });
  // clear act warining : method 3 (最不推薦)
  //   await act(async () => {
  //     await pause();
  //   });

  const link = screen.getByRole("link", { name: /github repository/i });
  expect(link).toHaveAttribute("href", repository.html_url);
});

test("should fileIcon with hte appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", {
    name: /javaScript/i,
  });
  expect(icon).toHaveClass("js-icon");
});
test("should show a link to the code editor page", async () => {
  const { repository } = renderComponent();

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});

// const pause = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// };
