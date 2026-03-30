import express, { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import { GoogleGenAI } from '@google/genai'

const router = express.Router()
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { buffer, public_id } = req.body

    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id)
    }

    console.time('upload')
    const cloud = await cloudinary.v2.uploader.upload(buffer, {
    })
    console.timeEnd('uploadend')

    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id
    })

  } catch (err: any) {
    res.status(500).json({
      message: err.message,
      success: false
    })

  }

})

// ai setup

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

router.post('/career', async (req, res) => {
  try {
    const { skills } = req.body || {};

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "skills required",
      });
    }

    const prompt = `
Based on the following skills: ${skills}.
Please act as a career advisor and generate a career path suggestion.

Return ONLY valid JSON. No markdown, no backticks.

{
  "summary": "string",
  "jobOptions": [
    {
      "title": "string",
      "responsibilities": "string",
      "why": "string"
    }
  ],
  "skillsToLearn": [
    {
      "category": "string",
      "skills": [
        {
          "title": "string",
          "why": "string",
          "how": "string"
        }
      ]
    }
  ],
  "learningApproach": {
    "title": "string",
    "points": ["string"]
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let rawText = response.text?.trim();

    if (!rawText) {
      throw new Error("Empty response from AI");
    }


    rawText = rawText.replace(/```json|```/gi, "").trim();

    // Cleanup (defensive, but minimal)
    if (rawText.startsWith('"') && rawText.endsWith('"')) {
      rawText = rawText.slice(1, -1);
    }

    rawText = rawText.replace(/```json\s*|```/gi, "").trim();

    const data = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err: any) {

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

/*
router.post('/resume-analyzer', async (req, res) => {
  try {

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume
and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance
Your entire response must be in valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:

{
"atsScore": 85,
"scoreBreakdown": {
"formatting": {
"score": 90,
"feedback": "Brief feedback on formatting"
},
"keywords": {
"score": 80,
"feedback": "Brief feedback on keyword usage"
},
"structure": {
"score": 85,
"feedback": "Brief feedback on resume structure"
},
"readability": {
"score": 88,
"feedback": "Brief feedback on readability"
}
},
"suggestions": [
{
"category": "Category name (e.g., 'Formatting', 'Content', 'Keywords',
'Structure')",
"issue": "Description of the issue found",
"recommendation": "Specific actionable recommendation to fix it",
"priority": "high/medium/low"
}
],
"strengths": [
"List of things the resume does well for ATS"
],
"summary": "A brief 2-3 sentence summary of the overall ATS performance"
}
Focus on:
- File format and structure compatibility
- Proper use of standard section headings
- Keyword optimization
- Formatting issues (tables, columns, graphics, special characters)
- Contact information placement
- Date formatting
- Use of action verbs and quantifiable achievements
- Section organization and flow
`;
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({
        message: "pdfBase64 field required"
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, "")
              }
            }
          ]
        }
      ]
    })

    let rawText =
      response.text?.trim() ||
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      throw new Error("Empty response from AI");
    }


    rawText = rawText.replace(/```json|```/gi, "").trim();

    // Cleanup (defensive, but minimal)
    if (rawText.startsWith('"') && rawText.endsWith('"')) {
      rawText = rawText.slice(1, -1);
    }


    const data = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }

}) */


const MAX_BASE64_SIZE = 5_000_000;
router.post("/resume-analyzer", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64 || typeof pdfBase64 !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing pdfBase64",
      });
    }

    if (pdfBase64.length > MAX_BASE64_SIZE) {
      return res.status(413).json({
        success: false,
        message: "File too large",
      });
    }

    const cleanBase64 = pdfBase64.replace(
      /^data:application\/pdf;base64,/,
      ""
    );

    const prompt = `
Return ONLY valid JSON. No markdown, no explanation.

{
  "atsScore": number,
  "scoreBreakdown": {
    "formatting": { "score": number, "feedback": string },
    "keywords": { "score": number, "feedback": string },
    "structure": { "score": number, "feedback": string },
    "readability": { "score": number, "feedback": string }
  },
  "suggestions": [
    {
      "category": string,
      "issue": string,
      "recommendation": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "strengths": string[],
  "summary": string
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: cleanBase64,
              },
            },
          ],
        },
      ],
    });

    let rawText =
      response?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      throw new Error("Empty response from AI");
    }

    rawText = rawText.replace(/```json|```/gi, "").trim();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("❌ Invalid JSON from AI:\n", rawText);
      throw new Error("AI returned invalid JSON");
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err: any) {
    console.error("🔥 Resume Analyzer Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

export default router;

