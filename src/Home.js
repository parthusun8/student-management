import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, FormControl, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-modal';

function Home() {

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

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }


    function closeModal() {
        setIsOpen(false);
    }
    const [editModal, seteditModal] = useState(false);

    function editModalOpen(row) {
        setNewDepartmentNo(row.dept_no);
        setPrevDepartmentNo(row.dept_no);
        setNewDepartmentName(row.dept_name);
        seteditModal(true);
    }


    function editModalClose() {
        seteditModal(false);
    }


    const [departments, setDepartments] = useState([]);
    var onlyOnce = 1;

    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [newDepartmentNo, setNewDepartmentNo] = useState(-1);
    const [prevDepartmentNo, setPrevDepartmentNo] = useState(-1);

    useEffect(() => {
        console.log("Fetching data");
        async function fetchData() {
            axios.get("http://localhost:4000/api/departments/").then((res) => {
                console.log(res.data);
                setDepartments(res.data.sort((a, b) => a.dept_no - b.dept_no));
                onlyOnce = 0;
            }).catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, [onlyOnce]);

    const handleEdit = async () => {
        // Handle edit action for the given ID

        await axios.put("http://localhost:4000/api/departments/" + prevDepartmentNo + "/", {
            dept_no: newDepartmentNo,
            dept_name: newDepartmentName
        }).then((res) => {
            setNewDepartmentName("");
            setNewDepartmentNo(0);
            seteditModal(false);
        });
    };

    const handleDelete = async (row) => {
        // Handle delete action for the given ID
        console.log('Delete', row);
        await axios.delete("http://localhost:4000/api/departments/" + row.dept_no + "/").then((res) => {
            console.log("Delete Successfull");
            setDepartments(departments.filter((department) => department.dept_no !== row.dept_no));
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleAdd = async () => {
        // Handle add action
        if (departments.some((department) => department.dept_no === newDepartmentNo)) {
            alert("Department with the given ID already exists");
        } else {
            await axios.post("http://localhost:4000/api/departments/", {
                dept_name: newDepartmentName,
                dept_no: newDepartmentNo
            }).then((res) => {
                console.log(res);
                setDepartments([...departments, res.data].sort((a, b) => a.dept_no - b.dept_no));
                closeModal();
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    return (
        <>
            <Button variant="contained" onClick={openModal}>Add Department</Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Department No</TableCell>
                            <TableCell align="center">Department Name</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((row) => (
                            <TableRow key={row.dept_no}>
                                <TableCell align="center">
                                    <Link to={`/departments?id=${row.dept_no}&dept=${row.dept_name}`}>
                                        {row.dept_no}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{row.dept_name}</TableCell>
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
                    <TextField id="dept_no" name='dept_no' label="Department No" variant="outlined" onChange={e => setNewDepartmentNo(parseInt(e.target.value != NaN ? e.target.value : 0))} />
                    <TextField id="dept_name" name='dept_name' label="Department Name" variant="outlined" onChange={e => setNewDepartmentName(e.target.value)} />
                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                    <Button variant="contained" onClick={closeModal}>Cancel</Button>
                </FormControl>
            </Modal>
            <Modal
                isOpen={editModal}
                onRequestClose={editModalClose}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <FormControl>
                    <TextField id="dept_no" name='dept_no' label="Department No" variant="outlined" value={newDepartmentNo} onChange={e => setNewDepartmentNo(parseInt(e.target.value))} />
                    <TextField id="dept_name" name='dept_name' label="Department Name" variant="outlined" value={newDepartmentName} onChange={e => setNewDepartmentName(e.target.value)} />
                    <Button variant="contained" onClick={handleEdit}>Edit</Button>
                    <Button variant="contained" onClick={editModalClose}>Cancel</Button>
                </FormControl>
            </Modal>
        </>
    );

}

export default Home