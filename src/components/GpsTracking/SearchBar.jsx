import React from 'react';

const SearchBar = ({ search, setSearch }) => {
    return (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
            <input
                type="text"
                placeholder="🔍 Search vehicle, plate, driver..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#f1f5f9',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    );
};

export default SearchBar;