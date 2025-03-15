import { useState } from "react";
// import { useState, useCallback } from "react";
// import debounce from "lodash/debounce";

function TaskFilter({ onFilterChange, onSortChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  //   const debouncedSearch = debounce((callback, value) => {
  //     callback(value);
  //   }, 300);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, priority });
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    onFilterChange({ searchTerm, priority: value });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="task-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <select
          value={priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
    </div>
  );
}

export default TaskFilter;
