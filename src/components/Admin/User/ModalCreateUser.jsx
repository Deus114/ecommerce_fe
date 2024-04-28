import React, { useState } from 'react';
import { Modal, Form, Divider, message, Input, notification } from 'antd';
import { postCreateUser } from '../../../services/apiServices';

const ModalCreateUser = (props) => {
    const { openModal, setOpenModal } = props;
    const [isSubmit, setIsSubmit] = useState(false)

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        let res = await postCreateUser(fullName, email, password, phone);
        if (res && res.data) {
            message.success('Create user success');
            form.resetFields();
            setOpenModal(false);
            await props.fetchUser();
        }
        else {
            notification.error({
                message: "Something error",
                description: res.message,
            });
            setIsSubmit(false);
        }
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModal}
                onOk={() => form.submit()}
                onCancel={() => setOpenModal(false)}
                okText={"Tạo mới"}
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: '24' }}
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: '24' }}
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCreateUser;