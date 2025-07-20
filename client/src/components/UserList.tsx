import { useEffect, useState } from "react";
import { fetchUsers } from "../api/fetchUsers";

type User = {
  _id: string;
  name: string;
  email: string;
  age: number;
  experience: string[];
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <ul>
        {users.length === 0 ? (
          <li>No users found.</li>
        ) : (
          users.map((user) => (
            <li key={user._id}>
              <p>
                <strong>{user.name}</strong> ({user.age} years)
              </p>
              <p>Email: {user.email}</p>
              <p>Experience: {user.experience.join(", ")}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
