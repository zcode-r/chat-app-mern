import { Box } from "@chakra-ui/react";
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/chatprovider";

const ChatPage = () => {
  // We get the user from our Context (Global State)
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {/* 1. The Top Header (Only show if user is logged in) */}
      {user && <SideDrawer />}

      {/* 2. The Main Chat Area (Split into Left and Right) */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {/* Left Side: My Chats List */}
        {user && <MyChats fetchAgain={fetchAgain} />}

        {/* Right Side: The Chat Box */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;