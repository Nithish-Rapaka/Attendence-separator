import React from "react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-6">About the Project</h2>

        {/* Intro */}
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          The <span className="font-semibold">Attendance Letter Generation System</span> 
          is a web application designed to automate and simplify the process of 
          creating attendance letters for faculty members. This system helps save 
          time, reduces manual errors, and ensures that all letters are generated 
          in a consistent and professional format.
        </p>

        {/* Optional additional description */}
        <p className="text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Faculty can easily select the required dates, generate letters automatically, 
          and download them instantly. This project streamlines administrative tasks 
          and improves overall efficiency in managing attendance documentation.
        </p>
      </div>
    </section>
  );
}
