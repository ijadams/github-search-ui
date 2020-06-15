import React from 'react';
import axios from 'axios';
import {CircularProgress, TablePagination, OutlinedInput, InputAdornment} from "@material-ui/core";
import {Result} from './Result';
import SearchIcon from '@material-ui/icons/Search';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: null,
            currentPageNo: null,
            rowsPerPage: 30,
            page: 0,
            searchBy: 'users'
        };

    }

    setSearchBy = (e, q) => {
        const {query} = this.state;
        if (!query) {
            this.setState({searchBy: q});
        } else {
            this.setState({searchBy: q}, () => {
                setTimeout(() => {
                    this.setState({loading: true});
                    this.fetchSearchResults();
                }, 200)
            });
        }
    };

    buildUrl = () => {
        const {page, query, searchBy} = this.state;
        let url = `https://api.github.com/search/${searchBy}?q=${query}&page=${page}`;
        return url;
    };

    fetchSearchResults = () => {
        const searchUrl = this.buildUrl();
        const {rowsPerPage} = this.state;
        axios.get(searchUrl, {})
            .then(res => {
                const resultNotFoundMsg = !res.data.items.length
                    ? 'Uhhh No results were found.'
                    : '';
                const results = res.data.items.slice(0, rowsPerPage);
                this.setState({
                    results: results,
                    message: resultNotFoundMsg,
                    totalResults: res.data.total_count,
                    loading: false
                })
            })
            .catch(error => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'There was an issue fetching the data.'
                    })
                }
            })
    };

    handleOnInputChange = (e, q) => {
        const query = e.target.value;
        if (!query) {
            this.setState({query, results: {}, message: '', totalPages: 0, totalResults: 0});
        } else {
            this.setState({query, message: ''}, () => {
                setTimeout(() => {
                    this.setState({loading: true});
                    this.fetchSearchResults();
                }, 1500)
            });
        }
    };


    renderSearchResults = () => {
        const {results} = this.state;

        if (Object.keys(results).length && results.length) {
            return (
                <div className="results--container">
                    <Result data={results} pageSize={this.state.rowsPerPage} searchBy={this.state.searchBy}/>
                </div>
            )
        }
    };

    handleChangePage = (e, page) => {
        this.setState({page: page, loading: true}, () => {
            this.fetchSearchResults();
        });
    };

    handleChangeRowsPerPage = (page) => {
        this.setState({rowsPerPage: page.props.value, loading: true}, () => {
            this.fetchSearchResults();
        });
    };

    renderPagination = () => {
        const {totalResults, results, rowsPerPage, page} = this.state;
        if (Object.keys(results).length && results.length) {
            return (
                <div className="pagination--container">
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={totalResults}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={(e, page) => this.handleChangePage(e, page)}
                        onChangeRowsPerPage={(e, page) => this.handleChangeRowsPerPage(page)}
                    />

                </div>
            )
        }
    };


    render() {
        const {query, loading, message, searchBy} = this.state;

        return (
            <div className="search--container">
                <div className="header">
                    <h1>Github UI Search</h1>
                    <div className="search--bar">
                        <label className="search-label" htmlFor="search-input">
                            <OutlinedInput
                                type="text"
                                name="query"
                                value={query}
                                id="search-input"
                                placeholder="Search..."
                                endAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                }
                                onChange={(e, q) => this.handleOnInputChange(e, q)}
                            />
                        </label>

                        <div className="radios">
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Search By</FormLabel>
                                <RadioGroup row aria-label="searchBy" name="searchBy" value={searchBy} onChange={(e, q) => this.setSearchBy(e, q)}>
                                    <FormControlLabel value="users" control={<Radio/>} label="User"/>
                                    <FormControlLabel value="repositories" control={<Radio/>} label="Repository"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {/*	Error Message*/}
                {message && <p className="message">{message}</p>}

                {/*	Loader*/}
                <div className={'loader'} style={{display: loading ? "block" : "none"}}>
                    <div>
                        <CircularProgress/>
                    </div>
                </div>

                {/*	Result*/}
                {this.renderSearchResults()}

                {/*Navigation*/}
                {this.renderPagination()}

            </div>
        )
    }
}
