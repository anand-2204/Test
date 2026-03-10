import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../asset/data.css';
import data from "../asset/data.json";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const ColumnsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const PAGE_SIZE = 10;
const allColumns = Object.keys(data[0]);

const Data = () => {
  const [searchTerm, setSearchTerm]   = useState("");
  const [visibleCols, setVisibleCols] = useState(() =>
    Object.fromEntries(allColumns.map(col => [col, true]))
  );
  const [showColPanel, setShowColPanel] = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const panelRef = useRef(null);
  const btnRef   = useRef(null);

  // Reset to page 1 on search change
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) setShowColPanel(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeColumns = allColumns.filter(col => visibleCols[col]);

  const filteredTasks = data.filter(task =>
    Object.values(task).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages  = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const pagedTasks  = filteredTasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goTo   = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  const toggleCol   = (col) => setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  const selectAll   = () => setVisibleCols(Object.fromEntries(allColumns.map(col => [col, true])));
  const deselectAll = () => setVisibleCols(Object.fromEntries(allColumns.map(col => [col, false])));

  const handleDownload = () => {
    const exportData = filteredTasks.map(task =>
      Object.fromEntries(activeColumns.map(col => [col, task[col]]))
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = activeColumns.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "tasks_export.xlsx");
  };

  // Build page number buttons (max 7 shown)
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (safePage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (safePage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="data-wrapper">

      <div className="data-header">
        <h2>All Tasks</h2>
      </div>

      {/* Toolbar */}
      <div className="data-toolbar">
        <div className="search-wrap">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search tasks…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select">
          <option value="New filter">New Filter</option>
          <option value="Default">Default</option>
          <option value="Task Report">Task Report</option>
          <option value="Unsaved Filter">Unsaved Filter</option>
        </select>

        {/* Columns button + dropdown */}
        <div className="col-btn-wrap">
          <button
            ref={btnRef}
            className={`btn-columns ${showColPanel ? 'active' : ''}`}
            onClick={() => setShowColPanel(prev => !prev)}
          >
            <ColumnsIcon />
            Columns
            {activeColumns.length < allColumns.length && (
              <span className="col-badge">{activeColumns.length}/{allColumns.length}</span>
            )}
          </button>

          {showColPanel && (
            <div className="col-panel" ref={panelRef}>
              <div className="col-panel-header">
                <span>Toggle Columns</span>
                <div className="col-panel-actions">
                  <button onClick={selectAll}>All</button>
                  <button onClick={deselectAll}>None</button>
                </div>
              </div>
              <div className="col-panel-list">
                {allColumns.map(col => (
                  <label key={col} className="col-check-item">
                    <input
                      type="checkbox"
                      checked={!!visibleCols[col]}
                      onChange={() => toggleCol(col)}
                    />
                    <span className="col-check-label">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="btn-download" onClick={handleDownload}>
          <DownloadIcon />
          Export XL
        </button>
      </div>

      {/* Table */}
      <div className="table-scroll-container">
        <table className="task-table">
          <thead>
            <tr>
              {activeColumns.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {pagedTasks.length > 0 ? (
              pagedTasks.map((task, index) => (
                <tr key={task.id || index}>
                  {activeColumns.map(col => <td key={col}>{task[col]}</td>)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeColumns.length}>
                  <div className="empty-state">No tasks match your search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div className="pagination-bar">
        <span className="pagination-info">
          {filteredTasks.length === 0
            ? '0 results'
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredTasks.length)} of ${filteredTasks.length}`}
        </span>

        <div className="pagination-controls">
          <button
            className="pg-btn"
            onClick={() => goTo(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          {getPageNumbers().map((p, i) =>
            p === '...'
              ? <span key={`ellipsis-${i}`} className="pg-ellipsis">…</span>
              : <button
                  key={p}
                  className={`pg-btn ${p === safePage ? 'pg-active' : ''}`}
                  onClick={() => goTo(p)}
                >
                  {p}
                </button>
          )}

          <button
            className="pg-btn"
            onClick={() => goTo(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Data;
