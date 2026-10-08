"use client";

import { useEffect, useState } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }

    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const response = await fetch("/api/comments");
      const data = await response.json();

      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function startReply(comment) {
    setReplyingTo(comment);
    setReplyMessage("");
  }

  function cancelReply() {
    setReplyingTo(null);
    setReplyMessage("");
  }

  async function sendReply(event) {
    event.preventDefault();

    if (!replyMessage.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket: replyingTo.ticket._id,
          message: replyMessage,
          author: "Technician",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      setReplyingTo(null);
      setReplyMessage("");

      fetchComments();
    } catch (error) {
      console.error(error);
    }
  }

  if (role !== "Technician") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-normal text-[#111827]">
            Comments
          </h1>

          <p className="font-serif text-xl text-[#4B5563] mt-3">
            Technician access only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-5xl font-normal text-[#111827]">
            Comments
          </h1>

          <p className="font-serif text-xl text-[#4B5563] mt-2">
            View student comments and reply to their questions.
          </p>

          <p className="font-serif text-lg text-[#4F7DE8] mt-2">
            Current role: {role}
          </p>
        </div>

        {loading ? (
          <p className="font-serif text-xl text-[#4B5563] text-center">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="font-serif text-xl text-[#4B5563] text-center">
            No comments yet.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white p-6 rounded-[22px] shadow-[0_8px_24px_rgba(30,64,175,0.08)]"
              >
                <div className="mb-3">
                  <p className="font-serif text-sm text-gray-500">
                    Ticket
                  </p>

                  <p className="font-serif text-lg font-semibold">
                    {comment.ticket?.title}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="font-serif text-sm text-gray-500">
                    Author
                  </p>

                  <p className="font-serif text-lg font-medium">
                    {comment.author}
                  </p>
                </div>

                <p className="font-serif text-lg text-gray-700">
                  {comment.message}
                </p>

                <p className="font-serif text-sm text-gray-500 mt-3">
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    timeZone: "Asia/Bangkok",
                  })}
                </p>
                
                {comment.author !== "Technician" &&
                  replyingTo?._id !== comment._id && (
                    <button
                      onClick={() => startReply(comment)}
                      className="bg-[#4F7DE8] text-white px-5 py-2.5 rounded-full font-sans font-semibold shadow-[0_6px_16px_rgba(79,125,232,0.2)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5 mt-4"
                    >
                      Reply
                    </button>
                  )}

                {replyingTo?._id === comment._id && (
                  <form
                    onSubmit={sendReply}
                    className="mt-5 pt-5 border-t border-[#EEF2F7]"
                  >
                    <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
                      Reply
                    </label>

                    <textarea
                      value={replyMessage}
                      onChange={(event) =>
                        setReplyMessage(event.target.value)
                      }
                      required
                      className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] font-serif outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
                      rows="4"
                      placeholder="Write a reply to the student"
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="bg-[#4F7DE8] text-white px-5 py-2.5 rounded-full font-sans font-semibold shadow-[0_6px_16px_rgba(79,125,232,0.2)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
                      >
                        Send Reply
                      </button>

                      <button
                        type="button"
                        onClick={cancelReply}
                        className="bg-[#F3F4F6] text-[#374151] px-5 py-2.5 rounded-full font-sans font-semibold transition-all duration-200 hover:bg-[#E5E7EB]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}