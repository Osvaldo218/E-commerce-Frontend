/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "../styles/Chatbot.css";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "¡Hola! ¿En qué puedo ayudarte?" }]);
  const [input, setInput] = useState("");

  // Manejar envío de mensajes
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario al chat
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("https://ecommerce-backend-eohg.onrender.com/api/chatbot", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Hubo un error, intenta más tarde." }]);
    }

    setInput("");
  };

  return (
    <>
      {/* Botón flotante */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <MessageCircle size={24} />
      </button>

      {/* Chatbot */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>PointBot</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
