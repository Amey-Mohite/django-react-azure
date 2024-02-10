import React from 'react'
import {useState,useEffect} from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { Form,Button,Col,Row } from 'react-bootstrap'
import { useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen() {

    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [paymentMethod,setPaymentMethod] = useState('Paypal')


    if(!shippingAddress.address){
        navigate('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
            <Form.Label as = 'legend'>Select Method</Form.Label>
            <Col>
                <Form.Check
                    type = 'radio'
                    label = 'Paypal or Credit Card'
                    id = 'paypal'
                    name = 'paymentMethod'
                    checked
                    onChange = {(e) => setPaymentMethod(e.target.value)}
                >

                </Form.Check>
            </Col>
        </Form.Group>
        <Button type = 'submit' variant = 'primary'>
            Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
