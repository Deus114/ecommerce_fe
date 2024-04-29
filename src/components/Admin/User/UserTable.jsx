import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Drawer, Descriptions, Badge, Popconfirm, notification, message } from 'antd';
import InputSearch from './InputSearch';
import { DelteUser, fetchListUser } from '../../../services/apiServices';
import { FaRegTrashAlt } from "react-icons/fa";
import { render } from 'react-dom';
import moment from 'moment';
import { IoReload } from "react-icons/io5";
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCreateUser from './ModalCreateUser';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AiTwotoneEdit } from 'react-icons/ai';
import ModalUpdateUser from './ModalUpdateUser';

const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    useEffect(() => {
        fetchUser()
    }, [current, pageSize]);

    const fetchUser = async (filterQuery) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filterQuery)
            query += `${filterQuery}`;
        const res = await fetchListUser(query);
        if (res && res.data) {
            setTotal(res.data.meta.total);
            setListUser(res.data.result);
        }
        setIsLoading(false);
    };

    const handleSearch = (query) => {
        fetchUser(query);
    }

    const handleDelete = async (_id) => {
        let res = await DelteUser(_id);
        if (res && res.data) {
            message.success('Delete user success');
            await fetchUser();
        }
        else {
            notification.error({
                message: "Something error",
                description: "Can't delete this user",
            });
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataDetail(record);
                            setOpen(true);
                        }}
                    >{record._id}</a>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="rightTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc muốn xóa user này không?"}
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
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        type='primary'
                        onClick={() => handleExport()}
                    >Export</Button>
                    <Button
                        type='primary'
                        onClick={() => setOpenModal(true)}
                    >Add new</Button>
                    <Button
                        onClick={() => {
                            fetchUser();
                            setCurrent(1);
                        }}
                    >
                        <IoReload />
                    </Button>
                </span>
            </div>
        )
    }

    return (
        <>
            <ModalUpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchUser={fetchUser}
                dataUpdate={dataUpdate}
            />
            <ModalCreateUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchUser={fetchUser}
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
                        dataSource={listUser}
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
                    title="User Info"
                    column={2}
                    bordered
                >
                    <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{dataDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status='processing' text={dataDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created date">
                        {moment(dataDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated date">
                        {moment(dataDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}


export default UserTable;