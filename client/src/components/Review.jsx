import React from 'react';
import ReviewList from './ReviewList';
import Score from './Score.jsx';
import HeaderBar from './HeaderBar';
import BlankSearch from './BlankSearch.jsx';
import axios from 'axios';
import $ from 'jquery';

export default class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: null,
      searchResultsArray: null,
      accuracy: 0,
      communication: 0,
      checkin: 0,
      value: 0,
      cleaniness: 0,
      location: 0,
      totalReviews: 0,
      hasSearched: false,
      searchTerm: null
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.renderSearchTerm = this.renderSearchTerm.bind(this);
    this.searchReviews = this.searchReviews.bind(this);
  }

  async retrieveMetaData() {
    const retrieved = await axios.get('/reviews');
    await this.setState(
      {
        reviews: retrieved.data,
        totalReviews: retrieved.data.length,
        accuracy:
          retrieved.data.reduce((a, b) => a + b.accuracy, 0) /
          retrieved.data.length,
        communication:
          retrieved.data.reduce((a, b) => a + b.communication, 0) /
          retrieved.data.length,
        checkin:
          retrieved.data.reduce((a, b) => a + b.checkin, 0) /
          retrieved.data.length,
        value:
          retrieved.data.reduce((a, b) => a + b.value, 0) /
          retrieved.data.length,
        cleaniness:
          retrieved.data.reduce((a, b) => a + b.cleaniness, 0) /
          retrieved.data.length,
        location:
          retrieved.data.reduce((a, b) => a + b.location, 0) /
          retrieved.data.length
      },
      () =>
        console.log(
          `current objects ahve this ==> ${this.state.reviews.length}`
        )
    );
  }

  renderSearchTerm(e) {
    // TODO: using the term, and filter out the correct messages
    this.setState({ searchTerm: e.target.value, hasSearched: true });
  }

  clearSearch() {
    this.setState({ searchResultsArray: null, searchTerm: null });
    $(':input').val('');
  }

  componentDidMount() {
    this.retrieveMetaData();
  }

  searchReviews(queryString) {
    this.setState({ searchTerm: queryString });
    const reviewArr = [];
    this.state.reviews.filter(review => {
      if (
        `${review.message}`.toUpperCase().indexOf(queryString.toUpperCase()) >=
        0
      )
        reviewArr.push(review);
    });
    this.setState({ searchResultsArray: reviewArr });
  }

  render() {
    if (this.state.reviews) {
      return (
        <div className="reviews">
          <HeaderBar totalReviews={this.state.totalReviews} />

          <div>
            <BlankSearch searchReviews={this.searchReviews} />
          </div>

          <div className="scorecard">
            <Score
              accuracy={this.state.accuracy}
              communication={this.state.communication}
              value={this.state.value}
              location={this.state.location}
              cleaniness={this.state.cleaniness}
              checkin={this.state.checkin}
            />
          </div>

          <div id="messages">
            <div>
              <ReviewList reviews={this.state.reviews} />
            </div>
          </div>
        </div>
      );
    } else if (this.state.searchResultsArray) {
      return (
        <div className="searchreviews">
          <HeaderBar totalReviews={this.state.totalReviews} />

          <div>
            <input
              id="searchbar"
              onChange={this.renderSearchTerm}
              type="text"
              placeholder="Search Reviews"
            />
          </div>

          <div className="scorecard">
            <Score
              accuracy={this.state.accuracy}
              communication={this.state.communication}
              value={this.state.value}
              location={this.state.location}
              cleaniness={this.state.cleaniness}
              checkin={this.state.checkin}
            />
          </div>

          <div id="messages">
            <div>
              <ReviewList reviews={this.state.reviews} />
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading....</div>;
  }
}
/* 
<div id="messages">
          {messageObj.length > 0 ? (
            <div>
              <ReviewList reviews={messageObj} />
            </div>
          ) : (
            <BlankSearch
              searchTerm={this.state.searchTerm}
              clearSearch={this.clearSearch}
            />
          )}
        </div> */
