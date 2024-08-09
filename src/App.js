import React, { useCallback, useEffect, useState } from 'react'
import Books from './Component/Shared/Books'
import { getData, sortData } from './Component/Api'
import Loader from './Component/Shared/Loader'

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState([])
  const [filter, setFilter] = useState({
    english: false,
    hindi: false,
    marathi: false,
    tamil: false
  })

  const fetchLatestData = () => {
    setLoading(true)
    getData(search)
      .then((resposne) => {
        setLoading(false)
        setData(resposne?.data?.data)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }


  const handleSearch = () => {
    setLoading(true)
    setFilter({
      english: false,
      hindi: false,
      marathi: false,
      tamil: false
    })
    getData(search)
      .then((resposne) => {
        setLoading(false)
        setCurrentPage(1)
        setData(resposne?.data?.data)
      }).catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const handleSort = (e) => {
    setLoading(true)
    setSort(e?.target?.value)
    setCurrentPage(1)
    sortData(e?.target?.value)
      .then((resposne) => {
        setLoading(false)
        setData(resposne?.data?.data)
      }).catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const handleFilter = useCallback((e) => {
    setFilter({ ...filter, [e.target.name]: e.target.checked })
    setCurrentPage(1)
  }, [filter, data])


  const filteredData = data?.filter(book => {
    if (!filter.english && !filter.hindi && !filter.marathi && !filter.tamil) {
      return true
    }
    return (filter.english && book.language?.toLowerCase() === "english") ||
      (filter.hindi && book.language?.toLowerCase() === "hindi") ||
      (filter.marathi && book.language?.toLowerCase() === "marathi") ||
      (filter.tamil && book.language?.toLowerCase() === "tamil")
  })

  const handleClear = (e) => {
    e?.preventDefault()
    setLoading(true)
    getData("")
      .then((resposne) => {
        setLoading(false)
        setSearch("")
        setData(resposne?.data?.data)
      }).catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredData?.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleEditOpenModal = (meta) => {
    setModal(true)
    setEditModal(meta)
  }

  useEffect(() => {
    fetchLatestData()
  }, [])


  return (
    <div className="container">
      {
        loading && (
          <Loader />
        )
      }
      {
        modal && (
          <Books setModal={setModal} modal={modal} data={editModal !== undefined ? editModal : []} newData={fetchLatestData} setData={setEditModal} />
        )
      }
      <h1>Book Store</h1>
      <div className="search-bar row">
        <div className='addBook-section col-lg-3 col-sm-12'>
          <button id="add-button" onClick={() => setModal(!modal)}>Add Book</button>
        </div>
        <div className='sortBy-section col-lg-3'>
          <select id="sort-select" value={sort} onChange={handleSort}>
            <option value="">Sort by</option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
        <div className='col-lg-3 filter-section '>
          <input type="checkbox" id="english" name="english" checked={filter.english} onChange={handleFilter} />
          <label for="english">English</label>
          <input type="checkbox" id="hindi" name="hindi" checked={filter.hindi} onChange={handleFilter} />
          <label for="hindi">Hindi</label>
          <input type="checkbox" id="marathi" name="marathi" checked={filter.marathi} onChange={handleFilter} />
          <label for="marathi">Marathi</label>
          <input type="checkbox" id="tamil" name="tamil" checked={filter.tamil} onChange={handleFilter} />
          <label for="tamil">Tamil</label>
        </div>
        <div className='search-input col-lg-3'>
          <div className='search'>
            <input type="text" id="search-input" placeholder="Search title..." value={search} onChange={(e) => setSearch(e?.target?.value)} />
            {
              search?.length > 0 && (
                <span onClick={handleClear}>x</span>
              )
            }
          </div>
          <button id="search-button" disabled={search?.length > 0 ? false : true} onClick={handleSearch}>Search</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th scope='col'>Author</th>
            <th scope='col'>Country</th>
            <th scope='col'>Language</th>
            <th scope='col'>Link</th>
            <th scope='col'>Title</th>
            <th scope='col'>Year</th>
            <th scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentItems?.length > 0 ? (
              currentItems?.map((book) => {
                return (
                  <tr key={book?.id}>
                    <td data-label="Author">{book?.author === null ? "-" : book?.author}</td>
                    <td data-label="Country">{book?.country === null ? "-" : book?.country}</td>
                    <td data-label="Language">{book?.language === null ? "-" : book?.language}</td>
                    <td data-label="Link">{book?.link === null ? "-" : book?.link}</td>
                    <td data-label="Title">{book?.title === null ? "-" : book?.title}</td>
                    <td data-label="Year">{book?.year === null ? "-" : book?.year}</td>
                    <td data-label="Action"><button onClick={() => {
                      setSearch("")
                      handleEditOpenModal(book)
                    }}>Edit</button></td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7}>No books found</td>
              </tr>
            )
          }

        </tbody>
      </table>
      <div className="pagination">
        <ul>
          {pageNumbers?.map((pageNumber) => (
            <li key={pageNumber}>
              <button onClick={() => handlePageChange(pageNumber)} disabled={currentPage === pageNumber ? true : false}>{pageNumber}</button>
            </li>
          ))}
        </ul>
      </div>
    </div >
  )
}
