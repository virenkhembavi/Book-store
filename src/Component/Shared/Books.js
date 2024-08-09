import React, { useState } from 'react'
import { editData, sendData } from '../Api';
import Loader from './Loader';

export default function Books({ setModal, modal, data, newData, setData }) {
    const [loading, setLoading] = useState(false)
    const [book, setBook] = useState({
        author: data?.author,
        country: data?.country,
        language: data?.language,
        link: data?.link,
        pages: data?.pages,
        title: data?.title,
        year: data?.year,
        id: data?.id
    });


    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        if (data?.id !== undefined) {
            editData(book)
                .then((response) => {
                    setLoading(false)
                    newData()
                    setModal(false)
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                })
        } else {
            setLoading(true)
            sendData(book)
                .then((response) => {
                    setLoading(false)
                    newData()
                    setModal(false)
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                })
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook({ ...book, [name]: value });
    };

    console.log(data);

    return (
        <div id="modal-container" className="modal-container">
            {
                loading && (
                    <Loader />
                )
            }
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{typeof data === 'object' ? "Edit Book" : "Add Book"}</h2>
                    <button className="close-modal" onClick={() => {
                        setData([])
                        setModal(!modal)
                    }}>×</button>
                </div>
                <div className="modal-body">
                    <form id="book-form" onSubmit={handleSubmit}>
                        <label htmlFor="author">Author:</label>
                        <input type="text" id="author" name="author" value={book.author} onChange={handleChange} /><br />
                        <label htmlFor="country">Country:</label>
                        <input type="text" id="country" name="country" value={book.country} onChange={handleChange} /><br />
                        <label htmlFor="language">Language:</label>
                        <input type="text" id="language" name="language" value={book.language} onChange={handleChange} /><br />
                        <label htmlFor="link">Link:</label>
                        <input type="text" id="link" name="link" value={book.link} onChange={handleChange} /><br />
                        <label htmlFor="pages">Pages:</label>
                        <input type="number" id="pages" name="pages" value={book.pages} onChange={handleChange} /><br />
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" value={book.title} onChange={handleChange} /><br />
                        <label htmlFor="year">Year:</label>
                        <input type={data?.year !== undefined ? "text" : "number"} id="year" name="year" value={book.year} onChange={handleChange} /><br />
                        <label htmlFor="id">ID:</label>
                        <input type="number" id="id" name="id" value={book.id} disabled={data?.id !== undefined ? true : false} onChange={handleChange} /><br />
                        <button onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
