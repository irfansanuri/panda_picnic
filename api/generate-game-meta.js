const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

function jsonResponse(status, data) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "Invalid request body.";
  const name = String(payload.name || "").trim();
  if (!name) return "Field 'name' is required.";
  if (name.length > 120) return "Field 'name' is too long.";
  return null;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function validateAiOutput(output) {
  if (!output || typeof output !== "object") {
    return "AI output is not an object.";
  }

  const type = String(output.type || "")
    .trim()
    .toLowerCase();
  const typeLabel = String(output.typeLabel || "").trim();
  const emoji = String(output.emoji || "").trim();
  const description = String(output.description || "").trim();

  const validType = ["card", "board", "outdoor"].includes(type);
  if (!validType) return "AI output has invalid 'type'.";
  if (!typeLabel) return "AI output missing 'typeLabel'.";
  if (!emoji) return "AI output missing 'emoji'.";
  if (!description) return "AI output missing 'description'.";

  return null;
}

async function generateWithOpenAI(name) {
  const prompt = [
    "Generate metadata for a picnic game/activity name.",
    "Return strict JSON only with keys: emoji, description, type, typeLabel.",
    "Rules:",
    "- type must be one of: card, board, outdoor",
    "- typeLabel should be concise Indonesian label for the type",
    "- emoji must be a single most-appropriate emoji",
    "- description must be one short natural Indonesian sentence (max 100 chars) tailored to the given name",
    `Game name: ${name}`,
  ].join("\n");

  const response = await fetch(OPENAI_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON with fields emoji, description, type, typeLabel.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `OpenAI request failed (${response.status}): ${text.slice(0, 300)}`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  const parsed = safeParseJson(content);

  if (!parsed) {
    throw new Error("AI returned non-JSON content.");
  }

  const validationError = validateAiOutput(parsed);
  if (validationError) {
    throw new Error(validationError);
  }

  return {
    emoji: String(parsed.emoji).trim(),
    description: String(parsed.description).trim(),
    type: String(parsed.type).trim().toLowerCase(),
    typeLabel: String(parsed.typeLabel).trim(),
  };
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is not configured." });
    }

    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const name = String(req.body.name).trim();
    const meta = await generateWithOpenAI(name);
    return res.status(200).json(meta);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Unknown server error." });
  }
};
