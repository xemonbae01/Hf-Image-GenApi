/*
HUGGING FACE IMAGE GENERATION WEB+API
CODED BY Redwan Ahemed (Xemon) 
DATE: 09-06-2024
*/

const express = require("express");

async function queryHuggingFace(prompt, modelEndpoint, seed) {
  const fetch = (await import("node-fetch")).default;
  const timeoutDuration = 120000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const response = await fetch(modelEndpoint, {
      headers: {
        Authorization: `Bearer hf_putthekeyhere`, //here put your token this is an fake example token you collect yours from highing face.
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt, seed }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face API error! Status: ${response.status}. Details: ${errorText}`
      );
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timed out for model:", modelEndpoint);
      throw new Error("Image generation timed out");
    } else {
      console.error("Error querying the model:", error);
      throw error;
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleRateLimit(error) {
  if (error.message.includes("Status: 429")) {
    console.warn("Rate limit reached. Waiting for 1 minute before retrying...");
    await delay(60000);
  } else {
    throw error;
  }
}

async function retryQueryWithTimeout(prompt, modelEndpoint, modelName, seed) {
  const modelTimeout = 120000;
  try {
    const result = await Promise.race([
      queryHuggingFace(prompt, modelEndpoint, modelName, seed),
      delay(modelTimeout).then(() => {
        throw new Error(`Timeout: Model ${modelName} took too long to respond.`);
      })
    ]);
    return result;
  } catch (error) {
    console.error(`Skipping model ${modelName} due to error:`, error.message);
    return null;
  }
}

async function queryWithRetries(prompt, modelEndpoint, modelName, seed, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await retryQueryWithTimeout(prompt, modelEndpoint, modelName, seed);
      return result;
    } catch (error) {
      await handleRateLimit(error);
      console.warn(`Retrying model ${modelName} (attempt ${attempt}/${retries})...`);
    }
  }
  console.error(`Max retries reached for model ${modelName}. Skipping.`);
  return null;
}

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "redwan"; // thought we do need some security or some mf will spam use it
// add as much as models you want from the available inference api and it uses a round robin loop so it won't fail catching the models one by one =>
const availableModels = {
  flux: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  "stable-diffusion": "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
  "red-cinema": "https://api-inference.huggingface.co/models/HalimAlrasihi/red-cinema",
  "flux-schnell": "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  "stable-diffusion-xl": "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  "nsfw-xl": "https://api-inference.huggingface.co/models/Dremmar/nsfw-xl",
  "dreamlike-photoreal": "https://api-inference.huggingface.co/models/dreamlike-art/dreamlike-photoreal-2.0",
  "newrealityxl-global-nsfw": "https://api-inference.huggingface.co/models/stablediffusionapi/newrealityxl-global-nsfw",
  "flux-80s-cyberpunk": "https://api-inference.huggingface.co/models/fofr/flux-80s-cyberpunk",
  "midjourney-v6": "https://api-inference.huggingface.co/models/Kvikontent/midjourney-v6",
  "duchaiten-pony-xl": "https://api-inference.huggingface.co/models/Niggendar/duchaitenPonyXLNo_v35",
  "lcm-dreamshaper-v7": "https://api-inference.huggingface.co/models/SimianLuo/LCM_Dreamshaper_v7",
  "midjourney-mimic": "https://api-inference.huggingface.co/models/sxqib/midjourney-mimic",
  "cyberpunk-anime-diffusion": "https://api-inference.huggingface.co/models/DGSpitzer/Cyberpunk-Anime-Diffusion"
};

app.get("/api/gen", async (req, res) => {
  let prompt = req.query.prompt;
  const apiKey = req.query.apikey;

  if (!prompt) {
    return res.status(400).send("Prompt query parameter is required");
  }

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).send("Invalid API key");
  }

  const qualityPrompts = ", (masterpiece), (best quality), (ultra-detailed), (extremely detailed CG unity 8k wallpaper), (intricate details), (hyperrealistic), (photorealistic), (lifelike), (sharp focus), (crisp details), (high resolution), (4k), (8k), (cinematic lighting), (dramatic lighting), (soft lighting), (perfect composition)";
  prompt += qualityPrompts;

  const imageBuffers = [];

  try {
    for (const [modelName, modelEndpoint] of Object.entries(availableModels)) {
      console.log(`Requesting image from model: ${modelName}`);
      const seed = Math.floor(Math.random() * 1000000);
      const imageBlob = await queryWithRetries(prompt, modelEndpoint, modelName, seed);
      
      if (imageBlob) {
        const buffer = await imageBlob.arrayBuffer();
        imageBuffers.push({ modelName, buffer: Buffer.from(buffer).toString('base64') });
      }
      
      await delay(5000);
    }

    let htmlContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }
          .frame {
            max-width: 480px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
          .image-card {
            max-width: 200px;
            margin: 10px;
            text-align: center;
          }
          .model-name {
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="frame">
          <h1>Here are all generated images</h1>
          <div class="container">
    `;

    imageBuffers.forEach((img) => {
      htmlContent += `
        <div class="image-card">
          <a href="data:image/png;base64,${img.buffer}" target="_blank">
            <img src="data:image/png;base64,${img.buffer}" alt="${img.modelName}" />
          </a>
          <div class="model-name">${img.modelName}</div>
        </div>
      `;
    });

    htmlContent += `
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).send("Error generating images");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
