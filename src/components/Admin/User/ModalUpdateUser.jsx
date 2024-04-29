import React, { useEffect, useState } from 'react';
import { Modal, Form, Divider, message, Input, notification } from 'antd';
import { UpdateUser } from '../../../services/apiServices';

const ModalUpdateUser = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false)

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setIsSubmit(true);
        const { _id, fullName, phone } = values;
        let res = await UpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success('Update user success');
            form.resetFields();
            await props.fetchUser();
            setIsSubmit(false);
            setOpenModalUpdate(false);
        }
        else {
            notification.error({
                message: "Something error",
                description: res.message,
            });
            setIsSubmit(false);
        }
    };

    useEffect(() => {
        form.setFieldsValue(dataUpdate);
    }, [dataUpdate])


    return (
        <>
            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalUpdate(false)}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: '24' }}
                        label="Tên người dùng"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your Fullname!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item

                        labelCol={{ span: '24' }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: '24' }}
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        hidden
                        labelCol={{ span: '24' }}
                        label="ID"
                        name="_id"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalUpdateUser;