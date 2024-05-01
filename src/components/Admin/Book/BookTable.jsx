import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Drawer, Descriptions, Badge, Popconfirm, notification, message, Divider, Upload, Modal } from 'antd';
import InputSearch from './InputSearch';
import { DelteBook, fetchListBook } from '../../../services/apiServices';
import { FaRegTrashAlt } from "react-icons/fa";
import { render } from 'react-dom';
import moment from 'moment';
import { IoReload } from "react-icons/io5";
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AiTwotoneEdit } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import ModalCreateBook from './ModalCreateBook';
import ModalUpdateBook from './BookModalUpdate';

const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchBook()
    }, [current, pageSize]);

    const fetchBook = async (filterQuery) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filterQuery)
            query += `${filterQuery}`;
        const res = await fetchListBook(query);
        if (res && res.data) {
            setTotal(res.data.meta.total);
            setListBook(res.data.result);
        }
        setIsLoading(false);
    };

    const handleSearch = (query) => {
        fetchBook(query);
    }

    const handleDelete = async (_id) => {
        let res = await DelteBook(_id);
        if (res && res.data) {
            message.success('Delete user success');
            setCurrent(1);
            await fetchBook();
        }
        else {
            notification.error({
                message: "Something error",
                description: "Can't delete this user",
            });
        }
    }

    const handleOpenModalDetail = (record) => {
        {
            setDataDetail(record);
            let imageThumbnail = {}, imageSlider = [];
            imageThumbnail = {
                uid: uuidv4(),
                name: record.thumbnail,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${record.thumbnail}`
            }
            record.slider.map(item => {
                imageSlider.push({
                    uid: uuidv4(),
                    name: item,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${item}`
                })
            })
            setFileList([imageThumbnail, ...imageSlider]);
            setOpen(true);
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#'
                        onClick={() => handleOpenModalDetail(record)}
                    >{record._id}</a>
                )
            }
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <>{record.price.toLocaleString()}đ</>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            }
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="rightTop"
                            title={"Xác nhận xóa sách"}
                            description={"Bạn có chắc muốn xóa sách này không?"}
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger><FaRegTrashAlt /></Button>
                        </Popconfirm>

                        <Button
                            onClick={() => {
                                setDataUpdate(record);
                                setOpenModalUpdate(true);
                            }}
                        ><AiTwotoneEdit /></Button>
                    </>
                )
            }
        },
    ];

    const onClose = () => {
        setOpen(false);
        setDataDetail(null);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleExport = () => {
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBooks.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table Books</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        type='primary'
                        onClick={() => handleExport()}
                        icon={<ExportOutlined />}
                    >Export</Button>
                    <Button
                        type='primary'
                        onClick={() => setOpenModal(true)}
                        icon={<PlusOutlined />}
                    >Add new</Button>
                    <Button
                        onClick={() => {
                            fetchBook();
                            setCurrent(1);
                        }}
                    >
                        <IoReload />
                    </Button>
                </span>
            </div>
        )
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    return (
        <>
            <ModalUpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchBook={fetchBook}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <ModalCreateBook
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchBook={fetchBook}
            />
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        dataSource={listBook}
                        loading={isLoading}
                        rowKey="_id"
                        onChange={onChange}
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                            }
                        }
                    />
                </Col>
            </Row>
            <Drawer
                title="View Detail"
                width={"50vw"}
                onClose={onClose}
                open={open}
            >
                <Descriptions
                    title="Book detail"
                    column={2}
                    bordered
                >
                    <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tên tác giả">{dataDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá">{dataDetail?.price?.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Created date">
                        {moment(dataDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated date">
                        {moment(dataDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status='processing' text={dataDetail?.category} />
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" > Hình ảnh </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    )
}


export default BookTable;