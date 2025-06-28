import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "@/assets/Animation.json";

const Loader = () => {
  const container = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => anim.destroy();
  }, []);

  return <div ref={container} className="w-40 h-40 mx-auto" />;
};

export default Loader;
