import {
  MessageSquareCode,
  FunctionSquare,
  RefreshCcw,
  Share,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareCode,
    title: "AI-Powered Prompt to Animation",
    description:
      "Describe any math concept in plain English and watch it transform into a vivid animation — all powered by AI.",
  },
  {
    icon: FunctionSquare,
    title: "Visualize Math Concepts Instantly",
    description:
      "From simple graphs to complex equations, ManimAI creates accurate, interactive visuals that make learning intuitive.",
  },
  {
    icon: RefreshCcw,
    title: "Real-Time Previews and Edits",
    description:
      "Tweak your prompt, regenerate animations, and explore different versions — all in real-time with just one click.",
  },
  {
    icon: Share,
    title: "Export and Share Anywhere",
    description:
      "Download videos for classes, slides, or social media — or embed them directly into your platform or website.",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto mt-20">
      <h2 className="text-5xl font-semibold text-center mb-8">Features</h2>
      <p className="w-full text-center text-lg text-foreground/60 max-w-2xl mx-auto mb-12">
        Discover how ManimAI brings your math ideas to life with <br />AI-generated
        animations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <feature.icon className="text-indigo-500 w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
