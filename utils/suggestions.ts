export function getSuggestion(emotion: string) {
  if (emotion === "sad")
    return "You seem to be feeling sad. Try taking a short walk or talking to someone you trust.";

  if (emotion === "anger")
    return "It looks like you're frustrated. A few deep breaths or a short break might help.";

  if (emotion === "happy")
    return "Great! Keep doing what makes you feel good.";

  return "Try taking a few moments to relax and reflect.";
}