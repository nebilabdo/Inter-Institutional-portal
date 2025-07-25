"use client";

export function AboutUs() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A6D6D6] to-white overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#a6f59bff] rounded-full blur-[150px] opacity-30"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-200 rounded-full blur-[160px] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a6f59bff] rounded-full blur-[200px] opacity-20"></div>
        <div className="absolute top-1/3 right-[10%] w-[300px] h-[300px] bg-[#d9d9ff] rounded-full blur-[100px] opacity-25"></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          About Us
        </h2>

        {/* <p className="text-base font-medium text-indigo-500 uppercase tracking-wide mb-10">
          Who we are & what we do
        </p> */}

        <div
          className="backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl px-6 py-10 text-left"
          style={{ backgroundColor: "#e1f7eaff" }}
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            
           We help government institutions share data and work better together.

Our platform is designed to make information exchange fast, safe, and easy. Instead of using paper or long processes, institutions can now send and receive information in a few clicks.

We currently work with 23 public institutions that offer many different services. By connecting them in one digital system, we help reduce delays, improve service quality, and support better decision-making.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Our goal is to support transparency, efficiency, and collaboration between institutions. We believe that when data flows better, services improve — and that means better results for people and communities.


          </p>
        </div>
      </div>
    </section>
  );
}
