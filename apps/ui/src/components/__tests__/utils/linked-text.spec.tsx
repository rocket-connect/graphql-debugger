import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import { LinkedText } from "../../utils/linked-text";

describe("LinkedText", () => {
  it("should render linked text successfully ", () => {
    const { getByTestId } = render(<LinkedText text="test" href="test" />);

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper").tagName).toBe("A");
  });
  it('should have "underline" class', () => {
    const { getByTestId } = render(<LinkedText text="test" href="test" />);

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper")).toHaveClass("underline");
  });
  it("should be bold", () => {
    const { getByTestId } = render(<LinkedText text="test" href="test" />);

    expect(getByTestId("linked-text-wrapper")).toBeInTheDocument();
    expect(getByTestId("linked-text-wrapper")).toHaveClass("font-bold");
  });
});
