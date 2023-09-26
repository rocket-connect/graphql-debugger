import { Container } from "../utils/Container";
import { logo } from "../utils/images";

export function Footer() {
  return (
    <div className="bg-graphiql-light p-5 text-graphiql-medium font-bold">
      <Container>
        <div className="flex flex-row justify-center align-center">
          <div className="flex gap-5">
            <div className="w-12">
              <img src={logo}></img>
            </div>
            <p className="my-auto text-xl">GraphQL Debugger</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
