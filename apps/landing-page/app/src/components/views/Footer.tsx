import { Container } from "../utils/Container";
import { logo } from "../utils/images";

export function Footer() {
  return (
    <div className="bg-graphiql-light p-3 text-graphiql-dark font-bold">
      <Container>
        <div className="flex flex-row justify-center align-center">
          <div className="flex gap-3">
            <div className="w-8">
              <img src={logo}></img>
            </div>
            <p className="my-auto text-xs italic">GraphQL Debugger</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
