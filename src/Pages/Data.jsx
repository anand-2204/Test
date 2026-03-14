import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import '../asset/data.css';
import data from "../asset/data.json";
import { useTheme } from '../globalContext/context/ThemeContect';
import { jsxDEV } from "react/jsx-dev-runtime";


/* ─── Icons ─────────────────────────────────────────── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const ColumnsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const XIcon = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const ChevronLeftSm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const DragIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <circle cx="9" cy="5" r="1.5" />
    <circle cx="15" cy="5" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="15" cy="19" r="1.5" />
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const SortAscIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const SortDescIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
const SortNoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
    <path d="M8 9l4-4 4 4M8 15l4 4 4-4" opacity="0.35" />
  </svg>
);
const DetailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9h6M9 12h6M9 15h4" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
             M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const StatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/* ─── Constants ─────────────────────────────────────── */
const defaultCols = data.length ? Object.keys(data[0]) : [];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/* ─── localStorage helpers ───────────────────────────── */
const LS_KEYS = {
  savedFilters: 'datatable_savedFilters',
  columnOrder: 'datatable_columnOrder',
  visibleCols: 'datatable_visibleCols',
  pageSize: 'datatable_pageSize',
};
/* ─── Highlight matching text ────────────────────────── */
const Highlight = ({ text, query }) => {
  // If no search query, just return plain text
  if (!query || !query.trim()) return <>{String(text ?? '')}</>;

  const str = String(text ?? '');
  const lower = str.toLowerCase();
  const q = query.toLowerCase().trim();
  const index = lower.indexOf(q);

  // If no match found in this cell, return plain text
  if (index === -1) return <>{str}</>;

  // Split text into 3 parts: before match, the match, after match
  const before = str.slice(0, index);
  const match = str.slice(index, index + q.length);
  const after = str.slice(index + q.length);

  return (
    <>
      {before}
      <mark className="search-highlight">{match}</mark>
      {after}
    </>
  );
};

/* ─── Column statistics ──────────────────────────────── */
const getNumericCols = (cols) =>
  cols.filter(col =>
    data.some(row => {
      const v = parseFloat(row[col]);
      return !isNaN(v) && row[col] !== '' && row[col] !== null;
    })
  );

const getColStats = (col, rows) => {
  const nums = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
  if (nums.length === 0) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  return {
    count: nums.length,
    sum: sum,
    avg: sum / nums.length,
    min: Math.min(...nums),
    max: Math.max(...nums),
  };
};

const fmt = (n) => {
  if (n === undefined || n === null) return '—';
  if (Number.isInteger(n)) return n.toLocaleString();
  return parseFloat(n.toFixed(2)).toLocaleString();
};

const lsGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const lsSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
};

/* ─── Detect column types ────────────────────────────── */
const isDateColumn = (col) => {
  const lower = col.toLowerCase();
  return (
    lower.includes('date') || lower.includes('time') || lower.includes('created') ||
    lower.includes('updated') || lower.includes('modified') || lower.includes('timestamp') ||
    lower.includes('deadline') || lower.includes('due') || lower.includes('start') ||
    lower.includes('end') || lower.includes('scheduled') || lower.includes('completed')
  );
};
const isStatusColumn = (col) => { const l = col.toLowerCase(); return l.includes('status') || l === 'state'; };
const isPriorityColumn = (col) => { const l = col.toLowerCase(); return l.includes('priority') || l.includes('urgency') || l.includes('severity'); };

const getUniqueValues = (col) => {
  const vals = [...new Set(data.map(r => String(r[col] ?? '')).filter(Boolean))];
  return vals.sort().slice(0, 100);
};

/* ─── Row highlight logic ────────────────────────────── */
const STATUS_COLORS = {
  done: 'row-green', complete: 'row-green', completed: 'row-green', closed: 'row-green',
  resolved: 'row-green', approved: 'row-green', active: 'row-green', success: 'row-green',
  overdue: 'row-red', blocked: 'row-red', failed: 'row-red', rejected: 'row-red',
  cancelled: 'row-red', canceled: 'row-red', urgent: 'row-red', high: 'row-red', critical: 'row-red',
  pending: 'row-orange', 'in progress': 'row-orange', inprogress: 'row-orange',
  review: 'row-orange', 'in review': 'row-orange', hold: 'row-orange',
  onhold: 'row-orange', paused: 'row-orange', medium: 'row-orange',
  new: 'row-blue', open: 'row-blue', todo: 'row-blue', 'to do': 'row-blue',
  planned: 'row-blue', scheduled: 'row-blue', low: 'row-blue',
};

const getRowHighlight = (task) => {
  for (const col of Object.keys(task)) {
    if (isStatusColumn(col) || isPriorityColumn(col)) {
      const key = String(task[col] ?? '').toLowerCase().trim();
      if (STATUS_COLORS[key]) return STATUS_COLORS[key];
    }
  }
  for (const col of Object.keys(task)) {
    if ((col.toLowerCase().includes('due') || col.toLowerCase().includes('deadline'))) {
      const d = new Date(task[col]);
      if (!isNaN(d) && d < new Date()) return 'row-red';
    }
  }
  return '';
};

/* ─── useOutsideClick ────────────────────────────────── */
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

/* ════════════════════════════════════════════════════════
   DETAIL PANEL COMPONENT
════════════════════════════════════════════════════════ */
const DetailPanel = ({ task, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!task) return null;

  return (
    <>
      <div className="detail-overlay" onClick={onClose} />
      <div className="detail-panel">
        <div className="detail-header">
          <div className="detail-header-left">
            <DetailIcon />
            <span>Row Detail</span>
          </div>
          <button className="detail-close" onClick={onClose}><XIcon size={16} /></button>
        </div>
        <div className="detail-body">
          {Object.entries(task).map(([col, val]) => (
            <div key={col} className="detail-field">
              <span className="detail-field-label">{col}</span>
              <span className={`detail-field-value ${(isStatusColumn(col) || isPriorityColumn(col)) && val
                ? `cell-badge cell-badge--${String(val).toLowerCase().replace(/\s+/g, '-')}`
                : ''
                }`}>
                {val ?? <span className="detail-empty">—</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="detail-footer">
          <button className="detail-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
const Data = () => {

  /* ── 1. localStorage-backed state ── */
  const [columnOrder, setColumnOrder] = useState(() =>
    lsGet(LS_KEYS.columnOrder, defaultCols)
  );
  const [visibleCols, setVisibleCols] = useState(() =>
    lsGet(LS_KEYS.visibleCols, Object.fromEntries(defaultCols.map(c => [c, true])))
  );
  const [savedFilters, setSavedFilters] = useState(() =>
    lsGet(LS_KEYS.savedFilters, [])
  );
  const [pageSize, setPageSize] = useState(() =>
    lsGet(LS_KEYS.pageSize, 10)
  );
  const { isDark, toggleTheme } = useTheme();
  /* persist to localStorage whenever these change */
  useEffect(() => lsSet(LS_KEYS.columnOrder, columnOrder), [columnOrder]);
  useEffect(() => lsSet(LS_KEYS.visibleCols, visibleCols), [visibleCols]);
  useEffect(() => lsSet(LS_KEYS.savedFilters, savedFilters), [savedFilters]);
  useEffect(() => lsSet(LS_KEYS.pageSize, pageSize), [pageSize]);

  /* ── 2. Regular state ── */
  const [showColPanel, setShowColPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [draftFilters, setDraftFilters] = useState({});
  const [filterSearch, setFilterSearch] = useState('');
  const [filterMode, setFilterMode] = useState(null);
  const [editingFilter, setEditingFilter] = useState(null);
  const [newFilterName, setNewFilterName] = useState('');
  const [showNameError, setShowNameError] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeStatCol, setActiveStatCol] = useState(null);
  /* ── 3. Sort state ── */
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  /* ── 4. Row selection state ── */
  const [selectedRows, setSelectedRows] = useState(new Set());

  /* ── 5. Detail panel state ── */
  const [detailTask, setDetailTask] = useState(null);

  /* ── Drag state ── */
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragItemIdx, setDragItemIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [dragging, setDragging] = useState(false);

  /* ── Refs ── */
  const colPanelRef = useRef(null);
  const colBtnRef = useRef(null);
  const filterPanelRef = useRef(null);
  const filterBtnRef = useRef(null);

  useOutsideClick([colPanelRef, colBtnRef], () => setShowColPanel(false));
  useOutsideClick([filterPanelRef, filterBtnRef], () => {
    setFilterMode(null); setNewFilterName('');
    setShowNameError(false); setEditingFilter(null);
  });

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, [searchTerm, activeFilters, sortCol, sortDir, pageSize]);

  const activeColumns = columnOrder.filter(c => visibleCols[c]);
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const draftFilterCount = Object.values(draftFilters).filter(Boolean).length;
  const numericCols = getNumericCols(activeColumns);


  /* ── Filtered data ── */
  const filteredTasks = useMemo(() => data.filter(task => {
    const matchSearch = !searchTerm || Object.values(task).some(v =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!matchSearch) return false;
    return Object.entries(activeFilters).every(([col, val]) =>
      !val || String(task[col] ?? '').toLowerCase().includes(val.toLowerCase())
    );
  }), [searchTerm, activeFilters]);

  /* ── Sorted data ── */
  const sortedTasks = useMemo(() => {
    if (!sortCol) return filteredTasks;
    return [...filteredTasks].sort((a, b) => {
      let aVal = a[sortCol] ?? '', bVal = b[sortCol] ?? '';
      const aNum = parseFloat(aVal), bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
      const aDate = new Date(aVal), bDate = new Date(bVal);
      if (!isNaN(aDate) && !isNaN(bDate)) return sortDir === 'asc' ? aDate - bDate : bDate - aDate;
      aVal = String(aVal).toLowerCase(); bVal = String(bVal).toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTasks, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedTasks = sortedTasks.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* ── Sort handler ── */
  const handleSort = (col) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortCol(null); setSortDir('asc'); }
    } else { setSortCol(col); setSortDir('asc'); }
  };
  const getSortIcon = (col) => {
    if (sortCol !== col) return <SortNoneIcon />;
    return sortDir === 'asc' ? <SortAscIcon /> : <SortDescIcon />;
  };

  /* ── Row selection handlers ── */
  const isAllSelected = pagedTasks.length > 0 && pagedTasks.every(t => selectedRows.has(t.id ?? JSON.stringify(t)));
  const isSomeSelected = pagedTasks.some(t => selectedRows.has(t.id ?? JSON.stringify(t)));

  const toggleSelectAll = () => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (isAllSelected) pagedTasks.forEach(t => next.delete(t.id ?? JSON.stringify(t)));
      else pagedTasks.forEach(t => next.add(t.id ?? JSON.stringify(t)));
      return next;
    });
  };

  const toggleSelectRow = (task) => {
    const key = task.id ?? JSON.stringify(task);
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const exportSelected = () => {
    const rows = sortedTasks.filter(t => selectedRows.has(t.id ?? JSON.stringify(t)));
    const exportData = rows.map(task => Object.fromEntries(activeColumns.map(c => [c, task[c]])));
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = activeColumns.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Selected');
    XLSX.writeFile(wb, 'selected_export.xlsx');
  };

  /* ── Column helpers ── */
  const toggleCol = c => setVisibleCols(p => ({ ...p, [c]: !p[c] }));
  const selectAll = () => setVisibleCols(Object.fromEntries(defaultCols.map(c => [c, true])));
  const deselectAll = () => setVisibleCols(Object.fromEntries(defaultCols.map(c => [c, false])));
  const resetOrder = () => setColumnOrder(defaultCols);

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

  /* ── Filter helpers ── */
  const openFilterMenu = () => {
    setFilterMode(filterMode === null ? 'menu' : null);
    setNewFilterName(''); setShowNameError(false); setEditingFilter(null);
  };
  const openNewFilter = () => {
    setDraftFilters({}); setFilterSearch(''); setNewFilterName('');
    setShowNameError(false); setEditingFilter(null); setFilterMode('new');
  };
  const applyDefault = () => { setActiveFilters({}); setDraftFilters({}); setFilterMode(null); };
  const openEditFilter = (sf) => {
    setDraftFilters({ ...sf.filters }); setFilterSearch('');
    setNewFilterName(sf.name); setShowNameError(false);
    setEditingFilter(sf); setFilterMode('new');
  };
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
      setEditingFilter(newEntry);
    }
  };
  const handleApplyOnly = () => { setActiveFilters({ ...draftFilters }); setFilterMode(null); setNewFilterName(''); setEditingFilter(null); };
  const deleteSavedFilter = (id, e) => { e.stopPropagation(); setSavedFilters(prev => prev.filter(f => f.id !== id)); };
  const loadSavedFilter = (sf) => { setActiveFilters({ ...sf.filters }); setFilterMode(null); };
  const clearAllFilters = () => { setActiveFilters({}); setDraftFilters({}); setFilterMode(null); };
  const removeSingleFilter = (col) => setActiveFilters(p => { const n = { ...p }; delete n[col]; return n; });

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

  /* ── Download all ── */
  const handleDownload = () => {
    const exportData = sortedTasks.map(task => Object.fromEntries(activeColumns.map(c => [c, task[c]])));
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = activeColumns.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks_export.xlsx');
  };

  /* ─── Render ──────────────────────────────────────── */
  return (
    <div className="data-wrapper">

      {/* Detail Panel */}
      {detailTask && <DetailPanel task={detailTask} onClose={() => setDetailTask(null)} />}

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
              <XIcon size={13} />
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="filter-btn-wrap" ref={filterBtnRef}>
          <button
            className={`btn-filter ${filterMode !== null || activeFilterCount > 0 ? 'active' : ''}`}
            onClick={openFilterMenu}
          >
            <FilterIcon />
            Filter
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            <ChevronDown />
          </button>

          {filterMode === 'menu' && (
            <div className="filter-panel" ref={filterPanelRef}>
              <div className="filter-panel-header">
                <span className="filter-panel-title">🎯 Filters</span>
              </div>
              <div className="fm-menu">
                <button className="fm-menu-item fm-menu-item--new" onClick={openNewFilter}>
                  <span className="fm-menu-icon"><PlusIcon /></span>
                  <span className="fm-menu-label">New Filter</span>
                  <span className="fm-menu-desc">Build a custom filter</span>
                </button>
                <button
                  className={`fm-menu-item ${activeFilterCount === 0 ? 'fm-menu-item--active' : ''}`}
                  onClick={applyDefault}
                >
                  <span className="fm-menu-icon"><DefaultIcon /></span>
                  <span className="fm-menu-label">Default</span>
                  <span className="fm-menu-desc">No filters applied</span>
                  {activeFilterCount === 0 && <span className="fm-active-dot" />}
                </button>
                {savedFilters.length > 0 && (
                  <>
                    <div className="fm-divider"><span>Saved Filters</span></div>
                    {savedFilters.map(sf => (
                      <div key={sf.id} className="fm-saved-row">
                        <button
                          className={`fm-menu-item fm-menu-item--saved ${JSON.stringify(activeFilters) === JSON.stringify(sf.filters) ? 'fm-menu-item--active' : ''
                            }`}
                          onClick={() => loadSavedFilter(sf)}
                        >
                          <span className="fm-menu-icon"><BookmarkIcon /></span>
                          <span className="fm-menu-label">{sf.name}</span>
                          <span className="fm-menu-desc">{Object.values(sf.filters).filter(Boolean).length} filter(s)</span>
                          {JSON.stringify(activeFilters) === JSON.stringify(sf.filters) && <span className="fm-active-dot" />}
                        </button>
                        <div className="fm-saved-actions">
                          <button className="fm-edit-btn" onClick={() => openEditFilter(sf)} title="Edit">✏️</button>
                          <button className="fm-delete-btn" onClick={(e) => deleteSavedFilter(sf.id, e)} title="Delete"><XIcon size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

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
                {showNameError && <span className="fp-name-error">Please enter a name for this filter</span>}
              </div>
              <div className="fp-col-search">
                <SearchIcon />
                <input type="text" placeholder="Find a column…" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
              </div>
              <div className="fp-rows">
                {filteredCols.map(col => {
                  const isDate = isDateColumn(col);
                  const uniqueVals = isDate ? [] : getUniqueValues(col);
                  const selected = draftFilters[col] || '';
                  return (
                    <div key={col} className={`fp-row ${selected ? 'fp-row--active' : ''}`}>
                      <span className="fp-col-name">
                        {col}
                        {isDate && <span className="fp-date-badge">date</span>}
                      </span>
                      <div className="fp-select-wrap">
                        {isDate ? (
                          <input type="text" className="fp-date-input" placeholder="e.g. 2024-01-15" value={selected}
                            onChange={e => setDraftFilters(p => ({ ...p, [col]: e.target.value }))} />
                        ) : (
                          <select className="fp-select" value={selected}
                            onChange={e => setDraftFilters(p => ({ ...p, [col]: e.target.value }))}>
                            <option value="">— Any —</option>
                            {uniqueVals.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        )}
                        {selected && (
                          <button className="fp-clear-single"
                            onClick={() => setDraftFilters(p => { const n = { ...p }; delete n[col]; return n; })}>
                            <XIcon size={10} />
                          </button>
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
                  <button className="btn-apply-only" onClick={handleApplyOnly}>Apply</button>
                  <button className="btn-apply-filter" onClick={handleApply}>
                    <SaveIcon /> {editingFilter ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columns */}
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
                  <button onClick={resetOrder}>↺ Reset</button>
                </div>
              </div>
              <div className="col-panel-hint">
                <span>☑ toggle</span><span>⠿ drag to reorder</span>
              </div>
              <div className={`col-panel-list ${dragging ? 'is-dragging' : ''}`}>
                {columnOrder.map((col, index) => (
                  <div
                    key={col}
                    className={[
                      'col-drag-item',
                      !visibleCols[col] ? 'col-drag-item--hidden' : '',
                      dragOverIdx === index && dragItemIdx !== index ? 'col-drag-item--over' : '',
                      dragItemIdx === index ? 'col-drag-item--dragging' : '',
                    ].filter(Boolean).join(' ')}
                    draggable
                    onDragStart={e => onDragStart(e, index)}
                    onDragEnter={e => onDragEnter(e, index)}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                  >
                    <span className="drag-handle"><DragIcon /></span>
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

        {/* Stats toggle */}
        {numericCols.length > 0 && (
          <button
            className={`btn-stats ${statsOpen ? 'active' : ''}`}
            onClick={() => { setStatsOpen(p => !p); setActiveStatCol(numericCols[0]); }}
          >
            <StatsIcon />
            Stats
            {statsOpen && <span className="stats-badge">{numericCols.length}</span>}
          </button>
        )}

        {/* Download */}
        <button className="btn-download" onClick={handleDownload}>
          <DownloadIcon /> Export XL
        </button>
      </div>
      {/* Dark mode toggle */}
      <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
        {isDark ? <SunIcon /> : <MoonIcon />}
        {isDark ? 'Light' : 'Dark'}
      </button>
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
                <button className="tag-remove" onClick={() => removeSingleFilter(col)}><XIcon size={10} /></button>
              </span>
            ))}
          </div>
          <button className="clear-all-tag" onClick={clearAllFilters}>Clear all</button>
        </div>
      )}

      {/* Statistics bar */}
      {statsOpen && numericCols.length > 0 && (() => {
        const col = activeStatCol || numericCols[0];
        const stats = getColStats(col, filteredTasks);
        return (
          <div className="stats-bar">

            {/* Column selector tabs */}
            <div className="stats-col-tabs">
              <span className="stats-bar-label"><StatsIcon /> Stats:</span>
              <div className="stats-tabs-scroll">
                {numericCols.map(c => (
                  <button
                    key={c}
                    className={`stats-tab ${(activeStatCol || numericCols[0]) === c ? 'stats-tab--active' : ''}`}
                    onClick={() => setActiveStatCol(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            {/* Stat cards */}
            {stats ? (
              <div className="stats-cards">
                <div className="stats-card">
                  <span className="stats-card-label">Count</span>
                  <span className="stats-card-value">{fmt(stats.count)}</span>
                  <span className="stats-card-sub">rows with a value</span>
                </div>
                <div className="stats-card stats-card--sum">
                  <span className="stats-card-label">Sum</span>
                  <span className="stats-card-value">{fmt(stats.sum)}</span>
                  <span className="stats-card-sub">all values added</span>
                </div>
                <div className="stats-card stats-card--avg">
                  <span className="stats-card-label">Average</span>
                  <span className="stats-card-value">{fmt(stats.avg)}</span>
                  <span className="stats-card-sub">sum ÷ count</span>
                </div>
                <div className="stats-card stats-card--min">
                  <span className="stats-card-label">Min</span>
                  <span className="stats-card-value">{fmt(stats.min)}</span>
                  <span className="stats-card-sub">smallest value</span>
                </div>
                <div className="stats-card stats-card--max">
                  <span className="stats-card-label">Max</span>
                  <span className="stats-card-value">{fmt(stats.max)}</span>
                  <span className="stats-card-sub">largest value</span>
                </div>
                <div className="stats-card stats-card--rows">
                  <span className="stats-card-label">Filtered rows</span>
                  <span className="stats-card-value">{filteredTasks.length}</span>
                  <span className="stats-card-sub">matching current filter</span>
                </div>
              </div>
            ) : (
              <span className="stats-no-data">No numeric data in this column</span>
            )}

          </div>
        );
      })()}


      {/* Sort indicator */}
      {sortCol && (
        <div className="sort-indicator-bar">
          <span className="sort-indicator-label">
            {sortDir === 'asc' ? <SortAscIcon /> : <SortDescIcon />}
            Sorted by <strong>{sortCol}</strong> ({sortDir === 'asc' ? 'A → Z' : 'Z → A'})
          </span>
          <button className="sort-clear-btn" onClick={() => { setSortCol(null); setSortDir('asc'); }}>
            <XIcon size={11} /> Clear sort
          </button>
        </div>
      )}

      {/* Bulk action bar — shows when rows are selected */}
      {selectedRows.size > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-count">
            <CheckIcon /> {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''} selected
          </span>
          <div className="bulk-actions">
            <button className="bulk-export-btn" onClick={exportSelected}>
              <DownloadIcon /> Export Selected
            </button>
            <button className="bulk-clear-btn" onClick={() => setSelectedRows(new Set())}>
              <XIcon size={11} /> Deselect all
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-scroll-container">
        <table className="task-table">
          <thead>
            <tr>
              {/* Checkbox column */}
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={el => { if (el) el.indeterminate = isSomeSelected && !isAllSelected; }}
                  onChange={toggleSelectAll}
                  title="Select all on this page"
                />
              </th>
              {activeColumns.map(col => (
                <th
                  key={col}
                  className={`sortable-th ${sortCol === col ? 'th-sorted' : ''}`}
                  onClick={() => handleSort(col)}
                >
                  <span className="th-inner">
                    {col}
                    <span className={`sort-icon ${sortCol === col ? 'sort-icon--active' : ''}`}>
                      {getSortIcon(col)}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedTasks.length > 0 ? (
              pagedTasks.map((task, index) => {
                const highlight = getRowHighlight(task);
                const rowKey = task.id ?? JSON.stringify(task);
                const isSelected = selectedRows.has(rowKey);
                return (
                  <tr
                    key={rowKey}
                    className={[
                      highlight ? `highlighted-row ${highlight}` : '',
                      isSelected ? 'row-selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {/* Checkbox cell */}
                    <td className="td-checkbox" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(task)}
                      />
                    </td>
                    {activeColumns.map(col => (
                      <td
                        key={col}
                        onClick={() => setDetailTask(task)}
                        className="td-clickable"
                        title="Click to view details"
                      >
                        {(isStatusColumn(col) || isPriorityColumn(col)) && task[col] ? (
                          <span className={`cell-badge cell-badge--${String(task[col]).toLowerCase().replace(/\s+/g, '-')}`}>
                            <Highlight text={task[col]} query={searchTerm} />
                          </span>
                        ) : (
                          <Highlight text={task[col]} query={searchTerm} />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={activeColumns.length + 1}>
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
        <div className="pagination-left">
          <span className="pagination-info">
            {sortedTasks.length === 0
              ? '0 results'
              : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, sortedTasks.length)} of ${sortedTasks.length}`}
          </span>
          {/* Page size selector */}
          <div className="page-size-wrap">
            <span className="page-size-label">Rows:</span>
            {PAGE_SIZE_OPTIONS.map(size => (
              <button
                key={size}
                className={`page-size-btn ${pageSize === size ? 'page-size-btn--active' : ''}`}
                onClick={() => { setPageSize(size); setCurrentPage(1); }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
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