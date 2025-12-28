import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY||"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",
});

export const generateItinerary = async (
  destination,
  startDate,
  endDate,
  preferences = {}
) => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not set. Using mock data.");
    return generateMockItinerary(destination, startDate, endDate);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `
Generate a travel itinerary.
Return ONLY valid JSON. No markdown.

Destination: ${destination}
Dates: ${startDate} to ${endDate} (${days} days)
Budget: ${preferences.budget || "Not specified"}
Interests: ${preferences.interests?.join(", ") || "General"}

JSON FORMAT:
{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "title": "Day 1 title",
      "activities": [
        {
          "name": "Activity name",
          "time": "09:00 AM",
          "description": "Details"
        }
      ]
    }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const text = response.choices[0].message.content;
    return JSON.parse(text);
  } catch (error) {
    console.error("Groq error:", error.message);
    return generateMockItinerary(destination, startDate, endDate);
  }
};

/* ---------------- MOCK FALLBACK ---------------- */

const generateMockItinerary = (destination, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return {
    destination,
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} in ${destination}`,
      activities: [
        {
          name: "City Tour",
          time: "09:00 AM",
          description: "Explore famous landmarks",
        },
        {
          name: "Local Lunch",
          time: "01:00 PM",
          description: "Try local cuisine",
        },
        {
          name: "Cultural Visit",
          time: "04:00 PM",
          description: "Visit cultural places",
        },
        {
          name: "Dinner",
          time: "08:00 PM",
          description: "Relax and dine",
        },
      ],
    })),
  };
};
