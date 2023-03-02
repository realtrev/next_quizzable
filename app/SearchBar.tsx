import "./style.css";

function SearchBar() {
  return (
    <div
      id="search-bar"
      className="flex h-14 w-full justify-between rounded-md bg-white p-2 shadow-black focus:shadow-2xl"
    >
      <input
        className="grow px-4 text-lg font-medium text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-500"
        placeholder="Explore flashcards"
      />
      <button className="button primary">Search</button>
    </div>
  );
}

export default SearchBar;
