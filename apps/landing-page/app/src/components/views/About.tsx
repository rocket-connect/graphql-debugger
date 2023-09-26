import { Container } from "../utils/Container";
import { screenshot } from "../utils/images";

export function About() {
  return (
    <Container>
      <div className="flex py-20 gap-10">
        <div>
          <img width={1200} src={screenshot} alt="logo" />
        </div>

        <div className="flex flex-col gap-10 my-auto">
          <h2 className="text-4xl font-bold">About</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Blanditiis, sit accusamus quia doloremque sunt corrupti quidem.
            Quaerat debitis quos libero in accusamus eum cupiditate autem
            accusantium, ut unde repellat praesentium.
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Blanditiis, sit accusamus quia doloremque sunt corrupti quidem.
            Quaerat debitis quos libero in accusamus eum cupiditate autem
            accusantium, ut unde repellat praesentium.
          </p>
        </div>
      </div>
    </Container>
  );
}
