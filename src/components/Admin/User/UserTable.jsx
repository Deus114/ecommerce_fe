import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
import InputSearch from './InputSearch';
import { fetchListUser } from '../../../services/apiServices';
import { render } from 'react-dom';

const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchUser()
    }, [current, pageSize]);

    const fetchUser = async () => {
        const query = `current=${current}&pageSize=${pageSize}`;
        const res = await fetchListUser(query);
        if (res && res.data) {
            setTotal(res.data.meta.total);
            setListUser(res.data.result);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            sorter: true
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Role',
            dataIndex: 'role',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <><button>Delete</button></>
                )
            }
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch />
                </Col>
                <Col span={24}>
                    <Table
                        className='def'
                        columns={columns}
                        dataSource={listUser}
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
        </>
    )
}


export default UserTable;