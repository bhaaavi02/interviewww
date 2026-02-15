// // lib/voiceagent.ts

// let recognition: any = null;
// let voicesLoaded = false;
// let selectedVoice: SpeechSynthesisVoice | null = null;

// // Load voices properly
// function loadVoices() {
//   const voices = speechSynthesis.getVoices();

//   if (voices.length > 0) {
//     voicesLoaded = true;

//     // Prefer natural voices
//     selectedVoice =
//       voices.find(v => v.name.includes("Google US English")) ||
//       voices.find(v => v.name.includes("Microsoft")) ||
//       voices.find(v => v.lang === "en-US") ||
//       voices[0];
//   }
// }

// // Ensure voices load
// if (typeof window !== "undefined") {
//   speechSynthesis.onvoiceschanged = loadVoices;
//   loadVoices();
// }

// // SPEAK FUNCTION
// export function speak(
//   text: string,
//   onStart?: () => void,
//   onEnd?: () => void
// ) {
//   if (!text) return;

//   speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance(text);

//   utterance.voice = selectedVoice;
//   utterance.lang = "en-US";
//   utterance.rate = 0.9;
//   utterance.pitch = 1;
//   utterance.volume = 1;

//   utterance.onstart = () => {
//     console.log("AI speaking:", text);
//     onStart?.();
//   };

//   utterance.onend = () => {
//     console.log("AI finished speaking");
//     onEnd?.();
//   };

//   utterance.onerror = (e) => {
//     console.error("Speech error:", e);
//   };

//   speechSynthesis.speak(utterance);
// }

// // LISTEN
// export function startListening(onResult: (text: string) => void) {
//   const SpeechRecognition =
//     (window as any).SpeechRecognition ||
//     (window as any).webkitSpeechRecognition;

//   if (!SpeechRecognition) {
//     alert("Speech recognition not supported");
//     return;
//   }

//   recognition = new SpeechRecognition();

//   recognition.lang = "en-US";
//   recognition.continuous = false;
//   recognition.interimResults = false;

//   recognition.onresult = (event: any) => {
//     const transcript = event.results[0][0].transcript;
//     console.log("User said:", transcript);
//     onResult(transcript);
//   };

//   recognition.start();
// }

// export function stopListening() {
//   if (recognition) recognition.stop();
// }

// export const stopSpeaking = () => {
//   window.speechSynthesis.cancel();
// };

let recognition: SpeechRecognition | null = null;

export function speak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    return;
  }

  // STOP any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => {
    console.log("Speaking:", text);
    onStart?.();
  };

  utterance.onend = () => {
    console.log("Speech finished");
    onEnd?.();
  };

  utterance.onerror = (event) => {
    console.error("Speech error:", event);
    onEnd?.();
  };

  // wait slight delay (IMPORTANT FIX)
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 200);
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
}

export function startListening(onResult: (text: string) => void) {
  const SpeechRecognition =
    window.SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported");
    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("Listening...");
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    console.log("User said:", transcript);
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    console.error("Recognition error:", event.error);
  };

  recognition.start();
}

export function stopListening() {
  recognition?.stop();
}
