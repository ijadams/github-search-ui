import React from 'react';
import axios from 'axios';
import {CircularProgress} from "@material-ui/core";
import {Result} from './Result';

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: 0,
            currentPageNo: 0,
        };

    }

    fetchSearchResults = (updatedPageNo = '', query) => {
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
        const searchUrl = `https://api.github.com/search/users?q=example`;


        axios.get(searchUrl, {})
            .then(res => {
                console.log(res);
                const total = res.data.total;
                const resultNotFoundMsg = !res.data.items.length
                    ? 'Uhhh No results were found.'
                    : '';
                this.setState({
                    results: res.data.items,
                    message: resultNotFoundMsg,
                    totalResults: total,
                    currentPageNo: updatedPageNo,
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
                this.fetchSearchResults(1, query);
            });
        }
    };

    renderSearchResults = () => {
        const {results} = this.state;

        if (Object.keys(results).length && results.length) {
            return (
                <div className="results-container">
                    {results.map(result => {
                        return (
                            <div>
                                <Result data={result}/>
                            </div>
                        )
                    })}

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


            </div>
        )
    }
}
