import { Button, Col, Divider, InputNumber, Row } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteCartAction, doUpdateCartAction } from '../../redux/order/orderSlice';

const ViewOrder = (props) => {
    const carts = useSelector(state => state.order.carts);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        let count = 0;
        carts?.map((book, index) => {
            count += (+book?.detail?.price * book?.quantity);
        })
        setTotal(count);
    }, [carts])

    const handleOnchange = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value))
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book?._id }));
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {
                            carts?.map((book, index) => {
                                return (
                                    <div className='order-book' key={index}>
                                        <div className='book-content'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${book?.detail?.thumbnail}`} />
                                            <div className='title'>
                                                {book?.detail?.mainText}
                                            </div>
                                            <div className='price'>
                                                {book?.detail?.price?.toLocaleString()}đ
                                            </div>
                                        </div>
                                        <div className='action'>
                                            <div className='quantity'>
                                                <InputNumber onChange={(value) => handleOnchange(value, book)}
                                                    value={book?.quantity} />
                                            </div>
                                            <div className='sum'>
                                                {(+book?.detail?.price * book?.quantity)?.toLocaleString()}đ
                                            </div>
                                            <Button onClick={() => dispatch(doDeleteCartAction(book))}><DeleteOutlined /></Button>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>  Tạm tính</span>
                                <span>{total.toLocaleString()}đ</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span> Tổng tiền</span>
                                <span className='sum-final'>{total.toLocaleString()}đ</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button>Mua Hàng ({carts?.length})</button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ViewOrder;