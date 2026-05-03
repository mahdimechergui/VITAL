const axios = require('axios');
require('dotenv').config();

const GROQ_KEY = process.env.GROQ_API_KEY;

async function queryGroq(systemPrompt, userPrompt, jsonFormat = false) {
  const options = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
  };
  
  if (jsonFormat) {
    options.response_format = { type: "json_object" };
  }

  const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', options, {
    headers: {
      Authorization: `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].message.content;
}

async function runTests() {
  if (!GROQ_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY is not defined in .env");
    return;
  }
  console.log("🟢 Starting AI Agent Tests using GROQ_API_KEY...");

  try {
    console.log("\n=================================");
    console.log("🤖 TEST 1: ARCHITECT AGENT");
    console.log("=================================");
    const architectSystem = "You are an AI Architect for a university club. Respond only in JSON.";
    const architectUser = `Task: Given an event idea, suggest: title, date, room, budget_tnd, recommendations.
Idea: A small React workshop
Participants: 20
Return JSON format: {"title": "", "date": "", "room": "", "budget_tnd": 0, "recommendations": []}`;
    
    console.log("Sending prompt to Groq...");
    const architectRes = await queryGroq(architectSystem, architectUser, true);
    console.log("✅ ARCHITECT RESPONSE (Parsed JSON):");
    console.log(JSON.parse(architectRes));

    console.log("\n=================================");
    console.log("📚 TEST 2: ARCHIVIST AGENT");
    console.log("=================================");
    const archivistSystem = "You are an AI Archivist for a club. You retrieve historical information. Answer concisely.";
    const archivistUser = "What is the typical budget for a programming workshop based on past data?";
    
    console.log("Sending prompt to Groq...");
    const archivistRes = await queryGroq(archivistSystem, archivistUser);
    console.log("✅ ARCHIVIST RESPONSE:");
    console.log(archivistRes);

    console.log("\n=================================");
    console.log("📢 TEST 3: LIAISON AGENT");
    console.log("=================================");
    const liaisonSystem = "You are an AI Liaison for a club. You draft professional and engaging announcements. Keep it short.";
    const liaisonUser = "Draft a quick 2-sentence Slack announcement for our upcoming React workshop this Friday.";
    
    console.log("Sending prompt to Groq...");
    const liaisonRes = await queryGroq(liaisonSystem, liaisonUser);
    console.log("✅ LIAISON RESPONSE:");
    console.log(liaisonRes);

    console.log("\n✅ ALL TESTS COMPLETED SUCCESSFULLY. connection is stable.");
  } catch (e) {
    console.error("\n❌ ERROR DURING TESTS:", e.message);
    if (e.response && e.response.data) {
      console.error(JSON.stringify(e.response.data, null, 2));
    }
  }
}

runTests();
