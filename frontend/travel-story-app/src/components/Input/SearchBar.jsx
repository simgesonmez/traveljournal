import React from 'react';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <form className="form relative" >
      {/* Search icon button */}
      <button
        type="button"
        className="absolute left-2 -translate-y-1/2 top-1/2 p-1"
        onClick={handleSearch}
      >
        <svg
          width="17"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search"
          className="w-5 h-5 text-gray-700"
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>

      {/* Search input */}
      <input
        className="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-green-500 placeholder-gray-400 transition-all duration-300 shadow-md"
        placeholder="Hikaye Ara..."
        required
        type="text"
        value={value}
        onChange={onChange}
      />

      {/* Clear search button */}
      {value && (
        <button
          type="button"
          className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
          onClick={onClearSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;

