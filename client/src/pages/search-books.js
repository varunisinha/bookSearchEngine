import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Jumbotron, Container, Col, Form, Button, Card, Row   } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookBasedOnIds, getSavedBookBasedOnIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../utils/mutations';

const SearchBooks = () => {
  const [search_Books, setSearchedBooks] = useState([]);
  const [search_Input, setSearchInput] = useState('');
  const [save_book_Id, setSavedBookIds] = useState(getSavedBookBasedOnIds());
  useEffect(() => {
    return () => saveBookBasedOnIds(save_book_Id);
  });

  const clickOnSubmit = async (event) => {
    event.preventDefault();

    if (!search_Input) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(search_Input);

      if (!response.ok) {
        throw new Error('Something went wrong! Please Try again after sometimes.');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const [saveBook] = useMutation(SAVE_BOOK);

  const handleSaveBook = async (bookId) => {

    const save_book = search_Books.find((book) => book.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      console.log('save_book:', save_book);

      const { data } = await saveBook({
        variables: { bookData: { ...save_book } }
      });
      console.log('data:', data);

      setSavedBookIds([...save_book_Id, save_book.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron  className=' app-background-color'>
        <Container>
          <p className="title-lg font-normal"></p>
          <Form onSubmit={clickOnSubmit}>
            <Form.Row>
              <Card className="search-card">
              <Card.Body>
                <Row>
              <Col xs={8}>
                <Form.Control
                  name='search_Input'
                  value={search_Input}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  
                  placeholder='Search Book'
                />
              </Col>
              <Col xs={4}>
                <Button type='submit' className="app-button" variant='normal' size='lg'>
                   Search
                </Button>
              </Col>
              </Row>
              </Card.Body>
              </Card>
            </Form.Row>
          </Form>
      
        </Container>
        
      </Jumbotron>
      
      <Container className=' app-background-color'>
      <hr
        style={{
          
            height: 0
        }}
    />
        <p className="title">
          {search_Books.length
            ? ` Results: ${search_Books.length}`
            : ''}
        </p>
          
         <Row>
           
           {search_Books.map((book) => {
            return (  
              <Col  xs={6}> 
         <Card key={book.bookId} className="card">
         
                {book.image ? (
                  <Card.Img className="img" src={book.image} alt={`The cover for ${book.title}`} variant='top'  />
                ) : null}
                
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={save_book_Id?.some((savedBookId) => savedBookId === book.bookId)}
                      className='app-button-book button-width btn-block ' 
                      onClick={() => handleSaveBook(book.bookId)}>
                      {save_book_Id?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved'
                        : 'Save this Book'}
                    </Button>
                  )}
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

export default SearchBooks;
