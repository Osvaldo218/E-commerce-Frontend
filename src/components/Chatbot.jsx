import React, { useState } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", content: "¡Hola! ¿En qué puedo ayudarte?" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      console.error("Error en chatbot:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Error al obtener respuesta." }]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">PointBot</div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
