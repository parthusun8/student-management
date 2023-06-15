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
import { Button } from '@mui/material';

function Students() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setid] = useState(searchParams.get("id"));
    const [section, setSection] = useState(searchParams.get("section"));
    const [dept_name, setdept_name] = useState(searchParams.get("dept"));

    const [studentData, setStudentData] = useState([]);

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
    return (
        <>
            <h1 className='ml-[30px] mt-5 py-2'>Department - {dept_name}</h1>
            <h1 className='ml-[30px] py-2'>Section - {section}</h1>

            <Button variant='contained'>Add Student</Button>
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
        </>
    );
}

export default Students;