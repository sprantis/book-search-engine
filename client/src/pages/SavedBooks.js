// Referencing code from Module 21
import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { removeBookId } from '../utils/localStorage';
// Import the `useQuery()` and `useMutation()` hooks from Apollo Client
import { useQuery, useMutation } from '@apollo/client';
// Import the query we are going to execute from its file
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  // Execute the query on component load
  const { loading, data } = useQuery(GET_ME);
  // Use optional chaining to check if data exists and if it has a me property. If not, return an empty array to use.
  const userData = data?.me || [];

  // Set up our mutation, option for handling errors not needed
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the bookId value and deletes the book from the database
  // On book delete, perform mutation and pass in bookId as argument
  // It is important that the object fields are match the defined parameters in `REMOVE_BOOK` mutation
  const handleDeleteBook = async (bookId) => {
    try {
      // Pass the `bookId` URL parameter into query to retrieve this book's data
      await removeBook({ variables: { bookId } });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
