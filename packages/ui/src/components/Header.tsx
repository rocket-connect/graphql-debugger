import { logo } from '../utils/images';

export function Header() {
  return (
    <div className="w-full pt-5 px-5">
      <div className="flex justify-between">
        <div className="w-1/2">
          <div className="flex flex-row gap-5">
            <div className="w-16">
              <img src={logo} alt="logo" />
            </div>
            <h1 className="text-white text-2xl mt-2 font-bold">GraphQL Debugger</h1>
          </div>
          <hr className="h-1 my-5 bg-graphql-otel-green border-0" />
        </div>
      </div>
    </div>
  );
}
