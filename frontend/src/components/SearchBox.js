import React,{useState} from 'react'
import { Link, useParams, useNavigate,useLocation,useHistory } from "react-router-dom";
import {
  Button,
  Form,
} from "react-bootstrap";


function SearchBox() {
    const [keyword,setKeyword] = useState('')

    let navigate = useNavigate()
    let location = useLocation()


    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword){
            navigate(`/?keyword=${keyword}&page=1`)
        }else{
            navigate(navigate(location))
        }
    }

  return (
    <Form onSubmit = {submitHandler} className='d-flex'>
        <Form.Control
          type = 'text'
          name = 'q'
          onChange = { (e) => setKeyword(e.target.value)}
          className = 'mr-sm-2 ml-sm-5'
        >
        </Form.Control>
        <Button
          type = 'submit'
          variant = 'outline-success'
          className='p-2'
        >Submit
        </Button>
    </Form>
  )
}

export default SearchBox
