import { About } from "./about";
import { HowItWorks } from "./how-it-works";
import { InfoLogo } from "./info-logo";
import { MadeWith } from "./made-with";
import { Watch } from "./watch";

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
