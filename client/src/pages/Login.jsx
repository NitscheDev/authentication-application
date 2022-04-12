import styled from 'styled-components'
import { useState } from 'react'

function Login() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email,password)
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <div className="title">
                    <h1>login</h1>
                    <p>Login to access dashboard</p>
                </div>
                <div className="group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name='email' autoComplete='off' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit">login</button>
                <p className='others'>No Account? Create one here</p>
            </Form>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background: #eef0f7;
    position: relative;
`

const Form = styled.form`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 400px;
    background: #FFFFFF;
    border-radius: 5px;

    .title {
        text-align: center;
        margin-bottom: 20px;

        h1 {
            text-transform: uppercase;
            font-size: 24px;
            margin: 20px 0px 0px 0px;
            color: #2a2a30;
        }
        p {
            font-size: 14px;
            color: #84849a;
        }
    }

    .group {
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0 auto;
        margin-bottom: 10px;

        input {
            width: 100%;
            height: 40px;
            border: 1px solid #d4d3e4;
            outline: none;
            padding: 0 20px;
            border-radius: 5px;
            transition: all .2s ease;

            &:focus {
                box-shadow: 0px 0px 0px 2px #435fe82f;
                border: 1px solid #828191;
            }
        }

        label {
            margin-bottom: 3px;
            margin-left: 3px;
            font-size: 14px;
            color: #2a2a30;
        }
    }

    button[type=submit] {
        width: 80%;
        margin: 0 auto;
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: none;
        outline: none;
        border-radius: 5px;
        color: #FFFFFF;
        text-transform: uppercase;
        background: #435fe8;
        cursor: pointer;
        margin-top: 100px;
        transition: background .3s ease;

        &:hover {
            background: #3a52c9;
        }
    }

    .others {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        font-size: 14px;
        color: #2a2a30;
    }
`

export default Login