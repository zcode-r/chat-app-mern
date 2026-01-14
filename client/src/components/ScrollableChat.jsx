import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/chatprovider";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ScrollableChat = ({ messages, setMessages }) => {
  const { user } = ChatState();
  const toast = useToast();

  const deleteHandler = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/message/${id}`, config);

      setMessages(messages.filter((m) => m._id !== id));

      toast({
        title: "Message Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to delete the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
            
            {/* 1. Logic for Other Users (Avatar) */}
            {/* ✅ FIX: Changed user._id to user.id */}
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            {/* 2. Logic for Current User (Delete Icon) */}
            {/* ✅ FIX: Changed user._id to user.id */}
            {m.sender._id === user.id && (
              <DeleteIcon
                color="red.500"
                cursor="pointer"
                mr={2}
                boxSize={3}
                onClick={() => {
                   if(window.confirm("Are you sure you want to delete this message?")) {
                       deleteHandler(m._id)
                   }
                }}
              />
            )}

            {/* 3. The Message Bubble */}
            <span
              style={{
                backgroundColor: `${
                  // ✅ FIX: Changed user._id to user.id
                  m.sender._id === user.id ? "#BEE3F8" : "#B9F5D0"
                }`,
                // ✅ FIX: Changed user._id to user.id
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>

          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;