"use client";

import { useEffect, useState } from "react";

export default function RoleSelector() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  function changeRole(event) {
    const selectedRole = event.target.value;

    setRole(selectedRole);
    localStorage.setItem("helpdeskRole", selectedRole);
  }

  return (
    <div>
      <label className="block mb-1 font-medium">
        Current Role
      </label>

      <select
        value={role}
        onChange={changeRole}
        className="border rounded-lg p-2"
      >
        <option value="">Select Role</option>
        <option value="Student">Student</option>
        <option value="Technician">Technician</option>
      </select>
    </div>
  );
}