import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiFetch from "../services/api";

export default function NutritionChat({ plan }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "X-FIT Nutrition Assistant online. Ask me about your meals, macros, calories, protein, hydration or your current nutrition protocol.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --------------------------------------------------
  // CHECK BROWSER VOICE SUPPORT
  // --------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    // You can change this to "en-IN" if you mostly speak Indian English.
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setMessage(finalTranscript.trim());
      } else if (interimTranscript) {
        setMessage(interimTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // AUTO SCROLL CHAT
  // --------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // --------------------------------------------------
  // SPEAK AI RESPONSE
  // --------------------------------------------------

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // --------------------------------------------------
  // STOP AI VOICE
  // --------------------------------------------------

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  // --------------------------------------------------
  // START / STOP MICROPHONE
  // --------------------------------------------------

  const toggleListening = () => {
    if (!voiceSupported) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error(
        "Could not start microphone:",
        error
      );
    }
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const sendMessage = async (customMessage = null) => {
    const text = (
      customMessage !== null
        ? customMessage
        : message
    ).trim();

    if (!text || loading) {
      return;
    }

    // Stop listening if microphone is active
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch(
        "/nutrition/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Nutrition assistant unavailable."
        );
      }

      const reply =
        data.reply ||
        "I could not generate a response.";

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
        },
      ]);

      // Automatically speak AI response
      speakText(reply);
    } catch (error) {
      console.error(
        "Nutrition chat error:",
        error
      );

      const errorMessage =
        "Nutrition system connection failed. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --------------------------------------------------
  // QUICK QUESTION
  // --------------------------------------------------

  const askQuickQuestion = (question) => {
    setMessage(question);
  };

  // --------------------------------------------------
  // CLOSE CHAT
  // --------------------------------------------------

  const closeChat = () => {
    setOpen(false);

    if (listening) {
      recognitionRef.current?.stop();
    }

    stopSpeaking();
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      {/* ============================================
          FLOATING NUTRITION BUTTON
      ============================================ */}

      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{
            scale: 1.06,
            boxShadow:
              "0 0 35px rgba(204,255,0,0.35)",
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            fixed
            bottom-7
            right-7
            z-[80]
            w-16
            h-16
            rounded-full
            bg-[#ccff00]
            text-black
            font-black
            border
            border-[#ccff00]
            shadow-[0_0_25px_rgba(204,255,0,0.25)]
            flex
            items-center
            justify-center
          "
        >
          <span className="text-xl">
            ✦
          </span>

          <span
            className="
              absolute
              -top-1
              -right-1
              w-3
              h-3
              rounded-full
              bg-cyan-400
              shadow-[0_0_12px_#00d9ff]
            "
          />
        </motion.button>
      )}

      {/* ============================================
          CHAT WINDOW
      ============================================ */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            className="
              fixed
              bottom-6
              right-6
              z-[90]
              w-[calc(100vw-32px)]
              sm:w-[430px]
              h-[650px]
              max-h-[calc(100vh-48px)]
              rounded-[28px]
              overflow-hidden
              border
              border-[#ccff00]/20
              bg-[#050505]/95
              backdrop-blur-2xl
              shadow-[0_0_80px_rgba(204,255,0,0.12)]
              flex
              flex-col
            "
          >
            {/* ========================================
                HEADER
            ======================================== */}

            <div
              className="
                relative
                px-5
                py-4
                border-b
                border-white/10
                bg-black/60
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-[#ccff00]/[0.025]
                "
              />

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      border
                      border-[#ccff00]/30
                      bg-[#ccff00]/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span className="text-[#ccff00]">
                      ✦
                    </span>
                  </div>

                  <div>
                    <p
                      className="
                        text-white
                        font-black
                        tracking-wide
                        text-sm
                      "
                    >
                      NUTRITION ASSISTANT
                    </p>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-1
                      "
                    >
                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-[#ccff00]
                          shadow-[0_0_8px_#ccff00]
                        "
                      />

                      <span
                        className="
                          text-[9px]
                          text-[#ccff00]
                          tracking-[0.2em]
                        "
                      >
                        SYSTEM ONLINE
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeChat}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-white/10
                    text-white/50
                    hover:text-white
                    hover:border-white/30
                    transition
                  "
                >
                  ×
                </button>
              </div>
            </div>

            {/* ========================================
                CURRENT PLAN
            ======================================== */}

            {plan && (
              <div
                className="
                  px-5
                  py-3
                  border-b
                  border-white/5
                  bg-[#ccff00]/[0.025]
                "
              >
                <div
                  className="
                    grid
                    grid-cols-3
                    gap-2
                  "
                >
                  <MiniStat
                    label="KCAL"
                    value={
                      plan.daily_calories
                    }
                  />

                  <MiniStat
                    label="PROTEIN"
                    value={`${plan.protein_grams}G`}
                  />

                  <MiniStat
                    label="FATS"
                    value={`${plan.fats_grams}G`}
                  />
                </div>
              </div>
            )}

            {/* ========================================
                VOICE STATUS
            ======================================== */}

            {(listening || speaking) && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                className="
                  px-5
                  py-2
                  border-b
                  border-white/5
                  bg-black/80
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {listening ? (
                    <>
                      <span
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-red-500
                          animate-pulse
                        "
                      />

                      <span
                        className="
                          text-[9px]
                          text-red-400
                          tracking-[0.2em]
                          font-bold
                        "
                      >
                        LISTENING...
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-cyan-400
                          animate-pulse
                        "
                      />

                      <span
                        className="
                          text-[9px]
                          text-cyan-400
                          tracking-[0.2em]
                          font-bold
                        "
                      >
                        SPEAKING...
                      </span>

                      <button
                        onClick={stopSpeaking}
                        className="
                          ml-2
                          text-[8px]
                          px-2
                          py-1
                          rounded-md
                          border
                          border-white/10
                          text-white/50
                          hover:text-white
                        "
                      >
                        STOP
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================
                MESSAGES
            ======================================== */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-4
                py-5
                space-y-4
              "
            >
              {messages.map(
                (item, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex ${
                      item.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-[85%]
                        rounded-2xl
                        px-4
                        py-3
                        text-sm
                        leading-relaxed
                        ${
                          item.role === "user"
                            ? "bg-[#ccff00] text-black font-medium"
                            : "bg-white/[0.045] border border-white/10 text-[#c8ccc4]"
                        }
                      `}
                    >
                      <div>
                        {item.text}
                      </div>

                      {/* SPEAK BUTTON FOR EACH AI MESSAGE */}

                      {item.role ===
                        "assistant" && (
                        <button
                          onClick={() =>
                            speaking
                              ? stopSpeaking()
                              : speakText(
                                  item.text
                                )
                          }
                          className="
                            mt-2
                            text-[9px]
                            text-[#ccff00]/70
                            hover:text-[#ccff00]
                            transition
                            flex
                            items-center
                            gap-1
                          "
                        >
                          {speaking
                            ? "■ STOP"
                            : "🔊 SPEAK"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              )}

              {/* LOADING */}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="
                      bg-white/[0.045]
                      border
                      border-white/10
                      rounded-2xl
                      px-4
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        gap-1
                      "
                    >
                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-[#ccff00]
                          animate-bounce
                        "
                      />

                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-[#ccff00]
                          animate-bounce
                          [animation-delay:120ms]
                        "
                      />

                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-[#ccff00]
                          animate-bounce
                          [animation-delay:240ms]
                        "
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ========================================
                QUICK QUESTIONS
            ======================================== */}

            <div
              className="
                px-4
                pb-2
                flex
                gap-2
                overflow-x-auto
              "
            >
              {[
                "How much protein?",
                "What should I eat?",
                "Improve my diet",
              ].map(
                (question) => (
                  <button
                    key={question}
                    onClick={() =>
                      askQuickQuestion(
                        question
                      )
                    }
                    className="
                      shrink-0
                      text-[10px]
                      px-3
                      py-2
                      rounded-full
                      border
                      border-white/10
                      text-[#9ba097]
                      hover:border-[#ccff00]/40
                      hover:text-[#ccff00]
                      transition
                    "
                  >
                    {question}
                  </button>
                )
              )}
            </div>

            {/* ========================================
                INPUT AREA
            ======================================== */}

            <div
              className="
                p-4
                border-t
                border-white/10
                bg-black/60
              "
            >
              <div
                className="
                  flex
                  gap-2
                "
              >
                {/* TEXT INPUT */}

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder={
                    listening
                      ? "Listening..."
                      : "Ask your nutrition system..."
                  }
                  rows={1}
                  className="
                    flex-1
                    resize-none
                    rounded-xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-4
                    py-3
                    text-sm
                    text-white
                    placeholder:text-white/25
                    outline-none
                    focus:border-[#ccff00]/40
                    transition
                  "
                />

                {/* MICROPHONE */}

                <button
                  onClick={
                    toggleListening
                  }
                  disabled={
                    loading ||
                    !voiceSupported
                  }
                  title={
                    voiceSupported
                      ? listening
                        ? "Stop listening"
                        : "Speak"
                      : "Voice input not supported"
                  }
                  className={`
                    relative
                    w-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    transition
                    border
                    ${
                      listening
                        ? "bg-red-500 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.35)]"
                        : "bg-white/[0.04] text-[#ccff00] border-white/10 hover:border-[#ccff00]/40 hover:bg-[#ccff00]/10"
                    }
                    ${
                      !voiceSupported
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {listening ? (
                    <span className="text-lg">
                      ■
                    </span>
                  ) : (
                    <span className="text-lg">
                      🎙
                    </span>
                  )}

                  {listening && (
                    <span
                      className="
                        absolute
                        inset-0
                        rounded-xl
                        border
                        border-red-400
                        animate-ping
                        opacity-30
                      "
                    />
                  )}
                </button>

                {/* SEND */}

                <button
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    loading ||
                    !message.trim()
                  }
                  className="
                    w-12
                    rounded-xl
                    bg-[#ccff00]
                    text-black
                    font-black
                    disabled:opacity-30
                    transition
                    hover:shadow-[0_0_20px_rgba(204,255,0,0.25)]
                  "
                >
                  →
                </button>
              </div>

              {/* VOICE HINT */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mt-2
                "
              >
                <p
                  className="
                    text-[8px]
                    text-white/20
                    tracking-[0.12em]
                  "
                >
                  🎙 SPEAK • 🔊 LISTEN
                </p>

                <p
                  className="
                    text-[8px]
                    text-white/20
                    tracking-[0.15em]
                  "
                >
                  X-FIT NUTRITION INTELLIGENCE
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==================================================
// MINI STAT
// ==================================================

function MiniStat({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-white/5
        bg-white/[0.025]
        px-3
        py-2
      "
    >
      <p
        className="
          text-[7px]
          tracking-[0.18em]
          text-white/30
        "
      >
        {label}
      </p>

      <p
        className="
          text-xs
          font-black
          text-[#ccff00]
          mt-1
        "
      >
        {value}
      </p>
    </div>
  );
}