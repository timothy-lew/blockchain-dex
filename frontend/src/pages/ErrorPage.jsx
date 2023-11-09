import React from 'react'
import { useRouteError } from "react-router-dom"

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
      <h1 className='text-5xl font-bold mb-8'>Oops!</h1>
      <p className='text-2xl'>Sorry, an unexpected error has occurred.</p>
      <p className='text-2xl mt-8'>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}