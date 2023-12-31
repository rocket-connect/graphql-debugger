import { Cancel } from "../icons/cancel";
import { Search } from "../icons/search";

interface SearchBoxProps {
  handleSearch: (value: string) => void;
  searchValue: string;
  placeholder?: string;
}

export function SearchBox({
  handleSearch,
  placeholder,
  searchValue,
}: SearchBoxProps) {
  return (
    <div
      className="flex items-center gap-2 border border-accent  py-1 px-2 rounded-md"
      data-testid="search-wrapper"
    >
      <Search width={15} height={15} />
      <input
        type="text"
        data-testid="search-box"
        className="bg-transparent focus:outline-none"
        placeholder={placeholder ?? "Search..."}
        value={searchValue}
        onChange={({ target: { value } }) => handleSearch(value)}
      />
      <button
        className="text-xs font-medium"
        data-testid="clear-search"
        onClick={() => handleSearch("")}
      >
        <Cancel width={10} height={10} />
      </button>
    </div>
  );
}
