import { useEffect, useState } from "react";
import TaskDetail from "../components/TaskDetail";
import "./Dashboard.css";
import {
  FaRegCheckCircle,
  FaClock,
  FaEllipsisH,
  FaBriefcase,
  FaBook,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: "All",
    cycle: "All",
    status: "All",
    priority: "All",
  });
  const [sortBy, setSortBy] = useState("Priority");
  const [searchText, setSearchText] = useState("");

  const userId = localStorage.getItem("userId");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks/user/${userId}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch personal tasks:", err);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tasks];

    if (filters.type !== "All") filtered = filtered.filter(task => task.type === filters.type);
    if (filters.cycle !== "All") filtered = filtered.filter(task => task.cycle === filters.cycle);
    if (filters.status !== "All") filtered = filtered.filter(task => task.status === filters.status);
    if (filters.priority !== "All") filtered = filtered.filter(task => task.priority === filters.priority);
    if (searchText.trim()) {
      filtered = filtered.filter(task => task.title.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (sortBy === "Priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2, TBD: 3 };
      filtered.sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4));
    } else if (sortBy === "Due Date") {
      filtered.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    }

    setDisplayedTasks(filtered);
  };

  const handleReset = () => {
    setFilters({ type: "All", cycle: "All", status: "All", priority: "All" });
    setSortBy("Priority");
    setSearchText("");
  };

  const getDueDisplay = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    const diff = due - now;
    if (isNaN(diff)) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diff < 0) {
      return { text: `Due: ${due.toLocaleDateString()}\n⚠️ Past Due`, isPast: true };
    }
    return { text: `Due: ${due.toLocaleDateString()}\nin ${days} Day(s) ${hours} Hour(s)`, isPast: false };
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await fetch(`/api/tasks/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add personal task:", err);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask({ task });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, sortBy, searchText]);

  return (
    <>
      {/* 顶部控制栏 */}
      <div className="task-controls">
        <button className="btn btn-secondary" onClick={() => setFilterVisible(!filterVisible)}>Filter</button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-icon-button" onClick={applyFiltersAndSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Filter 筛选区域 */}
      {filterVisible && (
        <div className="filter-panel">
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option>All Types</option>
            <option>Work</option>
            <option>Study</option>
            <option>Daily</option>
          </select>

          <select value={filters.cycle} onChange={(e) => setFilters({ ...filters, cycle: e.target.value })}>
            <option>All Cycles</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Priority</option>
            <option>Due Date</option>
          </select>

          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      )}

      {/* 任务卡展示区域 */}
      <div className="task-list">
        {displayedTasks.map((task) => {
          const priorityClass =
            task.priority === "High" ? "priority-high"
              : task.priority === "Medium" ? "priority-medium"
              : task.priority === "Low" ? "priority-low"
              : "";

          const statusClass =
            task.status === "Pending" ? "status-pending"
              : task.status === "In Progress" ? "status-in-progress"
              : task.status === "Completed" ? "status-completed"
              : "";

          const statusIcon =
            task.status === "Pending" ? <FaEllipsisH />
              : task.status === "In Progress" ? <FaClock />
              : task.status === "Completed" ? <FaRegCheckCircle />
              : null;

          const typeIcon =
            task.type === "Work" ? <FaBriefcase />
              : task.type === "Study" ? <FaBook />
              : <FaCalendarAlt />;

          const cycleIcon = <FaCalendarAlt />;
          const dueDisplay = getDueDisplay(task.dueDate);

          return (
            <div key={task.id} className="task-item" onClick={() => handleEditTask(task)}>
              <div className="task-top">
                <div className="title-priority">
                  <span className="task-title">{task.title}</span>
                  <span className={`priority-badge ${priorityClass}`}>{task.priority || "TBD"}</span>
                </div>
              </div>

              {dueDisplay && (
                <p className={`due-display ${dueDisplay.isPast ? "past-due" : ""}`}>
                  {dueDisplay.text.split("\n").map((line, idx) => (
                    <span key={idx}>{line}<br /></span>
                  ))}
                </p>
              )}

              <p>{task.description || "No description"}</p>

              <div className="task-tags">
                <span className={`task-tag ${statusClass}`}>{statusIcon} {task.status || "TBD"}</span>
                <span className="task-tag">{typeIcon} {task.type || "TBD"}</span>
                <span className="task-tag">{cycleIcon} {task.cycle || "TBD"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 添加任务 */}
      <div className="input-group">
        <input
          type="text"
          placeholder="New Personal Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="input-field"
        />
        <button className="btn btn-primary" onClick={handleAddTask}>Add</button>
      </div>

      {/* 弹窗 */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask.task}
          teamId={null}
          onClose={() => setSelectedTask(null)}
          onSave={() => {
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}
    </>
  );
}

export default MyTasks;






