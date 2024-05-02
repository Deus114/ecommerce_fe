import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import './home.scss';
import { useEffect, useState } from 'react';
import { callFetchCategory, fetchListBook } from '../../services/apiServices';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortQuery, setSortQuery] = useState("&sort=-sold");
    const [queryString, setqueryString] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategory();
    }, [])

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, queryString])

    const fetchBook = async (filterQuery) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filterQuery)
            query += `${filterQuery}`;
        if (queryString)
            query += `${queryString}`;
        if (sortQuery)
            query += `${sortQuery}`;
        const res = await fetchListBook(query);
        if (res && res.data) {
            setTotal(res.data.meta.total);
            setListBook(res.data.result);
        }
        setIsLoading(false);
    };

    const fetchCategory = async () => {
        const res = await callFetchCategory();
        if (res && res.data) {
            const list = res.data.map(item => {
                return { label: item, value: item }
            })
            setListCategory(list);
        }
    }

    const handleChangeFilter = (changedValues, values) => {
        if (changedValues.category) {
            let cat = values.category;
            if (cat && cat.length > 0) {
                let q = cat.join(',');
                let query = `&category=${q}`;
                setqueryString(query);
            } else {
                setqueryString("");
            }
        }
    }

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let q = `&price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                let cat = values?.category?.join(',');
                q += `&category=${cat}`;
            }
            setqueryString(q);
        }
    }

    const onChange = (key) => {
        setSortQuery(key);
    };

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
            console.log(current);
        }
    };

    const items = [
        {
            key: "&sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: "&sort=-createdAt",
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: "&sort=+price",
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: "&sort=-price",
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} className='left-part' style={{
                    padding: "0 30px", backgroundColor: "white",
                    marginRight: "2%", marginLeft: "3%"
                }}>
                    <div style={{ paddingTop: "20px", display: 'flex', justifyContent: "space-between" }}>
                        <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Reset" onClick={(changedValues, values) => {
                            setCurrent(1);
                            form.resetFields();
                            setqueryString("");
                            fetchBook();
                        }} />
                    </div>
                    <Divider />
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {
                                        listCategory?.map((item, index) => {
                                            return (
                                                <Col span={24} key={index} style={{ padding: "7px 0" }}>
                                                    <Checkbox value={item.value} >
                                                        {item.label}
                                                    </Checkbox>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span >-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            <div>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={18} xs={24} className='right-part' style={{
                    backgroundColor: "white"
                }} >
                    <Spin spinning={isLoading} tip="Loading...">
                        <Row>
                            <Tabs defaultActiveKey="&sort=-sold"
                                items={items}
                                onChange={(value) => { onChange(value) }}
                            />
                        </Row>
                        <Row className='customize-row'>
                            {
                                listBook.map((item, index) => {
                                    return (
                                        <div className="column" key={index} onClick={() => handleRedirectBook(item)}>
                                            <div className='wrapper'>
                                                <div className='thumbnail'>
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${item.thumbnail}`}
                                                        alt="thumbnail book" />
                                                </div>
                                                <div className='text'>{item.mainText}</div>
                                                <div className='price'>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </div>
                                                <div className='rating'>
                                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                    <span>{item.sold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Row>
                    </Spin>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            responsive
                            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Home;