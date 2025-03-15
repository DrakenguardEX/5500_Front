function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    high: "#ff4d4f",
    medium: "#faad14",
    low: "#52c41a",
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <div className="task-meta">
          <span>Due: {formatDate(task.dueDate)}</span>
          <span>{task.status}</span>
        </div>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)} className="delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
