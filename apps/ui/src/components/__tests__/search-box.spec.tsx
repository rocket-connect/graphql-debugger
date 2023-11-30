import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { act } from "react-dom/test-utils";

import { SearchBox } from "../search-box";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

const mockSetState = jest.fn();
const mockUseState = (initialState: string) => [initialState, mockSetState];

beforeEach(() => {
  (React.useState as jest.Mock).mockImplementation(mockUseState);
});

describe("search-box", () => {
  it("should render the search box successfully", () => {
    const { getByTestId } = render(
      <SearchBox handleSearch={jest.fn()} searchValue="" />,
    );
    expect(getByTestId("search-wrapper")).toBeInTheDocument();
    expect(getByTestId("search-box")).toBeInTheDocument();
    expect(getByTestId("clear-search")).toBeInTheDocument();
    expect(getByTestId("search-box")).toHaveValue("");
    expect(getByTestId("search-box")).toHaveAttribute(
      "placeholder",
      "Search...",
    );
  });

  it("should change value when user starts typing", async () => {
    const { getByTestId } = render(
      <SearchBox handleSearch={mockSetState} searchValue={mockUseState[0]} />,
    );
    const searchBox = getByTestId("search-box");
    await act(() => userEvent.type(searchBox, "test"));
    expect(mockSetState).toHaveBeenCalledTimes(4);
    expect(searchBox).toHaveValue("test");
  });

  it("should clear the search value successfully", async () => {
    const { getByTestId } = render(
      <SearchBox handleSearch={mockSetState} searchValue={mockUseState[0]} />,
    );
    const searchBox = getByTestId("search-box");

    await act(() =>
      userEvent.type(searchBox, "add this search value for testing purposes"),
    );
    expect(searchBox).toHaveValue("add this search value for testing purposes");

    await act(() => userEvent.clear(searchBox));
    expect(searchBox).toHaveValue("");
  });
});
