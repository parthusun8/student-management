import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
function Compare() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id1, setid1] = useState(searchParams.get("id1"));
    const [id2, setid2] = useState(searchParams.get("id2"));

    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            axios
                .get(
                    "http://localhost:4000/api/compareStudents/" + id1 + "/" + id2 + "/"
                )
                .then((res) => {
                    console.log(res.data["data"]);
                    setStudentData(res.data["data"]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        fetchData();
    });
    return (
        <div className="flex flex-col items-center justify-center h-[100vh]">
        <h1>COMPARING 2 STUDENTS</h1>
        <Box>
            <Grid container spacing={2} className="flex flex-row gap-20">
            {studentData.map((student, i) =>
                <Grid item key={i} className="gap-3">
                    <Typography className="p-1">Name : {student.name}</Typography>
                    <Typography className="p-1">Registration Number : {student.regdno}</Typography>
                    <Typography className="p-1">Current Semester : {student.current_semester}</Typography>
                    <Typography className="p-1">Department : {student.dept_no}</Typography>
                    <Typography className="p-1">Section : {student.section_id}</Typography>
                    <Typography className="p-1">CGPA : {student.cgpa}</Typography>
                    <Table>
                        <TableHead style={{background:"black"}}>
                            <TableRow>
                                <TableCell style={{color:"white"}}>Semester</TableCell>
                                <TableCell style={{color:"white"}}>SGPA</TableCell>
                                <TableCell style={{color:"white"}}>Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {student.data.map((semester, i) => (
                                (!(semester.sgpa < 7)) ?
                                <TableRow key={i} style={{background:"green"}}>
                                    <TableCell>{semester.semester}</TableCell>
                                    <TableCell>{semester.sgpa}</TableCell>
                                    <TableCell>{semester.grade}</TableCell>
                                </TableRow> : <TableRow key={i} style={{background:"red"}}>
                                    <TableCell>{semester.semester}</TableCell>
                                    <TableCell>{semester.sgpa}</TableCell>
                                    <TableCell>{semester.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            )}
            </Grid>
        </Box>
        </div>
    );
}

export default Compare;
