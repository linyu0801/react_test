import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

// test 1 - 加上 language 屬性，驗證所有屬性都有正確顯示
test("when component render,should have repository info", () => {
  const repository = {
    language: "javaScript",
    stargazers_count: 5,
    open_issues: 1,
    forks: 30,
  };
  render(<RepositoriesSummary repository={repository} />);

  for (const key in repository) {
    const value = repository[key];
    const element = screen.getByText(new RegExp(value));
    expect(element).toBeInTheDocument();
  }
});
