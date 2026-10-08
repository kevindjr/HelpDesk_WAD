"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }

    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [ticketResponse, categoryResponse] = await Promise.all([
        fetch("/api/tickets"),
        fetch("/api/categories"),
      ]);

      const ticketData = await ticketResponse.json();
      const categoryData = await categoryResponse.json();

      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <p className="font-serif text-2xl text-[#4B5563]">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-5xl font-normal text-[#111827]">
          {role || "Student"} Dashboard
        </h1>

        <p className="font-serif text-xl text-[#4B5563] mt-2">
          Overview of current IT support tickets.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
        {/* Total Tickets */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1">
          <p className="font-serif text-2xl text-[#111827]">
            Total Tickets
          </p>

          <p className="font-serif text-5xl text-[#111827] mt-2">
            {totalTickets}
          </p>
        </div>

        {/* Open */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1">
          <p className="font-serif text-2xl text-[#111827]">
            Open
          </p>

          <p className="font-serif text-5xl text-[#111827] mt-2">
            {openTickets}
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1">
          <p className="font-serif text-2xl text-[#111827]">
            In Progress
          </p>

          <p className="font-serif text-5xl text-[#111827] mt-2">
            {inProgressTickets}
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-[22px] p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1">
          <p className="font-serif text-2xl text-[#111827]">
            Resolved
          </p>

          <p className="font-serif text-5xl text-[#111827] mt-2">
            {resolvedTickets}
          </p>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Ticket Status */}
        <div className="bg-white rounded-[22px] p-7 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <h2 className="font-serif text-3xl font-normal text-[#111827]">
            Ticket Status
          </h2>

          <div className="mt-8 space-y-7">
            <p className="font-serif text-2xl text-[#111827]">
              OPEN: {openTickets}
            </p>

            <p className="font-serif text-2xl text-[#111827]">
              IN PROGRESS: {inProgressTickets}
            </p>

            <p className="font-serif text-2xl text-[#111827]">
              RESOLVED: {resolvedTickets}
            </p>
          </div>
        </div>

        {/* Available Categories */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-4xl font-normal text-[#111827] mb-4">
            Available Categories
          </h2>

          <div className="bg-white rounded-[22px] p-7 shadow-[0_8px_24px_rgba(30,64,175,0.08)] h-[320px] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="font-serif text-xl text-[#4B5563]">
                No categories available.
              </p>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 items-baseline"
                  >
                    <h3 className="font-serif text-3xl text-[#111827]">
                      {category.name}
                    </h3>

                    <p className="font-serif text-xl text-[#4B5563] leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}