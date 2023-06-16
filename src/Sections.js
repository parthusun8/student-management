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
import { Button, FormControl, TextField } from '@mui/material';
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

function Sections({ match }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setid] = useState(searchParams.get("id"));
    const [dept_name, setdept_name] = useState(searchParams.get("dept"));


    const [sectionData, setSectionData] = useState([]);
    const [newSectionName, setNewSectionName] = useState("");

    useEffect(() => {
        console.log(id)
        async function fetchData() {
            await axios.get("http://localhost:4000/api/departments/" + id + "/sections/").then((res) => {
                console.log(res.data);
                setSectionData(res.data);
            }).catch((err) => {
                console.log(err);
            });
        }
        if (id && id > 0) {
            fetchData();
        }
    }, [id]);

    const [editModal, seteditModal] = useState(false);

    function editModalOpen(row) {
        // setNewDepartmentNo(row.dept_no);
        // setPrevDepartmentNo(row.dept_no);
        // setNewDepartmentName(row.dept_name);
        seteditModal(true);
    }


    function editModalClose() {
        seteditModal(false);
    }


    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }


    function closeModal() {
        setIsOpen(false);
    }

    const handleDelete = async (row) => {
        // Handle delete action for the given ID
        console.log('Delete', row);
        await axios.delete("http://localhost:4000/api/sections/" + row.id + "/").then((res) => {
            console.log("Delete Successfull");
            setSectionData(sectionData.filter((section) => section.id !== row.id));
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleAdd = async () => {
        // Handle add action
        await axios.post("http://localhost:4000/api/sections/", {
            section_name: newSectionName,
            dept_no: id
        }).then((res) => {
            console.log(res.data);
            setNewSectionName("");
            closeModal();
            res.data.count_students = 0;
            setSectionData([...sectionData, res.data]);
        }).catch((err) => {
            console.log(err);
        });
    }


    return (
        <>
            <h1 className='ml-[30px] mt-10 py-5'>Department - {dept_name}</h1>
            <Button variant="contained" onClick={openModal} style={{ marginLeft: "30px" }}>Add Section</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Section Id</TableCell>
                            <TableCell align="center">Section Name</TableCell>
                            <TableCell align="center">Total Students</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sectionData.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">
                                    <Link to={`/students?id=${row.id}&dept_id=${id}&section=${row.section_name}&dept=${dept_name}`}>
                                        {row.id}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{row.section_name}</TableCell>
                                <TableCell align="center">{row.count_students}</TableCell>
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
                    <TextField id="section_name" name='section_name' label="Section Name" variant="outlined" onChange={e => setNewSectionName(e.target.value)} />
                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                    <Button variant="contained" onClick={closeModal}>Cancel</Button>
                </FormControl>
            </Modal>
        </>
    )
}

export default Sections