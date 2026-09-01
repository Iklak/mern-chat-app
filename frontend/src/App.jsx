import { useEffect } from "react";
import { getUsers } from "./services/user.service";

function App() {
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();

        console.log("Users:", data);
      } catch (error) {
        console.log(
          "Failed to fetch users:",
          error.response?.data || error.message,
        );
      }
    };

    loadUsers();
  }, []);

  return <h1>Chat App</h1>;
}

export default App;
