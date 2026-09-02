import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onSelectUser={setSelectedUser} />

      <main style={{ padding: "30px" }}>
        {selectedUser ? (
          <h2>Chat with {selectedUser.name}</h2>
        ) : (
          <h2>Select a user</h2>
        )}
      </main>
    </div>
  );
}

export default App;
