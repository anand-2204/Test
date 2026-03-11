import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../asset/data.css';
import data from "../asset/data.json";

/* ─── Icons ─────────────────────────────────────────── */
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
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const XIcon = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const ChevronLeftSm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const DragIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <circle cx="9"  cy="5"  r="1.5"/>
    <circle cx="15" cy="5"  r="1.5"/>
    <circle cx="9"  cy="12" r="1.5"/>
    <circle cx="15" cy="12" r="1.5"/>
    <circle cx="9"  cy="19" r="1.5"/>
    <circle cx="15" cy="19" r="1.5"/>
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ─── Constants ─────────────────────────────────────── */
const PAGE_SIZE   = 10;
const defaultCols = data.length ? Object.keys(data[0]) : [];

/* ─── Detect if a column is date-related ─────────────── */
const isDateColumn = (col) => {
  const lower = col.toLowerCase();
  return (
    lower.includes('date') || lower.includes('time') || lower.includes('created') ||
    lower.includes('updated') || lower.includes('modified') || lower.includes('timestamp') ||
    lower.includes('deadline') || lower.includes('due') || lower.includes('start') ||
    lower.includes('end') || lower.includes('scheduled') || lower.includes('completed')
  );
};

const getUniqueValues = (col) => {
  const vals = [...new Set(data.map(r => String(r[col] ?? '')).filter(Boolean))];
  return vals.sort().slice(0, 100);
};

/* ─── useOutsideClick ─────────────────────────────────── */
const useOutsideClick = (refs, cb) => {
  const cbRef = useRef(cb);
  useEffect(() => { cbRef.current = cb; });
  useEffect(() => {
    const handler = (e) => {
      if (refs.every(r => r.current && !r.current.contains(e.target))) cbRef.current();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/* ─── Main Component ──────────────────────────────────── */
const Data = () => {
  const [columnOrder,  setColumnOrder] = useState(defaultCols);
  const [visibleCols,  setVisibleCols] = useState(() =>
    Object.fromEntries(defaultCols.map(c => [c, true]))
  );
  const [showColPanel,    setShowColPanel]    = useState(false);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [activeFilters,   setActiveFilters]   = useState({});
  const [draftFilters,    setDraftFilters]    = useState({});
  const [filterSearch,    setFilterSearch]    = useState('');
  const [savedFilters,    setSavedFilters]    = useState([]);

  /* ── Filter panel mode: null | 'menu' | 'new' | 'edit' ── */
  const [filterMode,      setFilterMode]      = useState(null); // null = closed
  const [editingFilter,   setEditingFilter]   = useState(null); // { id, name, filters } when editing saved
  const [newFilterName,   setNewFilterName]   = useState('');
  const [showNameError,   setShowNameError]   = useState(false);

  const dragItem     = useRef(null);
  const dragOverItem = useRef(null);
  const [dragItemIdx, setDragItemIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [dragging,    setDragging]    = useState(false);

  const colPanelRef    = useRef(null);
  const colBtnRef      = useRef(null);
  const filterPanelRef = useRef(null);
  const filterBtnRef   = useRef(null);

  useOutsideClick([colPanelRef, colBtnRef], () => setShowColPanel(false));
  useOutsideClick([filterPanelRef, filterBtnRef], () => {
    setFilterMode(null);
    setNewFilterName('');
    setShowNameError(false);
    setEditingFilter(null);
  });

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeFilters]);

  const activeColumns    = columnOrder.filter(c => visibleCols[c]);
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const draftFilterCount  = Object.values(draftFilters).filter(Boolean).length;

  /* ── Filtered / paged data ── */
  const filteredTasks = data.filter(task => {
    const matchSearch = !searchTerm || Object.values(task).some(v =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!matchSearch) return false;
    return Object.entries(activeFilters).every(([col, val]) =>
      !val || String(task[col] ?? '').toLowerCase().includes(val.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const pagedTasks = filteredTasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Column helpers ── */
  const toggleCol   = c => setVisibleCols(p => ({ ...p, [c]: !p[c] }));
  const selectAll   = () => setVisibleCols(Object.fromEntries(defaultCols.map(c => [c, true])));
  const deselectAll = () => setVisibleCols(Object.fromEntries(defaultCols.map(c => [c, false])));
  const resetOrder  = () => setColumnOrder(defaultCols);

  /* ── Drag handlers ── */
  const onDragStart = (e, index) => {
    dragItem.current = index; setDragItemIdx(index); setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    const ghost = document.createElement('div');
    ghost.style.cssText = 'position:absolute;top:-9999px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };
  const onDragEnter = (e, index) => { dragOverItem.current = index; setDragOverIdx(index); };
  const onDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newOrder = [...columnOrder];
      const dragged = newOrder.splice(dragItem.current, 1)[0];
      newOrder.splice(dragOverItem.current, 0, dragged);
      setColumnOrder(newOrder);
    }
    dragItem.current = null; dragOverItem.current = null;
    setDragItemIdx(null); setDragOverIdx(null); setDragging(false);
  };
  const onDragOver = (e) => { e.preventDefault(); };

  /* ── Filter button click → show menu ── */
  const openFilterMenu = () => {
    setFilterMode(filterMode === null ? 'menu' : null);
    setNewFilterName('');
    setShowNameError(false);
    setEditingFilter(null);
  };

  /* ── Open New Filter form ── */
  const openNewFilter = () => {
    setDraftFilters({});
    setFilterSearch('');
    setNewFilterName('');
    setShowNameError(false);
    setEditingFilter(null);
    setFilterMode('new');
  };

  /* ── Load Default (clear all filters) ── */
  const applyDefault = () => {
    setActiveFilters({});
    setDraftFilters({});
    setFilterMode(null);
  };

  /* ── Load a saved filter into the edit form ── */
  const openEditFilter = (sf) => {
    setDraftFilters({ ...sf.filters });
    setFilterSearch('');
    setNewFilterName(sf.name);
    setShowNameError(false);
    setEditingFilter(sf);
    setFilterMode('new');
  };

  /* ── Apply / Save ── */
 const handleApply = () => {
  const name = newFilterName.trim();
  if (!name) { setShowNameError(true); return; }

  if (editingFilter) {
    setSavedFilters(prev => prev.map(f =>
      f.id === editingFilter.id ? { ...f, name, filters: { ...draftFilters } } : f
    ));
    setEditingFilter(prev => ({ ...prev, name, filters: { ...draftFilters } }));
  } else {
    const newEntry = { id: Date.now(), name, filters: { ...draftFilters } };
    setSavedFilters(prev => [...prev, newEntry]);
    setEditingFilter(newEntry); // mark as "just saved" so Update shows
  }
  // stay on form — user can now click Apply
};
  /* ── Apply without saving ── */
const handleApplyOnly = () => {
  setActiveFilters({ ...draftFilters });
  setFilterMode(null);
  setNewFilterName('');
  setEditingFilter(null);
};

  /* ── Delete saved filter ── */
  const deleteSavedFilter = (id, e) => {
    e.stopPropagation();
    setSavedFilters(prev => prev.filter(f => f.id !== id));
  };

  /* ── Load saved filter directly ── */
  const loadSavedFilter = (sf) => {
    setActiveFilters({ ...sf.filters });
    setFilterMode(null);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setDraftFilters({});
    setFilterMode(null);
  };

  const removeSingleFilter = (col) =>
    setActiveFilters(p => { const n = { ...p }; delete n[col]; return n; });

  const filteredCols = defaultCols.filter(c =>
    c.toLowerCase().includes(filterSearch.toLowerCase())
  );

  /* ── Pagination ── */
  const goTo = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (safePage <= 4) pages.push(1, 2, 3, 4, 5, '...', totalPages);
    else if (safePage >= totalPages - 3) pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
    return pages;
  };

  /* ── Download ── */
  const handleDownload = () => {
    const exportData = filteredTasks.map(task =>
      Object.fromEntries(activeColumns.map(c => [c, task[c]]))
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = activeColumns.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks_export.xlsx');
  };

  /* ─── Render ─────────────────────────────────────── */
  return (
    <div className="data-wrapper">

      {/* Header */}
      <div className="data-header">
        <h2>All Tasks</h2>
        <p className="data-subtitle">{data.length} total records</p>
      </div>

      {/* Toolbar */}
      <div className="data-toolbar">

        {/* Search */}
        <div className="search-wrap">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search anything…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <XIcon size={13}/>
            </button>
          )}
        </div>

        {/* ── Filter Button + Dropdown ── */}
        <div className="filter-btn-wrap" ref={filterBtnRef}>
          <button
            className={`btn-filter ${filterMode !== null || activeFilterCount > 0 ? 'active' : ''}`}
            onClick={openFilterMenu}
          >
            <FilterIcon />
            Filter
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
            <ChevronDown />
          </button>

          {/* ── MENU VIEW ── */}
          {filterMode === 'menu' && (
            <div className="filter-panel" ref={filterPanelRef}>
              <div className="filter-panel-header">
                <span className="filter-panel-title">🎯 Filters</span>
              </div>

              <div className="fm-menu">

                {/* New Filter */}
                <button className="fm-menu-item fm-menu-item--new" onClick={openNewFilter}>
                  <span className="fm-menu-icon"><PlusIcon /></span>
                  <span className="fm-menu-label">New Filter</span>
                  <span className="fm-menu-desc">Build a custom filter</span>
                </button>

                {/* Default */}
                <button
                  className={`fm-menu-item ${activeFilterCount === 0 ? 'fm-menu-item--active' : ''}`}
                  onClick={applyDefault}
                >
                  <span className="fm-menu-icon"><DefaultIcon /></span>
                  <span className="fm-menu-label">Default</span>
                  <span className="fm-menu-desc">No filters applied</span>
                  {activeFilterCount === 0 && <span className="fm-active-dot" />}
                </button>

                {/* Saved filters */}
                {savedFilters.length > 0 && (
                  <>
                    <div className="fm-divider">
                      <span>Saved Filters</span>
                    </div>
                    {savedFilters.map(sf => (
                      <div key={sf.id} className="fm-saved-row">
                        <button
                          className={`fm-menu-item fm-menu-item--saved ${
                            JSON.stringify(activeFilters) === JSON.stringify(sf.filters) ? 'fm-menu-item--active' : ''
                          }`}
                          onClick={() => loadSavedFilter(sf)}
                        >
                          <span className="fm-menu-icon"><BookmarkIcon /></span>
                          <span className="fm-menu-label">{sf.name}</span>
                          <span className="fm-menu-desc">
                            {Object.values(sf.filters).filter(Boolean).length} filter(s)
                          </span>
                          {JSON.stringify(activeFilters) === JSON.stringify(sf.filters) && (
                            <span className="fm-active-dot" />
                          )}
                        </button>
                        <div className="fm-saved-actions">
                          <button
                            className="fm-edit-btn"
                            onClick={() => openEditFilter(sf)}
                            title="Edit"
                          >✏️</button>
                          <button
                            className="fm-delete-btn"
                            onClick={(e) => deleteSavedFilter(sf.id, e)}
                            title="Delete"
                          ><XIcon size={10}/></button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── NEW / EDIT FILTER FORM ── */}
          {filterMode === 'new' && (
            <div className="filter-panel filter-panel--wide" ref={filterPanelRef}>
              <div className="filter-panel-header">
                <button className="fp-back-btn" onClick={() => setFilterMode('menu')}>
                  <ChevronLeftSm /> Back
                </button>
                <span className="filter-panel-title">
                  {editingFilter ? '✏️ Edit Filter' : '✨ New Filter'}
                </span>
                <button className="fp-clear-btn" onClick={() => setDraftFilters({})}>Reset</button>
              </div>

              {/* Filter Name Input */}
              <div className="fp-name-row">
                <label className="fp-name-label">Filter Name</label>
                <input
                  type="text"
                  className={`fp-name-input ${showNameError ? 'fp-name-input--error' : ''}`}
                  placeholder="e.g. High Priority Tasks…"
                  value={newFilterName}
                  onChange={e => { setNewFilterName(e.target.value); setShowNameError(false); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleApply(); }}
                  autoFocus
                />
                {showNameError && (
                  <span className="fp-name-error">Please enter a name for this filter</span>
                )}
              </div>

              {/* Column Search */}
              <div className="fp-col-search">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Find a column…"
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                />
              </div>

              {/* Filter Rows */}
              <div className="fp-rows">
                {filteredCols.map(col => {
                  const isDate     = isDateColumn(col);
                  const uniqueVals = isDate ? [] : getUniqueValues(col);
                  const selected   = draftFilters[col] || '';
                  return (
                    <div key={col} className={`fp-row ${selected ? 'fp-row--active' : ''}`}>
                      <span className="fp-col-name">
                        {col}
                        {isDate && <span className="fp-date-badge">date</span>}
                      </span>
                      <div className="fp-select-wrap">
                        {isDate ? (
                          <input
                            type="text"
                            className="fp-date-input"
                            placeholder="e.g. 2024-01-15"
                            value={selected}
                            onChange={e => setDraftFilters(p => ({ ...p, [col]: e.target.value }))}
                          />
                        ) : (
                          <select
                            className="fp-select"
                            value={selected}
                            onChange={e => setDraftFilters(p => ({ ...p, [col]: e.target.value }))}
                          >
                            <option value="">— Any —</option>
                            {uniqueVals.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        )}
                        {selected && (
                          <button
                            className="fp-clear-single"
                            onClick={() => setDraftFilters(p => { const n = { ...p }; delete n[col]; return n; })}
                          ><XIcon size={10}/></button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredCols.length === 0 && <p className="fp-no-cols">No columns match.</p>}
              </div>

             <div className="filter-panel-footer">
              <span className="fp-footer-hint">{draftFilterCount} filter(s) selected</span>
              <div className="fp-footer-actions">
                <button className="btn-clear-filter" onClick={() => setDraftFilters({})}>Clear</button>
                <button className="btn-apply-only" onClick={handleApplyOnly}>
                  Apply
                </button>
                <button className="btn-apply-filter" onClick={handleApply}>
                  <SaveIcon /> {editingFilter ? 'Update' : 'Save'}
                </button>
              </div>
            </div>

            </div>
          )}
        </div>

        {/* Columns button + drag panel */}
        <div className="col-btn-wrap" ref={colBtnRef}>
          <button
            className={`btn-columns ${showColPanel ? 'active' : ''}`}
            onClick={() => setShowColPanel(p => !p)}
          >
            <ColumnsIcon />
            Columns
            {activeColumns.length < defaultCols.length && (
              <span className="col-badge">{activeColumns.length}/{defaultCols.length}</span>
            )}
          </button>

          {showColPanel && (
            <div className="col-panel" ref={colPanelRef}>
              <div className="col-panel-header">
                <span>Columns &amp; Order</span>
                <div className="col-panel-actions">
                  <button onClick={selectAll}>All</button>
                  <button onClick={deselectAll}>None</button>
                  <button onClick={resetOrder} title="Reset order">↺ Reset</button>
                </div>
              </div>
              <div className="col-panel-hint">
                <span>☑ toggle</span>
                <span>⠿ drag to reorder</span>
              </div>
              <div className={`col-panel-list ${dragging ? 'is-dragging' : ''}`}>
                {columnOrder.map((col, index) => (
                  <div
                    key={col}
                    className={[
                      'col-drag-item',
                      !visibleCols[col]                              ? 'col-drag-item--hidden'   : '',
                      dragOverIdx === index && dragItemIdx !== index ? 'col-drag-item--over'     : '',
                      dragItemIdx === index                          ? 'col-drag-item--dragging' : '',
                    ].filter(Boolean).join(' ')}
                    draggable
                    onDragStart={e => onDragStart(e, index)}
                    onDragEnter={e => onDragEnter(e, index)}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                  >
                    <span className="drag-handle" title="Drag to reorder"><DragIcon /></span>
                    <label className="col-check-label-wrap">
                      <input type="checkbox" checked={!!visibleCols[col]} onChange={() => toggleCol(col)} />
                      <span className="col-check-label">{col}</span>
                    </label>
                    <span className="col-order-badge">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download */}
        <button className="btn-download" onClick={handleDownload}>
          <DownloadIcon />
          Export XL
        </button>
      </div>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="active-filter-bar">
          <span className="active-filter-label"><FilterIcon /> Active:</span>
          <div className="active-filter-tags">
            {Object.entries(activeFilters).filter(([, v]) => v).map(([col, val]) => (
              <span key={col} className="filter-tag">
                <span className="filter-tag-col">{col}</span>
                <span className="filter-tag-sep">{isDateColumn(col) ? 'contains' : 'is'}</span>
                <span className="filter-tag-val">"{val}"</span>
                <button className="tag-remove" onClick={() => removeSingleFilter(col)}>
                  <XIcon size={10}/>
                </button>
              </span>
            ))}
          </div>
          <button className="clear-all-tag" onClick={clearAllFilters}>Clear all</button>
        </div>
      )}

      {/* Table */}
      <div className="table-scroll-container">
        <table className="task-table">
          <thead>
            <tr>{activeColumns.map(col => <th key={col}>{col}</th>)}</tr>
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
                  <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <p>No results found.</p>
                    <button className="empty-clear-btn" onClick={clearAllFilters}>Clear filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-bar">
        <span className="pagination-info">
          {filteredTasks.length === 0
            ? '0 results'
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredTasks.length)} of ${filteredTasks.length}`}
        </span>
        <div className="pagination-controls">
          <button className="pg-btn" onClick={() => goTo(safePage - 1)} disabled={safePage === 1}>
            <ChevronLeft />
          </button>
          {getPageNumbers().map((p, i) =>
            p === '...'
              ? <span key={`el-${i}`} className="pg-ellipsis">…</span>
              : <button key={p} className={`pg-btn ${p === safePage ? 'pg-active' : ''}`} onClick={() => goTo(p)}>{p}</button>
          )}
          <button className="pg-btn" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}>
            <ChevronRight />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Data;