"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  function logout() {
    localStorage.removeItem("helpdeskRole");
    router.push("/");
  }

  function isActive(path) {
    return pathname === path;
  }

  return (
    <nav className="w-full px-6 lg:px-12 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-serif text-3xl lg:text-4xl tracking-wide text-[#111827]"
        >
          IT HelpDesk
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          <Link
            href="/dashboard"
            className={`font-sans text-sm tracking-wider transition-colors ${
              isActive("/dashboard")
                ? "text-[#4F7DE8]"
                : "text-[#111827] hover:text-[#4F7DE8]"
            }`}
          >
            DASHBOARD
          </Link>

          <Link
            href="/tickets"
            className={`font-sans text-sm tracking-wider transition-colors ${
              isActive("/tickets")
                ? "text-[#4F7DE8]"
                : "text-[#111827] hover:text-[#4F7DE8]"
            }`}
          >
            TICKETS
          </Link>

          <Link
            href="/categories"
            className={`font-sans text-sm tracking-wider transition-colors ${
              isActive("/categories")
                ? "text-[#4F7DE8]"
                : "text-[#111827] hover:text-[#4F7DE8]"
            }`}
          >
            CATEGORIES
          </Link>

          {role === "Technician" && (
            <Link
              href="/comments"
              className={`font-sans text-sm tracking-wider transition-colors ${
                isActive("/comments")
                  ? "text-[#4F7DE8]"
                  : "text-[#111827] hover:text-[#4F7DE8]"
              }`}
            >
              COMMENTS
            </Link>
          )}

          <button
            onClick={logout}
            className="font-sans text-sm tracking-wider text-[#111827] transition-colors hover:text-[#4F7DE8]"
          >
            LOGOUT
          </button>

          <div className="w-10 h-10 rounded-full bg-[#4F7DE8] text-white flex items-center justify-center font-serif text-lg">
            {role === "Technician" ? "T" : "S"}
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#111827]"
          aria-label="Open menu"
        >
          <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-4 bg-white rounded-2xl shadow-lg p-5">
          <div className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm tracking-wider text-[#111827]"
            >
              DASHBOARD
            </Link>

            <Link
              href="/tickets"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm tracking-wider text-[#111827]"
            >
              TICKETS
            </Link>

            <Link
              href="/categories"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm tracking-wider text-[#111827]"
            >
              CATEGORIES
            </Link>

            {role === "Technician" && (
              <Link
                href="/comments"
                onClick={() => setMenuOpen(false)}
                className="font-sans text-sm tracking-wider text-[#111827]"
              >
                COMMENTS
              </Link>
            )}

            <button
              onClick={logout}
              className="text-left font-sans text-sm tracking-wider text-[#111827] hover:text-[#4F7DE8]"
            >
              LOGOUT
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}