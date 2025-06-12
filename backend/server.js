const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const { log } = require('console');

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/generate-animation', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt);
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const manimCode = await generateManimCode(prompt);

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const uniqueFileName = uuidv4();
    const manimFileName = path.join(tempDir, `${uniqueFileName}.py`);
    const outputVideoFileName = path.join(__dirname, 'media', 'videos', uniqueFileName, "480p15", `MyAnimation.mp4`);
    const rootFolderToDelete = path.join(__dirname, 'media', 'videos', uniqueFileName);

    try {
        fs.writeFileSync(manimFileName, manimCode);

        // Use child_process.exec to run the manim command directly
        const manimCommand = `manim -ql --media_dir "${path.join(__dirname, 'media')}" "${manimFileName}" ${uniqueFileName}`;
        
        console.log(`Executing Manim command: ${manimCommand}`);

        exec(manimCommand, { cwd: tempDir }, async (err, stdout, stderr) => {
            if (err) {
                console.error('Manim execution error:', err);
                console.error('Manim stdout:', stdout);
                console.error('Manim stderr:', stderr);
                return res.status(500).json({ error: 'Failed to generate animation', details: err.message });
            }
            console.log('Manim stdout:', stdout);
            console.log('Manim stderr:', stderr);

            // Check if the video file exists before sending and uploading
            if (fs.existsSync(outputVideoFileName)) {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(outputVideoFileName, {
                        resource_type: "video",
                        folder: "manim_animations"
                    });
                    console.log('Uploaded to Cloudinary:', result.secure_url);

                    // Respond with Cloudinary URL
                    res.json({ videoUrl: result.secure_url });

                    // Clean up temporary files
                    fs.rmSync(rootFolderToDelete, { recursive: true, force: true });
                    fs.unlinkSync(manimFileName);
                    console.log('Cleaned up local files.');

                } catch (uploadError) {
                    console.error('Cloudinary upload error or file cleanup error:', uploadError);
                    res.status(500).json({ error: 'Failed to upload video or clean up files', details: uploadError.message });
                }
            } else {
                console.error('Video file not found after Manim generation:', outputVideoFileName);
                res.status(500).json({ error: 'Generated video file not found' });
            }
        });

    } catch (error) {
        console.error('File write error:', error);
        res.status(500).json({ error: 'Failed to write Manim code to file' });
    }
});

async function generateManimCode(prompt) {
    const fullPrompt = `Generate Manim Python code for the following animation prompt: "${prompt}". Ensure the code is complete, runnable, and uses ONLY the most fundamental Manim functionalities. EXPLICITLY AVOID all complex features, external libraries, or advanced dependencies. This includes: 
    - NO LaTeX (use 'Text' for all text elements instead of 'Tex').
    - NO advanced graphing functions (e.g., 'ax.plot', coordinate systems).
    - NO 3D objects or complex mathematical constructs.
    - Give Class name as MyAnimation.
Focus strictly on basic primitive shapes (e.g., Circle, Square, Triangle, Line), simple movements (e.g., .shift(), .move_to()), and basic transformations like .animate.scale() or .animate.rotate(). Only return the raw Python code, without any markdown formatting, explanations, or extra text. Make sure the class name is MyAnimation and it inherits from Scene.`;
    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const code = response.text().split("```python")[1].split("```")[0];
        const cleanCode = code.replace(/```/g, '');

        console.log(cleanCode);
        return cleanCode;
    } catch (error) {
        console.error("Error generating Manim code with Gemini:", error);
        throw new Error("Failed to generate Manim code from prompt.");
    }
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});