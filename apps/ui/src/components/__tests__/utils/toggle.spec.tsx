import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Toggle } from "../../utils/toggle";

describe("toggle", () => {
  it("should render toggle component successfully", () => {
    render(<Toggle label="test" onToggle={() => void 0} />);
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toBeInTheDocument();
  });
});
