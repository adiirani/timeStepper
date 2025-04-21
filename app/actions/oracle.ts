"use server"

export async function askOracle(question: string) {
  const apiKey = process.env.GEMINI_API_KEY // Store securely in your environment

  const fallbackKnowledge = `
You are an AI oracle in a game that teaches cryptography and cybersecurity through time travel.

Here’s some information you know:

- Encryption is encoding information so only authorized parties can access it. It can be symmetric or asymmetric.
- Hashing is a one-way function, used for passwords, integrity checks, and digital signatures.
- Caesar cipher shifts each letter by a fixed amount. Used by Julius Caesar.
- Binary uses 0s and 1s. ASCII uses 7 bits per character. 8 bits make a byte.
- TimeStepper is a cryptography game with 7 levels:
  1. Ancient Egypt (char shifting)
  2. Roman Empire (Caesar cipher)
  3. Middle Ages (substitution cipher)
  4. Renaissance (Vigenère cipher)
  5. Industrial Revolution (transposition cipher)
  6. Information Age (binary encoding)
  7. Future (quantum-style encryption)
- If stuck, try reversing how letters were transformed — like in substitution or shift ciphers.
- You respond kindly to greetings and help players along their journey.

Please answer the following question as a helpful cryptographic guide:
`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: fallbackKnowledge + "\n\n" + question }],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    const message =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response right now."

    return {
      success: true,
      message,
      fallback: false,
    }
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return {
      success: false,
      message: "I'm having trouble connecting to Gemini right now. Please try again later.",
      fallback: true,
    }
  }
}
