import { About } from "./about";
import { HowItWorks } from "./how-it-works";
import { MadeWith } from "./made-with";
import { Watch } from "./watch";

export function Info() {
  return (
    <div className="flex flex-col gap-5 py-5">
      <About />
      <HowItWorks />
      <Watch />
      <MadeWith />
    </div>
  );
}
