import React from 'react';
import { Jumbotron, Container, Row,Col, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { deleteBookBasedOnId } from '../utils/localStorage';

const SavedBooks = () => {

  const { loading, data } = useQuery(GET_ME);
  const user_data = data?.me || [];
  const [deletebooks] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      await deletebooks({
        variables: { bookId: bookId }
      });

      deleteBookBasedOnId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      
      <Container className="margin-top-50px">
     
        <p className="app-font-color title">
          {user_data.savedBooks?.length
            ? `  Saved ${user_data.savedBooks.length === 1 ? 'Book' : 'Books'}: ${user_data.savedBooks.length}`
            : 'Saved Book: 0'}
        </p>
        <Row  >
          {user_data.savedBooks?.map((book) => {
            return (
              <Col xs={6}>
              <Card key={book.bookId} className="card">
                 
                {book.image ? <Card.Img className="img" src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block button-width btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book
                  </Button>
                </Card.Body>
              </Card>
              </Col>
              
            );
          })}
       </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
