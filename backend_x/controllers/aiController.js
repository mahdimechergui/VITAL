const axios = require("axios");

// POST /ai/architect
const architectAgent = async (req, res) => {
  try {
    const { idea, participants } = req.body;

    if (!idea) {
      return res.status(400).json({
        message: "Idea is required"
      });
    }

    // 🧠 Prompt (the brain of your agent)
    const prompt = `
You are an AI Architect for a university club.

Task:
Given an event idea, suggest:

1. Best date (avoid exam periods generally assume mid-semester). MUST BE A STRICT FUTURE DATE STRING in YYYY-MM-DD format (e.g. "2026-11-15").
2. Best room at ISSATKR (classroom / lab / amphitheater)
3. Estimated budget in TND
4. Suggestions to improve the event

Event:
- Idea: ${idea}
- Participants: ${participants || 30}

Return JSON only:
{
  "title": "",
  "suggested_date": "2026-11-15",
  "room": "",
  "budget_tnd": "",
  "recommendations": []
}
`;

    // 🤖 Call AI (Groq example - fast & free tier friendly)
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a helpful AI event planner. You must respond in valid JSON ONLY." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 📦 AI response text
    const aiText = response.data.choices[0].message.content;

    return res.status(200).json({
      message: "Architect plan generated",
      data: JSON.parse(aiText)
    });

  } catch (error) {
    return res.status(500).json({
      message: "AI Architect error",
      error: error.message
    });
  }
};

// POST /ai/liaison
const liaisonAgent = async (req, res) => {
  try {
    const { event, audience, tone } = req.body;

    if (!event) {
      return res.status(400).json({
        message: "Event is required"
      });
    }

    // 🧠 Prompt for marketing AI
    const prompt = `
You are a Marketing & Branding AI for a university club.

Task: Generate marketing content for the event.

Event: ${event}
Audience: ${audience || "students"}
Tone: ${tone || "professional"}

Return ONLY JSON:
{
  "instagram_caption": "",
  "sponsor_email": {
    "subject": "",
    "body": ""
  },
  "color_palette": ["", "", ""]
}

Rules:
- Instagram caption must be engaging and short
- Email must be professional for sponsors
- Colors must match tech/cyber style (blue, neon, dark, etc.)
`;

    // 🤖 Call Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a creative marketing assistant. You must respond ONLY in valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    return res.status(200).json({
      message: "Liaison content generated",
      data: JSON.parse(aiText)
    });

  } catch (error) {
    return res.status(500).json({
      message: "Liaison Agent error",
      error: error.message
    });
  }
};

const { readExcelFile } = require("../services/excelService");

// POST /ai/ingest-excel
const ingestExcel = async (req, res) => {
  try {
    const data = readExcelFile("./data/dataset.xlsx");

    const documents = data.map((row) => {
      return Object.entries(row).map(([k, v]) => `${k}: ${v}`).join("\n");
    });

    // هنا لاحقًا تبعثهم لـ vector DB
    console.log(documents);

    return res.json({
      message: "Excel ingested successfully",
      count: documents.length
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

// POST /ai/archivist
const archivistAgent = async (req, res) => {
  try {
    const { question } = req.body;
    console.log(`🔍 Archivist hit with question: "${question}"`);

    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const words = question.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
    
    let results = [];
    
    // 1. Fetch Events from Supabase
    const { data: events } = await supabase.from('events').select('*');
    if (events && words.length > 0) {
      events.forEach(e => {
        const text = JSON.stringify(e).toLowerCase();
        const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
        if (score > 0) results.push({ row: e, score });
      });
    }

    // 2. Fetch Sponsors from Supabase
    const { data: sponsors } = await supabase.from('sponsors').select('*');
    if (sponsors && words.length > 0) {
      sponsors.forEach(s => {
        const text = JSON.stringify(s).toLowerCase();
        const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
        if (score > 0) results.push({ row: s, score });
      });
    }

    // Sort and format the best matching rows
    results = results.sort((a, b) => b.score - a.score).map(r => r.row);
    console.log(`🎯 Search results: ${results.length} matches found in Supabase.`);

    const context = results.slice(0, 10).map(row => {
        return Object.entries(row).map(([k, v]) => `${k}: ${v}`).join("\n");
    }).join("\n\n");

    // 🤖 AI call
    const axios = require("axios");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are the Archivist AI of a university club. Answer the user politely. Use the provided context to answer factually. If the context is empty or lacks the answer, use your general knowledge but clarify that you couldn't find specific club records in the Supabase database."
          },
          {
            role: "user",
            content: `
Context:
${context || 'No specific club records found in database.'}

Question:
${question}
            `
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`🤖 AI Answer length: ${response.data.choices[0].message.content.length}`);

    return res.json({
      answer: response.data.choices[0].message.content,
      used_data: results.length
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {
  architectAgent,liaisonAgent, ingestExcel, archivistAgent
};