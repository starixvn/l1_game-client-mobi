import React from 'react';
import Link from 'next/link'

const NotFound = () => (
  <div>
    <h1>Session Timeout!</h1>
    <Link href="/">
      Go Home
    </Link>
  </div>
);

export default NotFound;