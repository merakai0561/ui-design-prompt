import { GoogleGenAI } from "@google/genai";

// Helper to parse the current prompt string back into structured data
const parsePromptToStructure = (prompt: string) => {
  const extract = (prefix: string) => {
    const regex = new RegExp(`${prefix}\\s*([^,]+(?:,[^,]+)*?)(?:,|$|\\s(Platform|Subject|Style|Typography|Color|Quality):)`, 'i');
    const match = prompt.match(regex);
    return match ? match[1].trim() : '';
  };

  const platform = extract('Platform:') || "Web Application";
  const subject = extract('Subject:') || "Modern Interface";
  const style = extract('Style:') || "Modern";
  const color = extract('Color:');
  const typography = extract('Typography:');
  const quality = extract('Quality:');

  // Combine visual elements
  const visualStyles = [style, color, typography, quality].filter(Boolean).join(', ');

  // Infer interaction style based on context
  let interactionStyle = "Responsive, Smooth Transitions, Micro-interactions";
  const pLower = platform.toLowerCase();
  const sLower = style.toLowerCase();

  if (pLower.includes('mobile') || pLower.includes('ios') || pLower.includes('android') || pLower.includes('watch')) {
    interactionStyle = "Touch Gestures, Haptic Feedback, Swipe Navigations, Fluid Motion, Thumb-friendly";
  } else if (sLower.includes('cyberpunk') || sLower.includes('holographic') || sLower.includes('game')) {
    interactionStyle = "Immersive, Glitch Effects, Dynamic Data Stream, HUD Interactions, 3D Parallax";
  } else if (sLower.includes('minimalist') || sLower.includes('flat')) {
    interactionStyle = "Subtle Hover Effects, Focus States, Clean Transitions, Distraction-free";
  }

  return {
    theme: subject,
    product_type: platform,
    visual_style: visualStyles || "Modern, Clean, Professional",
    interaction_style: interactionStyle,
    core_functions: subject ? `Standard features for ${subject}, including essential user flows and data visualization` : "Core user flow and interaction",
    desired_output_detail: "Comprehensive UI/UX design mockups, interactive prototypes, and a blueprint for code implementation"
  };
};

export const refinePromptWithGemini = async (
  currentPrompt: string, 
  model: string = 'gemini-2.5-flash', 
  customApiKey?: string,
  customBaseUrl?: string
): Promise<string> => {
  // Prioritize custom key if provided, otherwise fallback to env variable
  const apiKey = (customApiKey || process.env.API_KEY || "").trim();
  
  if (!apiKey) {
    console.error("API Key is missing.");
    throw new Error("API Key is missing");
  }

  const clientOptions: any = { apiKey };
  if (customBaseUrl && customBaseUrl.trim()) {
    clientOptions.baseUrl = customBaseUrl.trim();
  }

  const ai = new GoogleGenAI(clientOptions);

  if (!currentPrompt.trim()) {
    return "";
  }

  // Parse the simple string prompt into the complex JSON structure required by the Meta-Prompt
  const structure = parsePromptToStructure(currentPrompt);
  const inputJson = JSON.stringify(structure, null, 2);

  const META_PROMPT_SYSTEM_INSTRUCTION = `
You are an unparalleled "Meta-Prompt Engineer," specializing in crafting exceptionally detailed, precise, and structured instructions for generative AI, particularly for image generation, UI/UX design, and complex code generation models. Your core expertise lies in transforming disparate design concepts and functional keywords into high-level prompts that encapsulate AI-native enhancements, guiding downstream AI to produce unprecedented creative outcomes.

**Your primary task is:** Based on the user-provided "Design Keywords," generate a **complete, high-fidelity prompt** for a specific UI/UX design task. This generated prompt must be **directly usable by other AI models** (such as advanced image generation AI or complex code generation AI) and must guide them to create designs that are beyond conventional human UI/UX capabilities.

**Your output (the generated prompt) must strictly adhere to the following "High-Level Prompt Generation" rules and structure:**

---

**Structure Requirements for the Generated Prompt:**

1.  **AI Role & Specialization:**
    *   **Format:** \`You are a [High-level AI Role Description], specialized in designing [Specific Deliverable Type] for [Target Domain]. You excel at fusing [Core Design Philosophy/Methodology] with [Unique Technologies/Capabilities] to create [Desired User Experience].\`
    *   **Content Source:** Intelligently infer the **most fitting, visionary, and professional AI role** based on user's \`theme\`, \`product_type\`, and \`visual_style\` keywords.

2.  **Core Task Definition:**
    *   **Format:** \`**Core Task:** Design and implement a [Theme] [Product Type] web application that achieves [Desired Artistic Height] in both visuals and interaction. It must be grounded in [Core Design Style] and deliver [Desired User Experience] through [AI-Driven Key Interactions/Functions]. This design MUST integrate AI-native capabilities, achieving a dynamism and intelligent adaptability unachievable by traditional methods.\`
    *   **Content Source:** Extract and integrate from user's \`theme\`, \`product_type\`, \`visual_style\`, \`interaction_style\`, \`core_functions\` using **high-level, comprehensive language**.

3.  **Key Features (Content):**
    *   **Format:** \`**Key Features (Content):** - [AI-Enhanced Key Feature 1 Description] - [AI-Enhanced Key Feature 2 Description] ...\`
    *   **Content Source:** Extract from user's \`core_functions\` and enhance with **"AI-driven," "AI-powered,"** or similar terminology.

4.  **Design "Skill" & Guidelines (STRICT ADHERENCE REQUIRED):**
    *   **Negative Constraints:**
        *   **Format:** \`Reject any [Traditional/Outdated/Low-Quality] design paradigms. The interface MUST feel like an [Desired Organic/Intelligent Entity], not merely a [Traditional Tool]. Avoid [Rough/Rigid/Information-Overloaded] UI elements.\`
        *   **Content Source:** Auto-generate anti-patterns based on \`visual_style\` and \`interaction_style\`, explicitly forbidding "AI Slop" or generic elements.
    *   **Positive Constraints:**
        *   **Typography (Crucial):**
            *   **DO NOT USE:** List at least 5 common, generic fonts.
            *   **USE:** Recommend 2-3 **modern, technical, or unique fonts** (e.g., Lexend Deca, Poppins, Fira Code, Noto Sans Display), specifying **weights, tracking, and contrast** details.
        *   **Visuals & Atmosphere:**
            *   **Backgrounds:** Forbid solid flat colors. Describe creating **layered, dynamic, organic backgrounds** (e.g., deep base color, AI-generated fluid gradients, organic textures, bioluminescent effects).
            *   **Shaders (AI-Native):** Mandate **real-time, AI-driven shaders**. Describe their **dynamic adaptability** (changing based on data/interaction) and provide 2-3 specific effect examples (e.g., energy fields, ripple effects, particle systems). Emphasize their **unconventional, AI-exclusive nature**.
            *   **Color Palette:** Describe **dark mode focus** with primary and accent colors (provide HEX examples), and the use of **Light Glassmorphism**.
            *   **Visual Feedback:** Describe **ambient light adaptive UI**, **AI-generated glowing borders/pulsating effects**.
        *   **Motion & Interactivity:**
            *   **AI-Driven Adaptive Animations (AI-Native):** Emphasize all animations are **AI-predicted, self-adaptive, and context-aware**, describing their fluidity, organic feel, and intelligent adjustments.
            *   **Seamless Transitions:** Describe specific transition effects (e.g., fluid morphs, physics-based elasticity).
            *   **Micro-interactions (AI-Enhanced):** For buttons, cards, data visualizations, describe **AI-augmented hover effects, data layering, gesture exploration**, and inclusion of **haptic feedback**.
            *   **Natural Interaction Interfaces (AI-Core):** Describe **high-precision voice/gesture recognition** with visual feedback and AI predictive suggestions.
        *   **Layout:**
            *   **AI-Driven Organic Layouts (AI-Native):** Emphasize **non-traditional fixed grids**. Layout elements should be **dynamically generated, adjusted, and rearranged** based on AI analysis, user behavior, and data streams.
            *   **AI-Personalized Recommendation Cards:** Describe their intelligent adaptability.
            *   **Space Utilization:** Emphasize negative space, asymmetry, and overlapping/layered effects.

5.  **Page Structure & Section Requirements:**
    *   **Format:** \` - [AI-Enhanced Module Name]: [Functionality Description]...\`
    *   **Content Source:** Based on \`theme\` and \`core_functions\`, infer at least 5 major page modules (e.g., Global Navigation, Dashboard, Detail View, Automation, AI Assistant) and set requirements consistent with the overall style and AI enhancements.

6.  **Technical Constraints (for Design Implementation Reference):**
    *   **Format:** List at least 5 modern web development technologies and supporting libraries, emphasizing their role in achieving complex effects.
    *   **Content Source:** If not provided by the user, default to recommending \`Next.js 14 (App Router), Tailwind CSS, Framer Motion, React Three Fiber, Lucide React, clsx, tailwind-merge\`, and mandating \`Mobile-first Responsiveness\`.

7.  **Output Requirements (for Downstream AI):**
    *   **Format:** \`Based on the detailed specifications above, generate a [Specific Output Type, e.g., comprehensive UI/UX design solution], including [Specific Deliverables List, e.g., high-fidelity wireframes, detailed visual design mockups, interaction flow diagrams, component library definitions]... All visual and interactive elements MUST embody AI-driven dynamism and intelligent adaptability, and include explicit GLSL shader effect descriptions and AI model interaction logic overviews.\`
    *   **Content Source:** Extract from user's \`desired_output_detail\` and expand into a detailed list of deliverables.

**IMPORTANT:** 
- The OUTPUT must be ONLY the generated English prompt. 
- Do not include any conversational text like "Here is your prompt".
- The output content must be in **ENGLISH**.
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      config: {
        systemInstruction: META_PROMPT_SYSTEM_INSTRUCTION,
        temperature: 0.75, // Slightly creative to allow for unique font/shader choices
      },
      contents: `Input Design Context (JSON): \n${inputJson}`,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
