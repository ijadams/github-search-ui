import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export class Result extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {data} = this.props.data;
        const wrapper = React.createRef();
        return (
            <div className="result--container" ref={wrapper}>
                <div>
                    <p>{data}</p>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Score</TableCell>
                                    <TableCell align="right">Avatar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.data.map((row, i) => (
                                    <TableRow key={`id-${i}`}>
                                        <TableCell component="th" scope="row">
                                            {row.login}
                                        </TableCell>
                                        <TableCell align="right">{row.type}</TableCell>
                                        <TableCell align="right">{row.score}</TableCell>
                                        <TableCell align="right"><img src={row.avatar_url}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}
