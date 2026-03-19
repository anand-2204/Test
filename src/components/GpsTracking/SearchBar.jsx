import React from 'react';

const SearchBar = ({ search, setSearch }) => (
    <div className="sb-search">
        <div className="sb-search__wrap">
            <span className="sb-search__icon">🔍</span>
            <input
                className="sb-search__input"
                type="text"
                placeholder="Search vehicle or IMEI…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {search && (
                <button
                    className="sb-search__clear"
                    onClick={() => setSearch('')}
                    title="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    </div>
);

export default SearchBar;