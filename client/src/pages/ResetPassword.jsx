import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ FIX: Changed useHistory to useNavigate
import { Box, Button, FormControl, FormLabel, Input, useToast, VStack, Text } from "@chakra-ui/react";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // ✅ FIX: const history = useHistory() is now const navigate = useNavigate()
  const { token } = useParams();
  const toast = useToast();

  const submitHandler = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Ensure this URL matches your backend port (usually 8000 or 5000)
      await axios.put(`http://127.0.0.1:8000/api/user/resetpassword/${token}`, { password }, config);

      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      navigate("/"); // ✅ FIX: history.push("/") is now navigate("/")
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Token expired or invalid",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" w="100%" h="100vh" bgGradient="linear(to-r, blue.200, blue.500)">
      <Box bg="white" p={8} borderRadius="lg" w={{ base: "90%", md: "40%" }} boxShadow="lg">
        <VStack spacing={4}>
          <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">Set New Password</Text>
          <FormControl id="password">
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirm-password">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" w="100%" onClick={submitHandler} isLoading={loading}>
            Update Password
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ResetPassword;