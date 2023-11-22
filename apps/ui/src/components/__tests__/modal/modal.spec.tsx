import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";

import { Modal } from "../../modal/modal";

describe("modal", () => {
  beforeEach(() => {
    const container = document.createElement("div");
    container.setAttribute("id", "portals");
    document.body.appendChild(container);
  });
  it("should render modal successfully", () => {
    const { getByTestId } = within(
      document.getElementById("portals") as HTMLElement,
    );

    render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="small">
        <div>Modal content</div>
      </Modal>,
    );

    expect(getByTestId("modal")).toBeInTheDocument();
  });

  it('should render modal with title "Modal title"', () => {
    const { getByTestId } = within(
      document.getElementById("portals") as HTMLElement,
    );

    render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="small">
        <div>Modal content</div>
      </Modal>,
    );

    expect(getByTestId("modal")).toBeInTheDocument();
    expect(getByTestId("modal-title")).toHaveTextContent("Modal title");
  });

  it('should render modal with content "Modal content"', () => {
    const { getByTestId } = within(
      document.getElementById("portals") as HTMLElement,
    );

    render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="small">
        <div>Modal content</div>
      </Modal>,
    );

    expect(getByTestId("modal")).toBeInTheDocument();
    expect(getByTestId("modal-content")).toHaveTextContent("Modal content");
  });

  it('should render with correct size when type is "small"', () => {
    const { getByTestId } = within(
      document.getElementById("portals") as HTMLElement,
    );

    render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="small">
        <div>Modal content</div>
      </Modal>,
    );

    expect(getByTestId("modal")).toBeInTheDocument();
    expect(getByTestId("modal-wrapper")).toHaveClass("w-1/2 h-1/2");
  });

  it(`shouldn't render modal when open is false`, () => {
    const { queryByTestId } = within(
      document.getElementById("portals") as HTMLElement,
    );

    render(
      <Modal open={false} onClose={jest.fn()} title="Modal title" type="small">
        <div>Modal content</div>
      </Modal>,
    );

    expect(queryByTestId("modal")).not.toBeInTheDocument();
  });
});
