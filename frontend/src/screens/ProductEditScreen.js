import React,{useState,useEffect} from 'react'
import { Link,useNavigate,useLocation,useParams } from 'react-router-dom'
import { Form,Button } from 'react-bootstrap'
import { useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails,updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

function ProductEditScreen() {

    const productId = useParams();

    const [name,setName] = useState('')
    const [price,setPrice] = useState(0)
    const [image,setImage] = useState('')
    const [brand,setBrand] = useState('')
    const [category,setCategory] = useState('')
    const [description,setDescription] = useState('')
    const [countInStock,setCountInStock] = useState(0)
    const [uploading,setUploading] = useState(false)




    const dispatch = useDispatch()
    const navigate = useNavigate()

    const productDetails= useSelector(state => state.productDetails)
    const {error,loading,product} = productDetails

    const productUpdate= useSelector(state => state.productUpdate)
    const {error:errorUpdate,loading:loadingUpdate,success:successUpdate} = productUpdate


    useEffect(() =>{

        if(successUpdate){
            dispatch({type:PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        }else{
            if(!product.name || product._id !== Number(productId['id'])){
                dispatch(listProductDetails(productId['id']))
            }else{
                    setName(product.name)
                    setPrice(product.price)
                    setImage(product.image)
                    setBrand(product.brand)
                    setCategory(product.category)
                    setDescription(product.description)
                    setCountInStock(product.countInStock)
            }
        }

    },[product,productId['id'],successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({_id:product._id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description}))
    }

    const uploadFileHandler = async (e) =>{
        console.log("File is Uploading")
        const file = e.target.files[0]
        
        const formData  = new FormData();

        formData.append('image',file)
        formData.append('product_id',productId['id'])

        // for (var key of formData.entries()) {
        //     console.log(key[0] + ', ' + key[1]);
        // }
        setUploading(true)

        try{
            const config = {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }

            const {data}= await axios.post('/api/products/upload/',formData,config)
            console.log(data)
            setImage(data)
            setUploading(false)

        }catch(error){
            setUploading(true)
        }
    }

  return (

        <div>
            <Link to = '/admin/productlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type = 'name'
                            placeholder  = 'Enter Name'
                            value = {name}
                            onChange = {(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='price'>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type = 'number'
                            placeholder  = 'Enter price'
                            value = {price}
                            onChange = {(e) => setPrice(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image:</Form.Label>
                        
                        <Form.Control
                            type = 'file'
                            id = 'image-file'
                            label ='Choose File'
                            placeholder  = 'Add Image'
                            // value = {image}
                            onChange={uploadFileHandler}
                            // onChange = {(e) => setImage(e.target.value)}
                        >
                        
                        </Form.Control>
                        {uploading && <Loader />}
                        {/* <Form.File
                        type="file"
                        id = 'image-file'
                        label ='Choose File'
                        custom
                        onChange={uploadFileHandler}
                         /> */}
                        
                    </Form.Group>
                    <Form.Group controlId='brand'>
                        <Form.Label>Brand:</Form.Label>
                        <Form.Control
                            type = 'text'
                            placeholder  = 'Enter brand'
                            value = {brand}
                            onChange = {(e) => setBrand(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countinstock'>
                        <Form.Label>Stock:</Form.Label>
                        <Form.Control
                            type = 'number'
                            placeholder  = 'Enter stock'
                            value = {countInStock}
                            onChange = {(e) => setCountInStock(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category'>
                        <Form.Label>Category:</Form.Label>
                        <Form.Control
                            type = 'text'
                            placeholder  = 'Enter Category'
                            value = {category}
                            onChange = {(e) => setCategory(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description'>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            type = 'text'
                            placeholder  = 'Enter Description'
                            value = {description}
                            onChange = {(e) => setDescription(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                <Button type = 'submit' variant='primary'>
                    Update
                </Button>
                </Form>
                )}
            </FormContainer>
        </div>

  )
}

export default ProductEditScreen
