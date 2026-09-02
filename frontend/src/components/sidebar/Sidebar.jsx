import { useEffect, useState } from "react";
import { getUsers } from "../../services/user.service";
import "./Sidebar.css";
import UserList from "./UserList";
function Sidebar({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch users:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Messages</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sidebar-content">
        {loading ? (
          <p className="loading">Loading users...</p>
        ) : (
          <UserList users={filteredUsers} onSelectUser={onSelectUser} />
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
