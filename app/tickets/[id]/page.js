"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function TicketDetails() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }

    const savedAuthor = localStorage.getItem("helpdeskAuthor");

    if (savedAuthor) {
      setAuthor(savedAuthor);
    }

    if (ticketId) {
      fetchTicket();
      fetchComments();
      fetchCategories();
    }
  }, [ticketId]);

  async function fetchTicket() {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const data = await response.json();

      setTicket(data);

      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category?._id || "");
      setPriority(data.priority);
      setStatus(data.status);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const response = await fetch("/api/comments");
      const data = await response.json();

      const ticketComments = data.filter(
        (comment) => comment.ticket?._id === ticketId
      );

      setComments(ticketComments);
    } catch (error) {
      console.error(error);
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

  async function updateStudentTicket(event) {
    event.preventDefault();

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          status: ticket.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      const updatedTicket = await response.json();

      setTicket(updatedTicket);

      setTitle(updatedTicket.title);
      setDescription(updatedTicket.description);
      setCategory(updatedTicket.category?._id || "");
      setPriority(updatedTicket.priority);

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateTechnicianTicket(newStatus, newPriority) {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category?._id,
          status: newStatus,
          priority: newPriority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      const updatedTicket = await response.json();

      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
      setPriority(updatedTicket.priority);
    } catch (error) {
      console.error(error);
    }
  }

  async function addComment(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket: ticketId,
          message,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      localStorage.setItem("helpdeskAuthor", author);

      setMessage("");

      fetchComments();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteComment(comment) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      fetchComments();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTicket() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      router.push("/tickets");
    } catch (error) {
      console.error(error);
    }
  }

  function startEditing() {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setCategory(ticket.category?._id || "");
    setPriority(ticket.priority);

    setEditing(true);
  }

  function cancelEditing() {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setCategory(ticket.category?._id || "");
    setPriority(ticket.priority);

    setEditing(false);
  }

  function getStatusStyle(statusValue) {
    if (statusValue === "Open") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (statusValue === "In Progress") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    if (statusValue === "Resolved") {
      return "bg-green-50 text-green-700 border border-green-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  }

  function getPriorityStyle(priorityValue) {
    if (priorityValue === "High") {
      return "bg-orange-50 text-orange-700 border border-orange-200";
    }

    if (priorityValue === "Medium") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="bg-white rounded-[22px] p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <p className="font-serif text-2xl text-[#4B5563]">
            Loading ticket...
          </p>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="bg-white rounded-[22px] p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <h1 className="font-serif text-4xl text-[#111827]">
            Ticket not found
          </h1>

          <Link
            href="/tickets"
            className="inline-block mt-5 text-[#4F7DE8] font-sans font-semibold hover:text-[#3B66D0]"
          >
            ← Back to Tickets
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-12">
      <Link
        href="/tickets"
        className="inline-flex items-center font-sans text-sm font-semibold text-[#4F7DE8] hover:text-[#3B66D0] transition-colors mb-6"
      >
        ← Back to Tickets
      </Link>

      <div className="bg-white rounded-[22px] p-7 lg:p-9 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
        {role === "Student" && editing ? (
          <>
            <div className="mb-7">
              <h1 className="font-serif text-4xl text-[#111827]">
                Edit My Ticket
              </h1>

              <p className="font-serif text-lg text-[#4B5563] mt-2">
                Update the information for your support request.
              </p>
            </div>

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

            <div className="mb-5">
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows="5"
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              />
            </div>

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
                onClick={updateStudentTicket}
                className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
              >
                Save Changes
              </button>

              <button
                onClick={cancelEditing}
                className="bg-[#F3F4F6] text-[#374151] font-sans font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-[#E5E7EB]"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="min-w-0">
                <h1 className="font-serif text-4xl lg:text-5xl text-[#111827] break-words">
                  {ticket.title}
                </h1>

                <p className="font-serif text-xl text-[#4B5563] mt-4 leading-relaxed max-w-4xl">
                  {ticket.description}
                </p>
              </div>

              {role === "Student" && (
                <button
                  onClick={startEditing}
                  className="self-start bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Edit Ticket
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#F8FAFF] border border-[#E1E8F5] rounded-2xl p-5">
                <p className="font-sans text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Category
                </p>

                <p className="font-serif text-2xl text-[#111827] mt-2">
                  {ticket.category?.name || "Unknown"}
                </p>
              </div>

              <div className="bg-[#F8FAFF] border border-[#E1E8F5] rounded-2xl p-5">
                <p className="font-sans text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Status
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-sans font-bold ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="bg-[#F8FAFF] border border-[#E1E8F5] rounded-2xl p-5">
                <p className="font-sans text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Priority
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-sans font-bold ${getPriorityStyle(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-[#EEF2F7]">
              <p className="font-sans text-sm text-[#6B7280]">
                Created{" "}
                <span className="font-semibold text-[#374151]">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            {role === "Student" && ticket.status === "Resolved" && (
              <div className="mt-6 pt-5 border-t border-[#EEF2F7]">
                <button
                  onClick={deleteTicket}
                  className="bg-red-50 text-red-600 border border-red-200 font-sans font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-red-100"
                >
                  Delete Ticket
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {role === "Technician" && (
        <div className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mt-6">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-[#111827]">
              Manage Ticket
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              Update the status and priority of this ticket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Status
              </label>

              <select
                value={status}
                onChange={(event) => {
                  const newStatus = event.target.value;

                  setStatus(newStatus);

                  updateTechnicianTicket(newStatus, priority);
                }}
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) => {
                  const newPriority = event.target.value;

                  setPriority(newPriority);

                  updateTechnicianTicket(status, newPriority);
                }}
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none cursor-pointer focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="mb-5">
          <h2 className="font-serif text-4xl text-[#111827]">
            Comments
          </h2>

          <p className="font-serif text-lg text-[#4B5563] mt-1">
            Conversation about this support request.
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="bg-white rounded-[22px] p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
            <p className="font-serif text-xl text-[#4B5563]">
              No comments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white rounded-[22px] p-6 shadow-[0_8px_24px_rgba(30,64,175,0.08)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="font-sans font-bold text-[#111827]">
                      {comment.author}
                    </p>

                    <p className="font-sans text-sm text-[#6B7280] mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {role === "Student" &&
                    comment.author === author && (
                      <button
                        onClick={() => deleteComment(comment)}
                        className="self-start bg-red-50 text-red-600 border border-red-200 font-sans font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    )}

                  {role === "Technician" &&
                    comment.author !== "Technician" && (
                      <button
                        onClick={() => {
                          setAuthor("Technician");
                          setMessage("");
                        }}
                        className="self-start bg-[#4F7DE8] text-white font-sans font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 hover:bg-[#3B66D0]"
                      >
                        Reply
                      </button>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#EEF2F7]">
                  <p className="font-serif text-lg text-[#374151] leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(role === "Student" || role === "Technician") && (
        <div className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mt-6">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-[#111827]">
              {role === "Technician"
                ? "Reply to Student"
                : "Add Comment"}
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              {role === "Technician"
                ? "Send a response to the student."
                : "Add more information or a follow-up to your ticket."}
            </p>
          </div>

          <form onSubmit={addComment}>
            <div className="mb-5">
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Author
              </label>

              <input
                type="text"
                value={author}
                onChange={(event) => {
                  setAuthor(event.target.value);
                  localStorage.setItem(
                    "helpdeskAuthor",
                    event.target.value
                  );
                }}
                required
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                Message
              </label>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                rows="4"
                className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
                placeholder={
                  role === "Technician"
                    ? "Write a reply to the student"
                    : "Write a comment"
                }
              />
            </div>

            <button
              type="submit"
              className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
            >
              {role === "Technician"
                ? "Send Reply"
                : "Add Comment"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}