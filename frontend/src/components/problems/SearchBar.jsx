import PropTypes from "prop-types";

function SearchBar({
  value,
  onChange,
  placeholder = "Search problems...",
  className = "",
}) {
  return (
    <div className={`form-control ${className}`}>
      <label className="input input-bordered flex items-center gap-2 bg-base-200 rounded-xl border-base-300 focus-within:border-base-300 focus-within:outline-none focus-within:shadow-none transition-none">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeJoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          /* CHANGE 1: Use type="text" instead of "search" */
          type="text" 
          autoComplete="off"
          className="grow focus:outline-none"
        />
      </label>
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SearchBar;