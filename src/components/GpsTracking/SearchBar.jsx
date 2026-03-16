import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import '../../asset/css/SearchBar.css';

const SearchBar = ({ search, setSearch }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="searchbar-wrapper">
            <div className={`searchbar-container ${isFocused ? 'searchbar-container--focused' : ''}`}>
                <Search
                    size={15}
                    strokeWidth={2.2}
                    className="searchbar-icon"
                />
                <input
                    type="text"
                    placeholder="Search vehicle, plate, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="searchbar-input"
                />
                {search && (
                    <button
                        className="searchbar-clear"
                        onClick={() => setSearch('')}
                        title="Clear"
                    >
                        <X size={13} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;