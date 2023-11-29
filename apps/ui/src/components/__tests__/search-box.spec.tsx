import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import { SearchBox } from "../search-box";

describe("search-box", () => {
  it("should render search box successfully", () => {
    const handleSearch = jest.fn();

    const { getByRole } = render(
      <SearchBox handleSearch={handleSearch} searchValue="" />,
    );

    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByRole("textbox")).toHaveAttribute("placeholder", "Search...");
  });

  it("should have the correct placeholder", () => {
    const handleSearch = jest.fn();

    const { getByRole } = render(
      <SearchBox
        handleSearch={handleSearch}
        placeholder="test search"
        searchValue="search text"
      />,
    );

    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByRole("textbox")).toHaveAttribute("placeholder", "test search");
    expect(getByRole("textbox")).toHaveAttribute("value", "search text");
  });
});
