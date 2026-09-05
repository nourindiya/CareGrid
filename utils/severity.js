const highSeverity = ["chest pain", "difficulty breathing", "severe bleeding", "stroke"];

function checkSeverity(problem) {
  const lower = problem.toLowerCase();
  return highSeverity.some((p) => lower.includes(p)) ? "admission" : "visit";
}

module.exports = checkSeverity;