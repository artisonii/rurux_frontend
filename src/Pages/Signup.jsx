import { Box, Button, Flex, Grid, Heading, Input, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config'
import { useToast } from '@chakra-ui/react'

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const toast = useToast()
    const signup = async (url, obj) => {
        try {
            const res = await axios.post(url + "/user/signup", obj)
            toast({
                position: 'top',
                title: res.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            navigate("/login")
        } catch (error) {
            toast({
                position: 'top',
                title: error.response?.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const handleSignup = (e) => {
        e.preventDefault()
        signup(serverUrl, { email, password, name })
    }

    return (

        <Box>
            <Flex justifyContent={"center"} alignItems={"center"} h={"90vh"}>
                <Grid gridTemplateColumns={"1fr 1fr"} maxW={"1200px"} margin={"auto"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 0px 10px"} borderRadius={"10px"}>
                    <Box>
                        <img src="https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-photographs-of-unmanned-bookstores-in-the-library-image_785535.jpg" alt="" width={"90%"} />
                    </Box>
                    <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDir={"column"}
                    >
                        <Heading fontSize={"2rem"} p={3} textAlign={"center"} color={"blackAlpha.700"}>Signup Here</Heading>

                        <Flex flexDir={"column"} gap={"10px"} padding={5} w={"100%"}  >
                            <form onSubmit={handleSignup}>
                                <Flex flexDir={"column"} gap={"10px"} padding={5} maxW={"450px"} m={"auto"}>
                                    <Input placeholder='Name' size='md' type='text' required value={name} onChange={(e) => setName(e.target.value)} />
                                    <Input placeholder='Email' size='md' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} />

                                    <Input placeholder='Password' size='md' type='password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <Button type='submit'>Sign up</Button>
                                    <Text color={"gray.600"} pl={1} _hover={{ cursor: "pointer" }}>Already a registed student? <b color={"gray.900"}
                                        fontWeight={500} display={"inline"} onClick={() => navigate("/login")} _hover={{ color: "red.400", cursor: "pointer" }}>Login Now</b></Text>
                                </Flex>
                            </form>
                        </Flex>
                    </Flex>
                </Grid>
            </Flex>
        </Box>
    )
}

export default Signup