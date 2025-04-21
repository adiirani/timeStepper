// This would be a real API service in a production app
// For now, we'll use mock data

export async function fetchLevel(levelId: number) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        level: levelId,
        js_code: `// Level ${levelId} code would be here`,
      })
    }, 1000)
  })
}

export async function testSolution(levelId: number, input: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        output: `Transformed: ${input}XYZ`,
        correct: false,
      })
    }, 1000)
  })
}

export async function submitSolution(levelId: number, input: string) {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (input === "correct") {
        resolve({
          status: "correct",
          message: "You solved it!",
        })
      } else {
        reject({
          status: "incorrect",
          message: "Try again!",
        })
      }
    }, 1500)
  })
}

export async function fetchHint(levelId: number) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hint: `This is hint for level ${levelId}`,
      })
    }, 500)
  })
}
