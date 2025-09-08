export default function ChatbotButton({onClick}) {
  return (
    <button
      onClick={onClick}
      className="fixed right-3 bottom-3 sm:right-4 sm:bottom-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
      >
      <img src="/icon/chatbot.png" alt="Chatbot" className="w-6 h-6 sm:w-7 sm:h-7" />
    </button>
  );
}
