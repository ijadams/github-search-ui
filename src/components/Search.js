import React from 'react';
import axios from 'axios';
import {CircularProgress, TablePagination} from "@material-ui/core";
import {Result} from './Result';

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
            page: 0
        };

    }

    buildUrl = () => {
        let url = `https://api.github.com/search/users?q=example`;

        return url;
    }

    fetchSearchResults = () => {
        const searchUrl = this.buildUrl();
        const {rowsPerPage} = this.state;
        axios.get(searchUrl, {})
            .then(res => {
                const resultNotFoundMsg = !res.data.items.length
                    ? 'Uhhh No results were found.'
                    : '';
                const results = res.data.items.slice(0, rowsPerPage);
                console.log('results', results);
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

    handleOnInputChange = (event) => {
        const query = event.target.value;
        if (!query) {
            this.setState({query, results: {}, message: '', totalPages: 0, totalResults: 0});
        } else {
            this.setState({query, loading: true, message: ''}, () => {
                this.fetchSearchResults();
            });
        }
    };

    renderSearchResults = () => {
        const {results} = this.state;

        if (Object.keys(results).length && results.length) {
            return (
                <div className="results--container">
                    <Result data={results}/>
                </div>
            )
        }
    };

    handleChangePage = (e, page) => {
        this.setState({page: page}, () => {
            this.fetchSearchResults();
        });
    };

    handleChangeRowsPerPage = (page) => {
        this.setState({rowsPerPage: page.props.value}, () => {
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
        const {query, loading, message} = this.state;

        return (
            <div className="search--container">
                {/*	Heading*/}
                <h2 className="heading">Github UI Search</h2>
                {/* Search Input*/}
                <label className="search-label" htmlFor="search-input">
                    <input
                        type="text"
                        name="query"
                        value={query}
                        id="search-input"
                        placeholder="Search..."
                        onChange={this.handleOnInputChange}
                    />
                    <i className="fa fa-search search-icon" aria-hidden="true"/>
                </label>

                {/*	Error Message*/}
                {message && <p className="message">{message}</p>}

                {/*	Loader*/}
                <div style={{display: loading ? "block" : "none"}}>
                    <CircularProgress/>
                </div>

                {/*Navigation*/}

                {/*	Result*/}
                {this.renderSearchResults()}

                {/*Navigation*/}
                {this.renderPagination()}

            </div>
        )
    }
}
