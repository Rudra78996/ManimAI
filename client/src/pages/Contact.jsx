import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import NavBar from "../components/NavBar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/chat/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        toast.success("Your message has been sent! We'll get back to you soon.");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch {
      toast.error("Failed to send message. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center ">
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        <div className="relative h-full w-full hidden dark:block bg-slate-950">
          <div className="absolute bottom-0 top-[-10%] left-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 top-[-10%] right-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>
      </div>
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center w-full gap-8 px-4">
        <div className="w-full max-w-lg bg-card rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                required
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;