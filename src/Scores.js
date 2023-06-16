
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import { Box, Typography, IconButton, colors } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import Collapse from "@mui/material/Collapse";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareArrowUpRight, faArrowDownAZ, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

function Scores() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setid] = useState(searchParams.get("student"));
    const [name, setname] = useState(searchParams.get("name"));

    const [semesterData, setSemesterData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            await axios.get("http://localhost:4000/api/allSubjects/" + id + "/").then((res) => {
                console.log(res.data["Marks"]);
                setSemesterData(res.data["Marks"]);
            }).catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, [id]);

    return (
        <>
        <h1>{name}'s ScoreCard</h1>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="center">Semester</TableCell>
                        <TableCell align="center">Theory Subjects</TableCell>
                        <TableCell align="center">Lab Subjects</TableCell>
                        <TableCell align="center">SGPA</TableCell>
                        <TableCell align="center">Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {semesterData.map((row, i) => (
                        <Row key={i} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
                        </>
    );
}

export default Scores;

function Row({ row }) {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <TableRow key={row.semester}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <Link to={`/scores?student=${row.semester}`}>
                        {row.semester}
                    </Link>
                </TableCell>
                <TableCell align="center">{row.subjects.theory.length}</TableCell>
                <TableCell align="center">{row.subjects.lab.length}</TableCell>
                <TableCell align="center">{row.sgpa}</TableCell>
                <TableCell align="center">{row.grade}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Typography variant="h6" gutterBottom component="div">
                            Performance Report
                        </Typography>
                        {(row.subjects.theory.length != 0) ? <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Theory
                            </Typography>
                            <Table size="small" aria-label="purchases" style={{marginLeft:"60px"}}>
                                <TableHead style={{ backgroundColor: "black" }}>
                                    <TableRow>
                                        <TableCell align="center" style={{ color: "white" }}>Subject Code</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Subject Name</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Marks</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Grade</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {row.subjects.theory.map((historyRow) => (
                                    (historyRow.marks > 50) ? 
                                        <TableRow key={historyRow.subject_code} style={{ backgroundColor: "green" }}>
                                            <TableCell align="center" style={{ color: "white" }} component="th" scope="row">
                                                {historyRow.subject_code}
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.subject_name}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.marks}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.grade}</TableCell>
                                        </TableRow>
                                     : <TableRow key={historyRow.subject_code} style={{ backgroundColor: "red" }}>
                                            <TableCell align="center" style={{ color: "white" }} component="th" scope="row">
                                                {historyRow.subject_code}
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.subject_name}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.marks}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.grade}</TableCell>
                                        </TableRow>))}
                                </TableBody>
                            </Table>
                        </Box> : null}
                        {(row.subjects.lab.length != 0) ? <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Lab
                            </Typography>
                            <Table size="small" aria-label="purchases" style={{marginLeft:"60px"}}>
                                <TableHead style={{ backgroundColor: "black" }}>
                                    <TableRow>
                                        <TableCell align="center" style={{ color: "white" }}>Subject Code</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Subject Name</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Marks</TableCell>
                                        <TableCell align="center" style={{ color: "white" }}>Grade</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {row.subjects.lab.map((historyRow) => (
                                    (historyRow.marks > 50) ? 
                                        <TableRow key={historyRow.subject_code} style={{ backgroundColor: "green" }}>
                                            <TableCell align="center" style={{ color: "white" }} component="th" scope="row">
                                                {historyRow.subject_code}
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.subject_name}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.marks}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.grade}</TableCell>
                                        </TableRow>
                                     : <TableRow key={historyRow.subject_code} style={{ backgroundColor: "red" }}>
                                            <TableCell align="center" style={{ color: "white" }} component="th" scope="row">
                                                {historyRow.subject_code}
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.subject_name}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.marks}</TableCell>
                                            <TableCell align="center" style={{ color: "white" }}>{historyRow.grade}</TableCell>
                                        </TableRow>))}
                                </TableBody>
                            </Table>
                        </Box> : null}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}