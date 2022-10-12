import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoops, Page not found</h2>
        <p className="text-muted lead">
          You can visit to <Link to="/">homepage</Link>
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
