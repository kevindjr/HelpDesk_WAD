"use client";

import { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [deleteError, setDeleteError] = useState("");
  const [deleteErrorCategory, setDeleteErrorCategory] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("helpdeskRole");

    if (savedRole) {
      setRole(savedRole);
    }

    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function createCategory(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to create category");
        return;
      }

      resetForm();
      setShowForm(false);

      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(category) {
    setDeleteError("");
    setDeleteErrorCategory("");

    setEditingCategory(category);

    setName(category.name);
    setDescription(category.description);

    setShowForm(false);
  }

  async function updateCategory(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/categories/${editingCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to update category");
        return;
      }

      resetForm();
      setEditingCategory(null);

      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteCategory(id) {
    setDeleteError("");
    setDeleteErrorCategory("");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.message);
        setDeleteErrorCategory(id);
        return;
      }

      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
  }

  function cancelEdit() {
    resetForm();
    setEditingCategory(null);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
        <div>
          <h1 className="font-serif text-5xl font-normal text-[#111827]">
            Categories
          </h1>

          <p className="font-serif text-xl text-[#4B5563] mt-2">
            Browse the available IT support categories.
          </p>
        </div>

        {role === "Technician" && !editingCategory && (
          <button
            onClick={() => {
              resetForm();
              setDeleteError("");
              setDeleteErrorCategory("");
              setShowForm(!showForm);
            }}
            className="self-start sm:self-auto bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.25)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
          >
            {showForm ? "Cancel" : "+ Create Category"}
          </button>
        )}
      </div>

      {/* Create Category Form */}
      {showForm && role === "Technician" && (
        <form
          onSubmit={createCategory}
          className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mb-8"
        >
          <div className="mb-7">
            <h2 className="font-serif text-3xl text-[#111827]">
              Create New Category
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              Add a category for IT support requests.
            </p>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows="4"
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
              placeholder="Describe this category"
            />
          </div>

          <button
            type="submit"
            className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
          >
            Create Category
          </button>
        </form>
      )}

      {/* Edit Category Form */}
      {editingCategory && role === "Technician" && (
        <form
          onSubmit={updateCategory}
          className="bg-white rounded-[22px] p-7 lg:p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)] mb-8"
        >
          <div className="mb-7">
            <h2 className="font-serif text-3xl text-[#111827]">
              Edit Category
            </h2>

            <p className="font-serif text-lg text-[#4B5563] mt-1">
              Update the category information.
            </p>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 font-sans text-sm font-bold text-[#111827]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows="4"
              className="w-full bg-[#F8FAFF] border border-[#DCE5F5] rounded-xl px-4 py-3 text-[#111827] outline-none transition-all resize-none focus:border-[#4F7DE8] focus:ring-2 focus:ring-[#4F7DE8]/15"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-[#4F7DE8] text-white font-sans font-semibold px-6 py-3 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.22)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-0.5"
            >
              Update Category
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

      {/* Categories */}
      {loading ? (
        <div className="bg-white rounded-[22px] p-8 shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <p className="font-serif text-xl text-[#4B5563]">
            Loading categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-[22px] p-10 text-center shadow-[0_8px_24px_rgba(30,64,175,0.08)]">
          <h2 className="font-serif text-3xl text-[#111827]">
            No categories yet
          </h2>

          <p className="font-serif text-lg text-[#4B5563] mt-2">
            There are currently no IT support categories available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-[22px] p-7 shadow-[0_8px_24px_rgba(30,64,175,0.08)] transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-xs font-bold text-[#4F7DE8] uppercase tracking-wider">
                    IT Support
                  </p>

                  <h2 className="font-serif text-3xl text-[#111827] mt-2">
                    {category.name}
                  </h2>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#EEF2F7]">
                <p className="font-serif text-lg text-[#4B5563] leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Technician Actions */}
              {role === "Technician" && (
                <div className="mt-6 pt-5 border-t border-[#EEF2F7]">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => startEdit(category)}
                      className="bg-[#F8FAFF] text-[#4F7DE8] border border-[#C9D8F4] font-sans font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-[#EEF4FF]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="bg-red-50 text-red-600 border border-red-200 font-sans font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>

                  {deleteError &&
                    deleteErrorCategory === category._id && (
                      <p className="text-red-600 font-sans text-sm mt-3">
                        {deleteError}
                      </p>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}