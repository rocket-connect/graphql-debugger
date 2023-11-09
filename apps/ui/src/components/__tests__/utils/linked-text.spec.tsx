import { render } from "@testing-library/react";

import { LinkedText } from "../../utils/linked-text";

describe("LinkedText", () => {
  it("should render linked text successfully ", () => {
    const { getByTestId } = render(
      <LinkedText
        text="debug queries like a pro"
        href="https://www.graphql-debugger.com"
      />,
    );

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper").tagName).toBe("A");
    expect(getByTestId("linked-text-wrapper")).toHaveAttribute(
      "href",
      "https://www.graphql-debugger.com",
    );
    expect(getByTestId("linked-text-wrapper")).toHaveTextContent(
      "debug queries like a pro",
    );
  });
  it('should have "underline" class', () => {
    const { getByTestId } = render(
      <LinkedText
        text="debug queries like a pro"
        href="https://www.graphql-debugger.com"
      />,
    );

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper")).toHaveClass("underline");
  });
  it("should be bold", () => {
    const { getByTestId } = render(
      <LinkedText
        text="debug queries like a pro"
        href="https://www.graphql-debugger.com"
      />,
    );

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper")).toHaveClass("font-bold");
  });
});
