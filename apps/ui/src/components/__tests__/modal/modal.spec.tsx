import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "../../modal/modal";

describe("modal", () => {
  it("should render modal successfully", () => {
    const { getByTestId } = render(
      <Modal open={true} onClose={jest.fn()} title="Modal title" type="default">
        Modal content
      </Modal>,
    );

    expect(getByTestId("modalWrapper")).toBeInTheDocument();
    expect(getByTestId("modalTitle")).toHaveTextContent("Modal title");
  });

  it("should open modal successfully", async () => {
    let open = false;
    const buttonElement = document.createElement("button");
    buttonElement.onclick = () => (open = true);

    await userEvent.click(buttonElement);

    const { getByTestId } = render(
      <Modal
        open={open}
        onClose={jest.fn()}
        title="Test Modal title"
        type="default"
      >
        Modal content
      </Modal>,
    );

    expect(getByTestId("modalWrapper")).toBeInTheDocument();
    expect(getByTestId("modalTitle")).toHaveTextContent("Modal title");
    expect(getByTestId("modalContent")).toHaveTextContent("Modal content");
  });
});
