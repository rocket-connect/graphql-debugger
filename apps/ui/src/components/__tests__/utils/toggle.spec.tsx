import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { Toggle } from "../../utils/toggle";

describe("toggle", () => {
  it("should render toggle component successfully", () => {
    render(
      <Toggle label="test" initialState={false} onToggle={() => void 0} />,
    );
    const toggle = screen.getByTestId("toggle-wrapper");
    expect(toggle).toBeInTheDocument();
  });
  it("should render any label that is passed as prop", () => {
    render(
      <Toggle
        initialState={false}
        label="toggle modal"
        onToggle={() => void 0}
      />,
    );

    const toggleLabel = screen.getByTestId("label");
    expect(toggleLabel).toHaveTextContent("toggle modal");
  });

  it("should toggle the checkbox and call the onToggle function with the correct value", () => {
    const onToggleMock = jest.fn();

    const { getByTestId } = render(
      <Toggle label="toggle modal" onToggle={onToggleMock} />,
    );

    const checkBoxElement = getByTestId("checkbox");

    fireEvent.click(checkBoxElement);

    expect(onToggleMock).toHaveBeenCalledWith(true);
    expect(checkBoxElement).toHaveProperty("checked", true);

    fireEvent.click(checkBoxElement);

    expect(checkBoxElement).toHaveProperty("checked", false);
    expect(onToggleMock).toHaveBeenCalledWith(false);
  });

  it('should maintain an enabled state when "alwaysEnabled" prop is true', () => {
    const onToggleMock = jest.fn();

    const { getByTestId } = render(
      <Toggle label="always enabled" onToggle={onToggleMock} alwaysEnabled />,
    );

    const toggle = getByTestId("toggle-wrapper");
    const checkbox = getByTestId("checkbox");

    expect(toggle).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(checkbox).toHaveProperty("checked", true);

    fireEvent.click(checkbox);

    expect(checkbox).toHaveProperty("checked", true);
  });
});
