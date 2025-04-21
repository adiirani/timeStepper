"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LevelData {
  level: number
  js_code: string
  title?: string
  passphrase?: string
  transformedPassphrase?: string
}

interface TestResult {
  output: string
  correct: boolean
  message?: string
}

interface LevelContextType {
  currentLevel: number
  levelData: LevelData | null
  isLoading: boolean
  isSubmitting: boolean
  testResult: any
  hints: string[]
  setLevel: (level: number) => void
  testSolution: (input: string) => void
  submitSolution: (input: string) => void
  getHint: () => void
  generatePassphrase: () => void
  completedLevels: number[]
}

const LevelContext = createContext<LevelContextType | undefined>(undefined)

// Update the mock level data to include time period titles
const mockLevelData: Record<number, LevelData> = {
  1: {
    level: 1,
    title: "Ancient Egypt - 3000 BCE",
    js_code: `// The challenge involves shifting ASCII values by +2 for each character.

function shiftCharacters(inputString) {
  let output = '';
  for (let i = 0; i < inputString.length; i++) {
    let charCode = inputString.charCodeAt(i);
    // Shift the ASCII value by +2
    charCode += 2;
    output += String.fromCharCode(charCode);
  }
  return output;
}`,
  },
  2: {
    level: 2,
    title: "Roman Empire - 100 CE",
    js_code: `// This challenge involves a Caesar cipher with a shift of 3
function caesarCipher(input) {
  const shift = 3;
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    
    if (char.match(/[a-z]/i)) {
      const code = input.charCodeAt(i);
      
      if (code >= 65 && code <= 90) {
        // Uppercase letters
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase letters
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    
    result += char;
  }
  
  return result;
}`,
  },
  3: {
    level: 3,
    title: "Middle Ages - 1000 CE",
    js_code: `// This challenge involves a substitution cipher
function substitutionCipher(input) {
  const substitutionMap = {
    'a': 'm', 'b': 'n', 'c': 'o', 'd': 'p', 'e': 'q',
    'f': 'r', 'g': 's', 'h': 't', 'i': 'u', 'j': 'v',
    'k': 'w', 'l': 'x', 'm': 'y', 'n': 'z', 'o': 'a',
    'p': 'b', 'q': 'c', 'r': 'd', 's': 'e', 't': 'f',
    'u': 'g', 'v': 'h', 'w': 'i', 'x': 'j', 'y': 'k',
    'z': 'l', ' ': ' '
  };
  
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i].toLowerCase();
    result += substitutionMap[char] || char;
  }
  
  return result;
}`,
  },
  4: {
    level: 4,
    title: "Renaissance - 1500 CE",
    js_code: `// This challenge involves a Vigenère cipher
function vigenereCipher(input) {
  const key = "LEONARDO";
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    if (char.match(/[a-z]/i)) {
      const isUpperCase = char === char.toUpperCase();
      const plainChar = char.toUpperCase();
      const keyChar = key[i % key.length];
      
      // Convert to 0-25
      const plainCode = plainChar.charCodeAt(0) - 65;
      const keyCode = keyChar.charCodeAt(0) - 65;
      
      // Apply Vigenère formula
      const encryptedCode = (plainCode + keyCode) % 26;
      
      // Convert back to ASCII and maintain case
      const encryptedChar = String.fromCharCode(encryptedCode + 65);
      result += isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
    } else {
      result += char;
    }
  }
  
  return result;
}`,
  },
  5: {
    level: 5,
    title: "Industrial Revolution - 1800 CE",
    js_code: `// This challenge involves a transposition cipher
function transpositionCipher(input) {
  const numColumns = 3;
  const numRows = Math.ceil(input.length / numColumns);
  
  // Pad the input if necessary
  const paddedInput = input.padEnd(numRows * numColumns, ' ');
  
  let result = '';
  
  // Read by columns
  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const index = row * numColumns + col;
      if (index < paddedInput.length) {
        result += paddedInput[index];
      }
    }
  }
  
  return result;
}`,
  },
  6: {
    level: 6,
    title: "Information Age - 1970 CE",
    js_code: `// This challenge involves binary encoding
function binaryEncoding(input) {
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const binary = charCode.toString(2).padStart(8, '0');
    result += binary + ' ';
  }
  
  return result.trim();
}`,
  },
  7: {
    level: 7,
    title: "Future - 2100 CE",
    js_code: `// This challenge involves a quantum-inspired encryption
function quantumEncryption(input) {
  const key = 42;
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const position = i + 1;
    
    // Apply a position-dependent transformation
    const transformedCode = (charCode ^ key) + position;
    result += String.fromCharCode(transformedCode);
  }
  
  return result;
}`,
  },
}

// Update the mockHints to include hints for all levels
const mockHints: Record<number, string[]> = {
  1: [
    "Each character in the transformed string has been shifted by 2 in its value.",
    "The original characters' values are 2 less than the transformed characters.",
    "To reverse the transformation, you need to subtract 2 from the value of each character.",
  ],
  2: [
    "This is a classic Caesar cipher with a shift of 3.",
    "To decrypt, you need to shift each letter backwards by 3 positions.",
    "Remember that the shift wraps around the alphabet (z shifts to c).",
  ],
  3: [
    "This is a substitution cipher where each letter is replaced with another letter.",
    "The substitution follows a pattern where 'a' becomes 'm', 'b' becomes 'n', etc.",
    "To decrypt, you need to reverse the substitution mapping.",
  ],
  4: [
    "This is a Vigenère cipher using the key 'LEONARDO'.",
    "Each character is shifted by a different amount based on the corresponding key character.",
    "To decrypt, you need to subtract the key value from each character.",
  ],
  5: [
    "This is a transposition cipher that rearranges characters without changing them.",
    "The text is written in rows but read in columns.",
    "To decrypt, you need to reverse the process by writing in columns and reading in rows.",
  ],
  6: [
    "This is a binary encoding where each character is converted to its 8-bit binary representation.",
    "Each group of 8 bits represents one character.",
    "To decrypt, you need to convert each binary group back to its decimal value and then to ASCII.",
  ],
  7: [
    "This is a quantum-inspired encryption that uses XOR with a key and adds the position.",
    "Each character is transformed based on its position in the string.",
    "To decrypt, you need to subtract the position and then XOR with the key again.",
  ],
}

// Sample passphrases for each level
const samplePassphrases: Record<number, string[]> = {
  1: ["sphinx", "pyramid", "pharaoh", "hieroglyph", "nile", "anubis", "scarab"],
  2: ["caesar", "legion", "senate", "gladius", "forum", "empire", "colosseum"],
  3: ["knight", "castle", "plague", "crusade", "joust", "feudal", "monastery"],
  4: ["davinci", "medici", "florence", "anatomy", "perspective", "humanism", "rebirth"],
  5: ["steam", "factory", "railway", "telegraph", "industry", "coal", "machine"],
  6: ["computer", "internet", "digital", "silicon", "network", "software", "binary"],
  7: ["quantum", "nanobot", "hologram", "neural", "fusion", "biotech", "virtual"],
}

export function LevelProvider({ children }: { children: ReactNode }) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [levelData, setLevelData] = useState<LevelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [hints, setHints] = useState<string[]>([])
  const [hintIndex, setHintIndex] = useState(0)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  // Load level data when the current level changes
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newLevelData = { ...mockLevelData[currentLevel] }
      setLevelData(newLevelData)
      setHintIndex(0)
      setHints([])
      setTestResult(null)
      setIsLoading(false)

      // Generate a passphrase automatically when loading a level
      generatePassphraseForLevel(currentLevel)
    }, 1000)
  }, [currentLevel])

  const setLevel = (level: number) => {
    if (level >= 1 && level <= 7) {
      setCurrentLevel(level)
    }
  }

  const generatePassphraseForLevel = (level: number) => {
    const passphrases = samplePassphrases[level]
    const randomIndex = Math.floor(Math.random() * passphrases.length)
    const passphrase = passphrases[randomIndex]

    let transformedPassphrase = ""

    // Apply the appropriate transformation based on the level
    if (level === 1) {
      transformedPassphrase = shiftCharacters(passphrase)
    } else if (level === 2) {
      transformedPassphrase = caesarCipher(passphrase)
    } else if (level === 3) {
      transformedPassphrase = substitutionCipher(passphrase)
    } else if (level === 4) {
      transformedPassphrase = vigenereCipher(passphrase)
    } else if (level === 5) {
      transformedPassphrase = transpositionCipher(passphrase)
    } else if (level === 6) {
      transformedPassphrase = binaryEncoding(passphrase)
    } else if (level === 7) {
      transformedPassphrase = quantumEncryption(passphrase)
    }

    // Update the level data with the passphrase and its transformed version
    setLevelData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          passphrase,
          transformedPassphrase,
        }
      }
      return prevData
    })

    // Show the transformed passphrase in the test result
    setTestResult({
      output: transformedPassphrase,
      message: `Target output: ${transformedPassphrase}`,
      originalPassphrase: passphrase,
    })
  }

  const generatePassphrase = () => {
    generatePassphraseForLevel(currentLevel)
  }

  const testSolution = (input: string) => {
    // In a real app, this would call the API
    // For demo, we'll just evaluate the code
    try {
      let output = ""

      if (currentLevel === 1) {
        output = shiftCharacters(input)
      } else if (currentLevel === 2) {
        output = caesarCipher(input)
      } else if (currentLevel === 3) {
        output = substitutionCipher(input)
      } else if (currentLevel === 4) {
        output = vigenereCipher(input)
      } else if (currentLevel === 5) {
        output = transpositionCipher(input)
      } else if (currentLevel === 6) {
        output = binaryEncoding(input)
      } else if (currentLevel === 7) {
        output = quantumEncryption(input)
      }

      const targetOutput = levelData?.transformedPassphrase || ""
      const isCorrect = output === targetOutput

      setTestResult({
        output,
        correct: isCorrect,
        message: isCorrect ? "Correct! You've solved this level's challenge!" : "Not quite right. Try again!",
        originalPassphrase: levelData?.passphrase,
      })
    } catch (error) {
      setTestResult({
        output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        correct: false,
      })
    }
  }

  const submitSolution = (input: string) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Check if the input produces the same output as the target passphrase
      let output = ""
      const targetOutput = levelData?.transformedPassphrase || ""

      try {
        if (currentLevel === 1) {
          output = shiftCharacters(input)
        } else if (currentLevel === 2) {
          output = caesarCipher(input)
        } else if (currentLevel === 3) {
          output = substitutionCipher(input)
        } else if (currentLevel === 4) {
          output = vigenereCipher(input)
        } else if (currentLevel === 5) {
          output = transpositionCipher(input)
        } else if (currentLevel === 6) {
          output = binaryEncoding(input)
        } else if (currentLevel === 7) {
          output = quantumEncryption(input)
        }

        const isCorrect = output === targetOutput

        if (isCorrect) {
          setTestResult({
            correct: true,
            message: "Correct! You've solved this level's challenge!",
            output,
            originalPassphrase: levelData?.passphrase,
          })

          // Mark level as completed
          if (!completedLevels.includes(currentLevel)) {
            setCompletedLevels((prev) => [...prev, currentLevel])
          }

          // Optionally advance to the next level
          if (currentLevel < 7) {
            setTimeout(() => {
              setCurrentLevel((prev) => prev + 1)
            }, 2000)
          }
        } else {
          setTestResult({
            correct: false,
            message: "Not quite right. Try again!",
            output,
            originalPassphrase: levelData?.passphrase,
          })
        }
      } catch (error) {
        setTestResult({
          correct: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      }

      setIsSubmitting(false)
    }, 1500)
  }

  const getHint = () => {
    if (hintIndex < mockHints[currentLevel]?.length) {
      setHints((prev) => [...prev, mockHints[currentLevel][hintIndex]])
      setHintIndex((prev) => prev + 1)
    }
  }

  // Helper functions for the mock API
  function shiftCharacters(inputString: string) {
    let output = ""
    for (let i = 0; i < inputString.length; i++) {
      let charCode = inputString.charCodeAt(i)
      charCode += 2
      output += String.fromCharCode(charCode)
    }
    return output
  }

  function caesarCipher(input: string) {
    const shift = 3
    let result = ""

    for (let i = 0; i < input.length; i++) {
      let char = input[i]

      if (char.match(/[a-z]/i)) {
        const code = input.charCodeAt(i)

        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65)
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97)
        }
      }

      result += char
    }

    return result
  }

  function substitutionCipher(input: string) {
    const substitutionMap: Record<string, string> = {
      a: "m",
      b: "n",
      c: "o",
      d: "p",
      e: "q",
      f: "r",
      g: "s",
      h: "t",
      i: "u",
      j: "v",
      k: "w",
      l: "x",
      m: "y",
      n: "z",
      o: "a",
      p: "b",
      q: "c",
      r: "d",
      s: "e",
      t: "f",
      u: "g",
      v: "h",
      w: "i",
      x: "j",
      y: "k",
      z: "l",
      " ": " ",
    }

    let result = ""

    for (let i = 0; i < input.length; i++) {
      const char = input[i].toLowerCase()
      result += substitutionMap[char] || char
    }

    return result
  }

  function vigenereCipher(input: string) {
    const key = "LEONARDO"
    let result = ""

    for (let i = 0; i < input.length; i++) {
      const char = input[i]

      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase()
        const plainChar = char.toUpperCase()
        const keyChar = key[i % key.length]

        // Convert to 0-25
        const plainCode = plainChar.charCodeAt(0) - 65
        const keyCode = keyChar.charCodeAt(0) - 65

        // Apply Vigenère formula
        const encryptedCode = (plainCode + keyCode) % 26

        // Convert back to ASCII and maintain case
        const encryptedChar = String.fromCharCode(encryptedCode + 65)
        result += isUpperCase ? encryptedChar : encryptedChar.toLowerCase()
      } else {
        result += char
      }
    }

    return result
  }

  function transpositionCipher(input: string) {
    const numColumns = 3
    const numRows = Math.ceil(input.length / numColumns)

    // Pad the input if necessary
    const paddedInput = input.padEnd(numRows * numColumns, " ")

    let result = ""

    // Read by columns
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        const index = row * numColumns + col
        if (index < paddedInput.length) {
          result += paddedInput[index]
        }
      }
    }

    return result
  }

  function binaryEncoding(input: string) {
    let result = ""

    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i)
      const binary = charCode.toString(2).padStart(8, "0")
      result += binary + " "
    }

    return result.trim()
  }

  function quantumEncryption(input: string) {
    const key = 42
    let result = ""

    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i)
      const position = i + 1

      // Apply a position-dependent transformation
      const transformedCode = (charCode ^ key) + position
      result += String.fromCharCode(transformedCode)
    }

    return result
  }

  return (
    <LevelContext.Provider
      value={{
        currentLevel,
        levelData,
        isLoading,
        isSubmitting,
        testResult,
        hints,
        setLevel,
        testSolution,
        submitSolution,
        getHint,
        generatePassphrase,
        completedLevels,
      }}
    >
      {children}
    </LevelContext.Provider>
  )
}

export function useLevelContext() {
  const context = useContext(LevelContext)

  if (context === undefined) {
    throw new Error("useLevelContext must be used within a LevelProvider")
  }

  return context
}
