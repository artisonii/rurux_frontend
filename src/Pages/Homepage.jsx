import { serverUrl } from '../config';
import axios from 'axios';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Button,
    useDisclosure,
    Text,
    CloseButton,
    Heading,
    Grid,
} from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Flex,
    Input,
    Select,
} from '@chakra-ui/react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { AuthReducer } from '../Context/AuthReducer';


const Homepage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({});
    const { authContext } = useContext(AuthReducer);
    const [formData, setFormData] = useState(editData);
    const [deleteId, setDeleteId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const cancelRef = React.useRef()
    const [error, setError] = useState(null);
    const [subjectState, setSubjectState] = useState({})
    const [subjectStateArray, setSubjectStateArray] = useState([])

    const getData = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${authContext.token}`,
                    'Content-Type': 'application/json'
                }
            });
            setError(null)
            setData(res.data.students);
            console.log(res)
        } catch (error) {
            setError(error.response?.data.message)
        }
    };

    const patchData = async (url, obj) => {
        try {
            console.log(url, obj)
            const res = await axios.patch(url, obj, {
                headers: {
                    "Authorization": `Bearer ${authContext.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res) {
                setRefresh(!refresh);
                onClose();
            }
            setError(null)
        } catch (error) {
            console.log(error)
            setError(error.response?.data.message)
        }
    };

    const deleteData = async (url, obj) => {
        try {
            const res = await axios.delete(url, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res) {
                setRefresh(!refresh);
                onClose();
            }
            setError(null)
        } catch (error) {
            setError(error.response?.data.message)
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id)
    }

    const handleForm = (e) => {
        e.preventDefault();
        console.log(formData)
        console.log(editData, subjectState)
        const { _id } = formData
        patchData(serverUrl + "/students/update/" + _id, { ...formData, subjects: subjectStateArray })
    };

    const handleFormInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubjectInput = (e) => {
        const { name, value } = e.target;
        setSubjectState({ ...subjectState, [name]: value });

    };
    useEffect(() => {
        const convertedArray = Object.entries(subjectState).map(([name, score]) => ({
            name,
            score
        }));
        setSubjectStateArray(convertedArray)
    }, [subjectState])

    useEffect(() => {
        setFormData(editData);
        if (editData?.subjects) {
            const subjectsObject = editData?.subjects?.reduce((obj, item) => {
                obj[item.name] = item.score;
                return obj;
            }, {});
            setSubjectState(subjectsObject)
        }


    }, [editData]);
    useEffect(() => {
        if (formData.stream !== editData.stream) {
            setSubjectState({})
        } else {
            if (editData?.subjects) {
                const subjectsObject = editData?.subjects?.reduce((obj, item) => {
                    obj[item.name] = item.score;
                    return obj;
                }, {});
                setSubjectState(subjectsObject)
            }
        }
    }, [formData])

    useEffect(() => {
        let newUrl = serverUrl + "/students/getAllStudents";
        getData(newUrl);
    }, [refresh]);

    return (
        <Box m={"10px"}>
            {error && (
                <Alert status="error" variant="solid" mb={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <CloseButton onClick={() => setError(null)} position="absolute" right="8px" top="8px" />
                </Alert>
            )}
            <Box>
                <Heading>Student dashboard</Heading>
            </Box>
            <TableContainer mt={"20px"}>
                <Table variant='striped' colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>Sr. No.</Th>
                            <Th>Name</Th>
                            <Th>Year</Th>
                            <Th>Stream</Th>
                            <Th>Subjects</Th>
                            <Th>Edit</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            data.map((ele, ind) => {
                                return <tr key={ind}>
                                    <td>{ind + 1}</td>
                                    <td>{ele.name}</td>
                                    <td>{ele.year ? ele.year : "Not set"}</td>
                                    <td>{ele.stream ? ele.stream : "Not set"}</td>
                                    <td>{ele?.subjects?.length > 0 ? ele?.subjects?.map((e) => {
                                        return <div>
                                            <span>{e.name}</span> - <span>{e.score}</span>
                                        </div>
                                    }) : "Not set"}</td>
                                    <Td>
                                        <Button onClick={() => { setEditData(ele); onOpen(); }} colorScheme='green'>Edit/Delete</Button>
                                    </Td>
                                </tr>
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent padding={"10px 0"}>
                    <ModalHeader textAlign={"center"} fontSize={"1.5rem"}>Edit Student's Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleForm}>
                            <Flex flexDir={"column"} gap={"15px"} padding={"10px 15px"} maxW={"450px"} m={"auto"}>
                                <Input placeholder='Name' name='name' size="lg" type='text' required value={formData.name} onChange={handleFormInput} />
                                {/* <Input placeholder='Author' name='year' size="lg" type='text' required value={formData.year} onChange={handleFormInput} /> */}
                                <Select name='year' size="lg" value={formData?.year} onChange={handleFormInput}>
                                    <option value="">Select Year</option>
                                    <option value="First Year">First Year</option>
                                    <option value="Second Year">Second Year</option>
                                    <option value="Third Year">Third Year</option>
                                    <option value="Forth Year">Forth Year</option>
                                </Select>

                                <Select name='stream' size="lg" value={formData?.stream} onChange={handleFormInput}>
                                    <option value="">Select Stream</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </Select>

                                {formData.stream === "Science" && (
                                    <Box >
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Maths Marks
                                            </Text>
                                            <Input placeholder='Maths' name='maths' size="lg" type='number' required value={subjectState.maths || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Physics Marks
                                            </Text>
                                            <Input placeholder='Physics' name='physics' size="lg" type='number' required value={subjectState.physics || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Chemistry Marks
                                            </Text>
                                            <Input placeholder='Chemistry' name='chemistry' size="lg" type='number' required value={subjectState.chemistry || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                    </Box>
                                )}

                                {formData.stream === "Commerce" && (
                                    <Box >
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Economics Marks
                                            </Text>
                                            <Input placeholder='Economics' name='economics' size="lg" type='number' required value={subjectState.economics || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Accountancy Marks
                                            </Text>
                                            <Input placeholder='Accountancy' name='accountancy' size="lg" type='number' required value={subjectState.accountancy || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Business Studies Marks
                                            </Text>
                                            <Input placeholder='Business Studies' name='businessStudies' size="lg" type='number' required value={subjectState.businessStudies || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                    </Box>
                                )}

                                {formData.stream === "Arts" && (
                                    <Box >
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                History Marks
                                            </Text>
                                            <Input placeholder='History' name='history' size="lg" type='number' required value={subjectState.history || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Sociology Marks
                                            </Text>
                                            <Input placeholder='Sociology' name='sociology' size="lg" type='number' required value={subjectState.sociology || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                        <Grid gridTemplateColumns={"1fr 1fr"}>
                                            <Text textAlign={"center"} fontSize={"1.2rem"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                Psychology Marks
                                            </Text>
                                            <Input placeholder='Psychology' name='psychology' size="lg" type='number' required value={subjectState.psychology || ""} onChange={handleSubjectInput} />
                                        </Grid>
                                    </Box>
                                )}

                                <Button type='submit'>Edit Student</Button>
                                <Button colorScheme='blue' onClick={onClose}>
                                    Go back
                                </Button>
                            </Flex>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <>
                <AlertDialog
                    isOpen={delIsOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={delOnClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Book
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={delOnClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={() => { deleteData(serverUrl + "/books/delete/" + deleteId); delOnClose() }} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>

        </Box>
    );
};

export default Homepage;