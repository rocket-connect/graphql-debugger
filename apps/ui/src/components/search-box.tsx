import { Search } from "../icons/search";

interface SearchBoxProps {
  handleSearch: (value: string) => void;
}

export function SearchBox({ handleSearch }: SearchBoxProps) {
  return (
    <div className="flex items-center gap-2 border border-accent  py-1 px-2 rounded-md">
      <Search width={15} height={15} />
      <input
        type="text"
        className="bg-transparent focus:outline-none"
        placeholder="Search"
        onChange={({ target: { value } }) => handleSearch(value)}
      />
    </div>
  );
}
