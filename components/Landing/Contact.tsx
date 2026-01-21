"use client";
import React, { useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [phone, setPhone] = useState<string | undefined>(undefined);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: integrate EmailJS or backend
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-6 md:px-20 py-10">
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column – Brand Social Links */}
        <div className="flex flex-col gap-10 p-10 ">
          <h2 className="text-5xl font-serif text-[#B10E0E] font-light mb-2">
            Connect with Us
          </h2>
          <p className="text-black mb-6">
            Follow our journey, explore our collections, or reach out directly.
          </p>

          <div className="flex flex-col gap-6">
            {/* Social Icons */}
            <div className="flex gap-6">
              <a
                href="https://instagram.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B10E0E] hover:text-black text-2xl transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B10E0E] hover:text-black text-2xl transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B10E0E] hover:text-black text-2xl transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://tiktok.com/@yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B10E0E] hover:text-black text-2xl transition"
              >
                <FaTiktok />
              </a>
              <a
                href="https://linkedin.com/company/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B10E0E] hover:text-black text-2xl transition"
              >
                <FaLinkedinIn />
              </a>
            </div>

            <div className="text-gray-800 text-lg">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:contact@yourbrand.com"
                className="hover:underline"
              >
                contact@yourbrand.com
              </a>
            </div>

            <div className="text-gray-800 text-lg">
              <span className="font-semibold">Phone:</span>{" "}
              <a href="tel:+1234567890" className="hover:underline">
                +1 234 567 890
              </a>
            </div>
          </div>
        </div>

        <div className="p-10 flex flex-col gap-4 h-full justify-center">
          <div className="w-full flex flex-col">
            <h2 className="text-5xl font-serif text-[#B10E0E] font-light mb-2">
              Get in Touch
            </h2>
            <p className="text-black mb-6">
              We'd love to hear from you. Send us a message for inquiries or
              collaborations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-[#B10E0E] outline-0 focus:border-black focus:ring-0 p-3 rounded text-gray-900 placeholder-gray-400 transition"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[#B10E0E] outline-0 focus:border-black focus:ring-0 p-3 rounded text-gray-900 placeholder-gray-400 transition"
              required
            />

            <PhoneInput
              placeholder="Your Phone Number"
              value={phone}
              onChange={setPhone}
              defaultCountry="US"
              international
              countryCallingCodeEditable
              className="w-full border p-2 border-[#B10E0E] rounded"
              inputComponent={({ value, onChange, ...props }: any) => (
                <input
                  {...props}
                  value={value}
                  onChange={onChange}
                  className="w-full h-full p-1 text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-0 transition"
                />
              )}
              containerClass="h-[64px]"
              inputClass="h-full"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="border border-[#B10E0E] outline-0 focus:border-black focus:ring-0 p-4 rounded text-gray-900 placeholder-gray-400 h-40 transition"
              required
            />

            <button
              type="submit"
              className="border border-[#B10E0E] text-[#B10E0E] px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#B10E0E] cursor-pointer hover:text-white transition"
            >
              Send Message
            </button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-green-600 text-center">
              Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-red-600 text-center">
              Oops! Something went wrong.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
