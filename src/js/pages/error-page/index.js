import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { common as t } from '../../constants/texts';
import PATHS from '../../constants/urls';
import { Layout } from '../../components';

const ErrorPage = () => {
  // Force GET /404 for proper response code
  if (window.location.pathname !== PATHS.NOT_FOUND) {
    window.location.replace(PATHS.NOT_FOUND);
    return null;
  }

  return (
    <Layout flex title={t.notFoundTitle}>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <h3 className="text-white">
          {t.notFoundTitle}
        </h3>
        <Button variant="primary" as={Link} to={PATHS.HOME} className="mt-4">
          {t.returnToMain}
        </Button>
      </div>
    </Layout>
  );
};

export default ErrorPage;
