import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/cards/InfoCard";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import FinanceOverview from "../../components/dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/dashboard/Last30DaysExpenses";
import RecentIncome from "../../components/dashboard/RecentIncome";
import RecentIncomeWithChart from "../../components/dashboard/RecentIncomeWithChart";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chatbot states
  const [userQuery, setUserQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; 
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setUserQuery("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) setDashboardData(response.data);
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Simple markdown-like formatter ---
  const formatResponse = (text) => {
    if (!text) return "";
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formatted = formatted.replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, "<li>$1</li>");
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }
    formatted = formatted.replace(/\n/g, "<br />");
    return formatted;
  };

  const handleAskGpt = async () => {
    if (!userQuery.trim() || isAsking) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setIsAsking(true);

    // Add user message immediately
    const newUserMsg = { role: "user", text: userQuery, time: timestamp };
    setChatHistory((prev) => [...prev, newUserMsg].slice(-5));

    try {
      const response = await axiosInstance.post(API_PATHS.ASSISTANT.ASK_GPT, {
        query: userQuery,
      });

      const text = response.data.response;
      const formatted = formatResponse(text);
      const newBotMsg = {
        role: "assistant",
        text: formatted,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, newBotMsg].slice(-5));
    } catch (error) {
      console.log("Error asking GPT:", error);
      const fallback =
        "⚠️ Sorry, I couldn’t process your question right now.";
      const newBotMsg = {
        role: "assistant",
        text: fallback,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, newBotMsg].slice(-5));
    } finally {
      setUserQuery("");
      setIsAsking(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Dashboard Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          />
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>

      {/* Floating Chatbot Popup */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Toggle Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬
        </button>

        {/* Chat Popup */}
        {showChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="font-semibold text-gray-800">Financial Assistant</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-grow overflow-y-auto max-h-64 mb-3 bg-gray-50 rounded p-2 space-y-3">
              {chatHistory.length === 0 && !isAsking && (
                <p className="text-sm text-gray-400 italic">
                  Ask me anything about your finances...
                </p>
              )}
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  <span className="text-[10px] text-gray-400 mt-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              {isAsking && (
                <div className="flex justify-start items-center text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Thinking...
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title="Voice Input"
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>

              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={
                  isListening ? "Listening..." : "Type your question..."
                }
                className="border border-gray-300 rounded px-3 py-2 flex-grow text-sm focus:outline-none focus:border-blue-400"
                disabled={isAsking || isListening}
              />
              <button
                onClick={handleAskGpt}
                disabled={isAsking || !userQuery.trim()}
                className={`px-3 py-2 rounded text-sm text-white ${
                  isAsking || !userQuery.trim()
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isAsking ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
