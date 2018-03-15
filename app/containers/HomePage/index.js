/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */
import React from "react";
// import PropTypes from "prop-types";
import ReactTable from "react-table";
import "react-table/react-table.css";
import mockData from "./mockData";
import { Helmet } from "react-helmet";
// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from "containers/App/selectors";
// import H2 from "components/H2";
// import ReposList from "components/ReposList";
// import AtPrefix from "./AtPrefix";
import CenteredSection from "./CenteredSection";
// import Form from "./Form";
// import Input from "./Input";
// import Section from "./Section";
// import messages from "./messages";
import { loadRepos } from "../App/actions";
import { changeUsername } from "./actions";
import { makeSelectUsername } from "./selectors";
import reducer from "./reducer";
import saga from "./saga";


export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  constructor() {
    super();
    this.state = {
      data: mockData,
    };
    this.renderEditable = this.renderEditable.bind(this);
  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id],
        }}
      />
    );
  }
  render() {
    // const { loading, error, repos } = this.props;
    // const reposListProps = {
    //   loading,
    //   error,
    //   repos,
    // };

    const { data } = this.state;

    const columns = [
      {
        Header: "Building Name",
        accessor: "buildingName", // String-based value accessors!
        Cell: this.renderEditable,
      },
      {
        Header: "Synonyms",
        accessor: "synonyms",
        Cell: props => <span className="number">{props.value}</span>, // Custom cell components!
      },
    ];

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <div>
          <CenteredSection>
            <ReactTable
              data={data}
              columns={columns}
              showPagination
              showPaginationTop={false}
              showPaginationBottom
              showPageSizeOptions
              filterable
            />
          </CenteredSection>
        </div>
      </article>
    );
  }
}

// HomePage.propTypes = {
//   loading: PropTypes.bool,
//   error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool])
// };

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: "home", reducer });
const withSaga = injectSaga({ key: "home", saga });

export default compose(withReducer, withSaga, withConnect)(HomePage);
