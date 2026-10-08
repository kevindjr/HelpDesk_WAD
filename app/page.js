"use client";

export default function Welcome() {
  function chooseRole(role) {
    localStorage.setItem("helpdeskRole", role);
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-6xl md:text-7xl text-[#111827] leading-tight">
          Campus IT Helpdesk
        </h1>

        <p className="font-serif text-2xl md:text-3xl text-[#4B5563] mt-4">
          Submit and Track IT Support Tickets
        </p>

        <div className="mt-12">
          <h2 className="font-serif text-2xl md:text-3xl text-[#111827]">
            Select your role to continue
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => chooseRole("Student")}
              className="bg-[#4F7DE8] text-white font-sans px-8 py-4 rounded-full shadow-[0_6px_16px_rgba(79,125,232,0.25)] transition-all duration-200 hover:bg-[#3B66D0] hover:-translate-y-1 min-h-12"
            >
              Continue as Student
            </button>

            <button
              onClick={() => chooseRole("Technician")}
              className="bg-white/80 text-[#4F7DE8] font-sans px-8 py-4 rounded-full border border-[#4F7DE8] transition-all duration-200 hover:bg-white hover:-translate-y-1 min-h-12"
            >
              Continue as Technician
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}