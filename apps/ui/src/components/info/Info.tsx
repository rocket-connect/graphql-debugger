import { About } from "./About";
import { HowItWorks } from "./HowItWorks";
import { InfoLogo } from "./InfoLogo";
import { MadeWith } from "./MadeWith";
import { Watch } from "./Watch";

export function Info() {
  return (
    <div className="flex flex-col gap-5 py-5">
      <InfoLogo />
      <About />
      <HowItWorks />
      <Watch />
      <MadeWith />
    </div>
  );
}
