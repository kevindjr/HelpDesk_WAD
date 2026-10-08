"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }

    fetchTickets();
    fetchCategories();
  }, []);

  async function fetchTickets() {
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();

      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createTicket(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      resetForm();
      setShowForm(false);

      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(ticket) {
    setEditingTicket(ticket);

    setTitle(ticket.title);
    setDescription(ticket.description);
    setCategory(ticket.category?._id || "");
    setPriority(ticket.priority);

    setShowForm(false);
  }

  async function updateTicket(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/tickets/${editingTicket._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
            priority,
            status: editingTicket.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      resetForm();
      setEditingTicket(null);

      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTicket(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("Medium");
  }

  function cancelEdit() {
    resetForm();
    setEditingTicket(null);
  }

  function getStatusStyle(status) {
    if (status === "Open") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    if (status === "Resolved") {
      return "bg-green-50 text-green-700 border border-green-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  }

  function getPriorityStyle(priority) {
    if (priority === "High") {
      return "bg-orange-50 text-orange-700 border border-orange-200";
    }

    if (priority === "Medium") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
        <div>
          <h1 className="font-serif text-5xl font-normal text-[#111827]">
            Tickets
          </h1>

          <p className="font-serif text-xl text-[#4B5563] mt-2">
            Manage and track your IT support requests.
          </p>
        </div>

        {!editingTicket && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="self-start sm:self-auto bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.25)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
          >
            {showForm ? "Cancel" : "+ Create Ticket"}
          </button>
        )}
      </div>

      {/* Create Ticket Form */}
      {showForm && !editingTicket && (
        <form
          onSubmit={createTicket}
          className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mb-8"
        >
          <div className="mb-7">
            <h2 className="font-serif text-3xl font-normal text-[#111827]">
              Create New Ticket
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              Tell us about the IT problem you are experiencing.
            </p>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              placeholder="Enter a short title for your issue"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              rows="5"
              placeholder="Describe the problem in detail..."
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="">Select a category</option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
          >
            Create Ticket
          </button>
        </form>
      )}

      {/* Edit Ticket Form */}
      {editingTicket && (
        <form
          onSubmit={updateTicket}
          className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mb-8"
        >
          <div className="mb-7">
            <h2 className="font-serif text-3xl font-normal text-[#111827]">
              Edit My Ticket
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              Update the information for your support request.
            </p>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              rows="5"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="">Select a category</option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
            >
              Update Ticket
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="bg-[#F3F4F6] text-[#374151] font-sans font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-[#E5E7EB]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="mb-5">
        <span className="font-sans text-sm font-semibold text-[#4B5563]">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-[22px] p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <p className="font-serif text-xl text-[#4B5563]">
            Loading tickets...
          </p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-[22px] p-10 text-center shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <h3 className="font-serif text-3xl text-[#111827]">
            No tickets yet
          </h3>

          <p className="font-serif text-lg text-[#4B5563] mt-2">
            Create a ticket when you need IT support.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-[22px] p-6 lg:p-7 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1"
            >
              {/* Ticket Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-3xl text-[#111827] break-words">
                    {ticket.title}
                  </h3>

                  <p className="font-serif text-lg text-[#4B5563] mt-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`self-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-sans font-bold ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* Ticket Information */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className="bg-[#F8FAFF] border border-[#E1E8F5] rounded-full px-4 py-2">
                  <span className="font-sans text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                    Category
                  </span>

                  <span className="font-sans text-sm font-semibold text-[#111827] ml-2">
                    {ticket.category?.name || "Unknown"}
                  </span>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-sm font-sans font-bold ${getPriorityStyle(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority} Priority
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#EEF2F7]">
                <Link
                  href={`/tickets/${ticket._id}`}
                  className="bg-[#4F7DE8] text-white font-sans font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
                >
                  View Ticket
                </Link>

                {role === "Student" && (
                  <>
                    {ticket.status === "Resolved" && (
                      <button
                        onClick={() => deleteTicket(ticket._id)}
                        className="bg-red-50 text-red-600 border border-red-200 font-sans font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}