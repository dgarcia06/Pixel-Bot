"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Button, TextField } from "@mui/material";
import { marked } from "marked";

export default function Home() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! I am your AI assistant for gaming related questions. How can I help you today?" }]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { role: "user", content: userInput }]);
    setUserInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let messageContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        messageContent += chunk;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: messageContent,
            };
          } else {
            updatedMessages.push({ role: "assistant", content: messageContent });
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: "Failed to get a response. Please try again later." }]);
    }
  };

  const formatText = (text) => {
    return marked(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="calc(100vh - 7vh)" 
      bgcolor="#131515"
    >
      <Box
        flexGrow={1}
        overflow="auto"
        width="100%"
        p={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.role === "assistant" ? "flex-start" : "flex-end"}
            mb={2}
          >
            <Box
              className={'chat-bubble ' + (msg.role === "assistant" ? "chat-bubble-assistant" : "chat-bubble-user")}
              border={`2px solid ${msg.role === "assistant" ? "#99ff83" : "#FF8343"}`}
              borderRadius={16}
              p={2}
              maxWidth="80%"
            >
              <Box
                component="div"
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
              />
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        display="flex"
        gap={2}
        p={2}
        width="100%"
        bgcolor="#09152b"
        component="footer"
      >
        <TextField
          label="Message"
          fullWidth
          value={userInput}
          onChange={handleInputChange}
          variant="outlined"
          onKeyDown={handleKeyDown} 
          sx={{
            borderColor: "#035cc2", // color for the TextField
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: "#99ff88", // color for the TextField
              },
              '&:hover fieldset': {
                borderColor: "#FF8343", // color when hovered
              },
              // text when inputting message
              '& input': {
                color: "white",
              },
              '&.Mui-focused fieldset': {
                borderColor: "#FF8343", // color when focused
              },
            },
            '& .MuiFormLabel-root': {
              color: "#99ff88", // label color
              '&.Mui-focused': {
                color: "#FF8343", // label color when focused
              },
            },
          }}
        />
        <Button
  variant="contained"
  onClick={handleSendMessage}
  sx={{
    bgcolor: "#09152b",
    border: "2px solid #99ff88",
    color: "white",
    '&:hover': {
      bgcolor: "#09152b",
      border: "2px solid #FF8343",
    },
  }}
>
  Send
</Button>
      </Box>
    </Box>
  );
}
