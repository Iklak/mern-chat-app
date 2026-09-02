import React from "react";

function UserItem({ user, onSelect }) {
  return (
    <button className="user-item" onClick={() => onSelect(user)}>
      <div className="user-avatar">
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </button>
  );
}

export default UserItem;
