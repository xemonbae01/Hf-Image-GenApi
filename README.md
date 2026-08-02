# 🖼️ Hf-Image-GenApi

> **Multi-Model Hugging Face Image Generation API**  
> One prompt. Multiple AI models. Instant results.

![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Inference%20API-yellow?logo=huggingface)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Archived-red)

---

### ⚠️ Important Notice

This project was **originally coded on 09.06.2024**.

It has **not been maintained** since then.  
This repository is simply a **republication** of an old project.

**Do not expect any further updates.**

Feel free to fork it, improve it, break it, or turn it into something greater.  
The code is yours now.

---

## ✨ Features

- 🎨 **Multi-Model Generation** — Generates images from multiple Hugging Face models in one request
- ⚡ **Smart Retries & Rate Limit Handling** — Automatically retries failed requests and handles 429s
- ⏱️ **Timeout Protection** — Prevents hanging requests with proper timeouts
- 🔑 **Simple API Key Protection** — Basic authentication for the endpoint
- 🌐 **Web Interface Output** — Returns a clean HTML gallery of all generated images
- 🔥 **Quality Boost** — Automatically appends high-quality prompt enhancers
- 🎲 **Random Seed** — Different results every time

### Supported Models

| Model Name                  | Hugging Face Model                                      |
|----------------------------|---------------------------------------------------------|
| `flux`                     | black-forest-labs/FLUX.1-dev                            |
| `flux-schnell`             | black-forest-labs/FLUX.1-schnell                        |
| `stable-diffusion`         | stabilityai/stable-diffusion-3-medium-diffusers         |
| `stable-diffusion-xl`      | stabilityai/stable-diffusion-xl-base-1.0                |
| `red-cinema`               | HalimAlrasihi/red-cinema                                |
| `nsfw-xl`                  | Dremmar/nsfw-xl                                         |
| `dreamlike-photoreal`      | dreamlike-art/dreamlike-photoreal-2.0                   |
| `newrealityxl-global-nsfw` | stablediffusionapi/newrealityxl-global-nsfw             |
| `flux-80s-cyberpunk`       | fofr/flux-80s-cyberpunk                                 |
| `midjourney-v6`            | Kvikontent/midjourney-v6                                |
| `duchaiten-pony-xl`        | Niggendar/duchaitenPonyXLNo_v35                         |
| `lcm-dreamshaper-v7`       | SimianLuo/LCM_Dreamshaper_v7                            |
| `midjourney-mimic`         | sxqib/midjourney-mimic                                  |
| `cyberpunk-anime-diffusion`| DGSpitzer/Cyberpunk-Anime-Diffusion                     |

---

## 🚀 Quick Start

```bash
git clone https://github.com/xemonbae01/Hf-Image-GenApi.git
cd Hf-Image-GenApi
npm install
