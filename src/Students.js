import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { Button, Input, Select, MenuItem, Typography } from '@mui/material';
import Modal from 'react-modal';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';

function Students() {
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

    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setid] = useState(searchParams.get("id"));
    const [dept_id, setdept_id] = useState(searchParams.get("dept_id"));
    const [section, setSection] = useState(searchParams.get("section"));
    const [dept_name, setdept_name] = useState(searchParams.get("dept"));

    const [studentData, setStudentData] = useState([]);

    const [newData, setNewData] = useState({});

    const [modalIsOpen, setIsOpen] = useState(false);
    const [selected1, setSelected1] = useState(0);
    const [selected2, setSelected2] = useState(0);

    function openModal() {
        setIsOpen(true);
    }


    function closeModal() {
        setIsOpen(false);
    }
    const [modal2IsOpen, setIsOpen2] = useState(false);

    function openModal2() {
        setIsOpen2(true);
    }


    function closeModal2() {
        setIsOpen2(false);
    }

    useEffect(() => {
        async function fetchData() {
            await axios.get("http://localhost:4000/api/sections/" + id + "/students/").then((res) => {
                console.log(res.data);
                setStudentData(res.data.sort((a, b) => a.regdno - b.regdno));
            }).catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, [id]);

    const handleDelete = async (regdno) => {
        await axios.delete("http://localhost:4000/api/students/" + regdno + "/").then((res) => {
            console.log(res.data);
            setStudentData(studentData.filter((student) => student.regdno !== regdno));
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleUpload = async () => {
        const file = newData.file;
        const formData = new FormData();
        formData.append("file", file);
        await axios.post("http://localhost:4000/api/upload/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res.data["details"]);
            setStudentData([...studentData, ...res.data["details"]]);
            closeModal2();
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleAdd = async () => {
        const a = {
            "name": newData.name,
            "email": newData.email,
            "section_id": id,
            "dept_no": dept_id,
            "current_semester": parseInt(newData.curr_sem)
        };
        console.log(a);
        await axios.post("http://localhost:4000/api/students/", a).then((res) => {
            console.log(res.data);
            setStudentData([...studentData, res.data]);
            closeModal();
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
        <div className="flex flex-col">
            <h1 className='ml-[30px] mt-5 py-2'>Department - {dept_name}</h1>
            <h1 className='ml-[30px] py-2'>Section - {section}</h1>

            <div className='flex flex-row gap-[60px] ml-5 justify-items-start'>
                <Button variant='contained' onClick={openModal}>Add Student</Button>
                <Button variant='contained' onClick={openModal2}>Add Multiple Students</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">RegdNo</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Current Semester</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentData.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell align="center">
                                    <Link to={`/scores?student=${row.regdno}&name=${row.name}`}>
                                        {row.regdno}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.current_semester}</TableCell>
                                <TableCell align="center">
                                    <Button variant='contained' onClick={() => handleDelete(row.regdno)}>
                                        Delete
                                    </Button>
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
                    <TextField id="student_name" name='student_name' label="Student Name" variant="outlined" onChange={e => setNewData({ ...newData, name: e.target.value })} />
                    <TextField id="email" name='email' label="Email" variant="outlined" onChange={e => setNewData({ ...newData, email: e.target.value })} />
                    <TextField id="current_sem" name='current_sem' label="current_sem" variant="outlined" onChange={e => setNewData({ ...newData, curr_sem: e.target.value })} />
                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                    <Button variant="contained" onClick={closeModal}>Cancel</Button>
                </FormControl>
            </Modal>
            <Modal
                isOpen={modal2IsOpen}
                onRequestClose={closeModal2}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <FormControl>
                    <Input type="file" name="file" onChange={e => setNewData({ ...newData, file: e.target.files[0] })} />
                    <Button variant="contained" onClick={handleUpload}>Add</Button>
                </FormControl>
            </Modal>

            <FormControl className='flex flex-row gap-6'>
                <Typography>
                    Select Students for comparison
                </Typography>
                <Select 
                labelId="demo-simple-select-helper-label"
                    label="student1"
                    id="demo-simple-select-helper"
                    className='w-[200px]'
                    onChange={(e) => setSelected1(e.target.value)}
                >
                    {
                        studentData.map((row, i) => (
                            <MenuItem value={row.regdno} className='p-5'>{row.name}</MenuItem>
                        ))
                    }
                </Select>
                <Select labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Student2"
                    className='w-[200px]'
                    onChange={(e) => setSelected2(e.target.value)}
                >
                    {
                        studentData.map((row, i) => (
                            <MenuItem value={row.regdno}>{row.name}</MenuItem>
                        ))
                    }
                </Select>
                <Link to={`/compare?id1=${selected1}&id2=${selected2}`}>
                    <Button variant='contained'>Compare</Button>
                </Link>
            </FormControl>
        </div>
    );
}

export default Students;