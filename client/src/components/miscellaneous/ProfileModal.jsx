import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  FormControl,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/chatprovider"; // Import Context
import axios from "axios";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: loggedInUser, setUser } = ChatState(); // Get currently logged in user
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // 1. Cloudinary Upload Logic (Same as Signup)
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // Check your preset name!
      data.append("cloud_name", "draq5gqvd");

      fetch("https://api.cloudinary.com/v1_1/draq5gqvd/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // ✅ Force HTTPS
          setPic(data.secure_url.toString());
          setLoading(false);
          toast({
            title: "Image Uploaded Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image (jpeg or png)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  // 2. The Update Logic (Calls your new Backend Route)
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/user/profile",
        {
          name: user.name, // Keep existing name
          pic: pic,        // Send NEW picture
        },
        config
      );

      // Update Local Storage so the change sticks on refresh
      localStorage.setItem("userInfo", JSON.stringify(data));
      // Update Global State
      setUser(data);
      
      setLoading(false);
      toast({
        title: "Profile Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      onClose(); // Close modal
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="450px"> {/* Increased height slightly */}
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>

            {/* 👇 ONLY SHOW THIS IF IT IS ME (The Logged In User) */}
            {(user._id === loggedInUser._id || user.id === loggedInUser.id) && (
               <VStack spacing={3} width="100%">
                  <FormControl id="pic">
                    <Input
                      type="file"
                      p={1.5}
                      accept="image/*"
                      onChange={(e) => postDetails(e.target.files[0])}
                    />
                  </FormControl>
                  <Button
                    colorScheme="teal"
                    onClick={handleUpdate}
                    isLoading={loading}
                    width="100%"
                  >
                    Update Picture
                  </Button>
               </VStack>
            )}

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;