import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import OpenAI from "openai";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Replace with your OpenAI API key
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/generate-animation", async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const manimCode = await generateManimCode(prompt);

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const uniqueFileName = uuidv4();
  const manimFileName = path.join(tempDir, `${uniqueFileName}.py`);
  const outputVideoFileName = path.join(
    __dirname,
    "media",
    "videos",
    uniqueFileName,
    "480p15",
    `MyAnimation.mp4`
  );
  const rootFolderToDelete = path.join(
    __dirname,
    "media",
    "videos",
    uniqueFileName
  );

  try {
    fs.writeFileSync(manimFileName, manimCode);

    // Use child_process.exec to run the manim command directly
    const manimCommand = `manim -ql --media_dir "${path.join(
      __dirname,
      "media"
    )}" "${manimFileName}" ${uniqueFileName}`;

    console.log(`Executing Manim command: ${manimCommand}`);

    exec(manimCommand, { cwd: tempDir }, async (err, stdout, stderr) => {
      if (err) {
        console.error("Manim execution error:", err);
        console.error("Manim stdout:", stdout);
        console.error("Manim stderr:", stderr);
        return res
          .status(500)
          .json({
            error: "Failed to generate animation",
            details: err.message,
          });
      }
      console.log("Manim stdout:", stdout);
      console.log("Manim stderr:", stderr);

      // Check if the video file exists before sending and uploading
      if (fs.existsSync(outputVideoFileName)) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(outputVideoFileName, {
            resource_type: "video",
            folder: "manim_animations",
          });
          console.log("Uploaded to Cloudinary:", result.secure_url);

          // Respond with Cloudinary URL
          res.json({ videoUrl: result.secure_url });

          // Clean up temporary files
          fs.rmSync(rootFolderToDelete, { recursive: true, force: true });
          fs.unlinkSync(manimFileName);
          fs.rmSync("./media/images", { recursive: true, force: true });
          fs.rmSync("./media/Tex", { recursive: true, force: true });
          fs.rmSync("./media/texts", { recursive: true, force: true });
          console.log("Cleaned up local files.");
        } catch (uploadError) {
          console.error(
            "Cloudinary upload error or file cleanup error:",
            uploadError
          );
          res
            .status(500)
            .json({
              error: "Failed to upload video or clean up files",
              details: uploadError.message,
            });
        }
      } else {
        console.error(
          "Video file not found after Manim generation:",
          outputVideoFileName
        );
        res.status(500).json({ error: "Generated video file not found" });
      }
    });
  } catch (error) {
    console.error("File write error:", error);
    res.status(500).json({ error: "Failed to write Manim code to file" });
  }
});

async function generateManimCode(prompt) {
  try {
    console.log("Generating Manim code for prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      temperature: 0,
      presence_penalty: -1,
      frequency_penalty: -1,
      stop: ["</CODE>"],
      messages: [
        {
          role: "system",
          content: `
You are a code generator.

Rules:
- You MUST output ONLY valid Python code
- The code MUST appear ONLY between <CODE> and </CODE>
- No markdown, no explanations, no comments
- No text outside these tags
- If you violate this, the output is invalid
`
        },
        {
          role: "user",
          content: `
Generate runnable Manim Python code for the following prompt:
${prompt}

Constraints:
- Only Manim is available
- Class name: MyAnimation(Scene)
- Use only basic primitives: Circle, Square, Triangle, Line, Text
- No Tex, no LaTeX, no Axes, no plots
- No 3D objects
- No external libraries
- Simple animations only: shift, move_to, scale, rotate

Return EXACTLY in this format:

<CODE>
python code here
</CODE>
`
        }
      ]
    });

    const response = completion.choices[0].message.content;

    const match = response.match(/<CODE>([\s\S]*?)<\/CODE>/);
    if (!match) {
      console.error("Invalid model output:", response);
      throw new Error("Model violated output format");
    }

    const cleanCode = match[1].trim();
    console.log(cleanCode);
    return cleanCode;

  } catch (error) {
    console.error("Error generating Manim code:", error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});