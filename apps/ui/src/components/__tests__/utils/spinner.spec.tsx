import { render } from "@testing-library/react";

import { Spinner } from "../../utils/spinner";

describe("Spinner", () => {
  it("should render spinner successfully", () => {
    const { getByTestId } = render(<Spinner />);
    const spinner = getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-10 h-10 animate-spin text-gray-300");
  });

  it('should have "fill-graphql-otel-green" class', () => {
    const { getByTestId } = render(<Spinner />);
    const spinner = getByTestId("spinner");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("fill-graphql-otel-green");
  });
  it('should have "fill-error-red" class', () => {
    const { getByTestId } = render(<Spinner isError />);
    const spinner = getByTestId("spinner");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("fill-error-red");
  });

  it("should have different size when passing size prop", () => {
    const { getByTestId } = render(<Spinner size="20" />);

    const spinner = getByTestId("spinner");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-20 h-20");
  });
});
