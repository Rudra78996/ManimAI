import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { toast } from "react-toastify";

const Home = () => {
  useEffect(() => {
    toast.info("Welcome to the Home Page!");
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <Header />
      </main>
    </div>
  );
};

export default Home;
