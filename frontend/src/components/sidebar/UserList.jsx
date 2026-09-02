import React from "react";
import UserItem from "./UserItem";

function UserList({ users, onSelectUser }) {
  if (!users.length) {
    return <div className="empty-users">No user found</div>;
  }
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserItem key={user._id} user={user} onSelect={onSelectUser} />
      ))}
    </div>
  );
}

export default UserList;
