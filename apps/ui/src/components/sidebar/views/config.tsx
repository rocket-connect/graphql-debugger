const configs = [
  {
    name: "Dark Mode",
    description: "Toggle between light and dark mode",
  },
];

export function Config() {
  return (
    <div className="flex flex-col gap-5 text-netural-100 text-xs">
      {configs.map((config) => {
        return (
          <label key={config.name} className="flex flex-col gap-3 relative">
            <div className="flex flex-row items-center gap-3 opacity-40 ">
              <div className="w-10 h-6 bg-graphql-otel-green rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5"></div>
              <span className="ml-3  font-bold italic">{config.name}</span>
              <span className="italic">(Comming Soon)</span>
            </div>
            <p>{config.description}.</p>
          </label>
        );
      })}
    </div>
  );
}
