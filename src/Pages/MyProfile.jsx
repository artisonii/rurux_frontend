import React, { useContext, useEffect, useState } from 'react'
import { serverUrl } from '../config';
import axios from 'axios';
import { AuthReducer } from '../Context/AuthReducer';
import { Box, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react';
import ChartPie from '../components/ChartPie';


const MyProfile = () => {
    const [data, setData] = useState({})
    const { authContext } = useContext(AuthReducer);
    const getData = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${authContext.token}`,
                    'Content-Type': 'application/json'
                }
            });

            setData(res.data.data);
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        let newUrl = serverUrl + "/students/myProfile";
        getData(newUrl);
    }, []);
    return (

        <Flex flexDir={"column"} gap={"10px"}>
            <Box>
                <Heading>My Profile</Heading>
            </Box>

            <Box border={"2px solid gray"} p={"20px 50px"} borderRadius={"20px"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                    <Image src={"https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} />
                </Flex>


                <Grid gridTemplateColumns={"1fr 1fr"} w={"600px"} >
                    <Box textAlign={"left"}>
                        <Text fontSize={"1.4rem"}>Name : {data.name}</Text>
                        <Text fontSize={"1.4rem"}>Year : {data.year || "Not updated"}</Text>
                        <Text fontSize={"1.4rem"}>Stream : {data.stream || "Not updated"}</Text>
                        {
                            data.subjects?.length > 0 && (
                                data.subjects.map((e, ind) => {
                                    return <Text fontSize={"1.4rem"} key={ind}>{e.name}: {e.score}</Text>
                                })
                            )
                        }
                    </Box>

                    <Box w={"200px"}>
                        <ChartPie data={data?.subjects} />
                    </Box>
                </Grid>
            </Box>

        </Flex>



    )
}

export default MyProfile