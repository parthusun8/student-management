import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, FormControl, Select, TextField, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function Subjects() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setid] = useState(searchParams.get("id"));
    const [dept_name, setdept_name] = useState(searchParams.get("dept"));
    const [subjects, setSubjects] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [newData, setNewData] = useState({
        type: "theory"
    });

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleDelete = async (row) => {
        // Handle delete action for the given ID
        console.log("Delete", row);
        await axios
            .delete("http://localhost:4000/api/subjects/" + row.id + "/")
            .then((res) => {
                console.log("Delete Successfull");
                setSubjects(
                    subjects.filter((subject) => subject.id !== row.id)
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [newsubjectNo, setNewSubjectNo] = useState("");

    const handleAdd = async () => {
        // Handle add action
        const d = {
            subject_name: newData.subject_name,
            subject_code: newData.subject_code,
            credits: parseInt(newData.credits),
            type: newData.type,
            semester_no: parseInt(newData.semester_no),
            dept_no: parseInt(id),
        };
        console.log(d);
        await axios.post("http://localhost:4000/api/subjects/", d).then((res) => {
            console.log(res.data);
            setSubjects([...subjects, res.data]);
            closeModal();
        }
        ).catch((err) => {
            console.log(err);
        }
        );
    };

    useEffect(() => {
        async function fetchData() {
            await axios.get("http://localhost:4000/api/departments/" + id + "/subjects/").then((res) => {
                console.log(res.data);
                setSubjects(res.data);
            }).catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, []);
    return (
        <>
            <h1 className='ml-[30px] mt-10 py-5'>Department - {dept_name}</h1>
            <Button variant="contained" onClick={openModal} style={{ marginLeft: "30px" }}>Add Subject</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Subject Name</TableCell>
                            <TableCell align="center">Subject Code</TableCell>
                            <TableCell align="center">Credits</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Part Of(Semester)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.subject_name}</TableCell>
                                <TableCell align="center">{row.subject_code}</TableCell>
                                <TableCell align="center">{row.credits}</TableCell>
                                <TableCell align="center">{row.type}</TableCell>
                                <TableCell align="center">{row.semester_no}</TableCell>
                                <TableCell align="center">
                                    {/* <Button variant="outlined" onClick={() => editModalOpen(row)}>Edit</Button> */}
                                    <Button variant="outlined" onClick={() => handleDelete(row)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <FormControl>
                    <TextField id="Subject_name" name='Subject_name' label="Subject Name" variant="outlined" onChange={e => setNewData({ ...newData, "subject_name": e.target.value })} />
                    <TextField id="Subject_code" name='Subject_code' label="Subject Code" variant="outlined" onChange={e => setNewData({ ...newData, "subject_code": e.target.value })} />
                    <TextField id="credits" name='credits' label="Credits" variant="outlined" onChange={e => setNewData({ ...newData, "credits": e.target.value })} />
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={newData.type}
                        label="Age"
                        onChange={(e) => setNewData({ ...newData, "type": e.target.value })}
                    >
                        <MenuItem value={"theory"}>Theory</MenuItem>
                        <MenuItem value={"lab"}>Lab</MenuItem>
                    </Select>
                    <TextField id="semester_no" name='semester_no' label="Semester No" variant="outlined" onChange={e => setNewData({ ...newData, "semester_no": e.target.value })} />
                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                    <Button variant="contained" onClick={closeModal}>Cancel</Button>
                </FormControl>
            </Modal>
        </>
    );
}

export default Subjects