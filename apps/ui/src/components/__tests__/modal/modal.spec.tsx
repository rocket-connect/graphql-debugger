import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../../modal/modal";

describe("modal", () => {
  it("should render modal successfully", () => {
    const { baseElement } = render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="default">
        Modal content
      </Modal>,
    );

    expect(baseElement).toBeInTheDocument();
  });

  it("should open modal successfully", async () => {
    let open = false;
    const buttonElement = document.createElement("button");
    buttonElement.onclick = () => (open = true);

    await userEvent.click(buttonElement);

    const { baseElement } = render(
      <Modal
        open={open}
        onClose={jest.fn()}
        title="Test Modal title"
        type="default"
      >
        Modal content
      </Modal>,
    );

    expect(baseElement).toBeInTheDocument();
  });

  it("should close modal successfully", async () => {
    let open = true;
    const buttonElement = document.createElement("button");

    await userEvent.click(buttonElement);

    const { baseElement } = render(
      <Modal
        open={open}
        onClose={(buttonElement.onclick = () => (open = false))}
        title="Test Modal title"
        type="default"
      >
        Modal content
      </Modal>,
    );

    expect(baseElement).not.toBeInTheDocument();
  });
});
