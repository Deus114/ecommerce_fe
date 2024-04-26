import { Button, Divider, Form, Input, notification, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../../services/apiServices';

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsLoading(true);
        let res = await postRegister(fullName, email, password, phone);
        if (res?.data?._id) {
            message.success('Register success');
            setIsLoading(false);
            navigate('/login');
        }
        else {
            notification.error({
                message: "Something error",
                description:
                    res.message && res.message.length > 0 ? res.message[0] : res.message,
                duration: 5
            });
            setIsLoading(false);
        }
    };

    return (
        <div className='register' style={{ padding: '50px' }}>
            <h3 style={{ textAlign: 'center' }}>Đăng kí</h3>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                style={{ maxWidth: 600, margin: '0 auto' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Fullname"
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

                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                    <Button type="primary" htmlType="submit"
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage;